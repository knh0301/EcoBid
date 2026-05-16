import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ChatMessage, ChatRoom, getChatSocket} from '../api/chatSocket';
import {useAuth} from '../context/AuthContext';
import {chatDetailStyles as styles} from '../styles/ChatDetailScreenStyle';

export function ChatDetailScreen({navigation, route}: any) {
  const {
    roomId = 'product-vintage-light',
    name = '채팅',
    productTitle = '나눔 물품',
    productPrice = '크레딧 상담',
  } = route.params || {};

  const insets = useSafeAreaInsets();
  const {userInfo} = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let activeSocket: Awaited<ReturnType<typeof getChatSocket>> | null = null;

    const handleMessage = (nextMessage: ChatMessage) => {
      if (nextMessage.roomId !== roomId || !isMounted) {
        return;
      }

      setMessages(prev => {
        if (prev.some(item => item.id === nextMessage.id)) {
          return prev;
        }

        return [...prev, nextMessage];
      });
    };

    getChatSocket()
      .then(socket => {
        if (!isMounted) {
          return;
        }

        activeSocket = socket;
        socket.on('chat:message', handleMessage);
        socket.emit(
          'chat:join',
          {roomId},
          (response: {
            success: boolean;
            room?: ChatRoom;
            messages?: ChatMessage[];
          }) => {
            if (!isMounted || !response.success) {
              return;
            }

            setRoom(response.room || null);
            setMessages(response.messages || []);
          },
        );
      })
      .catch(error => {
        console.warn('Chat detail connection error:', error);
      });

    return () => {
      isMounted = false;
      activeSocket?.off('chat:message', handleMessage);
    };
  }, [roomId]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({animated: true});
    });
  }, [messages.length]);

  const handleSend = async () => {
    const text = message.trim();

    if (!text || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const socket = await getChatSocket();

      socket.emit(
        'chat:send',
        {
          roomId,
          text,
        },
        (response: {success: boolean; message?: string}) => {
          if (!response.success) {
            console.warn('Send chat message failed:', response.message);
          }
        },
      );

      setMessage('');
    } catch (error) {
      console.warn('Send chat message error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const displayRoom = room || {
    name,
    productTitle,
    productPrice,
  };

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{displayRoom.name}</Text>

        <View style={styles.headerRightSpace} />
      </View>

      <View style={styles.productBar}>
        <View style={styles.productImagePlaceholder}>
          <Ionicons name="bulb-outline" size={30} color="#666" />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{displayRoom.productTitle}</Text>
          <Text style={styles.productPrice}>{displayRoom.productPrice}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled">
          {messages.map(item => {
            const isMine = String(userInfo?.id || '') === String(item.senderId);

            return (
              <View
                key={item.id}
                style={
                  isMine
                    ? styles.sentMessageWrapper
                    : styles.receivedMessageWrapper
                }>
                <View style={isMine ? styles.sentBubble : styles.receivedBubble}>
                  <Text style={isMine ? styles.sentText : styles.receivedText}>
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="메시지를 입력하세요"
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            multiline
            textAlignVertical="center"
          />

          <TouchableOpacity
            style={styles.sendButton}
            activeOpacity={0.8}
            disabled={isSending}
            onPress={handleSend}>
            <Text style={styles.sendButtonText}>
              {isSending ? '...' : '전송'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
