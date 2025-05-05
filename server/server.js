import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebnhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRouter.js';
import { clerkMiddleware } from '@clerk/express';
import ConnectCloudinary from './configs/cloudinary.js';

const app = express();

// Connect to MongoDB
await connectDB();
await ConnectCloudinary()

// Middleware for CORS
app.use(cors());
app.use(clerkMiddleware())

// ✅ Raw body middleware ONLY for Clerk webhook route
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }), // IMPORTANT: keep body as Buffer
  clerkWebnhooks
);

// ✅ JSON parser for other routes (if any in future)
app.use(express.json());
app.use('/api/educator', express.json(), educatorRouter)
// Health check
app.get('/', (req, res) => res.send('API working'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
