const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// POST /api/attendance/check - 오늘 출석하기
router.post('/check', attendanceController.checkAttendance);

// GET /api/attendance/today/:userId - 오늘 출석 여부 확인
router.get('/today/:userId', attendanceController.checkTodayStatus);

// GET /api/attendance/history/:userId - 내 출석 기록 조회
router.get('/history/:userId', attendanceController.getHistory);

// GET /api/attendance/streak/:userId - 연속 출석일 계산
router.get('/streak/:userId', attendanceController.getStreak);

module.exports = router;
