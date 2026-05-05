const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.env.DB_PATH || './database.sqlite'),
  logging: process.env.NODE_ENV === 'development'
    ? (msg) => console.log(`[SQL] ${msg}`)
    : false,
  define: {
    // 모든 모델에 createdAt, updatedAt 자동 추가
    timestamps: true,
    // 테이블명 자동 복수화 방지
    freezeTableName: true,
    // snake_case 컬럼명 사용
    underscored: true,
  },
});

module.exports = sequelize;