import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {GoToScreen} from '../types/navigation';

type ActiveTab = 'home' | 'map' | 'mission' | 'chat' | 'mypage';

export function AppLayout({
  children,
  active,
  go,
}: {
  children: React.ReactNode;
  active: ActiveTab;
  go: GoToScreen;
}) {
  return (
    <View style={styles.fullPage}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>EcoBid</Text>
      </View>

      <View style={styles.mainArea}>{children}</View>

      <View style={styles.bottomNav}>
        <NavItem label="홈" active={active === 'home'} onPress={() => go('home')} />
        <NavItem label="지도" active={active === 'map'} onPress={() => go('map')} />
        <NavItem label="미션" active={active === 'mission'} onPress={() => go('mission')} />
        <NavItem label="채팅" active={active === 'chat'} onPress={() => go('chatList')} />
        <NavItem label="내정보" active={active === 'mypage'} onPress={() => go('mypage')} />
      </View>
    </View>
  );
}

function NavItem({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.navItem}>
      <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
    </Pressable>
  );
}