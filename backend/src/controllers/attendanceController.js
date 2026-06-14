const { Attendance, User, CreditTransaction, sequelize } = require('../models');
const { Op } = require('sequelize');
const { evaluateAndAwardBadges } = require('../services/badge.service');

const MIN_ATTENDANCE_REWARD = 1;
const MAX_ATTENDANCE_REWARD = 10;

const getRandomAttendanceReward = () => {
  return Math.floor(
    Math.random() * (MAX_ATTENDANCE_REWARD - MIN_ATTENDANCE_REWARD + 1),
  ) + MIN_ATTENDANCE_REWARD;
};

const getTodayDate = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const calculateStreak = (attendances) => {
  if (attendances.length === 0) {
    return 0;
  }

  const attendanceDates = new Set(
    attendances.map(item => item.attendanceDate),
  );
  const today = getTodayDate();
  const yesterday = new Date(parseDate(today));
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayText = yesterday.toISOString().split('T')[0];

  let cursor = attendanceDates.has(today)
    ? parseDate(today)
    : parseDate(yesterdayText);
  let streak = 0;

  while (attendanceDates.has(cursor.toISOString().split('T')[0])) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
};

/**
 * 오늘 출석하기
 * POST /api/attendance/check
 */
exports.checkAttendance = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const today = getTodayDate();
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    const existing = await Attendance.findOne({
      where: { userId, attendanceDate: today },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: '이미 오늘 출석했습니다.',
        data: {
          isAttended: true,
          attendance: existing,
        },
      });
    }

    const reward = getRandomAttendanceReward();

    const result = await sequelize.transaction(async (t) => {
      const attendance = await Attendance.create(
        {
          userId,
          attendanceDate: today,
          pointsEarned: reward,
        },
        { transaction: t }
      );

      await User.increment('credits', {
        by: reward,
        where: { id: userId },
        transaction: t,
      });

      await CreditTransaction.create(
        {
          userId,
          amount: reward,
          referenceType: 'ATTENDANCE',
          referenceId: attendance.id,
          description: `일일 출석 보상 ${reward} 크레딧`,
        },
        { transaction: t }
      );

      return attendance;
    });

    const newlyAwardedBadges = await evaluateAndAwardBadges(userId);

    res.status(201).json({
      success: true,
      message: '출석체크가 완료되었습니다.',
      data: {
        isAttended: true,
        reward,
        attendance: result,
        newlyAwardedBadges,
      },
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: '이미 오늘 출석했습니다.',
      });
    }

    console.error('출석 체크 에러:', err);
    next(err);
  }
};

/**
 * 오늘 출석 여부 확인
 * GET /api/attendance/today
 */
exports.checkTodayStatus = async (req, res, next) => {
  const userId = req.user.id;
  const today = getTodayDate();

  try {
    const attendance = await Attendance.findOne({
      where: { userId, attendanceDate: today },
    });

    res.json({
      success: true,
      data: {
        isAttended: !!attendance,
        attendance,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 내 출석 기록 조회
 * GET /api/attendance/history
 */
exports.getHistory = async (req, res, next) => {
  const userId = req.user.id;
  const { year, month } = req.query;

  try {
    const where = { userId };

    if (year && month) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const end = new Date(Date.UTC(Number(year), Number(month), 1));
      const endDate = end.toISOString().split('T')[0];

      where.attendanceDate = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      };
    }

    const history = await Attendance.findAll({
      where,
      order: [['attendanceDate', 'DESC']],
    });

    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

/**
 * 연속 출석일 계산
 * GET /api/attendance/streak
 */
exports.getStreak = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const attendances = await Attendance.findAll({
      where: { userId },
      order: [['attendanceDate', 'DESC']],
    });

    const streak = calculateStreak(attendances);

    res.json({ success: true, data: { streak } });
  } catch (err) {
    next(err);
  }
};
