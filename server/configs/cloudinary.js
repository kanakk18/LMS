import { v2 as cloudinary } from 'cloudinary'; // Cloudinary v2 import
import dotenv from 'dotenv'; // dotenv to load environment variables
import { connect } from 'mongoose';

// Load environment variables
dotenv.config();

// Connect to Cloudinary
const ConnectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,   // corrected variable name
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
    console.log('✅ Cloudinary connected successfully');
  } catch (error) {
    console.error('❌ Cloudinary connection error:', error.message);
  }
};

// Connect to MongoDB
const connectToDB = async () => {
  try {
    await connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

export { ConnectCloudinary, connectToDB };
