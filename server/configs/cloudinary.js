import { v2 as cloudinary } from 'cloudinary'; // Cloudinary v2 import
import dotenv from 'dotenv'; // dotenv to load environment variables
import { connect } from 'mongoose';

// Environment variables ko load karna
dotenv.config();

// Cloudinary ko connect karna
const ConnectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_NAME,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
        });

        console.log('Cloudinary connected successfully');
    } catch (error) {
        console.error('Cloudinary se connection mein error:', error.message);
    }
};

// MongoDB se connect hona (agar zarurat ho)
const connectToDB = async () => {
    try {
        await connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB se connection mein error:', error.message);
    }
}

export { ConnectCloudinary, connectToDB };
