// middlewares/ensureMongoUser.js
import { clerkClient } from '@clerk/express';
import User from '../models/User.js';

const ensureMongoUser = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    // Check if user exists in MongoDB
    let mongoUser = await User.findById(userId);
    if (!mongoUser) {
      // Fetch Clerk user details
      const clerkUser = await clerkClient.users.getUser(userId);
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

      // Create user in MongoDB
      mongoUser = await User.create({
        _id: userId,
        name,
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl,
      });

      console.log('✅ New user created in MongoDB:', mongoUser._id);
    }

    next();
  } catch (err) {
    console.error('❌ Error in ensureMongoUser:', err.message);
    res.status(500).json({ success: false, message: 'MongoDB user creation failed' });
  }
};

export default ensureMongoUser;
