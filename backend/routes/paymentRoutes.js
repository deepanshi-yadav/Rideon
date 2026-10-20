const express = require('express');

const {
  createOrder,
  verifyPayment
} = require('../controllers/paymentController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


/*
  Create Razorpay order
*/

router.post(
  '/create-order',
  authMiddleware,
  createOrder
);


/*
  Verify Razorpay payment
  and create booking
*/

router.post(
  '/verify',
  authMiddleware,
  verifyPayment
);


module.exports = router;