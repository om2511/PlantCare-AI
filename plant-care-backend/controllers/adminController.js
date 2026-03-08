const User = require('../models/User');
const Plant = require('../models/Plant');
const CareLog = require('../models/CareLog');
const ContactMessage = require('../models/ContactMessage');
const PushSubscription = require('../models/PushSubscription');

const parseLimit = (rawLimit, fallback, hardMax) => {
  const parsed = Number.parseInt(rawLimit, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.min(parsed, hardMax);
};

// @desc    Get admin dashboard overview
// @route   GET /api/admin/overview
// @access  Private (admin)
const getAdminOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalBlockedUsers,
      totalPlants,
      totalCareLogs,
      totalMessages,
      newMessages,
      recentUsers,
      recentMessages
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isBlocked: true }),
      Plant.countDocuments(),
      CareLog.countDocuments(),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'new' }),
      User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(6).lean(),
      ContactMessage.find()
        .select('name email subject status createdAt')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          admins: totalAdmins,
          blockedUsers: totalBlockedUsers,
          plants: totalPlants,
          careLogs: totalCareLogs,
          contactMessages: totalMessages,
          unreadContactMessages: newMessages
        },
        recentUsers,
        recentMessages
      }
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin overview'
    });
  }
};

// @desc    Update user blocked status
// @route   PATCH /api/admin/users/:id/block-status
// @access  Private (admin)
const updateUserBlockStatus = async (req, res) => {
  try {
    const { isBlocked, reason } = req.body;
    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isBlocked must be boolean'
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (String(targetUser._id) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block or unblock your own account'
      });
    }

    if (targetUser.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be blocked from this endpoint'
      });
    }

    targetUser.isBlocked = isBlocked;
    targetUser.blockedAt = isBlocked ? new Date() : null;
    targetUser.blockReason = isBlocked ? String(reason || '').trim().slice(0, 300) : '';
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      data: {
        _id: targetUser._id,
        isBlocked: targetUser.isBlocked,
        blockedAt: targetUser.blockedAt,
        blockReason: targetUser.blockReason
      }
    });
  } catch (error) {
    console.error('Update user block status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

// @desc    Delete user account as admin
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUserAsAdmin = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id).lean();
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (String(targetUser._id) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account from admin endpoint'
      });
    }

    if (targetUser.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be deleted from this endpoint'
      });
    }

    await CareLog.deleteMany({ userId: targetUser._id });
    await Plant.deleteMany({ userId: targetUser._id });
    await PushSubscription.deleteMany({ userId: targetUser._id });
    await User.findByIdAndDelete(targetUser._id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user as admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// @desc    List users for admin
// @route   GET /api/admin/users
// @access  Private (admin)
const getUsers = async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit, 100, 300);
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Admin list users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// @desc    List plants for admin
// @route   GET /api/admin/plants
// @access  Private (admin)
const getPlants = async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit, 100, 300);
    const plants = await Plant.find()
      .select('nickname species category status userId createdAt updatedAt')
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Admin list plants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plants'
    });
  }
};

// @desc    List contact messages for admin
// @route   GET /api/admin/contact-messages
// @access  Private (admin)
const getAdminContactMessages = async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit, 100, 300);
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Admin contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
};

// @desc    Update contact message status
// @route   PATCH /api/admin/contact-messages/:id/status
// @access  Private (admin)
const updateContactMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    message.status = status;
    message.reviewedBy = req.user._id;
    message.reviewedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Contact message status updated',
      data: message
    });
  } catch (error) {
    console.error('Update contact message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message status'
    });
  }
};

module.exports = {
  getAdminOverview,
  getUsers,
  getPlants,
  getAdminContactMessages,
  updateContactMessageStatus,
  updateUserBlockStatus,
  deleteUserAsAdmin
};
