const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const authService = require('../services/auth.service');

const PROFILE_UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'profiles');
const PROFILE_MIME_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

const register = async (req, res, next) => {
  try {
    const { email, password, name, nickname, studentId, department } = req.body;

    if (!email || !password || !name || !nickname || !studentId || !department) {
      return res.status(400).json({
        success: false,
        message: '이메일, 비밀번호, 이름, 닉네임, 학번, 학과는 필수입니다.',
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 8자 이상이어야 합니다.',
      });
    }

    const result = await authService.register({
      email,
      password,
      name,
      nickname,
      studentId,
      department,
    });
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

const updateMe = async (req, res, next) => {
  try {
    const user = await authService.updateMe(req.user.id, req.body);

    res.json({
      success: true,
      message: '회원 정보가 수정되었습니다.',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    const { base64, mimeType } = req.body;

    if (!base64 || !mimeType) {
      return res.status(400).json({
        success: false,
        message: 'base64, mimeType은 필수 항목입니다.',
      });
    }

    const extension = PROFILE_MIME_EXTENSIONS[mimeType];

    if (!extension) {
      return res.status(400).json({
        success: false,
        message: 'jpg, png, webp 이미지만 업로드할 수 있습니다.',
      });
    }

    await fs.mkdir(PROFILE_UPLOAD_DIR, { recursive: true });

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(PROFILE_UPLOAD_DIR, fileName);
    const imageBuffer = Buffer.from(base64, 'base64');

    await fs.writeFile(filePath, imageBuffer);

    res.status(201).json({
      success: true,
      data: {
        imageUrl: `/uploads/profiles/${fileName}`,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  socialLogin,
  refresh,
  logout,
  getMe,
  updateMe,
  uploadProfileImage,
};
