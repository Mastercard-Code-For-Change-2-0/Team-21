import mongoose from 'mongoose';

// MongoDB URIs from environment
const MONGODB_URIS = {
  admin: process.env.MONGODB_URI_ADMIN,
  user: process.env.MONGODB_URI_USER,
  moderator: process.env.MONGODB_URI_MODERATOR,
};

// Cache connections
const cached = {};

/**
 * Connect to MongoDB based on user role
 * @param {string} role - User role ('admin', 'user', 'moderator')
 * @returns {Promise<mongoose.Connection>}
 */
export async function connectDB(role = 'user') {
  if (cached[role]) return cached[role];

  const uri = MONGODB_URIS[role];
  if (!uri) throw new Error(`No MongoDB URI for role: ${role}`);

  try {
    const connection = await mongoose.createConnection(uri);
    cached[role] = connection;
    console.log(`✅ Connected to MongoDB (${role})`);
    return connection;
  } catch (error) {
    console.error(`❌ MongoDB connection failed (${role}):`, error.message);
    throw error;
  }
}

export default connectDB;
