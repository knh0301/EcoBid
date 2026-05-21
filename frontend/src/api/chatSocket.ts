import {io, Socket} from 'socket.io-client';
import {API_CONFIG} from '../config/apiConfig';
import {tokenStorage} from '../storage/tokenStorage';

export type ChatRoom = {
  id: string;
  name: string;
  profileImage?: string | null;
  productTitle: string;
  productImageUrl?: string | null;
  productPrice: string;
  lastMessage: string;
  unreadCount?: number;
  hasUnread?: boolean;
  color: string;
  icon: string;
};

export type ChatMessage = {
  id: string;
  roomId: string;
  text: string;
  senderId: string;
  senderName: string;
  senderProfileImage?: string | null;
  createdAt: string;
};

let socket: Socket | null = null;
let socketAccessToken: string | null = null;

const getSocketUrl = () => API_CONFIG.BASE_URL.replace(/\/api\/?$/, '');

export const getChatSocket = async () => {
  const accessToken = await tokenStorage.getAccessToken();

  if (socket?.connected && socketAccessToken === accessToken) {
    return socket;
  }

  socket?.disconnect();
  socketAccessToken = accessToken || null;

  socket = io(getSocketUrl(), {
    auth: {
      token: accessToken,
    },
    transports: ['websocket'],
  });

  return socket;
};

export const disconnectChatSocket = () => {
  socket?.disconnect();
  socket = null;
  socketAccessToken = null;
};
