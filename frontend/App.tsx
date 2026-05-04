import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';

import {styles} from './src/styles/commonStyles';
import {ScreenName} from './src/types/navigation';

import {LoginScreen} from './src/screens/LoginScreen';
import {SignupScreen} from './src/screens/SignupScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {MissionScreen} from './src/screens/MissionScreen';
import {ChatListScreen} from './src/screens/ChatListScreen';
import {ChatDetailScreen} from './src/screens/ChatDetailScreen';
import {MapScreen} from './src/screens/MapScreen';
import {MyPageScreen} from './src/screens/MyPageScreen';
import {LikedItemsScreen} from './src/screens/LikedItemsScreen';
import {SharedItemsScreen} from './src/screens/SharedItemsScreen';
import {CreditHistoryScreen} from './src/screens/CreditHistoryScreen';
import {ProductDetailScreen} from './src/screens/ProductDetailScreen';
import {AttendanceScreen} from './src/screens/AttendanceScreen';
import {ProductRegisterScreen} from './src/screens/ProductRegisterScreen';

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<ScreenName>('login');

  const go = (nextScreen: ScreenName) => {
    setScreen(nextScreen);
  };

  return (
    <SafeAreaView style={styles.root}>
      {screen === 'login' && <LoginScreen go={go} />}
      {screen === 'signup' && <SignupScreen go={go} />}
      {screen === 'home' && <HomeScreen go={go} />}
      {screen === 'mission' && <MissionScreen go={go} />}
      {screen === 'chatList' && <ChatListScreen go={go} />}
      {screen === 'chatDetail' && <ChatDetailScreen go={go} />}
      {screen === 'map' && <MapScreen go={go} />}
      {screen === 'mypage' && <MyPageScreen go={go} />}
      {screen === 'likedItems' && <LikedItemsScreen go={go} />}
      {screen === 'sharedItems' && <SharedItemsScreen go={go} />}
      {screen === 'creditHistory' && <CreditHistoryScreen go={go} />}
      {screen === 'productDetail' && <ProductDetailScreen go={go} />}
      {screen === 'attendance' && <AttendanceScreen go={go} />}
      {screen === 'productRegister' && <ProductRegisterScreen go={go} isEditMode={false} />}
      {screen === 'productEdit' && <ProductRegisterScreen go={go} isEditMode={true} />}
    </SafeAreaView>
  );
}