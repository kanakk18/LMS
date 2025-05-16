import mongoose from 'mongoose';
import User from './models/User.js';
import 'dotenv/config';

const testCreateUser = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = new User({
    _id: 'test123',
    name: 'Test User',
    email: 'testuser@example.com',
    imageUrl: 'https://example.com/image.jpg'
  });
  await user.save();
  console.log('User saved manually');
  mongoose.connection.close();
};

testCreateUser();
