import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {GoToScreen} from '../types/navigation';

type ActiveTab = 'home' | 'map' | 'mission' | 'chat' | 'mypage';

export function AppLayout({
  children,
}: {
  children: React.ReactNode;
  active?: ActiveTab;
  go?: GoToScreen;
}) {
  return (
    <View style={styles.fullPage}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>EcoBid</Text>
      </View>

      <View style={styles.mainArea}>{children}</View>
    </View>
  );
}