import mongoose from 'mongoose';

let isConnected = false; // Track if we are connected

const connectDB = async () => {
  if (isConnected) return; // Return early if already connected

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Remove useFindAndModify
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit on failure
  }
};

export default connectDB;
