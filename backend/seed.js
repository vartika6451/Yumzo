import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Models
import Restaurant from './models/Restaurant.js';
import MenuItem from './models/MenuItem.js';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await MenuItem.deleteMany();
    await Restaurant.deleteMany();
    await User.deleteMany();

    console.log('Old data cleared!');

    // 1. Create Restaurants
    const createdRestaurants = await Restaurant.insertMany([
      {
        name: 'The Indian Spice',
        cuisine: 'Indian',
        address: '123 Curry Lane, Delhi',
        image: '/images/indian.jpeg',
        rating: 4.5,
        deliveryTime: '20-30 min',
      },
      {
        name: 'Wok This Way',
        cuisine: 'Chinese',
        address: '456 Noodle Blvd, Mumbai',
        image: '/images/chinese.jpeg',
        rating: 4.3,
        deliveryTime: '15-25 min',
      },
      {
        name: 'Bella Italia',
        cuisine: 'Italian',
        address: '789 Pasta Street, Bangalore',
        image: '/images/italian.png',
        rating: 4.7,
        deliveryTime: '25-40 min',
      },
    ]);

    const indianRes = createdRestaurants[0]._id;
    const chineseRes = createdRestaurants[1]._id;
    const italianRes = createdRestaurants[2]._id;

    // 2. Create Menus
    const menuItems = [
      // Indian
      { restaurant: indianRes, name: 'Dal Makhani', price: 750, image: '/images/dalmakhani.jpg', category: 'Main Course' },
      { restaurant: indianRes, name: 'Chole Bhature', price: 900, image: '/images/bhature.jpg', category: 'Main Course' },
      { restaurant: indianRes, name: 'Mango Lassi', price: 200, image: '/images/mangolassi.jpg', category: 'Beverage' },
      
      // Chinese
      { restaurant: chineseRes, name: 'Hakka Noodles', price: 850, image: '/images/noodles.jpg', category: 'Main Course' },
      { restaurant: chineseRes, name: 'Spring Rolls', price: 750, image: '/images/springrolls.jpg', category: 'Starter' },
      { restaurant: chineseRes, name: 'Hot & Sour Soup', price: 600, image: '/images/hotsour.jpg', category: 'Soup' },
      
      // Italian
      { restaurant: italianRes, name: 'Margherita Pizza', price: 1100, image: '/images/pizza.jpg', category: 'Pizza' },
      { restaurant: italianRes, name: 'Pasta Alfredo', price: 1050, image: '/images/pasta.jpg', category: 'Pasta' },
      { restaurant: italianRes, name: 'Tiramisu', price: 850, image: '/images/tiramisu.jpg', category: 'Dessert' },
    ];

    await MenuItem.insertMany(menuItems);

    console.log('Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
