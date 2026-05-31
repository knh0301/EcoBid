const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');

// GET /api/credits - 크레딧 내역 목록 조회
router.get('/', creditController.getCreditTransactions);

// GET /api/credits/department-rankings - 학과별 크레딧 총액 순위
router.get('/department-rankings', creditController.getDepartmentCreditRankings);

// GET /api/credits/:id - 크레딧 내역 상세 조회
router.get('/:id', creditController.getCreditTransactionById);

// POST /api/credits - 크레딧 내역 생성
router.post('/', creditController.createCreditTransaction);

// PUT /api/credits/:id - 크레딧 내역 수정
router.put('/:id', creditController.updateCreditTransaction);

// DELETE /api/credits/:id - 크레딧 내역 삭제
router.delete('/:id', creditController.deleteCreditTransaction);

module.exports = router;
