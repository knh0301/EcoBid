const jwt = require('jsonwebtoken');
const {User} = require('../models');

const DEFAULT_ROOMS = [
  {
    id: 'product-vintage-light',
    name: '김나현',
    productTitle: '빈티지 조명',
    productPrice: '2,500 크레딧',
    lastMessage: '빈티지 조명 나눔 받을 수 있을까요?',
    color: '#FFD15B',
    icon: 'happy-outline',
  },
  {
    id: 'product-cardigan',
    name: '김애리',
    productTitle: '가디건',
    productPrice: '3,000 크레딧',
    lastMessage: '가디건 언제 구매하신 건가요?',
    color: '#A5C9A1',
    icon: 'leaf-outline',
  },
  {
    id: 'product-book',
    name: '이지오',
    productTitle: '전공 서적',
    productPrice: '1,200 크레딧',
    lastMessage: '인하대 정문에서 봐요.',
    color: '#ADCFFF',
    icon: 'cloud-outline',
  },
];

const rooms = new Map(
  DEFAULT_ROOMS.map(room => [
    room.id,
    {
      ...room,
      messages: [
        {
          id: `${room.id}-welcome`,
          roomId: room.id,
          text: room.lastMessage,
          senderId: `seller-${room.id}`,
          senderName: room.name,
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ]),
);

const publicRoom = room => {
  const messages = room.messages || [];
  const lastMessage = messages[messages.length - 1]?.text || room.lastMessage;

  return {
    id: room.id,
    name: room.name,
    productTitle: room.productTitle,
    productPrice: room.productPrice,
    lastMessage,
    color: room.color,
    icon: room.icon,
  };
};

const getRooms = () => Array.from(rooms.values()).map(publicRoom);

const getOrCreateRoom = roomId => {
  if (rooms.has(roomId)) {
    return rooms.get(roomId);
  }

  const room = {
    id: roomId,
    name: 'EcoBid 사용자',
    productTitle: '나눔 물품',
    productPrice: '크레딧 상담',
    lastMessage: '',
    color: '#A5C9A1',
    icon: 'chatbubble-outline',
    messages: [],
  };

  rooms.set(roomId, room);
  return room;
};

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
          name: user.name || user.email,
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

const initializeChatSocket = io => {
  io.use(async (socket, next) => {
    await authenticateSocket(socket);
    next();
  });

  io.on('connection', socket => {
    socket.emit('chat:rooms:update', getRooms());

    socket.on('chat:rooms', callback => {
      callback?.(getRooms());
    });

    socket.on('chat:join', ({roomId}, callback) => {
      if (!roomId) {
        callback?.({success: false, message: 'roomId is required.'});
        return;
      }

      const room = getOrCreateRoom(roomId);
      socket.join(roomId);

      callback?.({
        success: true,
        room: publicRoom(room),
        messages: room.messages,
      });
    });

    socket.on('chat:send', ({roomId, text}, callback) => {
      const trimmedText = String(text || '').trim().normalize('NFC');

      if (!roomId || !trimmedText) {
        callback?.({success: false, message: 'roomId and text are required.'});
        return;
      }

      const room = getOrCreateRoom(roomId);
      const message = {
        id: `${Date.now()}-${socket.id}`,
        roomId,
        text: trimmedText,
        senderId: socket.user.id,
        senderName: socket.user.name,
        createdAt: new Date().toISOString(),
      };

      room.messages.push(message);
      room.messages = room.messages.slice(-100);
      room.lastMessage = trimmedText;

      io.to(roomId).emit('chat:message', message);
      io.emit('chat:rooms:update', getRooms());

      callback?.({success: true, message});
    });
  });
};

module.exports = {initializeChatSocket};
