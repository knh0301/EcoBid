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
  MainTabs: NavigatorScreenParams<MainTabParamList>;

  ProductDetail: undefined;
  ChatDetail: undefined;
  LikedItems: undefined;
  SharedItems: undefined;
  CreditHistory: undefined;
};