const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { syncDatabase } = require('./models');
const authRoutes = require('./routes/auth.routes');

const app = express();

// ── 미들웨어 ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

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
  app.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
    console.log(`📌 환경: ${process.env.NODE_ENV}`);
  });
});

module.exports = app;