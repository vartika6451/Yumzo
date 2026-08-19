import express from 'express';
import { getAllRestaurants, getRestaurantById, getRestaurantMenu } from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);

export default router;
