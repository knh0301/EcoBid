import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {ChatRoom, getChatSocket} from '../api/chatSocket';
import {chatListStyles as styles} from '../styles/ChatListScreenStyle';
import {resolveProfileImageUrl} from '../api/authApi';
import {useAuth} from '../context/AuthContext';

export function ChatListScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const {userInfo} = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let activeSocket: Awaited<ReturnType<typeof getChatSocket>> | null = null;

      setRooms([]);
      setIsLoading(true);

      const handleRoomsUpdate = (nextRooms: ChatRoom[]) => {
        if (isActive) {
          setRooms(nextRooms);
          setIsLoading(false);
        }
      };

      getChatSocket()
        .then(socket => {
          if (!isActive) {
            return;
          }

          if (!socket) {
            setIsLoading(false);
            return;
          }

          activeSocket = socket;
          socket.off('chat:rooms:update', handleRoomsUpdate);
          socket.on('chat:rooms:update', handleRoomsUpdate);
          socket.emit('chat:rooms', handleRoomsUpdate);
        })
        .catch(error => {
          console.warn('Chat rooms connection error:', error);
          if (isActive) {
            setIsLoading(false);
          }
        });

      return () => {
        isActive = false;
        activeSocket?.off('chat:rooms:update', handleRoomsUpdate);
      };
    }, [userInfo?.id]),
  );

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <View style={styles.topHeader}>
        <Text style={styles.headerLogo}>EcoBid</Text>
      </View>

      <View style={styles.titleHeader}>
        <Text style={styles.pageTitle}>채팅</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#5C8B5A" style={{marginTop: 32}} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {rooms.map(item => (
            <ChatRoomRow key={item.id} item={item} navigation={navigation} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function ChatRoomRow({item, navigation}: {item: ChatRoom; navigation: any}) {
  const profileImageUri = resolveProfileImageUrl(item.profileImage);

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('ChatDetail', {
          roomId: item.id,
          name: item.name,
          productTitle: item.productTitle,
          productImageUrl: item.productImageUrl,
          productPrice: item.productPrice,
          profileImage: item.profileImage,
        })
      }
      activeOpacity={0.7}>
      <View style={styles.avatar}>
        {profileImageUri ? (
          <Image
            source={{uri: profileImageUri}}
            style={styles.avatarPhoto}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="leaf-outline" size={30} color="#7FA56F" />
        )}
      </View>

      <View style={styles.chatInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.name}
        </Text>

        <Text
          style={[styles.lastMessage, item.hasUnread && styles.unreadLastMessage]}
          numberOfLines={1}>
          {item.lastMessage || '새 대화를 시작해보세요.'}
        </Text>
      </View>

      {item.hasUnread ? <View style={styles.unreadDot} /> : null}
    </TouchableOpacity>
  );
}
