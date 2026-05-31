const { Op } = require('sequelize');
const { sequelize, CreditTransaction, User } = require('../models');
const { evaluateAndAwardBadges } = require('../services/badge.service');

const VALID_REFERENCE_TYPES = ['ATTENDANCE', 'MISSION', 'PRODUCT'];

const getDateRange = (year, month) => {
  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 1);

  return { startDate, endDate };
};

/**
 * 학과별 크레딧 총액 순위
 * GET /api/credits/department-rankings
 */
exports.getDepartmentCreditRankings = async (req, res, next) => {
  try {
    const requestedLimit = Number(req.query.limit);
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 20)
      : 3;
    const departmentExpr = sequelize.fn(
      'COALESCE',
      sequelize.fn('NULLIF', sequelize.fn('TRIM', sequelize.col('department')), ''),
      '학과 미지정',
    );

    const rows = await User.findAll({
      attributes: [
        [departmentExpr, 'department'],
        [sequelize.fn('SUM', sequelize.col('credits')), 'totalCredits'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'userCount'],
      ],
      group: [departmentExpr],
      order: [
        [sequelize.fn('SUM', sequelize.col('credits')), 'DESC'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'DESC'],
      ],
      limit,
      raw: true,
    });

    const rankings = rows.map((item, index) => ({
      rank: index + 1,
      department: item.department,
      totalCredits: Number(item.totalCredits || 0),
      userCount: Number(item.userCount || 0),
    }));

    res.json({
      success: true,
      data: rankings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 크레딧 내역 생성
 * POST /api/credits
 */
exports.createCreditTransaction = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { userId, amount, referenceType, referenceId, description } = req.body;

    if (!userId || amount === undefined || !referenceType || !referenceId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'userId, amount, referenceType, referenceId는 필수 항목입니다.',
      });
    }

    if (!Number.isInteger(amount) || amount === 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'amount는 0이 아닌 정수여야 합니다.',
      });
    }

    if (!VALID_REFERENCE_TYPES.includes(referenceType)) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'referenceType은 ATTENDANCE, MISSION, PRODUCT 중 하나여야 합니다.',
      });
    }

    const user = await User.findByPk(userId, { transaction });

    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '존재하지 않는 사용자입니다.',
      });
    }

    const creditTransaction = await CreditTransaction.create(
      {
        userId,
        amount,
        referenceType,
        referenceId,
        description,
      },
      { transaction },
    );

    await user.increment('credits', {
      by: amount,
      transaction,
    });

    await transaction.commit();

    const newlyAwardedBadges = await evaluateAndAwardBadges(userId);

    res.status(201).json({
      success: true,
      data: creditTransaction,
      newlyAwardedBadges,
      message: '크레딧 내역이 생성되었습니다.',
    });
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    next(err);
  }
};

/**
 * 크레딧 내역 목록 조회
 * GET /api/credits
 *
 * Query 예시:
 * /api/credits?userId=1
 * /api/credits?userId=1&year=2026&month=5
 * /api/credits?userId=1&type=earn
 * /api/credits?userId=1&type=use
 */
exports.getCreditTransactions = async (req, res, next) => {
  try {
    const { userId, year, month, type, referenceType } = req.query;

    const where = {};

    if (userId) {
      where.userId = userId;
    }

    if (year && month) {
      const { startDate, endDate } = getDateRange(year, month);

      where.createdAt = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      };
    }

    if (type === 'earn') {
      where.amount = {
        [Op.gt]: 0,
      };
    }

    if (type === 'use') {
      where.amount = {
        [Op.lt]: 0,
      };
    }

    if (referenceType) {
      if (!VALID_REFERENCE_TYPES.includes(referenceType)) {
        return res.status(400).json({
          success: false,
          message: 'referenceType은 ATTENDANCE, MISSION, PRODUCT 중 하나여야 합니다.',
        });
      }

      where.referenceType = referenceType;
    }

    const transactions = await CreditTransaction.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'nickname', 'profileImage', 'credits'],
        },
      ],
    });

    res.json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 크레딧 내역 상세 조회
 * GET /api/credits/:id
 */
exports.getCreditTransactionById = async (req, res, next) => {
  try {
    const creditTransaction = await CreditTransaction.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'nickname', 'profileImage', 'credits'],
        },
      ],
    });

    if (!creditTransaction) {
      return res.status(404).json({
        success: false,
        message: '크레딧 내역을 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      data: creditTransaction,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 크레딧 내역 수정
 * PUT /api/credits/:id
 *
 * 주의:
 * 크레딧 내역은 이력 데이터라 실제 서비스에서는 수정/삭제를 제한하는 게 좋지만,
 * CRUD 구현 목적상 수정 시 사용자 credits 잔액도 같이 보정합니다.
 */
exports.updateCreditTransaction = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { amount, referenceType, referenceId, description } = req.body;

    const creditTransaction = await CreditTransaction.findByPk(req.params.id, {
      transaction,
    });

    if (!creditTransaction) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '크레딧 내역을 찾을 수 없습니다.',
      });
    }

    if (amount !== undefined && (!Number.isInteger(amount) || amount === 0)) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'amount는 0이 아닌 정수여야 합니다.',
      });
    }

    if (referenceType && !VALID_REFERENCE_TYPES.includes(referenceType)) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'referenceType은 ATTENDANCE, MISSION, PRODUCT 중 하나여야 합니다.',
      });
    }

    const oldAmount = creditTransaction.amount;
    const newAmount = amount !== undefined ? amount : oldAmount;
    const amountDifference = newAmount - oldAmount;

    await creditTransaction.update(
      {
        amount: newAmount,
        referenceType: referenceType || creditTransaction.referenceType,
        referenceId: referenceId !== undefined ? referenceId : creditTransaction.referenceId,
        description: description !== undefined ? description : creditTransaction.description,
      },
      { transaction },
    );

    if (amountDifference !== 0) {
      const user = await User.findByPk(creditTransaction.userId, { transaction });

      if (!user) {
        await transaction.rollback();

        return res.status(404).json({
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        });
      }

      await user.increment('credits', {
        by: amountDifference,
        transaction,
      });
    }

    await transaction.commit();

    const newlyAwardedBadges = await evaluateAndAwardBadges(creditTransaction.userId);

    res.json({
      success: true,
      data: creditTransaction,
      newlyAwardedBadges,
      message: '크레딧 내역이 수정되었습니다.',
    });
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    next(err);
  }
};

/**
 * 크레딧 내역 삭제
 * DELETE /api/credits/:id
 *
 * 삭제 시 해당 amount만큼 사용자 credits 잔액을 되돌립니다.
 */
exports.deleteCreditTransaction = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const creditTransaction = await CreditTransaction.findByPk(req.params.id, {
      transaction,
    });

    if (!creditTransaction) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '크레딧 내역을 찾을 수 없습니다.',
      });
    }

    const user = await User.findByPk(creditTransaction.userId, { transaction });

    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    await user.increment('credits', {
      by: -creditTransaction.amount,
      transaction,
    });

    await creditTransaction.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: '크레딧 내역이 삭제되었습니다.',
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
