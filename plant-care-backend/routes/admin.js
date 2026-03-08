const express = require('express');
const {
  getAdminOverview,
  getUsers,
  getPlants,
  getAdminContactMessages,
  updateContactMessageStatus,
  updateUserBlockStatus,
  deleteUserAsAdmin
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/overview', getAdminOverview);
router.get('/users', getUsers);
router.patch('/users/:id/block-status', updateUserBlockStatus);
router.delete('/users/:id', deleteUserAsAdmin);
router.get('/plants', getPlants);
router.get('/contact-messages', getAdminContactMessages);
router.patch('/contact-messages/:id/status', updateContactMessageStatus);

module.exports = router;
