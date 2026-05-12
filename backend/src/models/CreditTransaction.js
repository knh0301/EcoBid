const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CreditTransaction = sequelize.define('CreditTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  referenceType: {
    type: DataTypes.ENUM('ATTENDANCE', 'MISSION', 'PRODUCT'),
    allowNull: false,
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'credit_transactions',
  updatedAt: false, // 이력 데이터이므로 수정일은 필요 없음
});

module.exports = CreditTransaction;
