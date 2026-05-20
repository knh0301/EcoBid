const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JWT 토큰 생성
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 회원가입 (일반)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const register = async ({ email, password, name }) => {
  // 1. 이메일 중복 체크
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('이미 사용 중인 이메일입니다.');
    error.status = 409;
    throw error;
  }

  // 2. 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. 유저 생성
  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    provider: 'LOCAL',
  });

  // 4. 토큰 발급
  const { accessToken, refreshToken } = generateTokens(user.id);

  // 5. refreshToken DB 저장
  await user.update({ refreshToken });

  // 6. 민감 정보 제거 후 반환
  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    profileImage: user.profileImage,
    provider: user.provider,
    createdAt: user.createdAt,
  };

  return { user: safeUser, accessToken, refreshToken };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 로그인 (일반)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const login = async ({ email, password }) => {
  // 1. 유저 조회 (password 포함)
  const user = await User.scope('withSensitive').findOne({ where: { email } });
  if (!user || !user.password) {
    const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    error.status = 401;
    throw error;
  }

  // 2. 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    error.status = 401;
    throw error;
  }

  // 3. 토큰 발급
  const { accessToken, refreshToken } = generateTokens(user.id);

  // 4. refreshToken 저장
  await user.update({ refreshToken });

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    profileImage: user.profileImage,
    provider: user.provider,
    createdAt: user.createdAt,
  };

  return { user: safeUser, accessToken, refreshToken };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 소셜 로그인 (Google / Kakao)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const socialLogin = async ({ email, name, profileImage, provider, providerId }) => {
  // 1. 기존 유저 조회 또는 신규 생성
  let user = await User.scope('withSensitive').findOne({ where: { email } });

  if (user) {
    // 기존 유저 → 소셜 정보 업데이트
    await user.update({ provider, providerId, profileImage });
  } else {
    // 신규 유저 생성
    user = await User.create({
      email,
      name,
      profileImage,
      provider,
      providerId,
    });
  }

  // 2. 토큰 발급
  const { accessToken, refreshToken } = generateTokens(user.id);

  // 3. refreshToken 저장
  await user.update({ refreshToken });

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    profileImage: user.profileImage,
    provider: user.provider,
    createdAt: user.createdAt,
  };

  return { user: safeUser, accessToken, refreshToken };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Access Token 갱신
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const refreshAccessToken = async (refreshToken) => {
  // 1. 토큰 검증
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    const error = new Error('유효하지 않은 리프레시 토큰입니다.');
    error.status = 401;
    throw error;
  }

  // 2. DB에서 refreshToken 일치 확인
  const user = await User.scope('withSensitive').findByPk(payload.userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error('리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.');
    error.status = 401;
    throw error;
  }

  // 3. 새 토큰 발급 및 저장
  const tokens = generateTokens(user.id);
  await user.update({ refreshToken: tokens.refreshToken });

  return tokens;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 로그아웃
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const logout = async (userId) => {
  await User.update(
    { refreshToken: null },
    { where: { id: userId } }
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 내 정보 조회
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getMe = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('유저를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }
  return user;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 내 정보 수정
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const updateMe = async (userId, { name, profileImage }) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('유저를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  const updatePayload = {};

  if (name !== undefined) {
    const trimmedName = String(name).trim();

    if (!trimmedName) {
      const error = new Error('이름을 입력해주세요.');
      error.status = 400;
      throw error;
    }

    updatePayload.name = trimmedName;
  }

  if (profileImage !== undefined) {
    updatePayload.profileImage = profileImage || null;
  }

  await user.update(updatePayload);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    profileImage: user.profileImage,
    provider: user.provider,
    credits: user.credits,
    createdAt: user.createdAt,
  };
};

module.exports = {
  register,
  login,
  socialLogin,
  refreshAccessToken,
  logout,
  getMe,
  updateMe,
};
