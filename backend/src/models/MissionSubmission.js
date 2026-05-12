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
}, {
  tableName: 'mission_submissions',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'mission_id'],
      // 참고: 현재는 한 사용자당 미션 1회 제출로 제한.
      // 추후 반복 미션(매일 수행 등)이 필요할 경우 unique 제약조건에 날짜(date) 등을 추가하거나 제약조건을 제거해야 함.
    },
  ],
});

module.exports = MissionSubmission;
