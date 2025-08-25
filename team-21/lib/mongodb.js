import mongoose from 'mongoose';

// MongoDB URI from environment
const MONGODB_URI = process.env.MONGODB_URI_MODERATOR;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI_MODERATOR environment variable inside .env.local');
}

// Cache connection in global to prevent re-connecting during development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with proper connection management
 * @returns {Promise<mongoose.Connection>}
 */
export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB (MC Database)');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;

// Backward-compat helper expected by services/tests
export async function connectToDatabase(role = 'user') {
  // For now, we don't switch DBs per role; we keep a single connection.
  // This preserves the API expected by UserService and test routes.
  return connectDB();
}
