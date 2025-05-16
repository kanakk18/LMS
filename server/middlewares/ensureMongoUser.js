// middlewares/ensureMongoUser.js
import { clerkClient } from '@clerk/express';
import User from '../models/User.js';

const ensureMongoUser = async (req, res, next) => {
    try {
        console.log('ensureMongoUser middleware running for user:', req.auth.userId);
        const userId = req.auth.userId;

        // Check if user exists in MongoDB
        let mongoUser = await User.findById(userId);
        if (!mongoUser) {
            // Fetch user details from Clerk
            const clerkUser = await clerkClient.users.getUser(userId);
            const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

            // Create new user in MongoDB
            mongoUser = await User.create({
                _id: userId,                // Use Clerk user ID as Mongo _id
                name,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                imageUrl: clerkUser.imageUrl || '',
                enrolledCourses: [],
            });

            console.log(`Created new user in MongoDB: ${userId}`);
        }

        next();
    } catch (error) {
        console.error('Error in ensureMongoUser middleware:', error);
        res.status(500).json({ success: false, message: 'Failed to sync user data.' });
    }
};

export default ensureMongoUser;
