const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserBadge = sequelize.define('UserBadge', {
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
    onDelete: 'CASCADE',
  },
  badgeCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  periodType: {
    type: DataTypes.ENUM('PERMANENT', 'MONTHLY', 'DAILY'),
    defaultValue: 'PERMANENT',
    allowNull: false,
  },
  periodKey: {
    type: DataTypes.STRING,
    defaultValue: 'ALL',
    allowNull: false,
  },
}, {
  tableName: 'user_badges',
});

module.exports = UserBadge;
