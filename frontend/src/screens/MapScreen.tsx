import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {GoToScreen} from '../types/navigation';
import {AppLayout} from '../components/AppLayout';

export function MapScreen({go}: {go: GoToScreen}) {
  return (
    <AppLayout active="map" go={go}>
      <View style={styles.mapPage}>
        <TextInput style={styles.searchInput} placeholder="우리 동네 에코 스팟 검색" />

        <View style={styles.filterRow}>
          <Text style={styles.filterActive}>전체</Text>
          <Text style={styles.filter}>나눔물품</Text>
          <Text style={styles.filter}>제휴매장</Text>
          <Text style={styles.filter}>제로웨이스트</Text>
        </View>

        <View style={styles.fakeMap}>
          <Text style={styles.fakeMapText}>지도 영역</Text>
          <Text style={styles.pin}>📍</Text>
          <Text style={[styles.pin, {top: 160, left: 220}]}>📍</Text>
          <Text style={[styles.pin, {top: 260, left: 120}]}>📍</Text>
        </View>
      </View>
    </AppLayout>
  );
}