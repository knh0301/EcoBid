const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// GET /api/favorites - 내가 찜한 상품 목록
router.get('/', favoriteController.getMyFavorites);

// GET /api/favorites/ids - 내가 찜한 상품 ID 목록
router.get('/ids', favoriteController.getMyFavoriteIds);

// POST /api/favorites/:productId - 찜 추가
router.post('/:productId', favoriteController.addFavorite);

// DELETE /api/favorites/:productId - 찜 해제
router.delete('/:productId', favoriteController.removeFavorite);

module.exports = router;
