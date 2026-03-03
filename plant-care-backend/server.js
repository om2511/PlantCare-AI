const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const connectDB = require('./config/db');
const { initWebPush, sendDailyPlantReminders } = require('./services/notificationService');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize web push
initWebPush();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigin = process.env.FRONTEND_URL?.replace(/\/$/, ''); // Remove trailing slash
    if (!origin || !allowedOrigin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
})); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plants', require('./routes/plants'));
app.use('/api/care', require('./routes/care'));
app.use('/api/plant-data', require('./routes/plantData'));
app.use('/api/water-quality', require('./routes/waterQuality'));
app.use('/api/disease', require('./routes/disease'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Plant Care Assistant API is running',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Daily plant reminders — 8:00 AM IST = 2:30 AM UTC
cron.schedule('30 2 * * *', () => {
  console.log('⏰ Cron: sending daily plant reminders');
  sendDailyPlantReminders();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});