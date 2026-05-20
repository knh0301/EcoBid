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
}, {
  tableName: 'user_badges',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'badge_code'],
    },
  ],
});

module.exports = UserBadge;
