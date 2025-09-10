const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');
const { supabase, supabaseAdmin } = require('../lib/supabase');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register new user
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('role')
    .optional()
    .isIn(['admin', 'ciso', 'security_analyst', 'clinician', 'viewer'])
    .withMessage('Invalid role'),
  body('department')
    .optional()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('Invalid department')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, password, role = 'viewer', department, phoneNumber } = req.body;

    // Set default permissions based on role
    let permissions = [];
    switch (role) {
      case 'admin':
        permissions = [
          'view_vulnerabilities', 'manage_vulnerabilities',
          'view_devices', 'manage_devices',
          'view_alerts', 'manage_alerts',
          'view_compliance', 'manage_compliance',
          'manage_users', 'export_reports'
        ];
        break;
      case 'ciso':
        permissions = [
          'view_vulnerabilities', 'manage_vulnerabilities',
          'view_devices', 'manage_devices',
          'view_alerts', 'manage_alerts',
          'view_compliance', 'manage_compliance',
          'export_reports'
        ];
        break;
      case 'security_analyst':
        permissions = [
          'view_vulnerabilities', 'manage_vulnerabilities',
          'view_devices', 'view_alerts', 'manage_alerts',
          'view_compliance', 'export_reports'
        ];
        break;
      case 'clinician':
        permissions = [
          'view_vulnerabilities', 'view_devices',
          'view_alerts', 'view_compliance'
        ];
        break;
      default:
        permissions = ['view_vulnerabilities', 'view_devices', 'view_alerts'];
    }

    // Create user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role, department, phoneNumber, permissions } }
    });
    if (signUpError) {
      return res.status(400).json({ success: false, message: signUpError.message });
    }

    const authUser = signUpData.user;

    // Insert profile row (server-side, bypass RLS)
    await supabaseAdmin.from('profiles').upsert({
      id: authUser.id,
      email,
      role
    });

    // Issue application JWT (optional). Alternatively, rely on Supabase session on the client.
    const token = generateToken(authUser.id);

    logger.info(`New user registered in Supabase: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: { id: authUser.id, email, name, role, department, permissions, phoneNumber },
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login user
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { user: authUser, session } = signInData;
    const token = session?.access_token || generateToken(authUser.id);

    logger.info(`User logged in (Supabase): ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: authUser.id, email: authUser.email, ...authUser.user_metadata },
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Fetch profile from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phoneNumber')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Invalid phone number format'),
  body('alertPreferences.email')
    .optional()
    .isBoolean()
    .withMessage('Email preference must be boolean'),
  body('alertPreferences.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS preference must be boolean'),
  body('alertPreferences.criticalOnly')
    .optional()
    .isBoolean()
    .withMessage('Critical only preference must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['name', 'phoneNumber', 'alertPreferences'];
    const updates = {};
    Object.keys(req.body).forEach(key => { if (allowedUpdates.includes(key)) { updates[key] = req.body[key]; } });

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: 'Profile updated successfully', data });
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Change password
router.put('/change-password', auth, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Re-authenticate with current password
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: req.user.email,
      password: currentPassword
    });
    if (signInError) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Update password via admin
    const { error } = await supabaseAdmin.auth.admin.updateUserById(req.user.id, { password: newPassword });
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    logger.info(`Password changed for user: ${req.user.email}`);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Logout (client-side token removal, but we can log it)
router.post('/logout', auth, (req, res) => {
  logger.info(`User logged out: ${req.user.email}`);
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;