const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middlewares/auth.middleware');

// GET /api/products - 상품 목록 조회
router.get('/', productController.getProducts);

// GET /api/products/mine - 내가 등록한 상품 목록 조회
router.get('/mine', authenticate, productController.getMyProducts);

// POST /api/products/images - 상품 이미지 업로드
router.post('/images', authenticate, productController.uploadProductImage);

// GET /api/products/:id - 상품 상세 조회
router.get('/:id', productController.getProductById);

// POST /api/products - 상품 등록
router.post('/', authenticate, productController.createProduct);

// PUT /api/products/:id - 상품 수정
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - 상품 삭제
router.delete('/:id', productController.deleteProduct);

module.exports = router;
