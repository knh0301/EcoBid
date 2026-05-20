const { Op } = require('sequelize');
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
    code: 'COMMUNICATOR',
    title: '소통왕',
    description: '채팅방 20개 이상',
    icon: 'chatbubble-ellipses-outline',
    color: '#3F6FA8',
    bgColor: '#EAF2FF',
    periodType: 'PERMANENT',
  },
  {
    code: 'GOLDEN_HAND',
    title: '금손',
    description: '내 물품 찜 합산 50회',
    icon: 'hammer-outline',
    color: '#7A5CDB',
    bgColor: '#F1EDFF',
    periodType: 'PERMANENT',
  },
  {
    code: 'SAVER',
    title: '절약왕',
    description: '크레딧 미사용 5,000 보유',
    icon: 'wallet-outline',
    color: '#B88700',
    bgColor: '#FFF8D8',
    periodType: 'PERMANENT',
  },
  {
    code: 'MISSION_RUNNER',
    title: '미션러너',
    description: '오늘 미션 4개 완료',
    icon: 'flag-outline',
    color: '#2F6F3E',
    bgColor: '#EAF2E9',
    periodType: 'DAILY',
  },
  {
    code: 'SHARE_ANGEL',
    title: '나눔 천사',
    description: '이번 달 나눔 완료 10회',
    icon: 'gift-outline',
    color: '#2F6F3E',
    bgColor: '#EAF2E9',
    periodType: 'MONTHLY',
  },
  {
    code: 'EARTH_GUARDIAN',
    title: '지구 수호',
    description: '이번 달 미션 50회',
    icon: 'leaf-outline',
    color: '#4F8A45',
    bgColor: '#EEF7EA',
    periodType: 'MONTHLY',
  },
  {
    code: 'PUBLIC_TRANSPORT',
    title: '대중교통',
    description: '이번 달 대중교통 10회',
    icon: 'bus-outline',
    color: '#D9822B',
    bgColor: '#FFF3E4',
    periodType: 'MONTHLY',
  },
  {
    code: 'PERFECT_ATTENDANCE',
    title: '개근상',
    description: '이번 달 출석 30회',
    icon: 'calendar-clear-outline',
    color: '#D55353',
    bgColor: '#FFECEC',
    periodType: 'MONTHLY',
  },
];

const padNumber = value => String(value).padStart(2, '0');

const getSeoulDateParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, Number(part.value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
};

const getSeoulStartDate = (year, month, day) => {
  return new Date(Date.UTC(year, month - 1, day, -9, 0, 0, 0));
};

const getPeriodContext = (date = new Date()) => {
  const { year, month, day } = getSeoulDateParts(date);
  const monthKey = `${year}-${padNumber(month)}`;
  const dayKey = `${monthKey}-${padNumber(day)}`;
  const nextMonthYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;

  return {
    monthKey,
    dayKey,
    monthStart: getSeoulStartDate(year, month, 1),
    monthEnd: getSeoulStartDate(nextMonthYear, nextMonth, 1),
    dayStart: getSeoulStartDate(year, month, day),
    dayEnd: getSeoulStartDate(year, month, day + 1),
    attendanceMonthStart: `${monthKey}-01`,
    attendanceMonthEnd: `${nextMonthYear}-${padNumber(nextMonth)}-01`,
  };
};

const getBadgePeriodKey = (badge, periodContext) => {
  if (badge.periodType === 'MONTHLY') {
    return periodContext.monthKey;
  }

  if (badge.periodType === 'DAILY') {
    return periodContext.dayKey;
  }

  return 'ALL';
};

const checkBadgeEligibility = {
  SHARE_ANGEL: async (userId, periodContext) => {
    const completedShares = await Product.count({
      where: {
        sellerId: userId,
        status: 'SOLD',
        updatedAt: {
          [Op.gte]: periodContext.monthStart,
          [Op.lt]: periodContext.monthEnd,
        },
      },
    });

    return completedShares >= 10;
  },

  EARTH_GUARDIAN: async (userId, periodContext) => {
    const completedMissions = await MissionSubmission.count({
      where: {
        userId,
        status: 'APPROVED',
        createdAt: {
          [Op.gte]: periodContext.monthStart,
          [Op.lt]: periodContext.monthEnd,
        },
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

  PUBLIC_TRANSPORT: async (userId, periodContext) => {
    const publicTransportMissions = await MissionSubmission.count({
      where: {
        userId,
        status: 'APPROVED',
        createdAt: {
          [Op.gte]: periodContext.monthStart,
          [Op.lt]: periodContext.monthEnd,
        },
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

  PERFECT_ATTENDANCE: async (userId, periodContext) => {
    const attendanceCount = await Attendance.count({
      where: {
        userId,
        attendanceDate: {
          [Op.gte]: periodContext.attendanceMonthStart,
          [Op.lt]: periodContext.attendanceMonthEnd,
        },
      },
    });

    return attendanceCount >= 30;
  },

  MISSION_RUNNER: async (userId, periodContext) => {
    const missionCount = await MissionSubmission.count({
      where: {
        userId,
        status: 'APPROVED',
        createdAt: {
          [Op.gte]: periodContext.dayStart,
          [Op.lt]: periodContext.dayEnd,
        },
      },
      distinct: true,
      col: 'missionId',
    });

    return missionCount >= 4;
  },
};

const getBadgeDefinitions = () => BADGE_DEFINITIONS;

const evaluateAndAwardBadges = async (userId) => {
  const periodContext = getPeriodContext();
  const existingBadges = await UserBadge.findAll({
    where: { userId },
    attributes: ['badgeCode', 'periodKey'],
  });
  const existingBadgeCodes = new Set(
    existingBadges.map(badge => `${badge.badgeCode}:${badge.periodKey}`),
  );
  const awardedBadges = [];

  for (const badge of BADGE_DEFINITIONS) {
    const periodKey = getBadgePeriodKey(badge, periodContext);
    const badgePeriodId = `${badge.code}:${periodKey}`;

    if (existingBadgeCodes.has(badgePeriodId)) {
      continue;
    }

    const isEligible = await checkBadgeEligibility[badge.code](
      userId,
      periodContext,
    );

    if (!isEligible) {
      continue;
    }

    try {
      await UserBadge.create({
        userId,
        badgeCode: badge.code,
        periodType: badge.periodType,
        periodKey,
      });
      awardedBadges.push(badge);
      existingBadgeCodes.add(badgePeriodId);
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
  const periodContext = getPeriodContext();

  const userBadges = await UserBadge.findAll({
    where: { userId },
    attributes: ['badgeCode', 'periodKey', 'createdAt'],
  });
  const awardedByCode = new Map(
    userBadges.map(badge => [
      `${badge.badgeCode}:${badge.periodKey}`,
      badge.createdAt,
    ]),
  );

  return BADGE_DEFINITIONS.map(badge => {
    const periodKey = getBadgePeriodKey(badge, periodContext);
    const badgePeriodId = `${badge.code}:${periodKey}`;

    return {
      ...badge,
      periodKey,
      isAwarded: awardedByCode.has(badgePeriodId),
      awardedAt: awardedByCode.get(badgePeriodId) || null,
    };
  });
};

module.exports = {
  BADGE_DEFINITIONS,
  evaluateAndAwardBadges,
  getBadgeDefinitions,
  getUserBadges,
};
