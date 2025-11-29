import mongoose from 'mongoose';

// Hum "export const" use karenge taaki confusion na ho
export const connectDB = async () => {
  try {
    // Agar MONGO_URI nahi mila to crash mat hone do
    const uri = process.env.MONGO_URI || '';
    if (!uri) {
      console.error('Error: MONGO_URI environment variable is not defined.');
      process.exit(1);
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};