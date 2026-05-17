const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// POST /api/attendance/check - 오늘 출석하기
router.post('/check', attendanceController.checkAttendance);

// GET /api/attendance/today - 오늘 출석 여부 확인
router.get('/today', attendanceController.checkTodayStatus);

// GET /api/attendance/history - 내 출석 기록 조회
router.get('/history', attendanceController.getHistory);

// GET /api/attendance/streak - 연속 출석일 계산
router.get('/streak', attendanceController.getStreak);

module.exports = router;
