const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    brand: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: true
    },

    pricePerDay: {
      type: Number,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    image: {
      type: String
    },

    description: {
      type: String
    },

    stock: {
      type: Number,
      required: true,
      default: 1
    },

    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Bike', bikeSchema);