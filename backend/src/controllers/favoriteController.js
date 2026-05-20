const { Favorite, Product, ProductImage, User } = require('../models');
const { evaluateAndAwardBadges } = require('../services/badge.service');

const productInclude = [
  {
    model: User,
    as: 'seller',
    attributes: ['id', 'name', 'nickname', 'profileImage'],
  },
  {
    model: ProductImage,
    as: 'images',
    attributes: ['id', 'imageUrl', 'sortOrder'],
  },
];

exports.getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Product,
          as: 'product',
          include: productInclude,
        },
      ],
    });

    const products = favorites
      .map(favorite => favorite.product)
      .filter(Boolean)
      .map(product => ({
        ...product.toJSON(),
        isLiked: true,
      }));

    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyFavoriteIds = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      attributes: ['productId'],
    });

    res.json({
      success: true,
      data: favorites.map(favorite => favorite.productId),
    });
  } catch (err) {
    next(err);
  }
};

exports.addFavorite = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: '올바른 상품 ID가 아닙니다.',
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    await Favorite.findOrCreate({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    const newlyAwardedBadges = await evaluateAndAwardBadges(product.sellerId);

    res.status(201).json({
      success: true,
      data: {
        productId,
        isLiked: true,
        newlyAwardedBadges,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: '올바른 상품 ID가 아닙니다.',
      });
    }

    await Favorite.destroy({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    res.json({
      success: true,
      data: {
        productId,
        isLiked: false,
      },
    });
  } catch (err) {
    next(err);
  }
};
