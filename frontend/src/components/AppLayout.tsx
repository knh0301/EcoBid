import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';

export function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <View style={styles.fullPage}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>EcoBid</Text>
      </View>

      <View style={styles.mainArea}>{children}</View>
    </View>
  );
}