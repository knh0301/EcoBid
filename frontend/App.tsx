import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {RootStackParamList, MainTabParamList} from './src/types/navigation';

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

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

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
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>🏠</Text>
          ),
        }}
      />

      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          title: '지도',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>🗺️</Text>
          ),
        }}
      />

      <Tab.Screen
        name="MissionTab"
        component={MissionScreen}
        options={{
          title: '미션',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>🎯</Text>
          ),
        }}
      />

      <Tab.Screen
        name="ChatTab"
        component={ChatListScreen}
        options={{
          title: '채팅',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 20, color}}>💬</Text>
          ),
        }}
      />

      <Tab.Screen
        name="MyPageTab"
        component={MyPageScreen}
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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />

        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        <Stack.Screen name="LikedItems" component={LikedItemsScreen} />
        <Stack.Screen name="SharedItems" component={SharedItemsScreen} />
        <Stack.Screen name="CreditHistory" component={CreditHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}