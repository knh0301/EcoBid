import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {chatDetailStyles as styles} from '../styles/ChatDetailScreenStyle';

export function ChatDetailScreen({navigation, route}: any) {
  const {name} = route.params || {name: '김애리'};
  const [message, setMessage] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{name}</Text>

        <View style={styles.headerRightSpace} />
      </View>

      {/* 상단 상품 정보 바 */}
      <View style={styles.productBar}>
        <View style={styles.productImagePlaceholder}>
          <Ionicons name="bulb-outline" size={30} color="#666" />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>빈티지 조명</Text>
          <Text style={styles.productPrice}>2,500 크레딧</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.chatContent}>
          {/* 상대방 메시지 */}
          <View style={styles.receivedMessageWrapper}>
            <View style={styles.receivedBubble}>
              <Text style={styles.receivedText}>
                빈티지 조명 나눔 받고싶어요!
              </Text>
            </View>
          </View>

          <View style={styles.receivedMessageWrapper}>
            <View style={styles.receivedBubble}>
              <Text style={styles.receivedText}>상태가 어떤가요?</Text>
            </View>
          </View>

          {/* 내 메시지 */}
          <View style={styles.sentMessageWrapper}>
            <View style={styles.sentBubble}>
              <Text style={styles.sentText}>거의 새것과 다름없어요.</Text>
            </View>
          </View>
        </ScrollView>

        {/* 하단 입력 영역 */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="메시지를 입력하세요."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}