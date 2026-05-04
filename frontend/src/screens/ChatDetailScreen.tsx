import React from 'react';
import {Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {Message} from '../components/Message';

export function ChatDetailScreen({navigation}: any) {
  return (
    <View style={styles.fullPage}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'}</Text>
        </Pressable>
        <Text style={styles.appTitle}>EcoBid</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.productMiniHeader}>
        <View style={styles.itemImageSmall} />
        <View>
          <Text style={styles.sectionTitle}>빈티지 조명</Text>
          <Text style={styles.desc}>2500 크레딧</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Message type="received" text="빈티지 조명 나눔 받고싶어요!" />
        <Message type="received" text="상태가 어떤가요?" />
        <Message type="sent" text="거의 새것과 다름없습니다." />
      </ScrollView>

      <View style={styles.chatInputArea}>
        <TextInput style={styles.chatInput} placeholder="메시지를 입력하세요" />
        <Pressable style={styles.sendBtn}>
          <Text style={styles.sendText}>전송</Text>
        </Pressable>
      </View>
    </View>
  );
}