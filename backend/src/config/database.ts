import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur MongoDB:', error);
    process.exit(1);
  }
};
