import mongoose from 'mongoose';

// Unified User Schema for all roles
const UserSchema = new mongoose.Schema({
  // Basic Authentication Fields
  clerkId: {
    type: String,
    unique: true,
    sparse: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  },
  password_hash: {
    type: String,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  last_login: {
    type: Date,
    default: null
  },

  // Student-specific fields (only used when role = 'student')
  student_code: {
    type: String,
    sparse: true,
    match: /^Y4D_K_[0-9]{6}$/
  },
  full_name: String,
  dob: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  phone: {
    type: String,
    match: /^[0-9]{10}$/
  },
  address: String,
  education_level: String,
  graduation_year: {
    type: Number,
    min: 1900,
    max: 2100
  },
  college_name: String,
  placement_status: {
    type: String,
    enum: ['Not Placed', 'Placed', 'Multiple Offers'],
    default: 'Not Placed'
  },
  enrollment_date: Date,

  // Professional Growth Data
  professional_growth: [{
    company_name: String,
    job_role: String,
    employment_type: {
      type: String,
      enum: ['Internship', 'Full Time', 'Contract']
    },
    start_date: Date,
    end_date: Date,
    salary: Number,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    skills_acquired: [String],
    achievements: [String]
  }],

  // Marksheet/Documents
  marksheets: [{
    document_type: {
      type: String,
      enum: ['10th', '12th', 'Diploma', 'Graduation', 'Post-Graduation', 'Certificate']
    },
    file_url: String,
    file_name: String,
    upload_date: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],

  // Events (for admin/mentor roles)
  events_created: [{
    title: String,
    description: String,
    event_date: Date,
    location: String,
    visibility: {
      type: String,
      enum: ['all', 'students', 'mentors'],
      default: 'all'
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],

  // Relationships
  assigned_students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assigned_mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Additional metadata
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for performance
UserSchema.index({ role: 1 });
UserSchema.index({ student_code: 1 }, { sparse: true });
UserSchema.index({ email: 1 });
UserSchema.index({ clerkId: 1 }, { sparse: true });

// Model factory function
export function getModels(connection) {
  if (!connection.models.User) {
    return {
      User: connection.model('User', UserSchema)
    };
  }
  return {
    User: connection.models.User
  };
}

export { UserSchema };