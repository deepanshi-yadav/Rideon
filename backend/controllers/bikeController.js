const Bike = require('../models/Bike');

// ADD BIKE
const addBike = async (req, res) => {
  try {
    const {
      name,
      brand,
      type,
      pricePerDay,
      location,
      image,
      description,
      stock
    } = req.body;

    const bike = await Bike.create({
      name,
      brand,
      type,
      pricePerDay,
      location,
      image,
      description,
      stock
    });

    res.status(201).json({
      message: 'Bike added successfully',
      bike
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to add bike',
      error: error.message
    });
  }
};


// GET ALL BIKES
const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find();

    res.status(200).json(bikes);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch bikes',
      error: error.message
    });
  }
};

// GET SINGLE BIKE
const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    res.status(200).json(bike);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch bike',
      error: error.message
    });
  }
};

// UPDATE BIKE
const updateBike = async (req, res) => {
  try {
    const bike = await Bike.findByIdAndUpdate(
  req.params.id,
  req.body,
  { returnDocument: 'after', runValidators: true }
);

    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    res.status(200).json({
      message: 'Bike updated successfully',
      bike
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to update bike',
      error: error.message
    });
  }
};

// DELETE BIKE
const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);

    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    res.status(200).json({
      message: 'Bike deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete bike',
      error: error.message
    });
  }
};

module.exports = {
  addBike,
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike
};