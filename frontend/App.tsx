import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

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

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  ProductDetail: undefined;
  ChatDetail: undefined;
  LikedItems: undefined;
  SharedItems: undefined;
  CreditHistory: undefined;
};

type MainTabParamList = {
  HomeTab: undefined;
  MapTab: undefined;
  MissionTab: undefined;
  ChatTab: undefined;
  MyPageTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function useGoToScreen() {
  const navigation = useNavigation<any>();

  const go = (screen: ScreenName) => {
    switch (screen) {
      case 'login':
        navigation.navigate('Login');
        break;

      case 'signup':
        navigation.navigate('Signup');
        break;

      case 'home':
        navigation.navigate('MainTabs', {screen: 'HomeTab'});
        break;

      case 'map':
        navigation.navigate('MainTabs', {screen: 'MapTab'});
        break;

      case 'mission':
        navigation.navigate('MainTabs', {screen: 'MissionTab'});
        break;

      case 'chatList':
        navigation.navigate('MainTabs', {screen: 'ChatTab'});
        break;

      case 'mypage':
        navigation.navigate('MainTabs', {screen: 'MyPageTab'});
        break;

      case 'chatDetail':
        navigation.navigate('ChatDetail');
        break;

      case 'productDetail':
        navigation.navigate('ProductDetail');
        break;

      case 'likedItems':
        navigation.navigate('LikedItems');
        break;

      case 'sharedItems':
        navigation.navigate('SharedItems');
        break;

      case 'creditHistory':
        navigation.navigate('CreditHistory');
        break;

      default:
        navigation.navigate('MainTabs');
        break;
    }
  };

  return go;
}

function LoginWrapper() {
  const go = useGoToScreen();
  return <LoginScreen go={go} />;
}

function SignupWrapper() {
  const go = useGoToScreen();
  return <SignupScreen go={go} />;
}

function HomeWrapper() {
  const go = useGoToScreen();
  return <HomeScreen go={go} />;
}

function MapWrapper() {
  const go = useGoToScreen();
  return <MapScreen go={go} />;
}

function MissionWrapper() {
  const go = useGoToScreen();
  return <MissionScreen go={go} />;
}

function ChatListWrapper() {
  const go = useGoToScreen();
  return <ChatListScreen go={go} />;
}

function MyPageWrapper() {
  const go = useGoToScreen();
  return <MyPageScreen go={go} />;
}

function ProductDetailWrapper() {
  const go = useGoToScreen();
  return <ProductDetailScreen go={go} />;
}

function ChatDetailWrapper() {
  const go = useGoToScreen();
  return <ChatDetailScreen go={go} />;
}

function LikedItemsWrapper() {
  const go = useGoToScreen();
  return <LikedItemsScreen go={go} />;
}

function SharedItemsWrapper() {
  const go = useGoToScreen();
  return <SharedItemsScreen go={go} />;
}

function CreditHistoryWrapper() {
  const go = useGoToScreen();
  return <CreditHistoryScreen go={go} />;
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4E7B48',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeWrapper}
        options={{
          title: '홈',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>🏠</Text>
          ),
        }}
      />

      <Tab.Screen
        name="MapTab"
        component={MapWrapper}
        options={{
          title: '지도',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>🗺️</Text>
          ),
        }}
      />

      <Tab.Screen
        name="MissionTab"
        component={MissionWrapper}
        options={{
          title: '미션',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>🎯</Text>
          ),
        }}
      />

      <Tab.Screen
        name="ChatTab"
        component={ChatListWrapper}
        options={{
          title: '채팅',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>💬</Text>
          ),
        }}
      />

      <Tab.Screen
        name="MyPageTab"
        component={MyPageWrapper}
        options={{
          title: '마이페이지',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginWrapper} />
        <Stack.Screen name="Signup" component={SignupWrapper} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ProductDetail" component={ProductDetailWrapper} />
        <Stack.Screen name="ChatDetail" component={ChatDetailWrapper} />
        <Stack.Screen name="LikedItems" component={LikedItemsWrapper} />
        <Stack.Screen name="SharedItems" component={SharedItemsWrapper} />
        <Stack.Screen name="CreditHistory" component={CreditHistoryWrapper} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}