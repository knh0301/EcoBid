const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: '이미 사용 중인 이메일입니다.',
    },
    validate: {
      isEmail: {
        msg: '올바른 이메일 형식이 아닙니다.',
      },
      notEmpty: {
        msg: '이메일을 입력해주세요.',
      },
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: true, // 소셜 로그인 시 null
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: '이름을 입력해주세요.',
      },
      len: {
        args: [1, 50],
        msg: '이름은 1~50자 사이여야 합니다.',
      },
    },
  },

  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [1, 30],
        msg: '닉네임은 1~30자 사이여야 합니다.',
      },
    },
  },

  studentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // 소셜 로그인 제공자
  provider: {
    type: DataTypes.ENUM('LOCAL', 'GOOGLE', 'KAKAO'),
    defaultValue: 'LOCAL',
    allowNull: false,
  },

  // 소셜 제공자 고유 ID
  providerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  role: {
    type: DataTypes.ENUM('USER', 'ADMIN'),
    defaultValue: 'USER',
    allowNull: false,
  },

  // Refresh Token 저장
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // 비밀번호 재설정 코드 해시
  passwordResetTokenHash: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // 비밀번호 재설정 코드 만료 시각
  passwordResetExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  // 비밀번호 재설정 코드 검증 실패 횟수
  passwordResetAttemptCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },

  // 보유 크레딧 잔액 캐시
  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
},
{
  tableName: 'users',
  // password, refreshToken은 기본 조회에서 제외
  defaultScope: {
    attributes: {
      exclude: [
        'password',
        'refreshToken',
        'passwordResetTokenHash',
        'passwordResetExpiresAt',
        'passwordResetAttemptCount',
      ],
    },
  },
  // 민감 정보 포함 조회용 scope
  scopes: {
    withSensitive: {
      attributes: {},
    },
  },
});

module.exports = User;
