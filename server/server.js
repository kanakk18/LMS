import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebnhooks } from './controllers/webhooks.js';

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware for CORS
app.use(cors());

// ✅ Raw body middleware ONLY for Clerk webhook route
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }), // IMPORTANT: keep body as Buffer
  clerkWebnhooks
);

// ✅ JSON parser for other routes (if any in future)
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('API working'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
