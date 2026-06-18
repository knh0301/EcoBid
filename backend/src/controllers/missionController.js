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

const DEFAULT_MISSION_REWARD = 50;
const DAILY_MISSION_COMPLETION_LIMIT = 5;
const DAILY_MISSION_REWARD_LIMIT = 50;
const AD_VIEW_MISSION_TITLE = '광고 보기';
const AD_VIEW_DAILY_LIMIT = 3;
const ADMIN_EMAILS = String(process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);

const isAdminUser = user => {
  const email = String(user?.email || '').trim().toLowerCase();

  return user?.role === 'ADMIN' || ADMIN_EMAILS.includes(email);
};

const requireAdmin = (req, res) => {
  if (isAdminUser(req.user)) {
    return true;
  }

  res.status(403).json({
    success: false,
    message: '관리자 권한이 필요합니다.',
  });

  return false;
};

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
    requestedRewardPoints <= 500
    ? requestedRewardPoints
    : DEFAULT_MISSION_REWARD;
};

const getTodayCatalogMissionProgress = async (userId, transaction = null) => {
  const catalog = getMissionCatalog();
  const titles = catalog.map(item => item.title);
  const { startDate, endDate } = getTodayDateRange();
  const todaySubmissions = await MissionSubmission.findAll({
    where: {
      userId,
      status: {
        [Op.in]: ['PENDING', 'APPROVED', 'REJECTED'],
      },
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
    order: [['createdAt', 'DESC']],
    transaction,
  });
  const submissionsByTitle = new Map();

  todaySubmissions.forEach(submission => {
    const title = submission.Mission?.title;

    if (title && !submissionsByTitle.has(title)) {
      submissionsByTitle.set(title, submission);
    }
  });

  const completedTitles = new Set(
    [...submissionsByTitle.entries()]
      .filter(([, submission]) => submission.status === 'APPROVED')
      .map(([title]) => title),
  );
  const pendingTitles = new Set(
    [...submissionsByTitle.entries()]
      .filter(([, submission]) => submission.status === 'PENDING')
      .map(([title]) => title),
  );
  const rejectedTitles = new Set(
    [...submissionsByTitle.entries()]
      .filter(([, submission]) => submission.status === 'REJECTED')
      .map(([title]) => title),
  );
  const earnedRewardPoints = catalog.reduce((sum, item) => {
    return completedTitles.has(item.title) ? sum + item.rewardPoints : sum;
  }, 0);
  const activeSubmittedTitles = new Set([
    ...completedTitles,
    ...pendingTitles,
  ]);

  return {
    submissionsByTitle,
    completedTitles,
    pendingTitles,
    rejectedTitles,
    submittedTitles: new Set(submissionsByTitle.keys()),
    completedMissionCount: completedTitles.size,
    pendingMissionCount: pendingTitles.size,
    rejectedMissionCount: rejectedTitles.size,
    submittedMissionCount: activeSubmittedTitles.size,
    earnedRewardPoints: Math.min(earnedRewardPoints, DAILY_MISSION_REWARD_LIMIT),
    maxMissionCount: DAILY_MISSION_COMPLETION_LIMIT,
    maxRewardPoints: DAILY_MISSION_REWARD_LIMIT,
  };
};

const getTodayAdViewProgress = async (userId, transaction = null) => {
  const catalogItem = findMissionCatalogItemByTitle(AD_VIEW_MISSION_TITLE);
  const { startDate, endDate } = getTodayDateRange();
  const mission = await Mission.findOne({
    where: { title: AD_VIEW_MISSION_TITLE },
    transaction,
  });
  const completedCount = mission
    ? await MissionSubmission.count({
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
      })
    : 0;
  const rewardPoints = catalogItem?.rewardPoints || 20;

  return {
    completedCount,
    maxCount: AD_VIEW_DAILY_LIMIT,
    remainingCount: Math.max(AD_VIEW_DAILY_LIMIT - completedCount, 0),
    rewardPoints,
    earnedRewardPoints: completedCount * rewardPoints,
  };
};

const toMissionListItem = (item, progress) => {
  const isCompleted = progress.completedTitles.has(item.title);
  const isPending = progress.pendingTitles.has(item.title);
  const isRejected = progress.rejectedTitles.has(item.title);
  const isLimitReached =
    progress.submittedMissionCount >= DAILY_MISSION_COMPLETION_LIMIT;

  return {
    ...item,
    desc: item.description,
    creditText: `+ ${item.rewardPoints.toLocaleString()} 크레딧`,
    status: isCompleted
      ? 'completed'
      : isPending
        ? 'pending'
        : isLimitReached
          ? 'locked'
          : isRejected
            ? 'rejected'
            : 'active',
    buttonText: isCompleted
      ? '크레딧 지급 완료'
      : isPending
        ? '승인 대기'
        : isLimitReached
          ? '오늘 한도 완료'
          : isRejected
            ? '다시 인증하기'
            : '인증하기',
  };
};

exports.getDailyMissions = async (req, res, next) => {
  try {
    const catalog = getMissionCatalog();
    const progress = await getTodayCatalogMissionProgress(req.user.id);
    const dailyMissions = catalog.map(item => toMissionListItem(item, progress));

    res.json({
      success: true,
      data: {
        missions: dailyMissions,
        progress: {
          earnedRewardPoints: progress.earnedRewardPoints,
          maxRewardPoints: progress.maxRewardPoints,
          completedMissionCount: progress.completedMissionCount,
          pendingMissionCount: progress.pendingMissionCount,
          rejectedMissionCount: progress.rejectedMissionCount,
          maxMissionCount: progress.maxMissionCount,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAdViewStatus = async (req, res, next) => {
  try {
    const progress = await getTodayAdViewProgress(req.user.id);
    const isLimitReached = progress.completedCount >= progress.maxCount;

    res.json({
      success: true,
      data: {
        ...progress,
        status: isLimitReached ? 'locked' : 'active',
        buttonText: isLimitReached ? '오늘 한도 완료' : '광고보기',
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecommendedMissions = async (req, res, next) => {
  try {
    const requestedLimit = Number(req.query.limit);
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 5)
      : 2;
    const catalog = getMissionCatalog();
    const { today } = getTodayDateRange();
    const progress = await getTodayCatalogMissionProgress(req.user.id);

    if (progress.submittedMissionCount >= DAILY_MISSION_COMPLETION_LIMIT) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const availableMissions = catalog.filter(
      item =>
        !progress.completedTitles.has(item.title) &&
        !progress.pendingTitles.has(item.title),
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
      creditText: `+ ${item.rewardPoints.toLocaleString()} 크레딧`,
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
    const isAdViewMission = title === AD_VIEW_MISSION_TITLE;
    const dailyCatalogItem =
      getMissionCatalog().find(item => item.title === title) || null;
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
        status: dailyCatalogItem
          ? {
              [Op.in]: ['PENDING', 'APPROVED'],
            }
          : 'APPROVED',
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      transaction,
    });

    if (existingSubmission && !isAdViewMission) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: existingSubmission.status === 'PENDING'
          ? '이미 오늘 신청한 미션입니다. 관리자 승인을 기다려주세요.'
          : '이미 오늘 인증한 미션입니다.',
      });
    }

    if (isAdViewMission) {
      const adViewProgress = await getTodayAdViewProgress(userId, transaction);

      if (adViewProgress.completedCount >= AD_VIEW_DAILY_LIMIT) {
        await transaction.rollback();

        return res.status(409).json({
          success: false,
          message: '광고 보기는 하루 최대 3회까지 완료할 수 있습니다.',
        });
      }
    }

    if (dailyCatalogItem) {
      const progress = await getTodayCatalogMissionProgress(userId, transaction);

      if (progress.submittedMissionCount >= DAILY_MISSION_COMPLETION_LIMIT) {
        await transaction.rollback();

        return res.status(409).json({
          success: false,
          message: '오늘 데일리 미션은 최대 5개까지 완료할 수 있습니다.',
        });
      }
    }

    if (dailyCatalogItem) {
      const submission = await MissionSubmission.create(
        {
          missionId: mission.id,
          userId,
          content,
          imageUrl,
          status: 'PENDING',
        },
        { transaction },
      );

      await transaction.commit();

      return res.status(201).json({
        success: true,
        message: '미션 인증 신청이 접수되었습니다.',
        data: {
          mission,
          submission,
          rewardPoints,
          newlyAwardedBadges: [],
        },
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

exports.getMissionSubmissionsForAdmin = async (req, res, next) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    const status = String(req.query.status || 'PENDING').toUpperCase();
    const where = ['PENDING', 'APPROVED', 'REJECTED'].includes(status)
      ? { status }
      : {};

    const submissions = await MissionSubmission.findAll({
      where,
      include: [
        {
          model: Mission,
          attributes: ['id', 'title', 'description', 'rewardPoints'],
        },
        {
          model: User,
          attributes: ['id', 'email', 'name', 'nickname', 'studentId', 'department'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
};

exports.reviewMissionSubmission = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    if (!requireAdmin(req, res)) {
      await transaction.rollback();
      return;
    }

    const action = String(req.body.action || '').trim().toUpperCase();

    if (!['APPROVE', 'REJECT'].includes(action)) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'action은 APPROVE 또는 REJECT여야 합니다.',
      });
    }

    const submission = await MissionSubmission.findByPk(req.params.id, {
      include: [
        {
          model: Mission,
          attributes: ['id', 'title', 'description', 'rewardPoints'],
        },
        {
          model: User,
          attributes: ['id', 'email', 'name', 'nickname', 'credits'],
        },
      ],
      transaction,
    });

    if (!submission) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '미션 인증 신청을 찾을 수 없습니다.',
      });
    }

    if (submission.status !== 'PENDING') {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: '이미 처리된 미션 인증 신청입니다.',
      });
    }

    if (action === 'REJECT') {
      await submission.update({ status: 'REJECTED' }, { transaction });
      await transaction.commit();

      return res.json({
        success: true,
        message: '미션 인증 신청이 거절되었습니다.',
        data: {
          submission,
          rewardPoints: 0,
          newlyAwardedBadges: [],
        },
      });
    }

    const rewardPoints = resolveMissionReward(
      submission.Mission?.title,
      submission.Mission?.rewardPoints,
    );

    await submission.update({ status: 'APPROVED' }, { transaction });
    await User.increment('credits', {
      by: rewardPoints,
      where: { id: submission.userId },
      transaction,
    });

    await CreditTransaction.create(
      {
        userId: submission.userId,
        amount: rewardPoints,
        referenceType: 'MISSION',
        referenceId: submission.id,
        description: `${submission.Mission?.title || '미션'} 미션 보상 ${rewardPoints} 크레딧`,
      },
      { transaction },
    );

    await transaction.commit();

    const newlyAwardedBadges = await evaluateAndAwardBadges(submission.userId);

    res.json({
      success: true,
      message: '미션 인증 신청이 승인되었습니다.',
      data: {
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
