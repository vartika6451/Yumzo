import Order from '../models/Order.js';

// @desc    Get all orders for a restaurant owner
// @route   GET /api/dashboard/orders
// @access  Private (restaurant_owner)
export const getRestaurantOrders = async (req, res) => {
  try {
    // In production: const restaurantId = req.user.restaurant;
    // For demo, we just fetch all orders or a specific mock restaurant
    const orders = await Order.find()
      .populate('user', 'name')
      .populate('driver', 'name')
      .sort('-createdAt');
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
