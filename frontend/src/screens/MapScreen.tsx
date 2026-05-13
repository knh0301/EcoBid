 import React, {useState} from 'react'; import { Text, TextInput, View, TouchableOpacity, ScrollView, } from 'react-native'; import {useSafeAreaInsets} from 'react-native-safe-area-context'; import {styles} from '../styles/commonStyles';

export function MapScreen() { const insets = useSafeAreaInsets(); const [activeFilter, setActiveFilter] = useState('전체');

const filters = ['전체', '나눔물품', '제휴매장', '제로웨이스트'];

return (
    <View style={[styles.fullPage, {paddingTop: insets.top, paddingBottom: insets.bottom}]}> <View style={styles.mapHeader}> <Text style={styles.mapHeaderSub}>EcoBid</Text> <Text style={styles.mapHeaderTitle}>지도</Text>
      <View style={styles.mapSearchContainer}>
      <TextInput
        style={styles.mapSearchInput}
        placeholder=""
        placeholderTextColor="#9CA3AF"
      />
      <TouchableOpacity style={styles.mapSearchBtn}>
        <Text style={styles.mapSearchBtnText}>검색</Text>
      </TouchableOpacity>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.mapFilterRow}
      contentContainerStyle={{paddingRight: 16}}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter}
          onPress={() => setActiveFilter(filter)}
          style={[
            styles.mapChip,
            activeFilter === filter && styles.mapChipActive,
          ]}>
          <Text
            style={[
              styles.mapChipText,
              activeFilter === filter && styles.mapChipTextActive,
            ]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>

  <View style={{flex: 1, padding: 16, paddingTop: 0}}>
    <View style={styles.mapMain}>
      <Text style={styles.mapMainText}>지도</Text>
    </View>
  </View>
</View>
); }