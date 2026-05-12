const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Attendance = require('./Attendance');
const Mission = require('./Mission');
const MissionSubmission = require('./MissionSubmission');
const CreditTransaction = require('./CreditTransaction');

// ── 모델 간 관계 정의 ──

// User 관계
User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
User.hasMany(Attendance, { foreignKey: 'userId', as: 'attendances' });
User.hasMany(MissionSubmission, { foreignKey: 'userId', as: 'submissions' });
User.hasMany(CreditTransaction, { foreignKey: 'userId', as: 'transactions' });

// Product 관계
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// Attendance 관계
Attendance.belongsTo(User, { foreignKey: 'userId' });

// Mission & MissionSubmission 관계
Mission.hasMany(MissionSubmission, { foreignKey: 'missionId', as: 'submissions' });
MissionSubmission.belongsTo(Mission, { foreignKey: 'missionId' });
MissionSubmission.belongsTo(User, { foreignKey: 'userId' });

// CreditTransaction 관계
CreditTransaction.belongsTo(User, { foreignKey: 'userId' });

// DB 연결 및 테이블 동기화
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB 연결 성공');

    // force: false → 기존 테이블 유지
    // alter: true  → 스키마 변경 사항 자동 반영
    await sequelize.sync({ alter: true });
    console.log('✅ DB 동기화 완료');
  } catch (error) {
    console.error('❌ DB 연결 실패:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Product,
  Attendance,
  Mission,
  MissionSubmission,
  CreditTransaction,
};