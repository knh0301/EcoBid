import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {attendanceAPI, AttendanceRecord} from '../api/attendanceService';
import {colors} from '../styles/colors';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const AttendanceScreen: React.FC<any> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const todayDate = new Date();

  const [year] = useState(todayDate.getFullYear());
  const [month] = useState(todayDate.getMonth() + 1);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [isAttendedToday, setIsAttendedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);

      const [todayStatus, attendanceHistory, currentStreak] =
        await Promise.all([
          attendanceAPI.getTodayStatus(),
          attendanceAPI.getHistory({year, month}),
          attendanceAPI.getStreak(),
        ]);

      setIsAttendedToday(todayStatus.isAttended);
      setHistory(attendanceHistory);
      setStreak(currentStreak);
    } catch (error: any) {
      console.warn('Fetch attendance data error:', error);
      Alert.alert('오류', '출석 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAttendanceData();
    }, []),
  );

  const attendedDays = useMemo(() => {
    return history
      .map(item => {
        const [itemYear, itemMonth, itemDay] = item.attendanceDate
          .split('-')
          .map(Number);

        if (itemYear === year && itemMonth === month) {
          return itemDay;
        }

        return null;
      })
      .filter((day): day is number => day !== null);
  }, [history, month, year]);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const weeks = useMemo(() => {
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(day);
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    const nextWeeks: (number | null)[][] = [];

    for (let i = 0; i < cells.length; i += 7) {
      nextWeeks.push(cells.slice(i, i + 7));
    }

    return nextWeeks;
  }, [daysInMonth, firstDay]);

  const handleCheckIn = async () => {
    if (isAttendedToday || isCheckingIn) {
      return;
    }

    try {
      setIsCheckingIn(true);

      const result = await attendanceAPI.checkIn();

      setIsAttendedToday(true);
      await fetchAttendanceData();

      Alert.alert(
        '출석 완료',
        `${result.reward.toLocaleString()} 크레딧이 지급되었습니다.`,
      );
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        setIsAttendedToday(true);
        Alert.alert('출석 완료', message || '이미 오늘 출석했습니다.');
        await fetchAttendanceData();
        return;
      }

      console.warn('Attendance check-in error:', error);
      Alert.alert('오류', message || '출석체크 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <ScrollView style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>출석 현황</Text>

        <View style={styles.headerRightSpace} />
      </View>

      <View style={styles.body}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>
            {isAttendedToday ? '오늘 출석 완료' : '오늘 출석 전'}
          </Text>

          <Text style={styles.statusDesc}>
            {isAttendedToday
              ? '내일도 출석하고 새로운 크레딧 보상을 받아보세요!'
              : '출석하고 1 크레딧 보상을 받아보세요.'}
          </Text>

          <TouchableOpacity
            style={[
              styles.checkButton,
              isAttendedToday && styles.checkButtonDisabled,
            ]}
            onPress={handleCheckIn}
            disabled={isAttendedToday || isCheckingIn}>
            {isCheckingIn ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text
                style={[
                  styles.checkButtonText,
                  isAttendedToday && styles.checkButtonDisabledText,
                ]}>
                {isAttendedToday ? '출석 완료됨' : '출석체크 하기'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.monthRow}>
            <Text style={styles.monthTitle}>
              {year}년 {month}월
            </Text>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loadingIndicator}
            />
          ) : (
            <>
              <View style={styles.weekRow}>
                {WEEKDAYS.map((day, index) => (
                  <Text
                    key={day}
                    style={[
                      styles.weekday,
                      index === 0 && styles.sundayText,
                      index === 6 && styles.saturdayText,
                    ]}>
                    {day}
                  </Text>
                ))}
              </View>

              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {week.map((day, dayIndex) => {
                    const isAttended =
                      day !== null && attendedDays.includes(day);

                    return (
                      <View key={`${weekIndex}-${dayIndex}`} style={styles.dayCell}>
                        {day !== null ? (
                          <View
                            style={[
                              styles.dayInner,
                              isAttended && styles.attendedCircle,
                            ]}>
                            <Text
                              style={[
                                styles.dayText,
                                dayIndex === 0 && styles.sundayText,
                                dayIndex === 6 && styles.saturdayText,
                                isAttended && styles.attendedDayText,
                              ]}>
                              {day}
                            </Text>

                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              ))}
            </>
          )}
        </View>

        <View style={styles.badgeCard}>
          <Text style={styles.badgeIcon}>✓</Text>

          <View style={styles.badgeTextBox}>
            <Text style={styles.badgeTitle}>현재 {streak}일 연속 출석 중</Text>
            <Text style={styles.badgeDesc}>
              꾸준히 출석하면 더 많은 보상으로 확장할 수 있어요.
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
    backgroundColor: colors.grayBackground,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  backArrow: {
    fontSize: 18,
    color: colors.textPrimary,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  headerRightSpace: {
    width: 24,
  },

  body: {
    padding: 16,
  },

  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  statusTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },

  statusDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
    marginBottom: 14,
  },

  checkButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },

  checkButtonDisabled: {
    backgroundColor: colors.lightGrayBackground,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  checkButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },

  checkButtonDisabledText: {
    color: colors.textDisabled,
  },

  calendarCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },

  monthRow: {
    alignItems: 'center',
    marginBottom: 20,
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: colors.textMuted,
  },

  sundayText: {
    color: '#E53935',
  },

  saturdayText: {
    color: '#1565C0',
  },

  dayCell: {
    flex: 1,
    alignItems: 'center',
    height: 45,
  },

  dayInner: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17.5,
  },

  attendedCircle: {
    backgroundColor: colors.lightGreenBackground,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  dayText: {
    fontSize: 15,
    color: colors.textPrimary,
  },

  attendedDayText: {
    color: colors.primary,
    fontWeight: 'bold',
  },

  loadingIndicator: {
    marginVertical: 40,
  },

  badgeCard: {
    backgroundColor: colors.rankBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  badgeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: 'bold',
    marginRight: 14,
  },

  badgeTextBox: {
    flex: 1,
  },

  badgeTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.textPrimary,
  },

  badgeDesc: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
});
