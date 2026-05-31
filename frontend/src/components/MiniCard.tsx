import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';

export function MiniCard({title}: {title: string}) {
  return (
    <View style={styles.miniCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.desc}>+10 크레딧</Text>
    </View>
  );
}
