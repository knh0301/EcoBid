import {io, Socket} from 'socket.io-client';
import {API_CONFIG} from '../config/apiConfig';
import {tokenStorage} from '../storage/tokenStorage';

export type ChatRoom = {
  id: string;
  name: string;
  productTitle: string;
  productPrice: string;
  lastMessage: string;
  color: string;
  icon: string;
};

export type ChatMessage = {
  id: string;
  roomId: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: string;
};

let socket: Socket | null = null;

const getSocketUrl = () => API_CONFIG.BASE_URL.replace(/\/api\/?$/, '');

export const getChatSocket = async () => {
  const accessToken = await tokenStorage.getAccessToken();

  if (socket?.connected) {
    return socket;
  }

  socket?.disconnect();

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
};
