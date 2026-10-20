const User = require('../models/User');
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');


// =========================
// DASHBOARD STATISTICS
// =========================

const getDashboardStats = async (req, res) => {

  try {

    const totalUsers = await User.countDocuments({
      role: 'user'
    });

    const totalBikes = await Bike.countDocuments();

    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
      totalUsers,
      totalBikes,
      totalBookings
    });

  } catch (error) {

    res.status(500).json({
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });

  }

};


// =========================
// GET ALL USERS
// =========================

const getAllUsers = async (req, res) => {

  try {

    const users = await User.find({
      role: 'user'
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message
    });

  }

};


// =========================
// EXPORT
// =========================

module.exports = {
  getDashboardStats,
  getAllUsers
};