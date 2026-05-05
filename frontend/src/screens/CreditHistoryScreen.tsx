import React, {useMemo, useState} from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {creditHistoryStyles as styles} from '../styles/CreditHistoryScreenStyle';

type CreditType = 'earn' | 'use';
type FilterType = 'all' | 'earn' | 'use';

type CreditHistoryItem = {
  id: number;
  date: string;
  title: string;
  amount: number;
  type: CreditType;
};

const CREDIT_HISTORY: CreditHistoryItem[] = [
  {
    id: 1,
    date: '2026-05-03',
    title: '물품 구매 : 빈티지 조명',
    amount: -2500,
    type: 'use',
  },
  {
    id: 2,
    date: '2026-05-03',
    title: '미션 완료 : 텀블러 사용하기',
    amount: 500,
    type: 'earn',
  },
  {
    id: 3,
    date: '2026-05-03',
    title: '미션 완료 : 매일 출석',
    amount: 10,
    type: 'earn',
  },
  {
    id: 4,
    date: '2026-05-02',
    title: '미션 완료 : 텀블러 사용하기',
    amount: 500,
    type: 'earn',
  },
  {
    id: 5,
    date: '2026-05-02',
    title: '미션 완료 : 대중교통 이용하기',
    amount: 500,
    type: 'earn',
  },
  {
    id: 6,
    date: '2026-05-02',
    title: '미션 완료 : 매일 출석',
    amount: 10,
    type: 'earn',
  },
  {
    id: 7,
    date: '2026-05-01',
    title: '미션 완료 : 대중교통 이용하기',
    amount: 500,
    type: 'earn',
  },
  {
    id: 8,
    date: '2026-05-01',
    title: '미션 완료 : 매일 출석',
    amount: 10,
    type: 'earn',
  },
];

const FILTER_LABELS: Record<FilterType, string> = {
  all: '전체',
  earn: '지급',
  use: '사용',
};

export function CreditHistoryScreen() {
  const navigation = useNavigation<any>();

  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(5);

  const [draftYear, setDraftYear] = useState(selectedYear);
  const [draftMonth, setDraftMonth] = useState(selectedMonth);

  const [filter, setFilter] = useState<FilterType>('all');
  const [draftFilter, setDraftFilter] = useState<FilterType>('all');

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const filteredHistory = useMemo(() => {
    return CREDIT_HISTORY.filter(item => {
      const [year, month] = item.date.split('-').map(Number);

      const isSameMonth = year === selectedYear && month === selectedMonth;
      const isSameFilter = filter === 'all' || item.type === filter;

      return isSameMonth && isSameFilter;
    });
  }, [selectedYear, selectedMonth, filter]);

  const groupedHistory = useMemo(() => {
    return filteredHistory.reduce<Record<string, CreditHistoryItem[]>>(
      (acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }

        acc[item.date].push(item);
        return acc;
      },
      {},
    );
  }, [filteredHistory]);

  const openDateModal = () => {
    setDraftYear(selectedYear);
    setDraftMonth(selectedMonth);
    setDateModalVisible(true);
  };

  const openFilterModal = () => {
    setDraftFilter(filter);
    setFilterModalVisible(true);
  };

  const confirmDate = () => {
    setSelectedYear(draftYear);
    setSelectedMonth(draftMonth);
    setDateModalVisible(false);
  };

  const confirmFilter = () => {
    setFilter(draftFilter);
    setFilterModalVisible(false);
  };

  const changeDraftMonth = (value: number) => {
    if (value < 1) {
      setDraftYear(prev => prev - 1);
      setDraftMonth(12);
      return;
    }

    if (value > 12) {
      setDraftYear(prev => prev + 1);
      setDraftMonth(1);
      return;
    }

    setDraftMonth(value);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#222222" />
        </Pressable>

        <Text style={styles.headerTitle}>크레딧</Text>

        <View style={styles.creditBadge}>
          <Text style={styles.creditBadgeText}>1,250 크레딧</Text>
        </View>
      </View>

      <View style={styles.controlRow}>
        <Pressable style={styles.monthButton} onPress={openDateModal}>
          <Text style={styles.monthText}>
            {selectedYear}년 {selectedMonth}월
          </Text>
          <Ionicons name="chevron-down" size={16} color="#222222" />
        </Pressable>

        <Pressable style={styles.filterButton} onPress={openFilterModal}>
          <Text style={styles.filterButtonText}>{FILTER_LABELS[filter]}</Text>
          <Ionicons name="options-outline" size={14} color="#777777" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {Object.keys(groupedHistory).map(date => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateLabel}>{formatDateLabel(date)}</Text>

            {groupedHistory[date].map(item => (
              <View key={item.id} style={styles.historyItem}>
                <Text style={styles.historyTitle}>{item.title}</Text>

                <Text
                  style={[
                    styles.historyAmount,
                    item.type === 'earn'
                      ? styles.earnAmount
                      : styles.useAmount,
                  ]}>
                  {formatAmount(item.amount)} 크레딧
                </Text>
              </View>
            ))}
          </View>
        ))}

        {filteredHistory.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>해당 내역이 없습니다.</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={dateModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.dateSheet}>
            <View style={styles.datePickerRow}>
              <View style={styles.datePickerGroup}>
                <Pressable onPress={() => setDraftYear(prev => prev + 1)}>
                  <Ionicons name="chevron-up" size={18} color="#777777" />
                </Pressable>

                <View style={styles.dateValueBox}>
                  <Text style={styles.dateValue}>{draftYear}</Text>
                </View>

                <Pressable onPress={() => setDraftYear(prev => prev - 1)}>
                  <Ionicons name="chevron-down" size={18} color="#777777" />
                </Pressable>
              </View>

              <Text style={styles.dateUnit}>년</Text>

              <View style={styles.datePickerGroup}>
                <Pressable onPress={() => changeDraftMonth(draftMonth + 1)}>
                  <Ionicons name="chevron-up" size={18} color="#777777" />
                </Pressable>

                <View style={[styles.dateValueBox, styles.monthValueBox]}>
                  <Text style={styles.dateValue}>{draftMonth}</Text>
                </View>

                <Pressable onPress={() => changeDraftMonth(draftMonth - 1)}>
                  <Ionicons name="chevron-down" size={18} color="#777777" />
                </Pressable>
              </View>

              <Text style={styles.dateUnit}>월</Text>
            </View>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setDateModalVisible(false)}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>

              <Pressable style={styles.confirmButton} onPress={confirmDate}>
                <Text style={styles.confirmButtonText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={filterModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.filterSheet}>
            {(['all', 'earn', 'use'] as FilterType[]).map(type => {
              const isSelected = draftFilter === type;

              return (
                <Pressable
                  key={type}
                  style={styles.filterOption}
                  onPress={() => setDraftFilter(type)}>
                  <Text style={styles.filterOptionText}>
                    {FILTER_LABELS[type]}
                  </Text>

                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={isSelected ? '#2F6F3E' : '#D8D8D8'}
                  />
                </Pressable>
              );
            })}

            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>

              <Pressable style={styles.confirmButton} onPress={confirmFilter}>
                <Text style={styles.confirmButtonText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function formatDateLabel(date: string) {
  const [, month, day] = date.split('-').map(Number);
  return `${month}월 ${day}일`;
}

function formatAmount(amount: number) {
  const absAmount = Math.abs(amount).toLocaleString();

  if (amount > 0) {
    return `+ ${absAmount}`;
  }

  return `- ${absAmount}`;
}