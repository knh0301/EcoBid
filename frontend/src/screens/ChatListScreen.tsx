import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
    <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
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
            {/* 시안의 아바타를 재현한 아이콘 포함 원형 박스 */}
            <View style={[styles.avatar, {backgroundColor: item.color}]}>
              <Ionicons name={item.icon as any} size={36} color="rgba(0,0,0,0.5)" />
            </View>

            {/* 이름 및 마지막 메시지 */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerLogo: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  titleHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400',
  },
});