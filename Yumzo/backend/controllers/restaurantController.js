import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.id });
    if (!menuItems) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
