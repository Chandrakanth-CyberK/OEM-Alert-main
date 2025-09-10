const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // ... (same schema as before)
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'ciso', 'security_analyst', 'clinician', 'viewer'],
    default: 'viewer'
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Information Security', 'ICU', 'Emergency', 'Surgery', 'Radiology', 'Laboratory', 'IT', 'Administration']
  },
  permissions: [{
    type: String,
    enum: [
      'view_vulnerabilities',
      'manage_vulnerabilities',
      'view_devices',
      'manage_devices',
      'view_alerts',
      'manage_alerts',
      'view_compliance',
      'manage_compliance',
      'manage_users',
      'export_reports'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  alertPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    criticalOnly: { type: Boolean, default: false }
  },
  phoneNumber: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ department: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
