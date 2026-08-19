import express from 'express';
import { getAvailableOrders } from '../controllers/driverController.js';

const router = express.Router();

// Temporarily bypassed auth checks for easy testing
router.get('/available-orders', getAvailableOrders);

export default router;
