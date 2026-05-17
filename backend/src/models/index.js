const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const Attendance = require('./Attendance');
const Mission = require('./Mission');
const MissionSubmission = require('./MissionSubmission');
const CreditTransaction = require('./CreditTransaction');
const Favorite = require('./Favorite');

const ensureProductSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const productColumns = await queryInterface.describeTable('products');

  if (!productColumns.category) {
    await queryInterface.addColumn('products', 'category', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
};

// ── 모델 간 관계 정의 ──

// User 관계
User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
User.hasMany(Attendance, { foreignKey: 'userId', as: 'attendances' });
User.hasMany(MissionSubmission, { foreignKey: 'userId', as: 'submissions' });
User.hasMany(CreditTransaction, { foreignKey: 'userId', as: 'transactions' });
User.hasMany(Favorite, {
  foreignKey: 'userId',
  as: 'favorites',
  onDelete: 'CASCADE',
});
User.belongsToMany(Product, {
  through: Favorite,
  foreignKey: 'userId',
  otherKey: 'productId',
  as: 'likedProducts',
});

// Product 관계
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Product.hasMany(ProductImage, {
  foreignKey: 'productId',
  as: 'images',
  onDelete: 'CASCADE',
});
Product.hasMany(Favorite, {
  foreignKey: 'productId',
  as: 'favorites',
  onDelete: 'CASCADE',
});
Product.belongsToMany(User, {
  through: Favorite,
  foreignKey: 'productId',
  otherKey: 'userId',
  as: 'likedUsers',
});

// ProductImage 관계
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Attendance 관계
Attendance.belongsTo(User, { foreignKey: 'userId' });

// Mission & MissionSubmission 관계
Mission.hasMany(MissionSubmission, { foreignKey: 'missionId', as: 'submissions' });
MissionSubmission.belongsTo(Mission, { foreignKey: 'missionId' });
MissionSubmission.belongsTo(User, { foreignKey: 'userId' });

// CreditTransaction 관계
CreditTransaction.belongsTo(User, { foreignKey: 'userId' });

// Favorite 관계
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Favorite.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// DB 연결 및 테이블 동기화
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB 연결 성공');

    // force: false → 기존 테이블 유지
    // alter: true  → 스키마 변경 사항 자동 반영
    await sequelize.sync({ alter: false });
    await ensureProductSchema();
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
  ProductImage,
  Attendance,
  Mission,
  MissionSubmission,
  CreditTransaction,
  Favorite,
};
