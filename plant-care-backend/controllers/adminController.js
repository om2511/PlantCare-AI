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

const parsePage = (rawPage, fallback = 1) => {
  const parsed = Number.parseInt(rawPage, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
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
      inProgressMessages,
      resolvedMessages,
      usersLast7Days,
      plantsLast7Days,
      messagesLast7Days,
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
      ContactMessage.countDocuments({ status: 'in-progress' }),
      ContactMessage.countDocuments({ status: 'resolved' }),
      User.countDocuments({ createdAt: { $gte: daysAgo(7) } }),
      Plant.countDocuments({ createdAt: { $gte: daysAgo(7) } }),
      ContactMessage.countDocuments({ createdAt: { $gte: daysAgo(7) } }),
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
        messageStatusCounts: {
          new: newMessages,
          inProgress: inProgressMessages,
          resolved: resolvedMessages
        },
        recentActivity: {
          usersLast7Days,
          plantsLast7Days,
          messagesLast7Days
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

// @desc    Delete all resolved contact messages
// @route   DELETE /api/admin/contact-messages/resolved
// @access  Private (admin)
const deleteResolvedContactMessages = async (req, res) => {
  try {
    const deleteResult = await ContactMessage.deleteMany({ status: 'resolved' });
    res.status(200).json({
      success: true,
      message: 'Resolved contact messages deleted successfully',
      data: {
        deletedCount: deleteResult.deletedCount || 0
      }
    });
  } catch (error) {
    console.error('Delete resolved contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resolved contact messages'
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
    const limit = parseLimit(req.query.limit, 20, 300);
    const page = parsePage(req.query.page, 1);
    const status = String(req.query.status || 'all');
    const role = String(req.query.role || 'all');
    const search = String(req.query.search || '').trim();

    const query = {};
    if (status === 'blocked') {
      query.isBlocked = true;
    } else if (status === 'active') {
      query.isBlocked = false;
    }
    if (role === 'admin' || role === 'user') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages
      },
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
    const limit = parseLimit(req.query.limit, 20, 300);
    const page = parsePage(req.query.page, 1);
    const status = String(req.query.status || 'all');
    const category = String(req.query.category || 'all');
    const search = String(req.query.search || '').trim();

    const query = {};
    if (status !== 'all') {
      query.status = status;
    }
    if (category !== 'all') {
      query.category = category;
    }

    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const matchingUserIds = matchingUsers.map((item) => item._id);
      query.$or = [
        { nickname: { $regex: search, $options: 'i' } },
        { species: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        ...(matchingUserIds.length ? [{ userId: { $in: matchingUserIds } }] : [])
      ];
    }

    const total = await Plant.countDocuments(query);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    const plants = await Plant.find(query)
      .select('nickname species category status userId createdAt updatedAt')
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: plants.length,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages
      },
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
    const limit = parseLimit(req.query.limit, 20, 300);
    const page = parsePage(req.query.page, 1);
    const status = String(req.query.status || 'all');
    const search = String(req.query.search || '').trim();

    const query = {};
    if (status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await ContactMessage.countDocuments(query);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: messages.length,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages
      },
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

// @desc    Delete contact message (resolved only)
// @route   DELETE /api/admin/contact-messages/:id
// @access  Private (admin)
const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    if (message.status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Only resolved messages can be deleted'
      });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message'
    });
  }
};

module.exports = {
  getAdminOverview,
  getUsers,
  getPlants,
  getAdminContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  deleteResolvedContactMessages,
  updateUserBlockStatus,
  deleteUserAsAdmin
};
