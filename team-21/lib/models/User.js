import mongoose from 'mongoose';

// Unified User Schema for all roles
const UserSchema = new mongoose.Schema({
  // Basic Authentication Fields
  clerkId: {
    type: String,
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
    match: /^[0-9]{10,12}$/  // Accept 10-12 digits for international formats
  },
  address: String,
  employment_status: String,
  father_occupation: String,
  mother_occupation: String,
  education_level: String,
  cgpa_percentage: String,
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
    current_organization: String,
    current_role: String,
    current_join_date: Date,
    past_organization: String,
    past_role: String,
    past_join_date: Date,
    past_leave_date: Date,
    professional_challenge: String,
    new_skills: String,
    handle_criticism: String,
    team_collaboration: String,
    career_goals: String,
    work_culture_contribution: String,
    stay_updated: String,
    submission_date: {
      type: Date,
      default: Date.now
    },
    // Legacy fields for backward compatibility
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

// Indexes for performance (creating unique indexes here instead of in field definitions)
UserSchema.index({ role: 1 });
UserSchema.index({ student_code: 1 }, { sparse: true, unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ clerkId: 1 }, { sparse: true, unique: true });

// Create or get existing model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Export the model
export default User;

// Also export the schema for backward compatibility
export { UserSchema };

// Model factory function for backward compatibility
export function getModels(connection) {
  return {
    User: User
  };
}