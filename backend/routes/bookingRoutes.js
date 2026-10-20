const express = require('express');

const {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking
} = require('../controllers/bookingController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// User: create booking
router.post('/', authMiddleware, createBooking);

// Admin: view all bookings
router.get('/', authMiddleware, adminMiddleware, getAllBookings);

// User: view own bookings
router.get('/my', authMiddleware, getUserBookings);

// User: cancel own booking
router.put('/:id/cancel', authMiddleware, cancelBooking);

module.exports = router;