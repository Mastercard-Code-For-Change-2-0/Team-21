import mongoose from 'mongoose';

// Single MongoDB URI from environment
const MONGODB_URI = process.env.MONGODB_URI_MODERATOR;

// Cache connection
let cached = null;

/**
 * Connect to MongoDB (single database)
 * @returns {Promise<mongoose.Connection>}
 */
export async function connectDB() {
  if (cached) return cached;

  if (!MONGODB_URI) {
    throw new Error('MongoDB URI not found in environment variables');
  }

  try {
    const connection = await mongoose.createConnection(MONGODB_URI);
    cached = connection;
    console.log('✅ Connected to MongoDB (MC Database)');
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

export default connectDB;
