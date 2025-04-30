import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebnhooks } from './controllers/webhooks.js';
import { buffer } from 'micro'; // required to parse raw body for Clerk

const app = express();

// Connect to MongoDB
await connectDB();

// Middlewares
app.use(cors());

// Raw body for Clerk webhooks (important for signature verification)
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }), // Handle raw body to verify Clerk webhook signature
  async (req, res) => {
    const rawBody = req.body;
    req.body = await buffer(req); // Parse raw body with micro's buffer function
    clerkWebnhooks(req, res);
  }
);

// Default route
app.get('/', (req, res) => res.send('API working'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
