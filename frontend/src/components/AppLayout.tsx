import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from '../styles/commonStyles';

export function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <SafeAreaView style={styles.fullPage} edges={['top']}>
      <View style={styles.appHeader}>
        <Text style={styles.headerTitle}>EcoBid</Text>
      </View>

      <View style={styles.mainArea}>{children}</View>
    </SafeAreaView>
  );
}