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

  // Refresh Token 저장
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
},
{
  tableName: 'users',
  // password, refreshToken은 기본 조회에서 제외
  defaultScope: {
    attributes: {
      exclude: ['password', 'refreshToken'],
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