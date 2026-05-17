const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middlewares/auth.middleware');

// 모든 채팅 API는 로그인 인증이 필수입니다.
router.use(authenticate);

// 1. 채팅방 생성 또는 기존 방 반환
// POST /api/chats/rooms
router.post('/rooms', chatController.createOrGetRoom);

// 2. 내 채팅방 목록 조회
// GET /api/chats/rooms
router.get('/rooms', chatController.getRooms);

// 3. 특정 채팅방 메시지 목록 조회
// GET /api/chats/rooms/:roomId/messages
router.get('/rooms/:roomId/messages', chatController.getRoomMessages);

module.exports = router;
