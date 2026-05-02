import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../styles/commonStyles';

export function SimpleListPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.fullPage}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'}</Text>
        </Pressable>

        <Text style={styles.appTitle}>{title}</Text>

        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.bgTitle}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.grid}>
          {['빈티지 조명', '흰색 블라우스', '책상 스탠드'].map(item => (
            <Pressable
              key={item}
              style={styles.itemCard}
              onPress={() => navigation.navigate('ProductDetail')}>
              <View style={styles.itemImage} />

              <Text style={styles.itemTitle}>{item}</Text>
              <Text style={styles.itemPrice}>2500 크레딧</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}