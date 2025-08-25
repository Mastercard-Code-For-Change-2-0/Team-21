import mongoose from 'mongoose';

// Basic fields for all users
const BasicUserFields = {
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
    required: true,
    minlength: 8
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  last_login: {
    type: Date,
    default: null
  }
};

// Student Schema
const StudentSchema = new mongoose.Schema({
  ...BasicUserFields,
  role: {
    type: String,
    enum: ['student'],
    default: 'student'
  },
  student_code: {
    type: String,
    required: true,
    unique: true,
    match: /^Y4D_K_[0-9]{6}$/
  },
  full_name: {
    type: String,
    required: true
  },
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
  events: {
    type: [String],
    default: []
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Mentor Schema
const MentorSchema = new mongoose.Schema({
  ...BasicUserFields,
  role: {
    type: String,
    enum: ['mentor'],
    default: 'mentor'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Admin Schema
const AdminSchema = new mongoose.Schema({
  ...BasicUserFields,
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  mentors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor'
  }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Model factory function
export function getModels(connection) {
  const models = {};
  if (!connection.models.Student) {
    models.Student = connection.model('Student', StudentSchema);
  } else {
    models.Student = connection.models.Student;
  }
  if (!connection.models.Mentor) {
    models.Mentor = connection.model('Mentor', MentorSchema);
  } else {
    models.Mentor = connection.models.Mentor;
  }
  if (!connection.models.Admin) {
    models.Admin = connection.model('Admin', AdminSchema);
  } else {
    models.Admin = connection.models.Admin;
  }
  return models;
}

export { StudentSchema, MentorSchema, AdminSchema };