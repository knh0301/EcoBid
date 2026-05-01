import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';

export function MissionItem({title, credit}: {title: string; credit: string}) {
  return (
    <View style={styles.missionItem}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.desc}>인증 후 크레딧을 받을 수 있어요.</Text>
      </View>
      <Text style={styles.creditSmall}>{credit}</Text>
    </View>
  );
}