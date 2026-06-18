const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const { Op } = require('sequelize');
const mailer = require('../utils/mailer');
const {
  sequelize,
  Attendance,
  ChatMessage,
  ChatRoom,
  CreditTransaction,
  Favorite,
  MissionSubmission,
  Product,
  ProductImage,
  User,
  UserBadge,
} = require('../models');

const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads');
const DEFAULT_PASSWORD_RESET_TTL_MINUTES = 15;
const DEFAULT_PASSWORD_RESET_MAX_ATTEMPTS = 5;

const normalizeEmail = email => String(email || '').trim().toLowerCase();

const getAdminEmails = () =>
  String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(email => normalizeEmail(email))
    .filter(Boolean);

const isAdminEmail = email => getAdminEmails().includes(normalizeEmail(email));

const syncAdminRole = async (user) => {
  if (user && user.role !== 'ADMIN' && isAdminEmail(user.email)) {
    await user.update({ role: 'ADMIN' });
  }

  return user;
};

const emailWhere = email => sequelize.where(
  sequelize.fn('LOWER', sequelize.col('email')),
  normalizeEmail(email),
);

const getPasswordResetTtlMinutes = () => {
  const ttlMinutes = Number(process.env.PASSWORD_RESET_CODE_TTL_MINUTES);

  return Number.isFinite(ttlMinutes) && ttlMinutes > 0
    ? ttlMinutes
    : DEFAULT_PASSWORD_RESET_TTL_MINUTES;
};

const getPasswordResetMaxAttempts = () => {
  const maxAttempts = Number(process.env.PASSWORD_RESET_MAX_ATTEMPTS);

  return Number.isFinite(maxAttempts) && maxAttempts > 0
    ? maxAttempts
    : DEFAULT_PASSWORD_RESET_MAX_ATTEMPTS;
};

const shouldExposePasswordResetCode = () =>
  process.env.PASSWORD_RESET_RETURN_CODE === 'true';

const createPasswordResetCode = () => String(crypto.randomInt(100000, 1000000));

const hashPasswordResetCode = ({ email, code }) =>
  crypto
    .createHash('sha256')
    .update(`${normalizeEmail(email)}:${String(code || '').trim()}`)
    .digest('hex');

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
const toSafeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  nickname: user.nickname || user.name,
  studentId: user.studentId,
  department: user.department,
  profileImage: user.profileImage,
  provider: user.provider,
  role: user.role,
  credits: user.credits,
  createdAt: user.createdAt,
});

const getDisplayName = user => user?.nickname || user?.name || user?.email;

const resolveUploadPath = (imageUrl) => {
  if (!imageUrl || !String(imageUrl).startsWith('/uploads/')) {
    return null;
  }

  const relativePath = String(imageUrl).replace(/^\/uploads\//, '');
  const filePath = path.normalize(path.join(UPLOAD_ROOT, relativePath));

  if (!filePath.startsWith(UPLOAD_ROOT)) {
    return null;
  }

  return filePath;
};

const deleteUploadFiles = async (filePaths) => {
  await Promise.all(
    [...filePaths].map(async filePath => {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          console.warn('업로드 파일 삭제 실패:', filePath, err.message);
        }
      }
    }),
  );
};

const register = async ({
  email,
  password,
  name,
  nickname,
  studentId,
  department,
}) => {
  const normalizedEmail = normalizeEmail(email);
  const trimmedName = String(name || '').trim();
  const trimmedNickname = String(nickname || '').trim();
  const trimmedStudentId = String(studentId || '').trim();
  const trimmedDepartment = String(department || '').trim();

  if (!trimmedName) {
    const error = new Error('이름을 입력해주세요.');
    error.status = 400;
    throw error;
  }

  if (!trimmedNickname) {
    const error = new Error('닉네임을 입력해주세요.');
    error.status = 400;
    throw error;
  }

  if (!trimmedStudentId) {
    const error = new Error('학번을 입력해주세요.');
    error.status = 400;
    throw error;
  }

  if (!trimmedDepartment) {
    const error = new Error('학과를 선택해주세요.');
    error.status = 400;
    throw error;
  }

  // 1. 이메일 중복 체크
  const existingUser = await User.findOne({
    where: emailWhere(normalizedEmail),
  });
  if (existingUser) {
    const error = new Error('이미 사용 중인 이메일입니다.');
    error.status = 409;
    throw error;
  }

  // 2. 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. 유저 생성
  const user = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
    name: trimmedName,
    nickname: trimmedNickname,
    studentId: trimmedStudentId,
    department: trimmedDepartment,
    provider: 'LOCAL',
    role: isAdminEmail(normalizedEmail) ? 'ADMIN' : 'USER',
  });

  // 4. 토큰 발급
  const { accessToken, refreshToken } = generateTokens(user.id);

  // 5. refreshToken DB 저장
  await user.update({ refreshToken });

  // 6. 민감 정보 제거 후 반환
  return { user: toSafeUser(user), accessToken, refreshToken };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 로그인 (일반)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const login = async ({ email, password }) => {
  // 1. 유저 조회 (password 포함)
  const user = await User.scope('withSensitive').findOne({
    where: emailWhere(email),
  });
  if (!user || !user.password) {
    const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    error.status = 401;
    throw error;
  }

  await syncAdminRole(user);

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

  return { user: toSafeUser(user), accessToken, refreshToken };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 소셜 로그인 (Google / Kakao)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const socialLogin = async ({ email, name, profileImage, provider, providerId }) => {
  const normalizedEmail = normalizeEmail(email);

  // 1. 기존 유저 조회 또는 신규 생성
  let user = await User.scope('withSensitive').findOne({
    where: emailWhere(normalizedEmail),
  });

  if (user) {
    // 기존 유저 → 소셜 정보 업데이트
    await user.update({
      provider,
      providerId,
      profileImage,
      nickname: user.nickname || name || user.name,
      ...(isAdminEmail(normalizedEmail) ? { role: 'ADMIN' } : {}),
    });
  } else {
    // 신규 유저 생성
    user = await User.create({
      email: normalizedEmail,
      name,
      nickname: name,
      profileImage,
      provider,
      providerId,
      role: isAdminEmail(normalizedEmail) ? 'ADMIN' : 'USER',
    });
  }

  // 2. 토큰 발급
  const { accessToken, refreshToken } = generateTokens(user.id);

  // 3. refreshToken 저장
  await user.update({ refreshToken });

  return { user: toSafeUser(user), accessToken, refreshToken };
};

const fetchGoogleProfileWithAccessToken = async (accessToken) => {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = new Error('Google 인증 정보를 확인할 수 없습니다.');
    error.status = 401;
    throw error;
  }

  const profile = await response.json();

  if (!profile.sub || !profile.email) {
    const error = new Error('Google 계정 정보를 불러올 수 없습니다.');
    error.status = 401;
    throw error;
  }

  return {
    email: profile.email,
    name: profile.name || profile.email.split('@')[0],
    profileImage: profile.picture,
    provider: 'GOOGLE',
    providerId: profile.sub,
  };
};

const fetchGoogleProfileWithIdToken = async (idToken) => {
  const tokenInfoUrl = new URL('https://oauth2.googleapis.com/tokeninfo');
  tokenInfoUrl.searchParams.set('id_token', idToken);

  const response = await fetch(tokenInfoUrl);

  if (!response.ok) {
    const error = new Error('Google 인증 정보를 확인할 수 없습니다.');
    error.status = 401;
    throw error;
  }

  const profile = await response.json();

  if (!profile.sub || !profile.email) {
    const error = new Error('Google 계정 정보를 불러올 수 없습니다.');
    error.status = 401;
    throw error;
  }

  return {
    email: profile.email,
    name: profile.name || profile.email.split('@')[0],
    profileImage: profile.picture,
    provider: 'GOOGLE',
    providerId: profile.sub,
  };
};

const googleLogin = async ({ accessToken, idToken }) => {
  const googleProfile = idToken
    ? await fetchGoogleProfileWithIdToken(idToken)
    : await fetchGoogleProfileWithAccessToken(accessToken);

  return socialLogin(googleProfile);
};

const requestPasswordReset = async ({ email }) => {
  const normalizedEmail = normalizeEmail(email);
  const ttlMinutes = getPasswordResetTtlMinutes();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  const user = await User.scope('withSensitive').findOne({
    where: emailWhere(normalizedEmail),
  });

  if (!user) {
    return {
      expiresAt: expiresAt.toISOString(),
      resetCode: undefined,
    };
  }

  const resetCode = createPasswordResetCode();
  const passwordResetTokenHash = hashPasswordResetCode({
    email: normalizedEmail,
    code: resetCode,
  });

  await user.update({
    passwordResetTokenHash,
    passwordResetExpiresAt: expiresAt,
    passwordResetAttemptCount: 0,
  });

  if (process.env.NODE_ENV === 'development') {
    console.info(`[Password reset] ${normalizedEmail}: ${resetCode}`);
  }

  // 이메일 발송 비동기 처리 (응답 지연 방지를 위해 await 하지 않음)
  mailer.sendMail({
    to: normalizedEmail,
    subject: '[EcoBid] 비밀번호 재설정 안내',
    text: `비밀번호 재설정 코드는 다음과 같습니다: ${resetCode}\n이 코드는 ${ttlMinutes}분간 유효합니다.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>EcoBid 비밀번호 재설정</h2>
        <p>요청하신 비밀번호 재설정 코드는 다음과 같습니다:</p>
        <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
          ${resetCode}
        </div>
        <p>이 코드는 ${ttlMinutes}분간 유효합니다.</p>
        <p>본인이 요청하지 않은 경우 이 메일을 무시해 주세요.</p>
      </div>
    `,
  }).catch(err => {
    console.error('비밀번호 재설정 메일 발송 중 오류:', err);
  });

  return {
    expiresAt: expiresAt.toISOString(),
    resetCode: shouldExposePasswordResetCode() ? resetCode : undefined,
  };
};

const resetPassword = async ({ email, code, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedCode = String(code || '').trim();

  if (!normalizedEmail || !normalizedCode) {
    const error = new Error('이메일과 재설정 코드를 입력해주세요.');
    error.status = 400;
    throw error;
  }

  if (!password || password.length < 8) {
    const error = new Error('비밀번호는 8자 이상이어야 합니다.');
    error.status = 400;
    throw error;
  }

  const user = await User.scope('withSensitive').findOne({
    where: emailWhere(normalizedEmail),
  });

  const invalidCodeError = new Error('재설정 코드가 올바르지 않거나 만료되었습니다.');
  invalidCodeError.status = 400;

  if (!user || !user.passwordResetTokenHash || !user.passwordResetExpiresAt) {
    throw invalidCodeError;
  }

  if (new Date(user.passwordResetExpiresAt).getTime() < Date.now()) {
    await user.update({
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
      passwordResetAttemptCount: 0,
    });

    throw invalidCodeError;
  }

  const maxAttempts = getPasswordResetMaxAttempts();
  const attemptCount = Number(user.passwordResetAttemptCount || 0);

  if (attemptCount >= maxAttempts) {
    await user.update({
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
      passwordResetAttemptCount: 0,
    });

    throw invalidCodeError;
  }

  const submittedHash = hashPasswordResetCode({
    email: normalizedEmail,
    code: normalizedCode,
  });

  if (submittedHash !== user.passwordResetTokenHash) {
    const nextAttemptCount = attemptCount + 1;

    await user.update({
      passwordResetAttemptCount: nextAttemptCount,
      ...(nextAttemptCount >= maxAttempts
        ? {
            passwordResetTokenHash: null,
            passwordResetExpiresAt: null,
            passwordResetAttemptCount: 0,
          }
        : {}),
    });

    throw invalidCodeError;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await user.update({
    password: hashedPassword,
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null,
    passwordResetAttemptCount: 0,
    refreshToken: null,
  });

  return { user: toSafeUser(user) };
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

  return syncAdminRole(user);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 내 정보 수정
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const updateMe = async (userId, {
  name,
  nickname,
  studentId,
  department,
  profileImage,
}) => {
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

  if (nickname !== undefined) {
    const trimmedNickname = String(nickname).trim();

    if (!trimmedNickname) {
      const error = new Error('닉네임을 입력해주세요.');
      error.status = 400;
      throw error;
    }

    updatePayload.nickname = trimmedNickname;
  }

  if (studentId !== undefined) {
    updatePayload.studentId = String(studentId || '').trim() || null;
  }

  if (department !== undefined) {
    const trimmedDepartment = String(department).trim();

    if (!trimmedDepartment) {
      const error = new Error('학과를 선택해주세요.');
      error.status = 400;
      throw error;
    }

    updatePayload.department = trimmedDepartment;
  }

  if (profileImage !== undefined) {
    updatePayload.profileImage = profileImage || null;
  }

  await user.update(updatePayload);

  return toSafeUser(user);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 회원 탈퇴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const deleteAccount = async (userId) => {
  const uploadFilesToDelete = new Set();

  await sequelize.transaction(async (transaction) => {
    const user = await User.scope('withSensitive').findByPk(userId, {
      transaction,
    });

    if (!user) {
      const error = new Error('유저를 찾을 수 없습니다.');
      error.status = 404;
      throw error;
    }

    const profileImagePath = resolveUploadPath(user.profileImage);

    if (profileImagePath) {
      uploadFilesToDelete.add(profileImagePath);
    }

    const products = await Product.findAll({
      where: { sellerId: userId },
      attributes: ['id', 'imageUrl'],
      transaction,
    });
    const productIds = products.map(product => product.id);

    products.forEach(product => {
      const productImagePath = resolveUploadPath(product.imageUrl);

      if (productImagePath) {
        uploadFilesToDelete.add(productImagePath);
      }
    });

    if (productIds.length > 0) {
      const productImages = await ProductImage.findAll({
        where: {
          productId: {
            [Op.in]: productIds,
          },
        },
        attributes: ['imageUrl'],
        transaction,
      });

      productImages.forEach(image => {
        const imagePath = resolveUploadPath(image.imageUrl);

        if (imagePath) {
          uploadFilesToDelete.add(imagePath);
        }
      });
    }

    const roomWhere = {
      [Op.or]: [
        { buyerId: userId },
        { sellerId: userId },
      ],
    };

    if (productIds.length > 0) {
      roomWhere[Op.or].push({
        productId: {
          [Op.in]: productIds,
        },
      });
    }

    const chatRooms = await ChatRoom.findAll({
      where: roomWhere,
      attributes: ['id'],
      transaction,
    });
    const roomIds = chatRooms.map(room => room.id);

    const messageWhere = {
      [Op.or]: [
        { senderId: userId },
      ],
    };

    if (roomIds.length > 0) {
      messageWhere[Op.or].push({
        roomId: {
          [Op.in]: roomIds,
        },
      });
    }

    await ChatMessage.destroy({
      where: messageWhere,
      transaction,
    });

    if (roomIds.length > 0) {
      await ChatRoom.destroy({
        where: {
          id: {
            [Op.in]: roomIds,
          },
        },
        transaction,
      });
    }

    const favoriteWhere = {
      [Op.or]: [
        { userId },
      ],
    };

    if (productIds.length > 0) {
      favoriteWhere[Op.or].push({
        productId: {
          [Op.in]: productIds,
        },
      });
    }

    await Favorite.destroy({
      where: favoriteWhere,
      transaction,
    });

    if (productIds.length > 0) {
      await ProductImage.destroy({
        where: {
          productId: {
            [Op.in]: productIds,
          },
        },
        transaction,
      });

      await Product.destroy({
        where: {
          id: {
            [Op.in]: productIds,
          },
        },
        transaction,
      });
    }

    await Attendance.destroy({ where: { userId }, transaction });
    await CreditTransaction.destroy({ where: { userId }, transaction });
    await MissionSubmission.destroy({ where: { userId }, transaction });
    await UserBadge.destroy({ where: { userId }, transaction });

    await User.destroy({
      where: { id: userId },
      transaction,
    });
  });

  await deleteUploadFiles(uploadFilesToDelete);
};

module.exports = {
  register,
  login,
  socialLogin,
  googleLogin,
  requestPasswordReset,
  resetPassword,
  refreshAccessToken,
  logout,
  getMe,
  updateMe,
  deleteAccount,
  toSafeUser,
  getDisplayName,
};
