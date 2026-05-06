const sequelize = require('../config/database');
const User = require('./User');

// ── 추후 모델 간 관계 정의 위치 ──
// 예: User.hasMany(Meeting, { foreignKey: 'ownerId' });
// 예: Meeting.belongsTo(User, { foreignKey: 'ownerId' });

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

module.exports = { sequelize, syncDatabase, User };