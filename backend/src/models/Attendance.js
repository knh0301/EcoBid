const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
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
  attendanceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  pointsEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
}, {
  tableName: 'attendances',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'attendance_date'],
    },
  ],
});

module.exports = Attendance;
