const { Attendance, User, CreditTransaction, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * 오늘 출석하기
 * POST /api/attendance/check
 */
exports.checkAttendance = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'userId는 필수 항목입니다.',
    });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. 유저 존재 확인
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 유저입니다.',
      });
    }

    // 2. 이미 오늘 출석했는지 확인
    const existing = await Attendance.findOne({
      where: { userId, attendanceDate: today },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: '이미 오늘 출석했습니다.',
      });
    }

    // 3. 출석 프로세스 (트랜잭션)
    const result = await sequelize.transaction(async (t) => {
      // Attendance 기록 생성
      const attendance = await Attendance.create(
        {
          userId,
          attendanceDate: today,
          pointsEarned: 10,
        },
        { transaction: t }
      );

      // User 크레딧 증가
      await User.increment('credits', {
        by: 10,
        where: { id: userId },
        transaction: t,
      });

      // CreditTransaction 기록 생성
      await CreditTransaction.create(
        {
          userId,
          amount: 10,
          referenceType: 'ATTENDANCE',
          referenceId: attendance.id,
          description: '일일 출석 보상',
        },
        { transaction: t }
      );

      return attendance;
    });

    res.status(201).json({
      success: true,
      message: '출석체크가 완료되었습니다.',
      data: result,
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: '이미 오늘 출석했습니다.',
      });
    }
    next(err);
  }
};

/**
 * 오늘 출석 여부 확인
 * GET /api/attendance/today/:userId
 */
exports.checkTodayStatus = async (req, res, next) => {
  const { userId } = req.params;
  const today = new Date().toISOString().split('T')[0];

  try {
    const attendance = await Attendance.findOne({
      where: { userId, attendanceDate: today },
    });

    res.json({
      success: true,
      data: {
        isAttended: !!attendance,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 내 출석 기록 조회
 * GET /api/attendance/history/:userId
 */
exports.getHistory = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const history = await Attendance.findAll({
      where: { userId },
      order: [['attendanceDate', 'DESC']],
    });

    res.json({
      success: true,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 연속 출석일 계산
 * GET /api/attendance/streak/:userId
 */
exports.getStreak = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const attendances = await Attendance.findAll({
      where: { userId },
      order: [['attendanceDate', 'DESC']],
    });

    if (attendances.length === 0) {
      return res.json({ success: true, data: { streak: 0 } });
    }

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = null;
    const lastAttendanceDate = new Date(attendances[0].attendanceDate);
    lastAttendanceDate.setHours(0, 0, 0, 0);

    // 오늘 또는 어제 출석한 경우에만 스트릭 유지
    const diffTime = today.getTime() - lastAttendanceDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 1) {
      return res.json({ success: true, data: { streak: 0 } });
    }

    currentDate = lastAttendanceDate;
    streak = 1;

    for (let i = 1; i < attendances.length; i++) {
      const prevDate = new Date(attendances[i].attendanceDate);
      prevDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - 1);

      if (prevDate.getTime() === expectedDate.getTime()) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }

    res.json({
      success: true,
      data: { streak },
    });
  } catch (err) {
    next(err);
  }
};
