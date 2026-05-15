import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { attendanceAPI } from '../api/attendanceService';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const AttendanceScreen: React.FC<any> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const todayDate = new Date();
  const [year, setYear] = useState(todayDate.getFullYear());
  const [month, setMonth] = useState(todayDate.getMonth() + 1);

  const [attendedDays, setAttendedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const userId = 1;

  const processAttendanceAndFetchData = async () => {
    try {
      setIsLoading(true);

      // 1. 자동 출석 시도
      try {
        const checkRes = await attendanceAPI.checkIn(userId);
        if (checkRes.success) {
          Alert.alert('출석 완료', '오늘의 출석 보상 10 크레딧이 지급되었습니다! 🔥');
        }
      } catch (checkError: any) {
        // 이미 출석한 경우 409 에러가 나는데, 이때는 메시지만 확인하고 넘어갑니다.
        console.log('이미 출석함:', checkError.response?.data?.message);
      }

      // 2. 전체 출석 기록 가져오기
      const historyRes = await attendanceAPI.getHistory(userId);
     if (historyRes.success && Array.isArray(historyRes.data)) {
       console.log('서버에서 온 원본 데이터:', historyRes.data); // 여기서 데이터 모양을 꼭 확인하세요!

       const filteredDays = historyRes.data
         .map((item: any) => {
           // 1. 키값이 attendanceDate 일 수도 있고 attendance_date 일 수도 있음
           const rawDate = item.attendanceDate || item.attendance_date;
           if (!rawDate) return null;

           // 2. "2024-05-13" 분리
           const [iYear, iMonth, iDay] = rawDate.split('-').map(Number);

           // 3. 현재 달력의 년, 월과 비교 (주의: month는 1~12 숫자임)
           if (iYear === year && iMonth === month) {
             return iDay;
           }
           return null;
         })
         .filter((day: number | null): day is number => day !== null); // null 제거

       console.log('필터링 후 도장 찍을 날짜들:', filteredDays);
       setAttendedDays(filteredDays);
     }

      // 3. 연속 출석일 가져오기
      const streakRes = await attendanceAPI.getStreak(userId);
      setStreak(streakRes.data.streak);

    } catch (error) {
      console.error('데이터 로드 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    processAttendanceAndFetchData();
  }, [year, month]);

  // --- 달력 생성 로직 ---
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const buildCalendarDays = (): (number | null)[] => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };
  const weeks: (number | null)[][] = [];
  const cells = buildCalendarDays();
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <ScrollView style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>{'<'}</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>출석 현황</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.body}>
        <View style={styles.calendarCard}>
          {/* 년/월 표시 및 이동 */}
          <View style={styles.monthRow}>
            <Text style={styles.monthTitle}>{year}년 {month}월</Text>
          </View>

          {/* 요일 표시 */}
          <View style={styles.weekRow}>
            {WEEKDAYS.map((day, i) => (
              <Text key={day} style={[styles.weekday, i === 0 && {color: '#E53935'}, i === 6 && {color: '#1565C0'}]}>{day}</Text>
            ))}
          </View>

          {/* 날짜 표시 (도장 찍기 핵심 부분) */}
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                // 출석 데이터(attendedDays)에 이 날짜가 있는지 확인
                const isAttended = day !== null && attendedDays.includes(day);

                return (
                  <View key={di} style={styles.dayCell}>
                    {day !== null ? (
                      <View style={[
                        styles.dayInner,
                        isAttended && styles.attendedCircle // 출석 시 배경색 추가 (도장 효과)
                      ]}>
                        <Text style={[
                          styles.dayText,
                          di === 0 && {color: '#E53935'},
                          di === 6 && {color: '#1565C0'},
                          isAttended && {color: '#5C8B5A', fontWeight: 'bold'} // 출석 시 글자 강조
                        ]}>
                          {day}
                        </Text>
                        {isAttended && <Text style={styles.checkMark}>✓</Text>}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* 스트릭 표시 */}
        <View style={styles.badgeCard}>
          <Text style={{fontSize: 24}}>🔥</Text>
          <View style={{marginLeft: 16}}>
            <Text style={styles.badgeTitle}>현재 {streak}일 연속 출석 중!</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backArrow: { fontSize: 18 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  body: { padding: 16 },
  calendarCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, elevation: 2 },
  monthRow: { alignItems: 'center', marginBottom: 20 },
  monthTitle: { fontSize: 18, fontWeight: 'bold' },
  weekRow: { flexDirection: 'row', marginBottom: 10 },
  weekday: { flex: 1, textAlign: 'center', fontSize: 14, color: '#888' },
  dayCell: { flex: 1, alignItems: 'center', height: 45 },
  dayInner: { width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 17.5 },
  attendedCircle: { backgroundColor: '#EAF2E9', borderWidth: 1, borderColor: '#5C8B5A' }, // 도장 테두리와 배경
  dayText: { fontSize: 15 },
  checkMark: { position: 'absolute', bottom: -2, fontSize: 10, color: '#5C8B5A', fontWeight: 'bold' },
  badgeCard: { backgroundColor: '#FDF8EC', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  badgeTitle: { fontWeight: 'bold', fontSize: 15 },
});
