const jwt = require('jsonwebtoken');
const { User, ChatRoom, ChatMessage, Product } = require('../models');
const { Op } = require('sequelize');

const getDisplayName = user => user?.nickname || user?.name || user?.email || '알 수 없음';

/**
 * 특정 사용자의 DB 채팅방 목록을 조회하고 프론트엔드가 요구하는 구조로 가공합니다.
 */
const getUserRooms = async (userId) => {
  if (!userId || String(userId).startsWith('guest-')) {
    return [];
  }

  const chatRooms = await ChatRoom.findAll({
    where: {
      [Op.or]: [
        { buyerId: userId },
        { sellerId: userId }
      ]
    },
    include: [
      {
        model: Product,
        as: 'product'
      },
      {
        model: User,
        as: 'buyer',
        attributes: ['id', 'name', 'nickname', 'profileImage']
      },
      {
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'nickname', 'profileImage']
      }
    ],
    order: [['lastMessageAt', 'DESC']]
  });

  return chatRooms.map(room => {
    const isBuyer = String(room.buyerId) === String(userId);
    const otherUser = isBuyer ? room.seller : room.buyer;

    return {
      id: room.id,
      name: getDisplayName(otherUser),
      profileImage: otherUser ? otherUser.profileImage : null,
      productTitle: room.product ? room.product.title : '삭제된 상품',
      productImageUrl: room.product ? room.product.imageUrl : null,
      productPrice: room.product ? `${room.product.creditPrice.toLocaleString()} 크레딧` : '0 크레딧',
      lastMessage: room.lastMessage || '',
      color: isBuyer ? '#A5C9A1' : '#FFD15B', // 구매자는 녹색 계열, 판매자는 황색 계열 아바타 배경
      icon: 'chatbubble-outline',
    };
  });
};

/**
 * Socket 핸드쉐이크 토큰을 통해 사용자를 인증합니다.
 */
const authenticateSocket = async socket => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    socket.user = {
      id: `guest-${socket.id}`,
      name: '나',
    };
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.userId);

    socket.user = user
      ? {
          id: String(user.id),
          name: getDisplayName(user),
        }
      : {
          id: `guest-${socket.id}`,
          name: '나',
        };
  } catch {
    socket.user = {
      id: `guest-${socket.id}`,
      name: '나',
    };
  }
};

/**
 * Socket.io 서버를 초기화하고 DB 영구 CRUD 로직을 바인딩합니다.
 */
const initializeChatSocket = io => {
  io.use(async (socket, next) => {
    await authenticateSocket(socket);
    next();
  });

  // 특정 유저에게만 해당 유저의 채팅방 목록 업데이트 이벤트를 전송하는 헬퍼
  const emitUserRoomsUpdate = async (userId) => {
    try {
      const userRooms = await getUserRooms(userId);
      io.to(`user-${userId}`).emit('chat:rooms:update', userRooms);
    } catch (err) {
      console.error('Error emitting user rooms update:', err);
    }
  };

  io.on('connection', socket => {
    const userId = socket.user.id;

    // 1. 개인 전용 룸 참가 (다른 유저와 겹치지 않게 목록 갱신 이벤트를 개별 전달하기 위함)
    if (userId && !String(userId).startsWith('guest-')) {
      socket.join(`user-${userId}`);
    }

    // 2. 최초 연결 시 해당 사용자의 채팅방 목록 업데이트 발송
    getUserRooms(userId)
      .then(userRooms => {
        socket.emit('chat:rooms:update', userRooms);
      })
      .catch(err => console.error('Error getting initial rooms:', err));

    // 3. chat:rooms 이벤트 리스너 (요청 시 목록 반환)
    socket.on('chat:rooms', async callback => {
      try {
        const userRooms = await getUserRooms(userId);
        callback?.(userRooms);
      } catch (err) {
        console.error('Error in chat:rooms handler:', err);
        callback?.([]);
      }
    });

    // 4. chat:join 이벤트 리스너 (대화방 입장 및 과거 메시지 목록 로드)
    socket.on('chat:join', async ({roomId}, callback) => {
      if (!roomId) {
        callback?.({success: false, message: 'roomId가 필요합니다.'});
        return;
      }

      if (String(userId).startsWith('guest-')) {
        callback?.({success: false, message: '로그인이 필요합니다.'});
        return;
      }

      try {
        // 대화방 조회
        const room = await ChatRoom.findByPk(roomId, {
          include: [
            { model: Product, as: 'product' },
            { model: User, as: 'buyer', attributes: ['id', 'name', 'nickname', 'profileImage'] },
            { model: User, as: 'seller', attributes: ['id', 'name', 'nickname', 'profileImage'] },
          ]
        });

        if (!room) {
          callback?.({success: false, message: '존재하지 않는 채팅방입니다.'});
          return;
        }

        // 권한 검증: 현재 유저가 구매자 혹은 판매자인지 확인
        if (String(room.buyerId) !== String(userId) && String(room.sellerId) !== String(userId)) {
          callback?.({success: false, message: '이 채팅방에 접근할 권한이 없습니다.'});
          return;
        }

        // 소켓 방 참여
        socket.join(String(roomId));

        // 과거 대화 목록 조회 (오름차순)
        const chatMessages = await ChatMessage.findAll({
          where: { roomId },
          include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'nickname', 'profileImage'] }],
          order: [['createdAt', 'ASC']]
        });

        const formattedMessages = chatMessages.map(msg => ({
          id: msg.id,
          roomId: msg.roomId,
          text: msg.text,
          senderId: String(msg.senderId),
          senderName: getDisplayName(msg.sender),
          senderProfileImage: msg.sender ? msg.sender.profileImage : null,
          createdAt: msg.createdAt.toISOString ? msg.createdAt.toISOString() : msg.createdAt,
        }));

        const isBuyer = String(room.buyerId) === String(userId);
        const otherUser = isBuyer ? room.seller : room.buyer;

        const formattedRoom = {
          id: room.id,
          name: getDisplayName(otherUser),
          profileImage: otherUser ? otherUser.profileImage : null,
          productTitle: room.product ? room.product.title : '삭제된 상품',
          productImageUrl: room.product ? room.product.imageUrl : null,
          productPrice: room.product ? `${room.product.creditPrice.toLocaleString()} 크레딧` : '0 크레딧',
          lastMessage: room.lastMessage || '',
          color: isBuyer ? '#A5C9A1' : '#FFD15B',
          icon: 'chatbubble-outline',
        };

        callback?.({
          success: true,
          room: formattedRoom,
          messages: formattedMessages,
        });

      } catch (err) {
        console.error('Error on chat:join:', err);
        callback?.({success: false, message: '서버 내부 오류가 발생했습니다.'});
      }
    });

    // 5. chat:send 이벤트 리스너 (실시간 메시지 전송 및 저장)
    socket.on('chat:send', async ({roomId, text}, callback) => {
      const trimmedText = String(text || '').trim().normalize('NFC');

      if (!roomId || !trimmedText) {
        callback?.({success: false, message: 'roomId와 text가 필요합니다.'});
        return;
      }

      if (String(userId).startsWith('guest-')) {
        callback?.({success: false, message: '로그인이 필요합니다.'});
        return;
      }

      try {
        const room = await ChatRoom.findByPk(roomId);
        if (!room) {
          callback?.({success: false, message: '존재하지 않는 채팅방입니다.'});
          return;
        }

        // 권한 검증: 현재 유저가 참여자인지 확인
        if (String(room.buyerId) !== String(userId) && String(room.sellerId) !== String(userId)) {
          callback?.({success: false, message: '이 채팅방에 메시지를 보낼 권한이 없습니다.'});
          return;
        }

        // A. DB에 메시지 영구 저장
        const newMessage = await ChatMessage.create({
          roomId,
          senderId: userId,
          text: trimmedText
        });

        // B. 대화방 마지막 메시지 요약 정보 갱신
        await room.update({
          lastMessage: trimmedText,
          lastMessageAt: newMessage.createdAt
        });

        // C. 프론트엔드가 기대하는 양식에 맞추어 메시지 가공
        const sender = await User.findByPk(userId);
        const messagePayload = {
          id: newMessage.id,
          roomId,
          text: trimmedText,
          senderId: String(userId),
          senderName: getDisplayName(sender),
          senderProfileImage: sender ? sender.profileImage : null,
          createdAt: newMessage.createdAt.toISOString ? newMessage.createdAt.toISOString() : newMessage.createdAt,
        };

        // D. 해당 소켓 룸 전체 접속자들에게 메시지 브로드캐스트
        io.to(String(roomId)).emit('chat:message', messagePayload);

        // E. 양쪽 대화 참가자 전용 목록 비동기 새로고침 트리거
        await emitUserRoomsUpdate(room.buyerId);
        await emitUserRoomsUpdate(room.sellerId);

        callback?.({success: true, message: messagePayload});

      } catch (err) {
        console.error('Error on chat:send:', err);
        callback?.({success: false, message: '서버 내부 오류가 발생했습니다.'});
      }
    });
  });
};

module.exports = {initializeChatSocket};
