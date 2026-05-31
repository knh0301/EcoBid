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

// POST /api/products/ai-draft - 상품 이미지 기반 AI 초안 생성
router.post('/ai-draft', authenticate, productController.generateProductDraft);

// GET /api/products/:id/trade-status - 현재 사용자의 거래 상태 조회
router.get('/:id/trade-status', authenticate, productController.getTradeStatus);

// POST /api/products/:id/send-credits - 구매자가 판매자에게 크레딧 전송
router.post('/:id/send-credits', authenticate, productController.sendProductCredits);

// POST /api/products/:id/complete - 구매자 거래 완료 처리
router.post('/:id/complete', authenticate, productController.completeTrade);

// GET /api/products/:id - 상품 상세 조회
router.get('/:id', productController.getProductById);

// POST /api/products - 상품 등록
router.post('/', authenticate, productController.createProduct);

// PUT /api/products/:id - 상품 수정
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - 상품 삭제
router.delete('/:id', productController.deleteProduct);

module.exports = router;
