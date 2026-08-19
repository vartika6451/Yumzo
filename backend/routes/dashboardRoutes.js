import express from 'express';
import { getRestaurantOrders } from '../controllers/dashboardController.js';
import { requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Temporarily bypassed auth checks for easy testing without frontend login
// In production: router.get('/orders', requireRole('restaurant_owner'), getRestaurantOrders);
router.get('/orders', getRestaurantOrders);

export default router;
