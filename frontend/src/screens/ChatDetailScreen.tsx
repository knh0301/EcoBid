import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
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
import {resolveProfileImageUrl} from '../api/authApi';
import {resolveProductImageUrl} from '../api/products';

export function ChatDetailScreen({navigation, route}: any) {
  const {
    roomId,
    name = '채팅',
    productTitle = '나눔 물품',
    productImageUrl = null,
    productPrice = '크레딧 상담',
    profileImage = null,
  } = route.params || {};

  const insets = useSafeAreaInsets();
  const {userInfo} = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!roomId) {
      console.warn('ChatDetailScreen: roomId가 없습니다.');
      navigation.goBack();
      return;
    }

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

      if (String(nextMessage.senderId) !== String(userInfo?.id || '')) {
        activeSocket?.emit('chat:read', {roomId});
      }
    };

    getChatSocket()
      .then(socket => {
        if (!isMounted) {
          return;
        }

        if (!socket) {
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
  }, [navigation, roomId, userInfo?.id]);

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

      if (!socket) {
        console.warn('Send chat message skipped: auth token is missing.');
        return;
      }

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
    profileImage,
    productTitle,
    productImageUrl,
    productPrice,
  };
  const displayProfileImageUri = resolveProfileImageUrl(displayRoom.profileImage);
  const displayProductImageUri = resolveProductImageUrl(displayRoom.productImageUrl);

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

        <View style={styles.headerProfile}>
          <View style={styles.headerAvatar}>
            {displayProfileImageUri ? (
              <Image
                source={{uri: displayProfileImageUri}}
                style={styles.avatarPhoto}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="leaf-outline" size={22} color="#7FA56F" />
            )}
          </View>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {displayRoom.name}
          </Text>
        </View>

        <View style={styles.headerRightSpace} />
      </View>

      <View style={styles.productBar}>
        <View style={styles.productImagePlaceholder}>
          {displayProductImageUri ? (
            <Image
              source={{uri: displayProductImageUri}}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="bulb-outline" size={30} color="#666" />
          )}
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
            const senderProfileImageUri = resolveProfileImageUrl(
              item.senderProfileImage || displayRoom.profileImage,
            );

            return (
              <View
                key={item.id}
                style={
                  isMine
                    ? styles.sentMessageWrapper
                    : styles.receivedMessageWrapper
                }>
                {isMine ? (
                  <View style={styles.sentBubble}>
                    <Text style={styles.sentText}>{item.text}</Text>
                  </View>
                ) : (
                  <View style={styles.receivedMessageRow}>
                    <View style={styles.messageAvatar}>
                      {senderProfileImageUri ? (
                        <Image
                          source={{
                            uri: senderProfileImageUri,
                          }}
                          style={styles.avatarPhoto}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons
                          name="leaf-outline"
                          size={18}
                          color="#7FA56F"
                        />
                      )}
                    </View>

                    <View style={styles.receivedBubble}>
                      <Text style={styles.receivedText}>{item.text}</Text>
                    </View>
                  </View>
                )}
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
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            activeOpacity={0.8}
            disabled={isSending}
            onPress={handleSend}>
            <Ionicons
              name={isSending ? 'hourglass-outline' : 'send'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
