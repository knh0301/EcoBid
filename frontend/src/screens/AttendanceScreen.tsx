import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {ScreenName} from '../types/navigation';

interface Props {
  go: (screen: ScreenName) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const ATTENDED_DAYS = [1, 2, 4, 5, 6, 8];

export const AttendanceScreen: React.FC<Props> = ({go}) => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const buildCalendarDays = (): (number | null)[] => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const cells = buildCalendarDays();
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => go('home')}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>출석 현황</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.body}>
        {/* 캘린더 카드 */}
        <View style={styles.calendarCard}>
          {/* 월 이동 */}
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={prevMonth}>
              <Text style={styles.arrow}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {year}년 {month}월
            </Text>
            <TouchableOpacity onPress={nextMonth}>
              <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View style={styles.weekRow}>
            {WEEKDAYS.map((day, i) => (
              <Text
                key={day}
                style={[
                  styles.weekday,
                  i === 0 && {color: '#E53935'},
                  i === 6 && {color: '#1565C0'},
                ]}>
                {day}
              </Text>
            ))}
          </View>

          {/* 날짜 그리드 */}
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                const isAttended =
                  day !== null && ATTENDED_DAYS.includes(day);
                const isSun = di === 0;
                const isSat = di === 6;
                return (
                  <View key={di} style={styles.dayCell}>
                    {day !== null ? (
                      <View
                        style={[
                          styles.dayInner,
                          isAttended && styles.attendedCircle,
                        ]}>
                        <Text
                          style={[
                            styles.dayText,
                            isSun && {color: '#E53935'},
                            isSat && {color: '#1565C0'},
                          ]}>
                          {day}
                        </Text>
                        {isAttended && (
                          <Text style={styles.checkMark}>✓</Text>
                        )}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* 배지 안내 카드 */}
        <View style={styles.badgeCard}>
          <View style={styles.giftBox}>
            <Text style={{fontSize: 24}}>🎁</Text>
          </View>
          <View style={{flex: 1, marginLeft: 16}}>
            <Text style={styles.badgeTitle}>연속 출석 시 배지 지급!</Text>
            <Text style={styles.badgeDesc}>
              연속 출석을 이어가고 배지와 크레딧을 받아보세요.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
  },
  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  body: {
    padding: 16,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#5C8B5A44',
    marginBottom: 16,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrow: {
    fontSize: 18,
    color: '#1A1A1A',
    paddingHorizontal: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    paddingBottom: 8,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  dayInner: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  attendedCircle: {
    backgroundColor: '#5C8B5A44',
  },
  dayText: {
    fontSize: 13,
    color: '#1A1A1A',
  },
  checkMark: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 8,
    color: '#5C8B5A',
  },
  badgeCard: {
    backgroundColor: '#FDF8EC',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftBox: {
    width: 52,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 12,
    color: '#888888',
  },
});