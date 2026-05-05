import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export function ChatDetailScreen({navigation, route}: any) {
  const {name} = route.params || {name: '김애리'};
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={{width: 28}} />
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
        style={{flex: 1}}
      >
        <ScrollView contentContainerStyle={styles.chatContent}>
          {/* 상대방 메시지 */}
          <View style={styles.receivedMessageWrapper}>
            <View style={styles.receivedBubble}>
              <Text style={styles.receivedText}>빈티지 조명 나눔 받고싶어요!</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  productBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productInfo: {
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  chatContent: {
    flexGrow: 1,
    padding: 20,
  },
  receivedMessageWrapper: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  receivedText: {
    fontSize: 16,
    color: '#000',
  },
  sentMessageWrapper: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sentBubble: {
    backgroundColor: '#86B27A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  sentText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  textInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    width: 50,
    height: 50,
    backgroundColor: '#405D3B',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});