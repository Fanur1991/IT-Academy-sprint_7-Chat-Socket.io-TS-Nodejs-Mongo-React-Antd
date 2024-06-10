import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectMongo = async () => {
  try {
    if (!mongoURI) {
      console.error('MONGO_URI is not defined.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI as string);
    console.log(`
------------------------------------------------------------------------------------------
✅ Connected to MongoDB
------------------------------------------------------------------------------------------
`);
  } catch (error) {
    console.error('Could not connect to MongoDB:', error);
  }
};

export default connectMongo;
