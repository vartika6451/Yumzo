import express from 'express';
import { createCheckoutSession, stripeWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);

// The webhook needs the raw body to verify the signature, so we handle it uniquely in server.js
// but we map the route here. Wait, if we use express.json() globally in server.js, the webhook fails.
// We must extract the webhook route in server.js BEFORE express.json() is applied.

export default router;
