import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebnhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRouter.js';
import { clerkMiddleware } from '@clerk/express';
import {ConnectCloudinary , connectToDB } from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';

const app = express();

// Connect to MongoDB and Cloudinary
const init = async () => {
  await connectDB();
  await ConnectCloudinary();

  // Middleware setup
  app.use(cors());
  app.use(clerkMiddleware());

  // ✅ Raw body ONLY for Clerk webhooks
  app.post(
    '/clerk',
    express.raw({ type: 'application/json' }),
    clerkWebnhooks
  );

  // ✅ Apply JSON parser AFTER webhook (to avoid body-parser issues with Clerk)
  app.use(express.json());

  // Routes
  app.use('/api/educator', educatorRouter);
  app.use('/api/course', courseRouter);

  // Health check
  app.get('/', (req, res) => res.send('API working'));

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

init();
