const Booking = require('../models/Booking');
const Bike = require('../models/Bike');

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      bike,
      startDate,
      endDate,
      pickupLocation
    } = req.body;

    // Get logged-in user's ID from JWT
    const user = req.user.id;

    // Check required booking fields
if (!bike || !startDate || !endDate || !pickupLocation) {
  return res.status(400).json({
    message: 'Bike, start date, end date and pickup location are required'
  });
}

    // Check booking dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: 'Invalid booking dates'
      });
    }

    if (end < start) {
      return res.status(400).json({
        message: 'End date cannot be before start date'
      });
    }

    // Find bike
    const bikeExists = await Bike.findById(bike);

    if (!bikeExists) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    // Check bike availability and stock
    if (!bikeExists.available || bikeExists.stock <= 0) {
      return res.status(400).json({
        message: 'Bike is currently unavailable'
      });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      bike: bike,
      status: { $ne: 'cancelled' },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'Bike is already booked for these dates'
      });
    }

    // Calculate total rental days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const totalDays = Math.max(
      1,
      Math.ceil((end - start) / millisecondsPerDay)
    );

    // Calculate total amount from bike price
    const calculatedTotalAmount =
      totalDays * bikeExists.pricePerDay;

    // Create booking
    const booking = await Booking.create({
      user,
      bike,
      startDate,
      endDate,
      pickupLocation,
      totalAmount: calculatedTotalAmount
    });

    // Reduce bike stock
    bikeExists.stock -= 1;

    // If stock becomes 0, make bike unavailable
    if (bikeExists.stock === 0) {
      bikeExists.available = false;
    }

    await bikeExists.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to create booking',
      error: error.message
    });
  }
};


// GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('bike', 'name brand type pricePerDay');

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};


// GET BOOKINGS OF A USER
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id
    })
      .populate('user', 'name email phone')
      .populate('bike', 'name brand type pricePerDay image');

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user bookings',
      error: error.message
    });
  }
};


// CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    // Check that this booking belongs to logged-in user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not allowed to cancel this booking'
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        message: 'Booking is already cancelled'
      });
    }

    // Cancel booking
    booking.status = 'cancelled';

    await booking.save();

    // Return bike stock
    const bike = await Bike.findById(booking.bike);

    if (bike) {
      bike.stock += 1;
      bike.available = true;

      await bike.save();
    }

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};


module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking
};