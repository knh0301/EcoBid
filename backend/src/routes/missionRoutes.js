const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/recommended', missionController.getRecommendedMissions);
router.post('/submissions', missionController.submitMission);

module.exports = router;
