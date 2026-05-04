import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {AppLayout} from '../components/AppLayout';
import {MissionItem} from '../components/MissionItem';

export function MissionScreen() {
  return (
    <AppLayout>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.bgTitle}>미션</Text>
        <Text style={styles.subtitle}>
          매일 미션을 수행하고 경매에 사용할 크레딧을 모으세요.
        </Text>

        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>오늘의 진행도</Text>
          <Text style={styles.creditText}>2500 / 5000</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <MissionItem title="텀블러 사용 인증" credit="+100 크레딧" />
        <MissionItem title="패트병 라벨 제거 인증" credit="+100 크레딧" />
        <MissionItem title="대중교통 이용 인증" credit="+150 크레딧" />
      </ScrollView>
    </AppLayout>
  );
}