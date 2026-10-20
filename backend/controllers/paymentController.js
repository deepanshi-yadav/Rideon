const Razorpay = require('razorpay');
const crypto = require('crypto');

const Booking = require('../models/Booking');
const Bike = require('../models/Bike');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


/*
  CREATE RAZORPAY ORDER
*/

const createOrder = async (req, res) => {
  try {

    const {
      bikeId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation
    } = req.body;


    if (
      !bikeId ||
      !startDate ||
      !endDate ||
      !pickupLocation ||
      !dropoffLocation
    ) {
      return res.status(400).json({
        message:
          'Bike, dates, pickup location and drop-off location are required'
      });
    }


    const start = new Date(startDate);
    const end = new Date(endDate);


    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime())
    ) {
      return res.status(400).json({
        message: 'Invalid booking dates'
      });
    }


    if (end < start) {
      return res.status(400).json({
        message:
          'End date cannot be before start date'
      });
    }


    const bike = await Bike.findById(bikeId);


    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }


    if (
      !bike.available ||
      bike.stock <= 0
    ) {
      return res.status(400).json({
        message:
          'Bike is currently unavailable'
      });
    }


    /*
      Check overlapping booking
    */

    const overlappingBooking =
      await Booking.findOne({

        bike: bikeId,

        status: {
          $ne: 'cancelled'
        },

        startDate: {
          $lte: end
        },

        endDate: {
          $gte: start
        }

      });


    if (overlappingBooking) {
      return res.status(400).json({
        message:
          'Bike is already booked for these dates'
      });
    }


    /*
      Calculate amount on SERVER.
      We don't trust the amount
      coming from the frontend.
    */

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;


    const totalDays =
      Math.max(
        1,
        Math.ceil(
          (end - start) /
          millisecondsPerDay
        )
      );


    const totalAmount =
      totalDays *
      bike.pricePerDay;


    /*
      Razorpay amount is in paise.
    */

    const options = {

      amount:
        totalAmount * 100,

      currency:
        'INR',

      receipt:
        'rideon_' + Date.now(),

      notes: {

        bikeId:
          bikeId,

        startDate:
          startDate,

        endDate:
          endDate,

        pickupLocation:
          pickupLocation,

        dropoffLocation:
          dropoffLocation,

        userId:
          req.user.id

      }

    };


    const order =
      await razorpay.orders.create(
        options
      );


    res.status(200).json({

      message:
        'Razorpay order created successfully',

      order,

      bookingDetails: {

        bikeId,

        bikeName:
          bike.name,

        brand:
          bike.brand,

        startDate,

        endDate,

        pickupLocation,

        dropoffLocation,

        totalDays,

        totalAmount

      }

    });


  } catch (error) {

    console.log(
      'Razorpay Order Error:',
      error
    );

    res.status(500).json({

      message:
        'Failed to create Razorpay order',

      error:
        error.message

    });

  }
};


/*
  VERIFY PAYMENT
  AND CREATE BOOKING
*/

const verifyPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;


    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({

        message:
          'Payment details are incomplete'

      });
    }


    /*
      Create signature using
      Razorpay secret key.
    */

    const generatedSignature =
      crypto
        .createHmac(
          'sha256',
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          razorpay_order_id +
          '|' +
          razorpay_payment_id
        )
        .digest('hex');


    if (
      generatedSignature !==
      razorpay_signature
    ) {

      return res.status(400).json({

        message:
          'Payment verification failed'

      });

    }


    /*
      Get the Razorpay order so that
      we can recover the booking details
      stored in order notes.
    */

    const order =
      await razorpay.orders.fetch(
        razorpay_order_id
      );


    const {
      bikeId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      userId
    } = order.notes;


    /*
      Make sure the payment belongs
      to the currently logged-in user.
    */

    if (
      userId !== req.user.id
    ) {

      return res.status(403).json({

        message:
          'Payment user mismatch'

      });

    }


    const bike =
      await Bike.findById(bikeId);


    if (!bike) {

      return res.status(404).json({

        message:
          'Bike not found'

      });

    }


    /*
      Check again before creating
      the booking.
    */

    const overlappingBooking =
      await Booking.findOne({

        bike: bikeId,

        status: {
          $ne: 'cancelled'
        },

        startDate: {
          $lte:
            new Date(endDate)
        },

        endDate: {
          $gte:
            new Date(startDate)
        }

      });


    if (overlappingBooking) {

      return res.status(400).json({

        message:
          'Bike is already booked for these dates'

      });

    }


    const start =
      new Date(startDate);

    const end =
      new Date(endDate);


    const millisecondsPerDay =
      1000 * 60 * 60 * 24;


    const totalDays =
      Math.max(
        1,
        Math.ceil(
          (end - start) /
          millisecondsPerDay
        )
      );


    const totalAmount =
      totalDays *
      bike.pricePerDay;


    /*
      Create booking ONLY AFTER
      successful payment verification.
    */

    const booking =
      await Booking.create({

        user:
          req.user.id,

        bike:
          bikeId,

        startDate,

        endDate,

        pickupLocation,

        dropoffLocation,

        totalAmount,

        status:
          'confirmed'

      });


    /*
      Reduce available stock.
    */

    bike.stock -= 1;


    if (bike.stock === 0) {

      bike.available = false;

    }


    await bike.save();


    res.status(201).json({

      message:
        'Payment verified and booking created successfully',

      booking

    });


  } catch (error) {

    console.log(
      'Payment Verification Error:',
      error
    );

    res.status(500).json({

      message:
        'Payment verification failed',

      error:
        error.message

    });

  }

};


module.exports = {

  createOrder,

  verifyPayment
};
