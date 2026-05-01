export type ScreenName =
  | 'login'
  | 'signup'
  | 'home'
  | 'mission'
  | 'chatList'
  | 'chatDetail'
  | 'map'
  | 'mypage'
  | 'likedItems'
  | 'sharedItems'
  | 'creditHistory'
  | 'productDetail';

export type GoToScreen = (screen: ScreenName) => void;