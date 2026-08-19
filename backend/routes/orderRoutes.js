import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyToken, adminOnly } from '../middleware/authMiddleware.js';
import { assignDriver } from '../controllers/driverController.js';

const router = express.Router();

// Routes for authenticated users (Auth temporarily bypassed for POST for Stripe testing)
router.post('/', createOrder);
router.get('/me', verifyToken, getMyOrders);

// Admin / Restaurant Owner route (auth temporarily removed for easy testing)
router.patch('/:id/status', updateOrderStatus);

// Driver route
router.patch('/:id/assign-driver', assignDriver);

export default router;
