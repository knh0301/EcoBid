import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {homeStyles} from '../styles/HomeScreenStyle';
import {AppLayout} from '../components/AppLayout';

const rankingData = [
  {rank: 1, department: '컴퓨터공학과', credit: '112,894'},
  {rank: 2, department: '디자인테크놀로지학과', credit: '112,894'},
  {rank: 3, department: '기계공학과', credit: '112,894'},
];

const missionData = [
  {
    title: '텀블러 사용하기',
    description: '텀블러 사용 인증하고 크레딧을 얻으세요.',
    reward: '+500 크레딧',
  },
  {
    title: '대중교통 이용하기',
    description: '대중교통 이용을 인증하고 크레딧을 얻으세요.',
    reward: '+500 크레딧',
  },
  {
    title: '분리수거 인증하기',
    description: '올바른 분리수거를 인증하고 크레딧을 얻으세요.',
    reward: '+300 크레딧',
  },
  {
    title: '장바구니 사용하기',
    description: '일회용 봉투 대신 장바구니를 사용해보세요.',
    reward: '+300 크레딧',
  },
];

const itemData = [
  {
    id: 1,
    title: '빈티지 조명',
    price: '2,500 크레딧',
    icon: '💡',
  },
  {
    id: 2,
    title: '곰돌이 인형',
    price: '500 크레딧',
    icon: '🧸',
  },
  {
    id: 3,
    title: '각티슈 3묶음',
    price: '500 크레딧',
    icon: '🧻',
  },
  {
    id: 4,
    title: '수저 세트',
    price: '700 크레딧',
    icon: '🍴',
  },
];

export function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <AppLayout>
      <ScrollView
        style={homeStyles.homeScroll}
        contentContainerStyle={homeStyles.homeContainer}
        showsVerticalScrollIndicator={false}>
        <Pressable style={homeStyles.homeAttendanceCard}>
          <View style={homeStyles.homeAttendanceTextBox}>
            <Text style={homeStyles.homeCardTitle}>오늘의 출석 도장</Text>
            <Text style={homeStyles.homeCardDescription}>
              매일 출석하고 랜덤 크레딧을 받으세요!
            </Text>
          </View>

          <View style={homeStyles.homeStampCircle}>
            <Text style={homeStyles.homeStampText}>STAMP</Text>
          </View>
        </Pressable>

        <View style={homeStyles.homeCreditCard}>
          <View style={homeStyles.homeCreditTopRow}>
            <Text style={homeStyles.homeCardTitle}>나의 크레딧 잔액</Text>

            <View style={homeStyles.homeCreditRow}>
              <Text style={homeStyles.homeCreditAmount}>1,250</Text>
              <Text style={homeStyles.homeCreditUnit}> 크레딧</Text>
            </View>
          </View>

          <Pressable
            style={homeStyles.homeCreditButton}
            onPress={() =>
              navigation.navigate('MainTabs', {screen: 'MissionTab'})
            }>
            <Text style={homeStyles.homeCreditButtonText}>크레딧 모으기</Text>
          </Pressable>
        </View>

        <View style={homeStyles.homeRankingCard}>
          <Text style={homeStyles.homeCardTitle}>크레딧 총액 학과 순위</Text>

          <View style={homeStyles.homeRankingList}>
            {rankingData.map(item => (
              <View
                key={item.rank}
                style={[
                  homeStyles.homeRankingItem,
                  item.rank === 1 && homeStyles.homeRankingItemFirst,
                ]}>
                <View style={homeStyles.homeRankingLeft}>
                  <Text style={homeStyles.homeRankingRank}>{item.rank}</Text>
                  <Text style={homeStyles.homeRankingDept}>
                    {item.department}
                  </Text>
                </View>

                <Text style={homeStyles.homeRankingCredit}>
                  {item.credit}
                  <Text style={homeStyles.homeRankingCreditUnit}> 크레딧</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={homeStyles.homeSectionTitle}>추천 미션</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={homeStyles.homeMissionScrollContent}>
          {missionData.map(item => (
            <View key={item.title} style={homeStyles.homeMissionCard}>
              <Text style={homeStyles.homeMissionTitle}>{item.title}</Text>
              <Text style={homeStyles.homeMissionDescription}>
                {item.description}
              </Text>

              <View style={homeStyles.homeMissionBottom}>
                <Text style={homeStyles.homeMissionReward}>{item.reward}</Text>
                <Pressable
                  style={homeStyles.homeMissionButton}
                  onPress={() =>
                    navigation.navigate('MainTabs', {screen: 'MissionTab'})
                  }>
                  <Text style={homeStyles.homeMissionButtonText}>인증하기</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={homeStyles.homeSectionHeaderRow}>
          <Text style={homeStyles.homeSectionTitle}>나눔 물품 리스트</Text>
          <Pressable>
            <Text style={homeStyles.homeMoreText}>전체보기 &gt;</Text>
          </Pressable>
        </View>

        <View style={homeStyles.homeItemGrid}>
          {itemData.map(item => (
            <Pressable
              key={item.id}
              style={homeStyles.homeItemCard}
              onPress={() => navigation.navigate('ProductDetail')}>
              <View style={homeStyles.homeItemImagePlaceholder}>
                <Text style={homeStyles.homeItemIcon}>{item.icon}</Text>
              </View>

              <View style={homeStyles.homeItemInfo}>
                <View>
                  <Text style={homeStyles.homeItemTitle}>{item.title}</Text>
                  <Text style={homeStyles.homeItemPrice}>{item.price}</Text>
                </View>

                <Pressable style={homeStyles.homeHeartButton}>
                  <Text style={homeStyles.homeHeartIcon}>♡</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </AppLayout>
  );
}