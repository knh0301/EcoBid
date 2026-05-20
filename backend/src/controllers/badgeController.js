const { getUserBadges } = require('../services/badge.service');

exports.getMyBadges = async (req, res, next) => {
  try {
    const badges = await getUserBadges(req.user.id);

    res.json({
      success: true,
      data: badges,
    });
  } catch (err) {
    next(err);
  }
};
