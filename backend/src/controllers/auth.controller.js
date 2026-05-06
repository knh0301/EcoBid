const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: '이메일, 비밀번호, 이름은 필수입니다.',
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 8자 이상이어야 합니다.',
      });
    }

    const result = await authService.register({ email, password, name });
    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일과 비밀번호를 입력해주세요.',
      });
    }

    const result = await authService.login({ email, password });
    res.json({
      success: true,
      message: '로그인 성공',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const socialLogin = async (req, res, next) => {
  try {
    const { email, name, profileImage, provider, providerId } = req.body;

    if (!email || !provider || !providerId) {
      return res.status(400).json({
        success: false,
        message: '소셜 로그인 정보가 부족합니다.',
      });
    }
    if (!['GOOGLE', 'KAKAO'].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: '지원하지 않는 소셜 로그인 제공자입니다.',
      });
    }

    const result = await authService.socialLogin({
      email, name, profileImage, provider, providerId,
    });
    res.json({
      success: true,
      message: '소셜 로그인 성공',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: '리프레시 토큰이 없습니다.',
      });
    }

    const tokens = await authService.refreshAccessToken(refreshToken);
    res.json({
      success: true,
      message: '토큰이 갱신되었습니다.',
      data: tokens,
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.json({
      success: true,
      message: '로그아웃 되었습니다.',
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, socialLogin, refresh, logout, getMe };