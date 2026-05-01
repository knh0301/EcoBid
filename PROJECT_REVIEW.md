# EcoBid 프로젝트 리뷰

> 현재 프로젝트 상태를 분석하고, 앞으로 개선할 방향을 정리한 문서입니다.

---

## 1. 현재 프로젝트 구조

```
EcoBid/
├── frontend/                      # React Native (TypeScript)
│   ├── App.tsx                    # 진입점 + 수동 네비게이션
│   ├── src/
│   │   ├── screens/              # 12개 화면
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── MissionScreen.tsx
│   │   │   ├── MapScreen.tsx
│   │   │   ├── ChatListScreen.tsx
│   │   │   ├── ChatDetailScreen.tsx
│   │   │   ├── MyPageScreen.tsx
│   │   │   ├── LikedItemsScreen.tsx
│   │   │   ├── SharedItemsScreen.tsx
│   │   │   ├── CreditHistoryScreen.tsx
│   │   │   └── ProductDetailScreen.tsx
│   │   ├── components/           # 재사용 컴포넌트
│   │   │   ├── AppLayout.tsx     # 하단 네비 포함 레이아웃
│   │   │   ├── Buttons.tsx       # PrimaryButton, OutlineButton, SocialButton
│   │   │   ├── Input.tsx         # 텍스트 입력 필드
│   │   │   ├── Message.tsx       # 채팅 말풍선
│   │   │   ├── MiniCard.tsx      # 미션 카드
│   │   │   ├── MissionItem.tsx   # 미션 리스트 아이템
│   │   │   └── SimpleListPage.tsx # 리스트 페이지 템플릿
│   │   ├── styles/
│   │   │   └── commonStyles.ts   # 중앙 스타일 (590줄)
│   │   └── types/
│   │       └── navigation.ts     # 화면 이름 타입 정의
│   └── package.json
└── backend/                       # 빈 상태 (README만 존재)
    └── README.md
```

### 기술 스택

| 영역 | 현재 사용 중 | 비고 |
|------|-------------|------|
| 프론트엔드 | React Native 0.85 + TypeScript | UI 프로토타입 완성 |
| 네비게이션 | useState 수동 전환 | React Navigation 전환 필요 |
| 상태관리 | 없음 | Context/Zustand 등 도입 필요 |
| 백엔드 | 없음 | 처음부터 구축 필요 |
| DB | 없음 | 설계부터 필요 |

---

## 2. 현재 구현 상태

### 잘 된 부분

- TypeScript 사용으로 타입 안전성 확보
- 컴포넌트 분리가 잘 되어 있음 (screens / components / styles / types)
- 중앙 스타일 시스템 (commonStyles.ts)으로 일관된 디자인
- 재사용 컴포넌트 (AppLayout, SimpleListPage, Buttons 등)
- 한국어 UI/UX 용어 통일

### 구현된 것 vs 아직 안 된 것

| 기능 | UI 구현 | 실제 동작 | 상태 |
|------|---------|-----------|------|
| 로그인/회원가입 | O | X | 폼만 있고 인증 없음 |
| 홈 대시보드 | O | X | 하드코딩 데이터 |
| 출석 도장 | O | X | 버튼만 있고 저장 안됨 |
| 미션 목록 | O | X | 3개 고정 미션, 인증 불가 |
| 상품 상세 | O | X | 고정 데이터 1개 |
| 지도 | △ | X | 초록색 박스 placeholder |
| 채팅 목록/상세 | O | X | 하드코딩 3개 대화 |
| 마이페이지 | O | X | 고정 프로필 |
| 찜/나눔 목록 | O | X | SimpleListPage로 표시만 |
| 크레딧 내역 | △ | X | 캘린더 placeholder |
| 소셜 로그인 | △ | X | 버튼만, 핸들러 없음 |

**요약: UI는 거의 완성, 백엔드 연동과 실제 로직이 전부 빠져있음**

---

## 3. 고쳐야 할 것들

### 3-1. 네비게이션 구조 (중요도: 높음)

#### 현재: useState로 수동 전환
```tsx
// App.tsx - 현재 코드
const [screen, setScreen] = useState<ScreenName>('login');

// 화면 전환
if (screen === 'login') return <LoginScreen go={go} />;
if (screen === 'home') return <HomeScreen go={go} />;
// ... 12개 if문
```

#### 문제점
- 화면이 늘어날수록 if문이 계속 증가
- 뒤로가기(Android 하드웨어 버튼) 처리 불가
- 화면 전환 애니메이션 없음
- 딥링크, 탭 네비게이션 불가

#### 개선: React Navigation 도입
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
```

```tsx
// 구조 예시
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
  </Stack.Navigator>
</NavigationContainer>

// MainTabs (하단 탭)
<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Map" component={MapScreen} />
  <Tab.Screen name="Mission" component={MissionScreen} />
  <Tab.Screen name="Chat" component={ChatListScreen} />
  <Tab.Screen name="MyPage" component={MyPageScreen} />
</Tab.Navigator>
```

---

### 3-2. 백엔드 구축 (중요도: 높음)

현재 백엔드가 완전히 비어있습니다. 최소한 필요한 API:

```
# 인증
POST   /api/auth/signup        회원가입
POST   /api/auth/login         로그인
GET    /api/auth/me            내 정보 조회 (토큰 검증)

# 상품
GET    /api/products           상품 목록 (페이징, 필터)
GET    /api/products/:id       상품 상세
POST   /api/products           상품 등록
PUT    /api/products/:id       상품 수정
DELETE /api/products/:id       상품 삭제

# 미션
GET    /api/missions           미션 목록
POST   /api/missions/:id/submit  미션 인증 제출

# 출석
POST   /api/attendance         출석 체크
GET    /api/attendance/monthly  월별 출석 기록

# 크레딧
GET    /api/credits            크레딧 내역

# 채팅
GET    /api/chats              채팅방 목록
GET    /api/chats/:id/messages 메시지 목록
POST   /api/chats/:id/messages 메시지 전송
```

#### 필요한 DB 모델
```
User         유저 (이메일, 비밀번호 해시, 닉네임, 학과, 레벨)
Product      상품 (제목, 가격, 설명, 이미지URL, 카테고리, 위치, 작성자ID)
Mission      미션 (제목, 설명, 보상 크레딧, 인증 방식)
MissionSubmit 미션 인증 (유저ID, 미션ID, 인증사진URL, 상태)
Attendance   출석 (유저ID, 날짜, 보상 크레딧)
Credit       크레딧 내역 (유저ID, 금액, 사유, 날짜)
Like         찜 (유저ID, 상품ID)
ChatRoom     채팅방 (상품ID, 참여자들)
Message      메시지 (채팅방ID, 보낸사람ID, 내용, 시각)
```

---

### 3-3. 상태관리 도입 (중요도: 중간)

현재 데이터가 전부 하드코딩이라 상태관리가 없습니다. API 연동 시 필요합니다.

#### 추천: React Context + useReducer (간단한 경우)
```tsx
// 예시: AuthContext
const AuthContext = createContext<AuthState>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => { /* API 호출 */ };
  const logout = () => { /* 토큰 삭제 */ };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### 또는: Zustand (더 간결)
```tsx
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: async (email, pw) => { /* ... */ },
  logout: () => set({ user: null, token: null }),
}));
```

---

### 3-4. 지도 연동 (중요도: 중간)

현재 MapScreen은 초록색 박스 placeholder입니다.

```bash
npm install react-native-maps
```

```tsx
import MapView, { Marker } from 'react-native-maps';

<MapView
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 37.4505, // 인하대 좌표
    longitude: 126.6575,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
>
  {products.map(item => (
    <Marker key={item.id} coordinate={{ latitude: item.lat, longitude: item.lng }} />
  ))}
</MapView>
```

---

### 3-5. 라이브러리 부족 (중요도: 중간)

현재 거의 라이브러리가 없습니다. 필요한 것들:

| 용도 | 라이브러리 | 설명 |
|------|-----------|------|
| 네비게이션 | `@react-navigation/native` | 화면 전환 |
| 지도 | `react-native-maps` | 구글/애플 지도 |
| HTTP 요청 | `axios` | API 호출 |
| 이미지 선택 | `react-native-image-picker` | 미션 인증 사진 |
| 토큰 저장 | `@react-native-async-storage/async-storage` | 로그인 유지 |
| 폼 검증 | `react-hook-form` + `zod` | 입력값 검증 |
| 실시간 채팅 | `socket.io-client` | WebSocket 채팅 |

---

## 4. 우선순위 로드맵

### Phase 1: 기반 잡기
1. React Navigation 도입 (Stack + Bottom Tabs)
2. 백엔드 프로젝트 세팅 (Express + Sequelize + SQLite)
3. User 모델 + 회원가입/로그인 API (JWT)
4. 프론트에서 API 호출 구조 세팅 (axios + AsyncStorage)

### Phase 2: 핵심 기능 연동
5. 상품 CRUD API + 프론트 연동
6. 출석 API + 프론트 연동
7. 크레딧 API + 프론트 연동
8. 미션 API + 사진 업로드

### Phase 3: 부가 기능
9. 지도 연동 (react-native-maps)
10. 채팅 (Socket.io)
11. 찜하기 기능
12. 검색/필터

### Phase 4: 마무리
13. 에러 핸들링 + 로딩 상태
14. 푸시 알림
15. 테스트 작성
16. 배포 준비

---

## 5. 현재 코드에서 참고할 점 (잘 한 부분)

| 항목 | 설명 |
|------|------|
| 컴포넌트 분리 | screens/components/styles/types 구조가 깔끔함 |
| TypeScript | 타입 정의가 되어 있어 확장하기 좋음 |
| 중앙 스타일 | commonStyles.ts 하나로 디자인 일관성 유지 |
| 재사용 패턴 | AppLayout, SimpleListPage 등 템플릿 컴포넌트 활용 |
| 디자인 완성도 | 색상(#16a34a), 간격, 카드 UI 등 일관됨 |

이 구조를 유지하면서 백엔드 연동과 네비게이션만 추가하면 됩니다.

---

> 이 문서는 AI(Claude Code)로 프로젝트를 분석하여 작성되었습니다.
