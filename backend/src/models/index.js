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
const ChatRoom = require('./ChatRoom');
const ChatMessage = require('./ChatMessage');
const UserBadge = require('./UserBadge');

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

const ensureUserSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const userColumns = await queryInterface.describeTable('users');

  if (!userColumns.nickname) {
    await queryInterface.addColumn('users', 'nickname', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await sequelize.query(`
      UPDATE users
      SET nickname = name
      WHERE nickname IS NULL OR nickname = ''
    `);
  }

  if (!userColumns.student_id) {
    await queryInterface.addColumn('users', 'student_id', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }

  if (!userColumns.department) {
    await queryInterface.addColumn('users', 'department', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
};

const ensureAttendanceSchema = async () => {
  const [tables] = await sequelize.query(`
    SELECT sql
    FROM sqlite_master
    WHERE type = 'table'
      AND name = 'attendances'
  `);

  const tableSql = tables[0]?.sql || '';
  const hasLegacySingleColumnUnique =
    /user_id[^,]+UNIQUE/i.test(tableSql) ||
    /attendance_date[^,]+UNIQUE/i.test(tableSql);

  if (!hasLegacySingleColumnUnique) {
    return;
  }

  console.log('🔧 attendances 테이블 unique 제약 보정 중...');

  await sequelize.query('PRAGMA foreign_keys = OFF');

  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS attendances_new (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users (id),
        attendance_date DATE NOT NULL,
        points_earned INTEGER DEFAULT 10,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
      )
    `);

    await sequelize.query(`
      INSERT OR IGNORE INTO attendances_new (
        id,
        user_id,
        attendance_date,
        points_earned,
        created_at,
        updated_at
      )
      SELECT
        id,
        user_id,
        attendance_date,
        points_earned,
        created_at,
        updated_at
      FROM attendances
      ORDER BY id ASC
    `);

    await sequelize.query('DROP TABLE attendances');
    await sequelize.query('ALTER TABLE attendances_new RENAME TO attendances');
    await sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS attendances_user_id_attendance_date
      ON attendances (user_id, attendance_date)
    `);
  } finally {
    await sequelize.query('PRAGMA foreign_keys = ON');
  }

  console.log('✅ attendances 테이블 unique 제약 보정 완료');
};

const ensureMissionSubmissionSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const indexes = await queryInterface.showIndex('mission_submissions');

  const legacyUniqueIndexes = indexes.filter(index => {
    const fields = index.fields.map(field => field.attribute || field.name);

    return index.unique &&
      fields.includes('user_id') &&
      fields.includes('mission_id') &&
      fields.length === 2;
  });

  for (const index of legacyUniqueIndexes) {
    console.log(`🔧 mission_submissions unique 제약 제거 중: ${index.name}`);
    await queryInterface.removeIndex('mission_submissions', index.name);
  }
};

const ensureUserBadgeSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const columns = await queryInterface.describeTable('user_badges');

  if (!columns.period_type) {
    await queryInterface.addColumn('user_badges', 'period_type', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'PERMANENT',
    });
  }

  if (!columns.period_key) {
    await queryInterface.addColumn('user_badges', 'period_key', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ALL',
    });
  }

  const indexes = await queryInterface.showIndex('user_badges');
  const legacyUniqueIndexes = indexes.filter(index => {
    const fields = index.fields.map(field => field.attribute || field.name);

    return index.unique &&
      fields.includes('user_id') &&
      fields.includes('badge_code') &&
      fields.length === 2;
  });

  for (const index of legacyUniqueIndexes) {
    console.log(`🔧 user_badges unique 제약 보정 중: ${index.name}`);
    await queryInterface.removeIndex('user_badges', index.name);
  }

  const hasPeriodUniqueIndex = indexes.some(index => {
    const fields = index.fields.map(field => field.attribute || field.name);

    return index.unique &&
      fields.includes('user_id') &&
      fields.includes('badge_code') &&
      fields.includes('period_key');
  });

  if (!hasPeriodUniqueIndex) {
    await queryInterface.addIndex('user_badges', {
      name: 'user_badges_user_id_badge_code_period_key',
      unique: true,
      fields: ['user_id', 'badge_code', 'period_key'],
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
User.hasMany(ChatRoom, { foreignKey: 'buyerId', as: 'buyerChatRooms' });
User.hasMany(ChatRoom, { foreignKey: 'sellerId', as: 'sellerChatRooms' });
User.hasMany(ChatMessage, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(UserBadge, {
  foreignKey: 'userId',
  as: 'badges',
  onDelete: 'CASCADE',
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
Product.hasMany(ChatRoom, { foreignKey: 'productId', as: 'chatRooms' });

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

// ChatRoom 관계
ChatRoom.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
ChatRoom.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
ChatRoom.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ChatRoom.hasMany(ChatMessage, { foreignKey: 'roomId', as: 'messages' });

// ChatMessage 관계
ChatMessage.belongsTo(ChatRoom, { foreignKey: 'roomId', as: 'room' });
ChatMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// UserBadge 관계
UserBadge.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// DB 연결 및 테이블 동기화
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB 연결 성공');

    // force: false → 기존 테이블 유지
    // alter: true  → 스키마 변경 사항 자동 반영
    await sequelize.sync({ alter: false });
    await ensureUserSchema();
    await ensureProductSchema();
    await ensureAttendanceSchema();
    await ensureMissionSubmissionSchema();
    await ensureUserBadgeSchema();
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
  ChatRoom,
  ChatMessage,
  UserBadge,
};
