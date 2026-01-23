const express = require('express');
const router = express.Router();
const {
  logCareActivity,
  getPlantCareLogs,
  getUserCareLogs,
  deleteCareLog
} = require('../controllers/careLogController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Care log routes
router.route('/')
  .get(getUserCareLogs)
  .post(logCareActivity);

router.get('/plant/:plantId', getPlantCareLogs);

router.delete('/:id', deleteCareLog);

module.exports = router;