const jwt = require('jsonwebtoken');
const User = require('../models/User');

const resolveRoleForEmail = (email) => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail || !email) {
    return 'user';
  }
  return email.trim().toLowerCase() === adminEmail ? 'admin' : 'user';
};

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (req.user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: 'Account is blocked'
        });
      }

      const expectedRole = resolveRoleForEmail(req.user.email);
      if (req.user.role !== expectedRole) {
        req.user.role = expectedRole;
        await req.user.save({ validateBeforeSave: false });
      }

      next(); // Proceed to next middleware/route
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

module.exports = { protect, adminOnly };
