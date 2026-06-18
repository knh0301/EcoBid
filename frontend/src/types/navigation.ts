// export type ScreenName =
//   | 'login'
//   | 'signup'
//   | 'home'
//   | 'mission'
//   | 'chatList'
//   | 'chatDetail'
//   | 'map'
//   | 'mypage'
//   | 'likedItems'
//   | 'sharedItems'
//   | 'creditHistory'
//   | 'productDetail'
//   | 'attendance'
//   | 'productRegister'
//   | 'productEdit';
// export type GoToScreen = (screen: ScreenName) => void;

import {NavigatorScreenParams} from '@react-navigation/native';

export type MainTabParamList = {
  HomeTab: undefined;
  MapTab: undefined;
  MissionTab: undefined;
  ChatTab: undefined;
  MyPageTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  PasswordReset: undefined;

  MainTabs: NavigatorScreenParams<MainTabParamList>;

  ChatDetail: undefined;
  ProductDetail: undefined;
  LikedItems: undefined;
  SharedItems: undefined;
  CreditHistory: undefined;
  Attendance: undefined;
  MissionVerify: {
    missionTitle: string;
    rewardPoints?: number;
  };
  MissionAdminReview: undefined;

  ProductRegister: undefined;
  ProductEdit: undefined;

  ProfileEdit: undefined;
  MySharedItems: undefined;
};
