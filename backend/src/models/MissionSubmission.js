const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MissionSubmission = sequelize.define('MissionSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  missionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'missions',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // 사진 업로드 기능 구현 전까지 null 허용
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageHash: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verificationProvider: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  aiIsValid: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  aiConfidence: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  aiReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  aiEvidence: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  aiCheckedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'mission_submissions',
});

module.exports = MissionSubmission;
