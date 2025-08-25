import { connectToDatabase } from '../mongodb.js';
import { getUserModel } from '../models/User.js';
import { currentUser } from '@clerk/nextjs/server';

/**
 * User service for handling database operations based on user roles
 */
export class UserService {
  /**
   * Get database connection based on user role
   * @param {string} role - User role ('admin', 'moderator', 'client')
   * @returns {Promise<mongoose.Connection>}
   */
  static async getConnectionByRole(role) {
    const roleMapping = {
      'admin': 'admin',
      'moderator': 'moderator', 
      'client': 'user'
    };
    
    const dbRole = roleMapping[role] || 'user';
    return await connectToDatabase(dbRole);
  }

  /**
   * Create or update user in appropriate database based on role
   * @param {Object} userData - User data from Clerk
   * @returns {Promise<Object>} Created/updated user
   */
  static async createOrUpdateUser(userData) {
    try {
      const { clerkId, email, firstName, lastName, role = 'client', profileImage } = userData;
      
      console.log(`Creating/updating user with role: ${role}`);
      
      const connection = await this.getConnectionByRole(role);
      const User = getUserModel(connection);

      // Check if user already exists
      let user = await User.findByClerkId(clerkId);
      
      if (user) {
        // Update existing user
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.role = role;
        user.profileImage = profileImage;
        user.lastLogin = new Date();
        
        await user.save();
        console.log(`✅ Updated user: ${email} in ${role} database`);
      } else {
        // Create new user
        user = new User({
          clerkId,
          email,
          firstName,
          lastName,
          role,
          profileImage,
          lastLogin: new Date()
        });
        
        await user.save();
        console.log(`✅ Created new user: ${email} in ${role} database`);
      }
      
      return user.toObject();
    } catch (error) {
      console.error('❌ Error creating/updating user:', error);
      throw error;
    }
  }

  /**
   * Get user by Clerk ID from appropriate database
   * @param {string} clerkId - Clerk user ID
   * @param {string} role - User role
   * @returns {Promise<Object|null>} User data
   */
  static async getUserByClerkId(clerkId, role = 'client') {
    try {
      const connection = await this.getConnectionByRole(role);
      const User = getUserModel(connection);
      
      const user = await User.findByClerkId(clerkId);
      return user ? user.toObject() : null;
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Get current user from database based on Clerk session
   * @returns {Promise<Object|null>} Current user data
   */
  static async getCurrentUser() {
    try {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return null;
      }

      const role = clerkUser.publicMetadata?.role || 'client';
      return await this.getUserByClerkId(clerkUser.id, role);
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get all users from specific role database
   * @param {string} role - User role
   * @returns {Promise<Array>} Array of users
   */
  static async getUsersByRole(role) {
    try {
      const connection = await this.getConnectionByRole(role);
      const User = getUserModel(connection);
      
      const users = await User.find({ isActive: true }).sort({ createdAt: -1 });
      return users.map(user => user.toObject());
    } catch (error) {
      console.error(`❌ Error fetching ${role} users:`, error);
      throw error;
    }
  }

  /**
   * Update user role and move to appropriate database
   * @param {string} clerkId - Clerk user ID
   * @param {string} newRole - New user role
   * @returns {Promise<Object>} Updated user
   */
  static async updateUserRole(clerkId, newRole) {
    try {
      console.log(`Updating user ${clerkId} role to: ${newRole}`);
      
      // First, try to find user in any database
      let userData = null;
      let oldConnection = null;
      
      for (const role of ['admin', 'moderator', 'client']) {
        try {
          const connection = await this.getConnectionByRole(role);
          const User = getUserModel(connection);
          const user = await User.findByClerkId(clerkId);
          
          if (user) {
            userData = user.toObject();
            oldConnection = connection;
            
            // Delete from old database if role is changing
            if (role !== newRole) {
              await User.deleteOne({ clerkId });
              console.log(`🗑️ Deleted user from ${role} database`);
            }
            break;
          }
        } catch (err) {
          console.log(`User not found in ${role} database`);
        }
      }
      
      if (!userData) {
        throw new Error('User not found in any database');
      }
      
      // Update role and create/update in new database
      userData.role = newRole;
      return await this.createOrUpdateUser(userData);
      
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Delete user from database
   * @param {string} clerkId - Clerk user ID
   * @param {string} role - User role
   * @returns {Promise<boolean>} Success status
   */
  static async deleteUser(clerkId, role) {
    try {
      const connection = await this.getConnectionByRole(role);
      const User = getUserModel(connection);
      
      const result = await User.deleteOne({ clerkId });
      console.log(`🗑️ Deleted user ${clerkId} from ${role} database`);
      
      return result.deletedCount > 0;
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
  }
}

export default UserService;
