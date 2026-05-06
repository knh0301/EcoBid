import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  const [isLoading, setIsLoading] = useState(false);

  // response 변화 감지 → 토큰 저장
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleToken(authentication?.accessToken);
    }
  }, [response]);

  const handleGoogleToken = async (accessToken?: string) => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      // 유저 정보 가져오기
      const userInfoRes = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const userInfo = await userInfoRes.json();

      // AsyncStorage에 저장
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

      // SQLite에 유저 저장 (기존 DB 로직 연결)
      // await saveUserToDB(userInfo);

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    await promptAsync();
  };

  // ...
}