const { ChatRoom, ChatMessage, Product, User, ProductImage } = require('../models');
const { Op } = require('sequelize');
const { evaluateAndAwardBadges } = require('../services/badge.service');

const getDisplayName = user => user?.nickname || user?.name || '알 수 없음';

const getLastReadAt = (room, userId) => {
  const isBuyer = String(room.buyerId) === String(userId);
  return isBuyer ? room.buyerLastReadAt : room.sellerLastReadAt;
};

const getUnreadCount = (room, userId) => {
  const lastReadAt = getLastReadAt(room, userId) || new Date(0);

  return ChatMessage.count({
    where: {
      roomId: room.id,
      senderId: {
        [Op.ne]: userId,
      },
      createdAt: {
        [Op.gt]: lastReadAt,
      },
    },
  });
};

const markRoomAsRead = async (room, userId) => {
  const readAt = new Date();

  if (String(room.buyerId) === String(userId)) {
    await room.update({buyerLastReadAt: readAt});
    return;
  }

  if (String(room.sellerId) === String(userId)) {
    await room.update({sellerLastReadAt: readAt});
  }
};

/**
 * 채팅방 생성 또는 기존 채팅방 반환
 * POST /api/chats/rooms
 */
exports.createOrGetRoom = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const buyerId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'productId는 필수 항목입니다.',
      });
    }

    // 1. 상품 조회 및 판매자 확인
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 상품입니다.',
      });
    }

    const sellerId = product.sellerId;

    // 2. 자기 자신의 상품에 채팅방 생성 불가
    if (buyerId === sellerId) {
      return res.status(400).json({
        success: false,
        message: '자신의 상품에는 채팅방을 생성할 수 없습니다.',
      });
    }

    // 3. 기존 동일 조건의 채팅방이 존재하는지 검색
    let room = await ChatRoom.findOne({
      where: {
        productId,
        buyerId,
        sellerId,
      },
      include: [
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
      ],
    });

    // 4. 없으면 신규 생성
    let createdNewRoom = false;

    if (!room) {
      const newRoom = await ChatRoom.create({
        productId,
        buyerId,
        sellerId,
        lastMessage: '',
        lastMessageAt: new Date(),
        buyerLastReadAt: new Date(),
        sellerLastReadAt: new Date(),
      });
      createdNewRoom = true;

      room = await ChatRoom.findByPk(newRoom.id, {
        include: [
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
        ],
      });
    }

    const newlyAwardedBadges = createdNewRoom
      ? await evaluateAndAwardBadges(buyerId)
      : [];

    res.status(200).json({
      success: true,
      data: room,
      newlyAwardedBadges,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 내 채팅방 목록 조회
 * GET /api/chats/rooms
 */
exports.getRooms = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 로그인 유저가 구매자이거나 판매자인 채팅방들 조회
    const chatRooms = await ChatRoom.findAll({
      where: {
        [Op.or]: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
      include: [
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
      ],
      order: [['lastMessageAt', 'DESC']],
    });

    // 프론트엔드가 기대하는 양식에 맞추어 formatting
    const rooms = await Promise.all(chatRooms.map(async room => {
      const isBuyer = room.buyerId === userId;
      const otherUser = isBuyer ? room.seller : room.buyer;
      const unreadCount = await getUnreadCount(room, userId);

      return {
        id: room.id,
        productId: room.productId,
        productTitle: room.product ? room.product.title : '삭제된 상품',
        productImageUrl: room.product ? room.product.imageUrl : null,
        productPrice: room.product ? room.product.creditPrice : 0,
        lastMessage: room.lastMessage || '',
        lastMessageAt: room.lastMessageAt || room.createdAt,
        unreadCount,
        hasUnread: unreadCount > 0,
        buyerId: room.buyerId,
        sellerId: room.sellerId,
        otherUser: otherUser ? {
          id: otherUser.id,
          name: getDisplayName(otherUser),
          nickname: otherUser.nickname,
          profileImage: otherUser.profileImage,
        } : null,
      };
    }));

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 특정 채팅방 메시지 목록 조회
 * GET /api/chats/rooms/:roomId/messages
 */
exports.getRoomMessages = async (req, res, next) => {
  try {
    const roomId = Number(req.params.roomId);
    const userId = req.user.id;

    if (isNaN(roomId)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 roomId입니다.',
      });
    }

    // 1. 대화방 존재 유무 확인
    const room = await ChatRoom.findByPk(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 채팅방입니다.',
      });
    }

    // 2. 권한 검증: 현재 유저가 참여자인지 확인
    if (room.buyerId !== userId && room.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: '해당 채팅방에 대한 접근 권한이 없습니다.',
      });
    }

    await markRoomAsRead(room, userId);

    // 3. 메시지 조회 (오름차순 정렬)
    const chatMessages = await ChatMessage.findAll({
      where: { roomId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'nickname', 'profileImage'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    // 4. 프론트엔드가 기대하는 양식에 맞추어 formatting (text 필드명 유지)
    const messages = chatMessages.map(msg => ({
      id: msg.id,
      roomId: msg.roomId,
      text: msg.text,
      senderId: msg.senderId,
      senderName: getDisplayName(msg.sender),
      senderProfileImage: msg.sender ? msg.sender.profileImage : null,
      createdAt: msg.createdAt,
    }));

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    next(err);
  }
};
