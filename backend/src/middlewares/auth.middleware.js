const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    // 1. Authorization 헤더 추출
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '인증 토큰이 없습니다.',
      });
    }

    // 2. 토큰 파싱
    const token = authHeader.split(' ')[1];

    // 3. 토큰 검증
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === 'TokenExpiredError'
          ? '토큰이 만료되었습니다. 다시 로그인해주세요.'
          : '유효하지 않은 토큰입니다.',
      });
    }

    // 4. 유저 조회 (defaultScope 적용 → 민감 정보 제외)
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '존재하지 않는 유저입니다.',
      });
    }

    // 5. req에 유저 정보 첨부
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate };