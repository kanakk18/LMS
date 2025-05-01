import express from 'express';
import { clerkWebnhooks } from '../controllers/clerkWebhookController.js';

const router = express.Router();

// Clerk webhook route
router.post('/clerk-webhooks', clerkWebnhooks);

export default router;
