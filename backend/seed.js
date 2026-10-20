const mongoose = require('mongoose');
require('dotenv').config();

const Bike = require('./models/Bike');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const bikes = [
  {
    name: 'Classic 350',
    brand: 'Royal Enfield',
    type: 'Cruiser',
    pricePerDay: 1300,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
    description: 'Comfortable Royal Enfield bike for city and highway rides.',
    stock: 10
  },
  {
    name: 'Hunter 350',
    brand: 'Royal Enfield',
    type: 'Roadster',
    pricePerDay: 1200,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hunter_350_side_view_India_Model.png',
    description: 'Stylish and comfortable roadster for city rides.',
    stock: 10
  },
  {
    name: 'Activa 6G',
    brand: 'Honda',
    type: 'Scooter',
    pricePerDay: 800,
    image: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6',
    description: 'Easy-to-ride scooter suitable for daily city travel.',
    stock: 10
  },
  {
    name: 'R15 V4',
    brand: 'Yamaha',
    type: 'Sports',
    pricePerDay: 1500,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yamaha_R15_v4_bike.jpg',
    description: 'Sporty bike for riders looking for an exciting ride.',
    stock: 10
  },
  {
    name: 'Duke 200',
    brand: 'KTM',
    type: 'Street',
    pricePerDay: 1400,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc',
    description: 'Lightweight street bike suitable for city riding.',
    stock: 10
  },
  {
    name: 'Pulsar NS200',
    brand: 'Bajaj',
    type: 'Street',
    pricePerDay: 1100,
    image: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8',
    description: 'Powerful street bike for everyday and highway rides.',
    stock: 10
  },
  {
    name: 'Apache RTR 200',
    brand: 'TVS',
    type: 'Street',
    pricePerDay: 1100,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/TVS_Apache_RTR_200_4V_Front-Right_Profile.jpg',
    description: 'Powerful street bike for city and highway rides.',
    stock: 4
  }
];

const cities = [
  'Delhi',
  'Noida',
  'Ghaziabad',
  'Gurugram'
];

const seedBikes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected');

    // Add the same bikes to all four cities
    for (const city of cities) {
      for (const bikeData of bikes) {

        const existingBike = await Bike.findOne({
          name: bikeData.name,
          brand: bikeData.brand,
          location: city
        });

        if (!existingBike) {
          await Bike.create({
            ...bikeData,
            location: city
          });

          console.log(`${bikeData.name} added to ${city}`);
        } else {
          await Bike.findByIdAndUpdate(
            existingBike._id,
            {
              image: bikeData.image
            }
          );

          console.log(`${bikeData.name} already exists in ${city}`);
        }
      }
    }

    // Create/update admin user
    const adminPassword = await bcrypt.hash(
      'AdminPassword123',
      10
    );

    await User.findOneAndUpdate(
      { email: 'admin@rideon.com' },
      {
        name: 'RideOn Admin',
        email: 'admin@rideon.com',
        phone: '9999999999',
        password: adminPassword,
        role: 'admin'
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    console.log('Admin user created/updated');

    await mongoose.connection.close();

    console.log('Database connection closed');

  } catch (error) {
    console.log('Seed Error:', error.message);
  }
};

seedBikes();