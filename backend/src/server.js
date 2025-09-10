const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: 'server.env' });


const logger = require('./utils/logger');
//const errorHandler = require('./middleware/errorHandler');
//const authRoutes = require('./routes/auth');
//const vulnerabilityRoutes = require('./routes/vulnerabilities');
//const deviceRoutes = require('./routes/devices');
//const alertRoutes = require('./routes/alerts');
//const complianceRoutes = require('./routes/compliance');
//const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection (optional - disabled when migrating to Supabase)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
    .then(() => {
      console.log('✅ MongoDB connected');
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    });
} else {
  console.log('ℹ️ Skipping MongoDB connection (using Supabase)');
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OEMAlert Backend Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});


// Health check endpoint
app.get('/health', async (req, res) => {
  const payload = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  };
  try {
    if (process.env.PG_CONNECTION_STRING) {
      const { pool } = require('./lib/db');
      if (pool) {
        await pool.query('select 1');
        payload.db = 'up';
      }
    }
  } catch (e) {
    payload.db = 'down';
  }
  res.status(payload.db === 'down' ? 500 : 200).json(payload);
});

// API routes
//app.use('/api/auth', authRoutes);
//app.use('/api/vulnerabilities', vulnerabilityRoutes);
//app.use('/api/devices', deviceRoutes);
//app.use('/api/alerts', alertRoutes);
//app.use('/api/compliance', complianceRoutes);
//app.use('/api/users', userRoutes);

// Error handling middleware
//app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
} catch (err) {
  console.error("❌ Error loading authRoutes:", err);
}


// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
});


module.exports = app;