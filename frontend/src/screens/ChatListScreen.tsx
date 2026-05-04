import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {GoToScreen} from '../types/navigation';
import {AppLayout} from '../components/AppLayout';

export function ChatListScreen({go}: {go: GoToScreen}) {
  return (
    <AppLayout active="chat" go={go}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.bgTitle}>채팅</Text>

        {[
          ['김나현', '빈티지 조명 나눔 받고싶어요!'],
          ['김애리', '빈티지 조명 나눔 받고싶어요!'],
          ['이지오', '인하대 정문에서 봬요'],
        ].map(([name, message]) => (
          <Pressable
            key={name}
            style={styles.chatItem}
            onPress={() => go('chatDetail')}>
            <View style={styles.avatar} />
            <View style={{flex: 1}}>
              <Text style={styles.chatName}>{name}</Text>
              <Text style={styles.desc}>{message}</Text>
            </View>
            <Text>{'>'}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </AppLayout>
  );
}