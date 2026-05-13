import React from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {chatListStyles as styles} from '../styles/ChatListScreenStyle';

const CHAT_DATA = [
  {
    id: '1',
    name: '김나현',
    lastMessage: '빈티지 조명 나눔 받고싶어요!',
    color: '#FFD15B',
    icon: 'happy-outline',
  },
  {
    id: '2',
    name: '김애리',
    lastMessage: '각티슈 언제 구매하신건가요?',
    color: '#A5C9A1',
    icon: 'leaf-outline',
  },
  {
    id: '3',
    name: '이지오',
    lastMessage: '인하대 정문에서 봬요.',
    color: '#ADCFFF',
    icon: 'cloud-outline',
  },
];

export function ChatListScreen({navigation}: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      {/* 1단계 헤더: EcoBid 로고 */}
      <View style={styles.topHeader}>
        <Text style={styles.headerLogo}>EcoBid</Text>
      </View>

      {/* 2단계 헤더: 채팅 타이틀 */}
      <View style={styles.titleHeader}>
        <Text style={styles.pageTitle}>채팅</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {CHAT_DATA.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatDetail', {name: item.name})}
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
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}