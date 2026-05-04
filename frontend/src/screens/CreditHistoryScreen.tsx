import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {MissionItem} from '../components/MissionItem';

export function CreditHistoryScreen({navigation}: any) {
  return (
    <View style={styles.fullPage}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'}</Text>
        </Pressable>
        <Text style={styles.appTitle}>크레딧 내역</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>현재 보유 크레딧</Text>
        <Text style={styles.bgTitle}>1,250 크레딧</Text>

        <View style={styles.cardBlock}>
          <Text style={styles.sectionTitle}>월간 활동 캘린더</Text>
          <Text style={styles.desc}>2026.04</Text>
          <Text style={{marginTop: 20}}>캘린더 영역</Text>
        </View>

        <MissionItem title="텀블러 사용 인증" credit="+100 크레딧" />
        <MissionItem title="흰색 블라우스 구매" credit="-5,000 크레딧" />
      </ScrollView>
    </View>
  );
}