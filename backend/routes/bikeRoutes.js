const express = require('express');

const {
  addBike,
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike
} = require('../controllers/bikeController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Anyone can view bikes
router.get('/', getAllBikes);
router.get('/:id', getBikeById);

// Only admin can manage bikes
router.post('/', authMiddleware, adminMiddleware, addBike);
router.put('/:id', authMiddleware, adminMiddleware, updateBike);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBike);

module.exports = router;