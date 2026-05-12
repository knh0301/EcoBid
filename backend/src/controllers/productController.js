const { Product, User } = require('../models');

/**
 * 상품 등록
 * POST /api/products
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, creditPrice, imageUrl, sellerId } = req.body;

    // 필수값 검증
    if (!title || creditPrice === undefined || !sellerId) {
      return res.status(400).json({
        success: false,
        message: 'title, creditPrice, sellerId는 필수 항목입니다.',
      });
    }

    // 판매자 존재 확인
    const user = await User.findByPk(sellerId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 판매자입니다.',
      });
    }

    const product = await Product.create({
      title,
      description,
      creditPrice,
      imageUrl,
      sellerId,
      status: 'AVAILABLE',
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 상품 목록 조회 (AVAILABLE 상태만, 최신순)
 * GET /api/products
 */
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { status: 'AVAILABLE' },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'profileImage'],
        },
      ],
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
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'profileImage'],
        },
      ],
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
  try {
    const { title, description, creditPrice, imageUrl, status } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    // status 값 검증
    if (status && !['AVAILABLE', 'SOLD', 'RESERVED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status는 AVAILABLE, SOLD, RESERVED 중 하나여야 합니다.',
      });
    }

    await product.update({
      title: title || product.title,
      description: description !== undefined ? description : product.description,
      creditPrice: creditPrice !== undefined ? creditPrice : product.creditPrice,
      imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl,
      status: status || product.status,
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
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
