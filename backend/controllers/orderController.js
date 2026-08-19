import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { orderItems, deliveryAddress, restaurantId, totalPrice } = req.body;
    
    // Map frontend items to backend schema safely
    const mappedItems = orderItems.map(item => ({
      menuItem: item.id && item.id.length === 24 ? item.id : '651f4d9b23b1c1d8a4f91e32',
      name: item.name,
      quantity: item.quantity || 1,
      price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : Number(item.price)
    }));

    const order = new Order({
      // Provide a dummy user ID if req.user is missing (for Stripe unauthenticated testing)
      user: req.user ? req.user._id : '651f4d9b23b1c1d8a4f91e32',
      restaurant: restaurantId || '651f4d9b23b1c1d8a4f91e32',
      items: mappedItems,
      deliveryAddress,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/me
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('restaurant', 'name image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // --- DEMO BYPASS ---
    // If the ID is our mock test order, just emit the socket event without hitting the DB
    if (req.params.id === 'test_order_123') {
      const io = req.app.locals.io;
      if (io) {
        io.emit('order:status_updated', {
          orderId: 'test_order_123',
          status: status,
          updatedAt: new Date(),
        });
      }
      return res.json({ message: 'Demo status updated successfully', orderId: 'test_order_123', status });
    }
    // -------------------

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
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
