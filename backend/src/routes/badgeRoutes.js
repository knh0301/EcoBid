const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/my', badgeController.getMyBadges);

module.exports = router;
