const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - 상품 목록 조회
router.get('/', productController.getProducts);

// GET /api/products/:id - 상품 상세 조회
router.get('/:id', productController.getProductById);

// POST /api/products - 상품 등록
router.post('/', productController.createProduct);

// PUT /api/products/:id - 상품 수정
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - 상품 삭제
router.delete('/:id', productController.deleteProduct);

module.exports = router;
