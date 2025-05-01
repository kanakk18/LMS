import express from 'express';
import { clerkWebnhooks } from '../controllers/Webhook.js';

const router = express.Router();

// Clerk webhook route
router.post('/clerk-webhooks', clerkWebnhooks);

export default router;
