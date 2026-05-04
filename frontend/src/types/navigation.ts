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
  | 'productDetail'
  | 'attendance'
  | 'productRegister'
  | 'productEdit';
export type GoToScreen = (screen: ScreenName) => void;