const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { sequelize, Product, ProductImage, User } = require('../models');
const { evaluateAndAwardBadges } = require('../services/badge.service');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'products');
const MIME_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

const productIncludes = [
  {
    model: User,
    as: 'seller',
    attributes: ['id', 'name', 'profileImage'],
  },
  {
    model: ProductImage,
    as: 'images',
    attributes: ['id', 'imageUrl', 'sortOrder'],
  },
];

const normalizeImageUrls = ({ imageUrl, imageUrls }) => {
  const urls = Array.isArray(imageUrls) ? imageUrls : [];
  const normalizedUrls = urls
    .concat(imageUrl ? [imageUrl] : [])
    .filter(Boolean)
    .filter((url, index, arr) => arr.indexOf(url) === index)
    .slice(0, 5);

  return normalizedUrls;
};

const replaceProductImages = async (productId, imageUrls, transaction) => {
  await ProductImage.destroy({
    where: { productId },
    transaction,
  });

  if (imageUrls.length === 0) {
    return;
  }

  await ProductImage.bulkCreate(
    imageUrls.map((url, index) => ({
      productId,
      imageUrl: url,
      sortOrder: index,
    })),
    { transaction },
  );
};

/**
 * 상품 이미지 업로드
 * POST /api/products/images
 */
exports.uploadProductImage = async (req, res, next) => {
  try {
    const { base64, mimeType } = req.body;

    if (!base64 || !mimeType) {
      return res.status(400).json({
        success: false,
        message: 'base64, mimeType은 필수 항목입니다.',
      });
    }

    const extension = MIME_EXTENSIONS[mimeType];
    if (!extension) {
      return res.status(400).json({
        success: false,
        message: 'jpg, png, webp 이미지만 업로드할 수 있습니다.',
      });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    const imageBuffer = Buffer.from(base64, 'base64');

    await fs.writeFile(filePath, imageBuffer);

    res.status(201).json({
      success: true,
      data: {
        imageUrl: `/uploads/products/${fileName}`,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 상품 등록
 * POST /api/products
 */
exports.createProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, description, category, creditPrice, imageUrl, imageUrls } = req.body;
    const sellerId = req.user?.id || req.body.sellerId;

    // 필수값 검증
    if (!title || creditPrice === undefined || !sellerId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'title, creditPrice, sellerId는 필수 항목입니다.',
      });
    }

    // 판매자 존재 확인
    const user = await User.findByPk(sellerId, { transaction });
    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '존재하지 않는 판매자입니다.',
      });
    }

    const normalizedImageUrls = normalizeImageUrls({ imageUrl, imageUrls });

    const product = await Product.create({
      title,
      description,
      category: category || null,
      creditPrice,
      imageUrl: normalizedImageUrls[0] || null,
      sellerId,
      status: 'AVAILABLE',
    }, { transaction });

    await replaceProductImages(product.id, normalizedImageUrls, transaction);
    await transaction.commit();

    const newlyAwardedBadges = await evaluateAndAwardBadges(sellerId);

    const createdProduct = await Product.findByPk(product.id, {
      include: productIncludes,
      order: [[{ model: ProductImage, as: 'images' }, 'sortOrder', 'ASC']],
    });

    res.status(201).json({
      success: true,
      data: createdProduct,
      newlyAwardedBadges,
    });
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    next(err);
  }
};

/**
 * 상품 목록 조회 (AVAILABLE 상태만, 최신순)
 * GET /api/products
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const trimmedSearch = String(search || '').trim();
    const trimmedCategory = String(category || '').trim();
    const where = { status: 'AVAILABLE' };

    if (trimmedCategory && trimmedCategory !== '전체') {
      where.category = trimmedCategory;
    }

    if (trimmedSearch) {
      where[Op.or] = [
        { title: { [Op.like]: `%${trimmedSearch}%` } },
        { description: { [Op.like]: `%${trimmedSearch}%` } },
      ];
    }

    const products = await Product.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: productIncludes,
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 내가 등록한 상품 목록 조회
 * GET /api/products/mine
 */
exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: productIncludes,
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 상품 상세 조회
 * GET /api/products/:id
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: productIncludes,
      order: [[{ model: ProductImage, as: 'images' }, 'sortOrder', 'ASC']],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 상품 수정
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, description, category, creditPrice, imageUrl, imageUrls, status } = req.body;
    const product = await Product.findByPk(req.params.id, { transaction });

    if (!product) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    // status 값 검증
    if (status && !['AVAILABLE', 'SOLD', 'RESERVED'].includes(status)) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'status는 AVAILABLE, SOLD, RESERVED 중 하나여야 합니다.',
      });
    }

    const shouldReplaceImages = imageUrl !== undefined || imageUrls !== undefined;
    const normalizedImageUrls = shouldReplaceImages
      ? normalizeImageUrls({ imageUrl, imageUrls })
      : undefined;

    const sellerId = product.sellerId;

    await product.update({
      title: title || product.title,
      description: description !== undefined ? description : product.description,
      category: category !== undefined ? category || null : product.category,
      creditPrice: creditPrice !== undefined ? creditPrice : product.creditPrice,
      imageUrl: normalizedImageUrls !== undefined
        ? normalizedImageUrls[0] || null
        : product.imageUrl,
      status: status || product.status,
    }, { transaction });

    if (normalizedImageUrls) {
      await replaceProductImages(product.id, normalizedImageUrls, transaction);
    }

    await transaction.commit();

    const newlyAwardedBadges = await evaluateAndAwardBadges(sellerId);

    const updatedProduct = await Product.findByPk(product.id, {
      include: productIncludes,
      order: [[{ model: ProductImage, as: 'images' }, 'sortOrder', 'ASC']],
    });

    res.json({
      success: true,
      data: updatedProduct,
      newlyAwardedBadges,
    });
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    next(err);
  }
};

/**
 * 상품 삭제
 * DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: '상품이 삭제되었습니다.',
    });
  } catch (err) {
    next(err);
  }
};
