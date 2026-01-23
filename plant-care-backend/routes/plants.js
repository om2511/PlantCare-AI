const express = require('express');
const router = express.Router();
const {
  addPlant,
  getPlants,
  getPlant,
  updatePlant,
  deletePlant,
  getPlantsNeedingCare,
  getSeasonalTips
} = require('../controllers/plantController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Plant routes
router.route('/')
  .get(getPlants)
  .post(addPlant);

router.get('/care/today', getPlantsNeedingCare);

router.route('/:id')
  .get(getPlant)
  .put(updatePlant)
  .delete(deletePlant);

router.get('/:id/seasonal-tips', getSeasonalTips);

module.exports = router;