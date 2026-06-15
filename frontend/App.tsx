import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';
import {ActivityIndicator, View} from 'react-native';

import {HomeScreen} from './src/screens/HomeScreen';
import {MapScreen} from './src/screens/MapScreen';
import {MissionScreen} from './src/screens/MissionScreen';
import {ChatListScreen} from './src/screens/ChatListScreen';
import {MyPageScreen} from './src/screens/MyPageScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {SignupScreen} from './src/screens/SignupScreen';
import {PasswordResetScreen} from './src/screens/PasswordResetScreen';
import {ChatDetailScreen} from './src/screens/ChatDetailScreen';
import {AttendanceScreen} from './src/screens/AttendanceScreen';
import {ProductRegisterScreen} from './src/screens/ProductRegisterScreen';
import {ProductDetailScreen} from './src/screens/ProductDetailScreen';
import {SharedItemsScreen} from './src/screens/SharedItemsScreen';
import {LikedItemsScreen} from './src/screens/LikedItemsScreen';
import {CreditHistoryScreen} from './src/screens/CreditHistoryScreen';
import {MissionVerifyScreen} from './src/screens/MissionVerifyScreen';
import {ProfileEditScreen} from './src/screens/ProfileEditScreen';
import {MySharedItemsScreen} from './src/screens/MySharedItemsScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAuth} from './src/context/AuthContext';
import {ChatRoom, getChatSocket} from './src/api/chatSocket';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    let isActive = true;
    let activeSocket: Awaited<ReturnType<typeof getChatSocket>> | null = null;

    const handleRoomsUpdate = (rooms: ChatRoom[]) => {
      if (!isActive) {
        return;
      }

      const nextUnreadCount = rooms.reduce(
        (total, room) => total + (room.unreadCount || (room.hasUnread ? 1 : 0)),
        0,
      );

      setUnreadChatCount(nextUnreadCount);
    };

    getChatSocket()
      .then(socket => {
        if (!isActive) {
          return;
        }

        if (!socket) {
          setUnreadChatCount(0);
          return;
        }

        activeSocket = socket;
        socket.on('chat:rooms:update', handleRoomsUpdate);
        socket.emit('chat:rooms', handleRoomsUpdate);
      })
      .catch(error => {
        console.warn('Chat unread badge connection error:', error);
      });

    return () => {
      isActive = false;
      activeSocket?.off('chat:rooms:update', handleRoomsUpdate);
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Mission') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5C8B5A',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel: '홈'}} />
      <Tab.Screen name="Map" component={MapScreen} options={{tabBarLabel: '지도'}} />
      <Tab.Screen name="Mission" component={MissionScreen} options={{tabBarLabel: '에코'}} />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          tabBarLabel: '채팅',
          tabBarBadge: unreadChatCount > 0 ? unreadChatCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#E85D4F',
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: '800',
          },
        }}
      />
      <Tab.Screen name="Profile" component={MyPageScreen} options={{tabBarLabel: '마이'}} />
    </Tab.Navigator>
  );
}

export default function App(): React.JSX.Element {
  const {isLoggedIn, isLoading} = useAuth();

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
          }}>
          <ActivityIndicator size="large" color="#5C8B5A" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
   <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
            <Stack.Screen name="Attendance" component={AttendanceScreen} />
            <Stack.Screen name="ProductRegister" component={ProductRegisterScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="SharedItems" component={SharedItemsScreen} />
            <Stack.Screen name="LikedItems" component={LikedItemsScreen} />
            <Stack.Screen name="CreditHistory" component={CreditHistoryScreen} />
            <Stack.Screen name="MissionVerify" component={MissionVerifyScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen name="MySharedItems" component={MySharedItemsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
   </SafeAreaProvider>
  );
}
