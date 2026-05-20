const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const { syncDatabase } = require('./models');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/productRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const creditRoutes = require('./routes/creditRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const chatRoutes = require('./routes/chatRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const missionRoutes = require('./routes/missionRoutes');
const { initializeChatSocket } = require('./socket/chatSocket');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initializeChatSocket(io);

// ── 미들웨어 ──
app.use(cors());

// base64 이미지 업로드 요청이 커질 수 있으므로 body size limit 증가
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(morgan('dev'));

// 업로드된 이미지 정적 파일 서빙
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── 헬스 체크 ──
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'NTPC 서버 정상 동작 중',
    timestamp: new Date().toISOString(),
  });
});

// ── 라우터 ──
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/missions', missionRoutes);

// ── 404 처리 ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `경로를 찾을 수 없습니다: ${req.method} ${req.originalUrl}`,
  });
});

// ── 글로벌 에러 핸들러 ──
app.use((err, req, res, next) => {
  console.error('에러:', err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 내부 오류가 발생했습니다.',
  });
});

// ── DB 연결 후 서버 시작 ──
const PORT = process.env.PORT || 3000;

syncDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
    console.log(`📌 환경: ${process.env.NODE_ENV}`);
  });
});

module.exports = { app, server, io };
