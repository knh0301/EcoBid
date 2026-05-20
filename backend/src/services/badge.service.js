const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Attendance,
  ChatRoom,
  CreditTransaction,
  Favorite,
  Mission,
  MissionSubmission,
  Product,
  User,
  UserBadge,
} = require('../models');

const BADGE_DEFINITIONS = [
  {
    code: 'SHARE_ANGEL',
    title: '나눔 천사',
    description: '나눔 완료 10회',
    icon: 'gift-outline',
    color: '#2F6F3E',
    bgColor: '#EAF2E9',
  },
  {
    code: 'EARTH_GUARDIAN',
    title: '지구 수호',
    description: '미션 누적 50회',
    icon: 'leaf-outline',
    color: '#4F8A45',
    bgColor: '#EEF7EA',
  },
  {
    code: 'COMMUNICATOR',
    title: '소통왕',
    description: '채팅방 20개 이상',
    icon: 'chatbubble-ellipses-outline',
    color: '#3F6FA8',
    bgColor: '#EAF2FF',
  },
  {
    code: 'PUBLIC_TRANSPORT',
    title: '대중교통',
    description: '대중교통 미션 10회',
    icon: 'bus-outline',
    color: '#D9822B',
    bgColor: '#FFF3E4',
  },
  {
    code: 'SAVER',
    title: '절약왕',
    description: '크레딧 미사용 5,000 보유',
    icon: 'wallet-outline',
    color: '#B88700',
    bgColor: '#FFF8D8',
  },
  {
    code: 'GOLDEN_HAND',
    title: '금손',
    description: '내 물품 찜 합산 50회',
    icon: 'hammer-outline',
    color: '#7A5CDB',
    bgColor: '#F1EDFF',
  },
  {
    code: 'PERFECT_ATTENDANCE',
    title: '개근상',
    description: '한 달 출석 30회',
    icon: 'calendar-clear-outline',
    color: '#D55353',
    bgColor: '#FFECEC',
  },
  {
    code: 'MISSION_RUNNER',
    title: '미션러너',
    description: '하루 미션 4개 완료',
    icon: 'flag-outline',
    color: '#2F6F3E',
    bgColor: '#EAF2E9',
  },
];

const hasMonthWithThirtyAttendances = async (userId) => {
  const rows = await sequelize.query(
    `
      SELECT COUNT(*) AS count
      FROM (
        SELECT strftime('%Y-%m', attendance_date) AS month_key,
               COUNT(DISTINCT attendance_date) AS attendance_count
        FROM attendances
        WHERE user_id = :userId
        GROUP BY month_key
        HAVING attendance_count >= 30
        LIMIT 1
      )
    `,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    },
  );

  return Number(rows[0]?.count || 0) > 0;
};

const hasDayWithFourMissionCompletions = async (userId) => {
  const rows = await sequelize.query(
    `
      SELECT COUNT(*) AS count
      FROM (
        SELECT date(created_at) AS day_key,
               COUNT(DISTINCT mission_id) AS mission_count
        FROM mission_submissions
        WHERE user_id = :userId
          AND status = 'APPROVED'
        GROUP BY day_key
        HAVING mission_count >= 4
        LIMIT 1
      )
    `,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    },
  );

  return Number(rows[0]?.count || 0) > 0;
};

const checkBadgeEligibility = {
  SHARE_ANGEL: async (userId) => {
    const completedShares = await Product.count({
      where: {
        sellerId: userId,
        status: 'SOLD',
      },
    });

    return completedShares >= 10;
  },

  EARTH_GUARDIAN: async (userId) => {
    const completedMissions = await MissionSubmission.count({
      where: {
        userId,
        status: 'APPROVED',
      },
    });

    return completedMissions >= 50;
  },

  COMMUNICATOR: async (userId) => {
    const roomCount = await ChatRoom.count({
      where: {
        [Op.or]: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
    });

    return roomCount >= 20;
  },

  PUBLIC_TRANSPORT: async (userId) => {
    const publicTransportMissions = await MissionSubmission.count({
      where: {
        userId,
        status: 'APPROVED',
      },
      include: [
        {
          model: Mission,
          required: true,
          where: {
            title: {
              [Op.like]: '%대중교통%',
            },
          },
        },
      ],
    });

    return publicTransportMissions >= 10;
  },

  SAVER: async (userId) => {
    const [user, spentCount] = await Promise.all([
      User.findByPk(userId),
      CreditTransaction.count({
        where: {
          userId,
          amount: {
            [Op.lt]: 0,
          },
        },
      }),
    ]);

    return !!user && Number(user.credits) >= 5000 && spentCount === 0;
  },

  GOLDEN_HAND: async (userId) => {
    const favoriteCount = await Favorite.count({
      include: [
        {
          model: Product,
          as: 'product',
          required: true,
          where: {
            sellerId: userId,
          },
        },
      ],
    });

    return favoriteCount >= 50;
  },

  PERFECT_ATTENDANCE: async (userId) => {
    const attendanceCount = await Attendance.count({
      where: { userId },
    });

    if (attendanceCount < 30) {
      return false;
    }

    return hasMonthWithThirtyAttendances(userId);
  },

  MISSION_RUNNER: hasDayWithFourMissionCompletions,
};

const getBadgeDefinitions = () => BADGE_DEFINITIONS;

const evaluateAndAwardBadges = async (userId) => {
  const existingBadges = await UserBadge.findAll({
    where: { userId },
    attributes: ['badgeCode'],
  });
  const existingBadgeCodes = new Set(
    existingBadges.map(badge => badge.badgeCode),
  );
  const awardedBadges = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (existingBadgeCodes.has(badge.code)) {
      continue;
    }

    const isEligible = await checkBadgeEligibility[badge.code](userId);

    if (!isEligible) {
      continue;
    }

    try {
      await UserBadge.create({
        userId,
        badgeCode: badge.code,
      });
      awardedBadges.push(badge);
      existingBadgeCodes.add(badge.code);
    } catch (err) {
      if (err.name !== 'SequelizeUniqueConstraintError') {
        throw err;
      }
    }
  }

  return awardedBadges;
};

const getUserBadges = async (userId) => {
  await evaluateAndAwardBadges(userId);

  const userBadges = await UserBadge.findAll({
    where: { userId },
    attributes: ['badgeCode', 'createdAt'],
  });
  const awardedByCode = new Map(
    userBadges.map(badge => [badge.badgeCode, badge.createdAt]),
  );

  return BADGE_DEFINITIONS.map(badge => ({
    ...badge,
    isAwarded: awardedByCode.has(badge.code),
    awardedAt: awardedByCode.get(badge.code) || null,
  }));
};

module.exports = {
  BADGE_DEFINITIONS,
  evaluateAndAwardBadges,
  getBadgeDefinitions,
  getUserBadges,
};
