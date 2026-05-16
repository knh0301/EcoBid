import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ChatRoom, getChatSocket} from '../api/chatSocket';
import {chatListStyles as styles} from '../styles/ChatListScreenStyle';

export function ChatListScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let activeSocket: Awaited<ReturnType<typeof getChatSocket>> | null = null;

    const handleRoomsUpdate = (nextRooms: ChatRoom[]) => {
      if (isMounted) {
        setRooms(nextRooms);
        setIsLoading(false);
      }
    };

    getChatSocket()
      .then(socket => {
        if (!isMounted) {
          return;
        }

        activeSocket = socket;
        socket.on('chat:rooms:update', handleRoomsUpdate);
        socket.emit('chat:rooms', handleRoomsUpdate);
      })
      .catch(error => {
        console.warn('Chat rooms connection error:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      activeSocket?.off('chat:rooms:update', handleRoomsUpdate);
    };
  }, []);

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
            <TouchableOpacity
              key={item.id}
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate('ChatDetail', {
                  roomId: item.id,
                  name: item.name,
                  productTitle: item.productTitle,
                  productPrice: item.productPrice,
                })
              }
              activeOpacity={0.7}>
              <View style={[styles.avatar, {backgroundColor: item.color}]}>
                <Ionicons
                  name={item.icon as any}
                  size={36}
                  color="rgba(0,0,0,0.5)"
                />
              </View>

              <View style={styles.chatInfo}>
                <Text style={styles.userName}>{item.name}</Text>

                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage || '새 대화를 시작해보세요.'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
