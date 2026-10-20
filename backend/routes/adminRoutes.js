const express = require('express');

const {
  getDashboardStats,
  getAllUsers
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get(
  '/stats',
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

module.exports = router;