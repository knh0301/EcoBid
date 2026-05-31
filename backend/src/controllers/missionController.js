const {
  sequelize,
  CreditTransaction,
  Mission,
  MissionSubmission,
  User,
} = require('../models');
const { Op } = require('sequelize');
const { evaluateAndAwardBadges } = require('../services/badge.service');
const {
  findMissionCatalogItemByTitle,
  getMissionCatalog,
} = require('../services/missionCatalog');

const DEFAULT_MISSION_REWARD = 500;

const getTodayDateRange = () => {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const startDate = new Date(`${today}T00:00:00+09:00`);
  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() + 1);

  return { today, startDate, endDate };
};

const resolveMissionReward = (title, requestedRewardPoints) => {
  const catalogItem = findMissionCatalogItemByTitle(title);

  if (catalogItem) {
    return catalogItem.rewardPoints;
  }

  return Number.isInteger(requestedRewardPoints) &&
    requestedRewardPoints > 0 &&
    requestedRewardPoints <= 5000
    ? requestedRewardPoints
    : DEFAULT_MISSION_REWARD;
};

exports.getRecommendedMissions = async (req, res, next) => {
  try {
    const requestedLimit = Number(req.query.limit);
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 5)
      : 2;
    const catalog = getMissionCatalog();
    const titles = catalog.map(item => item.title);
    const { today, startDate, endDate } = getTodayDateRange();
    const todaySubmissions = await MissionSubmission.findAll({
      where: {
        userId: req.user.id,
        status: 'APPROVED',
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: [
        {
          model: Mission,
          attributes: ['title'],
          where: {
            title: {
              [Op.in]: titles,
            },
          },
        },
      ],
    });
    const completedTitles = new Set(
      todaySubmissions
        .map(submission => submission.Mission?.title)
        .filter(Boolean),
    );
    const availableMissions = catalog.filter(
      item => !completedTitles.has(item.title),
    );
    const rotationOffset = availableMissions.length > 0
      ? Number(today.replace(/-/g, '')) % availableMissions.length
      : 0;
    const rotatedMissions = [
      ...availableMissions.slice(rotationOffset),
      ...availableMissions.slice(0, rotationOffset),
    ];
    const recommendedMissions = rotatedMissions.slice(0, limit).map(item => ({
      ...item,
      desc: item.description,
      creditText: `+${item.rewardPoints.toLocaleString()} 크레딧`,
      status: 'active',
      buttonText: '인증하기',
    }));

    res.json({
      success: true,
      data: recommendedMissions,
    });
  } catch (err) {
    next(err);
  }
};

exports.submitMission = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const title = String(req.body.missionTitle || req.body.title || '').trim();
    const content = String(req.body.content || req.body.description || '').trim();
    const imageUrl = req.body.imageUrl || null;
    const requestedRewardPoints = Number(req.body.rewardPoints);
    const catalogItem = findMissionCatalogItemByTitle(title);
    const rewardPoints = resolveMissionReward(title, requestedRewardPoints);

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
        description: catalogItem?.description || null,
        rewardPoints,
      },
      transaction,
    });

    const { startDate, endDate } = getTodayDateRange();
    const existingSubmission = await MissionSubmission.findOne({
      where: {
        missionId: mission.id,
        userId,
        status: 'APPROVED',
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      transaction,
    });

    if (existingSubmission) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: '이미 오늘 인증한 미션입니다.',
      });
    }

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
