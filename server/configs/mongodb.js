import mongoose from 'mongoose';

let isConnected = false; // Track if already connected to MongoDB

const connectDB = async () => {
  if (isConnected) {
    console.log("ℹ️ Already connected to MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'lms-db', // ✅ Optional: define DB name if not in URI
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`✅ MongoDB connected: ${db.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Optional: Crash if DB connection fails
  }
};

export default connectDB;
