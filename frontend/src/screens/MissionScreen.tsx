import React from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {missionStyles} from '../styles/MissionScreenStyle';

const MISSION_DATA = [
  {
    id: '1',
    title: '오늘의 출석 도장',
    desc: '매일 출석하고 크레딧을 받아보세요!',
    credit: '',
    buttonText: '출석하기',
    status: 'active',
  },
  {
    id: '2',
    title: '나눔 물품 등록하기',
    desc: '물품 거래가 완료되면 1,000 크레딧을 추가로 지급해드려요.',
    credit: '+ 1,000 크레딧',
    buttonText: '나눔 물품 등록하기',
    status: 'active',
  },
  {
    id: '3',
    title: '친구 초대하기',
    desc: '친구 초대 해줘용.',
    credit: '+ 2,000 크레딧',
    buttonText: '초대하기',
    status: 'active',
  },
  {
    id: '4',
    title: '광고 보기',
    desc: '광고 봐줘용.',
    credit: '+ 200 크레딧',
    buttonText: '광고보기',
    status: 'active',
  },
];

const DAILY_MISSIONS = [
  {
    id: 'd1',
    title: '텀블러 사용하기',
    desc: '일회용품 대신 텀블러를 사용해보는건 어떨까요?',
    credit: '+ 50 크레딧',
    buttonText: '크레딧 지급 완료',
    status: 'completed',
  },
  {
    id: 'd2',
    title: '분리수거 하기',
    desc: '페트병 라벨 제거, 캔 압축 등 올바른 분리수거를 해봐요.',
    credit: '+ 50 크레딧',
    buttonText: '인증하기',
    status: 'active',
  },
  {
    id: 'd3',
    title: '내 용기 이용하여 음식 포장하기',
    desc: '일회용품 대신 집에 있던 용기를 활용해보세요.',
    credit: '+ 50 크레딧',
    buttonText: '인증하기',
    status: 'active',
  },
  {
    id: 'd4',
    title: '음식 남기지 않기',
    desc: '음식물 쓰레기를 줄여요.',
    credit: '+ 50 크레딧',
    buttonText: '인증하기',
    status: 'active',
  },
  {
    id: 'd5',
    title: '대중교통 이용하기',
    desc: '대중교통도 잘 되어있다.',
    credit: '+ 50 크레딧',
    buttonText: '인증하기',
    status: 'active',
  },
  {
    id: 'd6',
    title: '이면지 활용하기',
    desc: '점점',
    credit: '+ 50 크레딧',
    buttonText: '인증하기',
    status: 'active',
  },
  {
    id: 'd7',
    title: '10,000보 걷기',
    desc: '쓰기',
    credit: '+ 50 크레딧',
    buttonText: '인증하기',
    status: 'active',
  },
  {
    id: 'd8',
    title: '리필 제품 구매하기',
    desc: '구찮다.',
    credit: '+ 50 크레딧',
    buttonText: '인증하기',
    status: 'active',
  },
  {
    id: 'd9',
    title: '안쓰는 멀티탭 뽑기',
    desc: '전기세 줄줄 샌다.',
    credit: '+ 50 크레딧',
    buttonText: '인증하기',
    status: 'active',
  },
];

const MissionCard = ({item, navigation}: {item: any; navigation: any}) => (
  <View style={missionStyles.card}>
    <View style={missionStyles.cardHeader}>
      <Text style={missionStyles.cardTitle}>{item.title}</Text>

      {item.credit ? (
        <Text style={missionStyles.cardCredit}>{item.credit}</Text>
      ) : null}
    </View>

    <Text style={missionStyles.cardDesc}>{item.desc}</Text>

    <TouchableOpacity
      style={[
        missionStyles.button,
        item.status === 'completed' && missionStyles.buttonCompleted,
      ]}
      activeOpacity={0.7}
      disabled={item.status === 'completed'}
      onPress={() => {
        if (item.buttonText === '인증하기') {
          navigation.navigate('MissionVerify', {missionTitle: item.title});
        } else if (item.buttonText === '출석하기') {
          navigation.navigate('Attendance');
        } else if (item.buttonText === '나눔 물품 등록하기') {
          navigation.navigate('ProductRegister');
        }
      }}>
      <Text
        style={[
          missionStyles.buttonText,
          item.status === 'completed' && missionStyles.buttonTextCompleted,
        ]}>
        {item.buttonText}
      </Text>
    </TouchableOpacity>
  </View>
);

export function MissionScreen({navigation}: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        missionStyles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <View style={missionStyles.header}>
        <Text style={missionStyles.headerLogo}>EcoBid</Text>
      </View>

      <ScrollView contentContainerStyle={missionStyles.scrollContent}>
        <Text style={missionStyles.pageTitle}>미션</Text>

        <Text style={missionStyles.pageSubtitle}>
          매일 미션을 수행하고 크레딧을 모아보세요!
        </Text>

        {MISSION_DATA.map(item => (
          <MissionCard key={item.id} item={item} navigation={navigation} />
        ))}

        <Text style={missionStyles.sectionTitle}>데일리 미션</Text>

        <View style={missionStyles.progressCard}>
          <View style={missionStyles.progressHeader}>
            <Text style={missionStyles.progressTitle}>오늘의 진행도</Text>
            <Text style={missionStyles.progressValue}>50/250</Text>
          </View>

          <View style={missionStyles.progressBarTrack}>
            <View style={[missionStyles.progressBarFill, {width: '20%'}]} />
          </View>
        </View>

        {DAILY_MISSIONS.map(item => (
          <MissionCard key={item.id} item={item} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
}