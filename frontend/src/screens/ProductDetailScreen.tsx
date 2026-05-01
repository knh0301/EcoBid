import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {GoToScreen} from '../types/navigation';

export function ProductDetailScreen({go}: {go: GoToScreen}) {
  return (
    <View style={styles.fullPage}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => go('home')}>
          <Text style={styles.backText}>{'<'}</Text>
        </Pressable>
        <Text style={styles.appTitle}>상세 정보</Text>
        <Text>🔗</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.gallery}>
          <Text style={styles.galleryText}>사진 1</Text>
        </View>

        <Text style={styles.bgTitle}>빈티지 조명</Text>
        <Text style={styles.creditText}>2500 크레딧</Text>

        <View style={styles.sellerCard}>
          <View style={styles.avatar} />
          <View style={{flex: 1}}>
            <Text style={styles.sectionTitle}>김나현</Text>
            <Text style={styles.desc}>레벨 5 · 거리 계산중...</Text>
          </View>
          <Text style={styles.tempText}>42.5℃</Text>
        </View>

        <Text style={styles.desc}>
          물품 상세 설명이 이곳에 표시됩니다. 실제 데이터는 나중에 서버나 상태값으로 연결하면 됩니다.
        </Text>
      </ScrollView>

      <View style={styles.fixedBottom}>
        <Pressable style={styles.heartBtn}>
          <Text style={styles.heartText}>♡</Text>
        </Pressable>
        <Pressable style={styles.chatActionBtn} onPress={() => go('chatDetail')}>
          <Text style={styles.primaryBtnText}>채팅하기</Text>
        </Pressable>
      </View>
    </View>
  );
}