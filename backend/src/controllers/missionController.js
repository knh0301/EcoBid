const {
  sequelize,
  CreditTransaction,
  Mission,
  MissionSubmission,
  User,
} = require('../models');
const { evaluateAndAwardBadges } = require('../services/badge.service');

const DEFAULT_MISSION_REWARD = 500;

exports.submitMission = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const title = String(req.body.missionTitle || req.body.title || '').trim();
    const content = String(req.body.content || req.body.description || '').trim();
    const imageUrl = req.body.imageUrl || null;
    const rewardPoints = Number.isInteger(req.body.rewardPoints)
      ? req.body.rewardPoints
      : DEFAULT_MISSION_REWARD;

    if (!title || !content) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'missionTitle과 content는 필수 항목입니다.',
      });
    }

    const user = await User.findByPk(userId, { transaction });

    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    const [mission] = await Mission.findOrCreate({
      where: { title },
      defaults: {
        title,
        description: null,
        rewardPoints,
      },
      transaction,
    });

    const submission = await MissionSubmission.create(
      {
        missionId: mission.id,
        userId,
        content,
        imageUrl,
        status: 'APPROVED',
      },
      { transaction },
    );

    await User.increment('credits', {
      by: rewardPoints,
      where: { id: userId },
      transaction,
    });

    await CreditTransaction.create(
      {
        userId,
        amount: rewardPoints,
        referenceType: 'MISSION',
        referenceId: submission.id,
        description: `${title} 미션 보상 ${rewardPoints} 크레딧`,
      },
      { transaction },
    );

    await transaction.commit();

    const newlyAwardedBadges = await evaluateAndAwardBadges(userId);

    res.status(201).json({
      success: true,
      message: '미션 인증이 완료되었습니다.',
      data: {
        mission,
        submission,
        rewardPoints,
        newlyAwardedBadges,
      },
    });
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    next(err);
  }
};
