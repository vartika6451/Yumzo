import Order from '../models/Order.js';

// @desc    Get available orders for drivers
// @route   GET /api/driver/available-orders
// @access  Private (delivery_driver)
export const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Ready' })
      .populate('restaurant', 'name address')
      .sort('-createdAt');
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign driver to an order
// @route   PATCH /api/orders/:id/assign-driver
// @access  Private (delivery_driver)
export const assignDriver = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // In production: order.driver = req.user._id;
    // Mock user for testing:
    order.driver = '651f4d9b23b1c1d8a4f91e32'; 
    order.status = 'Out for Delivery';
    
    const updatedOrder = await order.save();

    // Emit socket event
    const io = req.app.locals.io;
    if (io) {
      io.emit('order:status_updated', {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
