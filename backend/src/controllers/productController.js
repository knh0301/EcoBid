const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { Op } = require('sequelize');
const {
  sequelize,
  ChatMessage,
  ChatRoom,
  CreditTransaction,
  Product,
  ProductImage,
  User,
} = require('../models');
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
    attributes: ['id', 'name', 'nickname', 'profileImage'],
  },
  {
    model: ProductImage,
    as: 'images',
    attributes: ['id', 'imageUrl', 'sortOrder'],
  },
];

const PRODUCT_CATEGORIES = ['가구', '가전', '도서', '의류/잡화', '생활용품', '기타'];
const PRODUCT_REGISTRATION_REWARD = 100;

const parseOpenAIOutputText = (responseBody) => {
  if (typeof responseBody.output_text === 'string') {
    return responseBody.output_text;
  }

  return (responseBody.output || [])
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === 'output_text' && content.text)
    .map((content) => content.text)
    .join('');
};

const normalizeDraft = (draft) => ({
  title: String(draft.title || '').trim().slice(0, 60),
  category: PRODUCT_CATEGORIES.includes(draft.category) ? draft.category : '기타',
  description: String(draft.description || '').trim().slice(0, 800),
  suggestedCreditPrice: Number.isInteger(draft.suggestedCreditPrice)
    ? Math.max(0, draft.suggestedCreditPrice)
    : 0,
});

const getFallbackDraft = () => ({
  title: '나눔 물품',
  category: '기타',
  description:
    '사진을 참고해 물품의 상태, 사용감, 구성품, 작동 여부를 확인한 뒤 설명을 수정해주세요.',
  suggestedCreditPrice: 1000,
});

const sendFallbackDraft = (res) =>
  res.json({
    success: true,
    data: getFallbackDraft(),
  });

const getProductDraftPrompt = () =>
  [
    '너는 중고 물품 나눔 앱 EcoBid의 상품 등록 도우미야.',
    '사용자가 올린 이미지를 보고 나눔글 초안을 한국어로 작성해줘.',
    `카테고리는 반드시 다음 중 하나로만 골라: ${PRODUCT_CATEGORIES.join(', ')}.`,
    '이미지만 보고 확신할 수 없는 사용 기간, 작동 여부, 크기, 브랜드, 구성품은 단정하지 말고 확인이 필요하다고 써.',
    '제목은 짧고 검색하기 쉽게, 설명은 상태와 활용처 중심으로 자연스럽게 작성해.',
    '크레딧 가격은 무료 나눔 앱의 추천값으로 보수적으로 제안해.',
  ].join('\n');

const productDraftJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      description: '사용자가 그대로 쓸 수 있는 짧은 상품 제목',
    },
    category: {
      type: 'string',
      enum: PRODUCT_CATEGORIES,
    },
    description: {
      type: 'string',
      description: '상태, 특징, 확인 필요 사항을 담은 한국어 상품 설명',
    },
    suggestedCreditPrice: {
      type: 'integer',
      description: '추천 크레딧 가격',
    },
  },
  required: ['title', 'category', 'description', 'suggestedCreditPrice'],
  propertyOrdering: ['title', 'category', 'description', 'suggestedCreditPrice'],
};

const getGeminiDraftModels = () => {
  const primaryModel =
    process.env.GEMINI_PRODUCT_DRAFT_MODEL || 'gemini-2.5-flash-lite';
  const fallbackModels = (
    process.env.GEMINI_PRODUCT_DRAFT_FALLBACK_MODELS ||
    'gemini-3.1-flash-lite,gemini-flash-lite-latest'
  )
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean);

  return [primaryModel, ...fallbackModels].filter(
    (model, index, models) => models.indexOf(model) === index,
  );
};

const requestGeminiDraft = async ({ apiKey, model, base64, mimeType }) => {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}` +
    `:generateContent?key=${apiKey}`;

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: getProductDraftPrompt(),
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        response_json_schema: productDraftJsonSchema,
        maxOutputTokens: 600,
      },
    }),
  });
};

const generateDraftWithGemini = async ({ base64, mimeType }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  for (const model of getGeminiDraftModels()) {
    const geminiResponse = await requestGeminiDraft({
      apiKey,
      model,
      base64,
      mimeType,
    });

    const responseBody = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.warn(
        `Gemini product draft failed (${model}):`,
        responseBody.error?.message || geminiResponse.statusText,
      );
      continue;
    }

    const outputText = (responseBody.candidates || [])
      .flatMap((candidate) => candidate.content?.parts || [])
      .map((part) => part.text || '')
      .join('');

    try {
      return normalizeDraft(JSON.parse(outputText));
    } catch (parseError) {
      console.warn(
        `Gemini product draft parse failed (${model}):`,
        parseError.message,
      );
    }
  }

  return null;
};

const generateDraftWithOpenAI = async ({ base64, mimeType }) => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const model = process.env.OPENAI_PRODUCT_DRAFT_MODEL || 'gpt-5.4-mini';
  const imageUrl = `data:${mimeType};base64,${base64}`;

  const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: getProductDraftPrompt(),
            },
            {
              type: 'input_image',
              image_url: imageUrl,
              detail: 'low',
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'product_draft',
          strict: true,
          schema: productDraftJsonSchema,
        },
      },
      max_output_tokens: 600,
    }),
  });

  const responseBody = await openAIResponse.json();

  if (!openAIResponse.ok) {
    console.warn('OpenAI product draft failed:', responseBody.error?.message);
    return null;
  }

  const outputText = parseOpenAIOutputText(responseBody);

  try {
    return normalizeDraft(JSON.parse(outputText));
  } catch (parseError) {
    console.warn('OpenAI product draft parse failed:', parseError.message);
    return null;
  }
};

const chatRoomIncludes = [
  {
    model: Product,
    as: 'product',
  },
  {
    model: User,
    as: 'buyer',
    attributes: ['id', 'name', 'nickname', 'profileImage'],
  },
  {
    model: User,
    as: 'seller',
    attributes: ['id', 'name', 'nickname', 'profileImage'],
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

const getOrCreateTradeRoom = async ({ product, buyerId, transaction }) => {
  let room = await ChatRoom.findOne({
    where: {
      productId: product.id,
      buyerId,
      sellerId: product.sellerId,
    },
    transaction,
  });

  if (room) {
    return room;
  }

  room = await ChatRoom.create(
    {
      productId: product.id,
      buyerId,
      sellerId: product.sellerId,
      lastMessage: '',
      lastMessageAt: new Date(),
      buyerLastReadAt: new Date(),
      sellerLastReadAt: new Date(),
    },
    { transaction },
  );

  return room;
};

const formatCreditTransferMessage = ({ buyer, product }) =>
  `${buyer.nickname || buyer.name}님이 ${product.creditPrice.toLocaleString()} 크레딧을 보냈습니다.`;

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
 * 상품 이미지 기반 AI 초안 생성
 * POST /api/products/ai-draft
 */
exports.generateProductDraft = async (req, res, next) => {
  try {
    const { base64, mimeType } = req.body;

    if (!base64 || !mimeType) {
      return res.status(400).json({
        success: false,
        message: 'base64, mimeType은 필수 항목입니다.',
      });
    }

    if (!MIME_EXTENSIONS[mimeType]) {
      return res.status(400).json({
        success: false,
        message: 'jpg, png, webp 이미지만 분석할 수 있습니다.',
      });
    }

    const provider = process.env.AI_PRODUCT_DRAFT_PROVIDER || 'gemini';
    const draft =
      provider === 'openai'
        ? await generateDraftWithOpenAI({ base64, mimeType })
        : await generateDraftWithGemini({ base64, mimeType });

    if (!draft) {
      return sendFallbackDraft(res);
    }

    res.json({
      success: true,
      data: draft,
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
    await user.increment('credits', {
      by: PRODUCT_REGISTRATION_REWARD,
      transaction,
    });
    await CreditTransaction.create(
      {
        userId: sellerId,
        amount: PRODUCT_REGISTRATION_REWARD,
        referenceType: 'PRODUCT',
        referenceId: product.id,
        description: `${title} 나눔 물품 등록 보상 ${PRODUCT_REGISTRATION_REWARD} 크레딧`,
      },
      { transaction },
    );
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
 * 현재 사용자의 상품 거래 상태 조회
 * GET /api/products/:id/trade-status
 */
exports.getTradeStatus = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    const isSeller = product.sellerId === req.user.id;

    if (isSeller) {
      return res.json({
        success: true,
        data: {
          isSeller: true,
          hasPaid: false,
          canComplete: false,
          isCompleted: product.status === 'SOLD',
          creditTransferAmount: null,
          creditTransferredAt: null,
          room: null,
        },
      });
    }

    const room = await ChatRoom.findOne({
      where: {
        productId: product.id,
        buyerId: req.user.id,
        sellerId: product.sellerId,
      },
      include: chatRoomIncludes,
    });
    const hasPaid = !!room?.creditTransferredAt;
    const isCompleted = product.status === 'SOLD' || !!room?.completedAt;

    res.json({
      success: true,
      data: {
        isSeller: false,
        hasPaid,
        canComplete: hasPaid && product.status !== 'SOLD' && !room?.completedAt,
        isCompleted,
        creditTransferAmount: room?.creditTransferAmount || null,
        creditTransferredAt: room?.creditTransferredAt || null,
        room,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 구매자가 판매자에게 상품 크레딧 전송
 * POST /api/products/:id/send-credits
 */
exports.sendProductCredits = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const buyerId = req.user.id;
    const product = await Product.findByPk(req.params.id, { transaction });

    if (!product) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    if (product.sellerId === buyerId) {
      await transaction.rollback();

      return res.status(403).json({
        success: false,
        message: '본인이 등록한 상품에는 크레딧을 보낼 수 없습니다.',
      });
    }

    if (product.status !== 'AVAILABLE') {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: '이미 거래 중이거나 거래 완료된 상품입니다.',
      });
    }

    const [buyer, seller] = await Promise.all([
      User.findByPk(buyerId, { transaction }),
      User.findByPk(product.sellerId, { transaction }),
    ]);

    if (!buyer || !seller) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '거래 사용자를 찾을 수 없습니다.',
      });
    }

    const price = Number(product.creditPrice);

    if (!Number.isInteger(price) || price <= 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: '상품 크레딧 금액이 올바르지 않습니다.',
      });
    }

    if (Number(buyer.credits || 0) < price) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: '보유 크레딧이 부족합니다.',
      });
    }

    const room = await getOrCreateTradeRoom({
      product,
      buyerId,
      transaction,
    });

    if (room.creditTransferredAt) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: '이미 이 상품에 크레딧을 보냈습니다.',
      });
    }

    const transferredAt = new Date();
    const messageText = formatCreditTransferMessage({ buyer, product });

    await buyer.decrement('credits', { by: price, transaction });
    await seller.increment('credits', { by: price, transaction });

    await CreditTransaction.bulkCreate(
      [
        {
          userId: buyer.id,
          amount: -price,
          referenceType: 'PRODUCT',
          referenceId: product.id,
          description: `${product.title} 구매 크레딧 전송`,
        },
        {
          userId: seller.id,
          amount: price,
          referenceType: 'PRODUCT',
          referenceId: product.id,
          description: `${product.title} 판매 크레딧 수신`,
        },
      ],
      { transaction },
    );

    const message = await ChatMessage.create(
      {
        roomId: room.id,
        senderId: buyer.id,
        text: messageText,
      },
      { transaction },
    );

    await product.update({ status: 'RESERVED' }, { transaction });
    await room.update(
      {
        creditTransferAmount: price,
        creditTransferredAt: transferredAt,
        lastMessage: messageText,
        lastMessageAt: message.createdAt,
        buyerLastReadAt: message.createdAt,
      },
      { transaction },
    );

    await transaction.commit();

    const [updatedRoom, updatedBuyer] = await Promise.all([
      ChatRoom.findByPk(room.id, {
        include: chatRoomIncludes,
      }),
      User.findByPk(buyer.id),
    ]);

    res.status(201).json({
      success: true,
      message: '크레딧을 보냈습니다.',
      data: {
        product: await Product.findByPk(product.id, {
          include: productIncludes,
          order: [[{ model: ProductImage, as: 'images' }, 'sortOrder', 'ASC']],
        }),
        room: updatedRoom,
        message: {
          id: message.id,
          roomId: message.roomId,
          text: message.text,
          senderId: message.senderId,
          senderName: buyer.nickname || buyer.name,
          senderProfileImage: buyer.profileImage || null,
          createdAt: message.createdAt,
        },
        balance: updatedBuyer?.credits ?? 0,
        hasPaid: true,
        canComplete: true,
      },
    });
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    next(err);
  }
};

/**
 * 구매자 거래 완료 처리
 * POST /api/products/:id/complete
 */
exports.completeTrade = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const buyerId = req.user.id;
    const product = await Product.findByPk(req.params.id, { transaction });

    if (!product) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    if (product.sellerId === buyerId) {
      await transaction.rollback();

      return res.status(403).json({
        success: false,
        message: '판매자는 거래완료를 누를 수 없습니다.',
      });
    }

    const room = await ChatRoom.findOne({
      where: {
        productId: product.id,
        buyerId,
        sellerId: product.sellerId,
      },
      transaction,
    });

    if (!room || !room.creditTransferredAt) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: '크레딧을 먼저 보내야 거래완료를 할 수 있습니다.',
      });
    }

    if (product.status === 'SOLD' || room.completedAt) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: '이미 거래완료된 상품입니다.',
      });
    }

    const completedAt = new Date();
    const buyer = await User.findByPk(buyerId, { transaction });
    const messageText = `${buyer?.nickname || buyer?.name || '구매자'}님이 거래를 완료했습니다.`;
    const message = await ChatMessage.create(
      {
        roomId: room.id,
        senderId: buyerId,
        text: messageText,
      },
      { transaction },
    );

    await product.update({ status: 'SOLD' }, { transaction });
    await room.update(
      {
        completedAt,
        lastMessage: messageText,
        lastMessageAt: message.createdAt,
        buyerLastReadAt: message.createdAt,
      },
      { transaction },
    );

    await transaction.commit();

    const [updatedProduct, updatedRoom, newlyAwardedBadges] = await Promise.all([
      Product.findByPk(product.id, {
        include: productIncludes,
        order: [[{ model: ProductImage, as: 'images' }, 'sortOrder', 'ASC']],
      }),
      ChatRoom.findByPk(room.id, {
        include: chatRoomIncludes,
      }),
      evaluateAndAwardBadges(product.sellerId),
    ]);

    res.json({
      success: true,
      message: '거래가 완료되었습니다.',
      data: {
        product: updatedProduct,
        room: updatedRoom,
        isCompleted: true,
        canComplete: false,
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
