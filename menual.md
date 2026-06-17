# EcoBid 환경변수 및 테스트 가이드

## 1. 환경변수 파일 역할 및 구조

이제 환경변수 파일을 직접 주석 처리하거나 이름을 변경하지 않고, 실행 명령어를 통해 로컬(local) 테스트와 Staging 테스트 환경을 선택하여 구동할 수 있습니다.

```text
frontend/
├─ env/
│  ├─ local.env          # 개인 로컬 테스트용 환경변수 (GitHub 업로드 제외)
│  ├─ local.env.example  # 로컬 테스트용 템플릿 예시 (GitHub 업로드 가능)
│  ├─ staging.env        # 공통 Staging 서버 환경변수 (GitHub 업로드 제외)
│  └─ staging.env.example# Staging 서버 템플릿 예시 (GitHub 업로드 가능)
├─ package.json          # 실행 스크립트 설정
└─ src/
```

| 파일                               | 용도                              | GitHub 업로드 여부            |
| ---------------------------------- | --------------------------------- | ----------------------------- |
| `frontend/env/local.env`           | 개인 로컬 API 서버 연동 주소      | ❌ 업로드 차단 (`.gitignore`) |
| `frontend/env/local.env.example`   | 로컬 환경 구성용 가이드 템플릿    | ✅ 업로드 가능                |
| `frontend/env/staging.env`         | 공통 Staging API 서버 연동 주소   | ❌ 업로드 차단 (`.gitignore`) |
| `frontend/env/staging.env.example` | Staging 환경 구성용 가이드 템플릿 | ✅ 업로드 가능                |

---

## 2. 처음 개발 환경 세팅 방법 (최초 1회)

팀원들은 프로젝트를 클론받은 후, `frontend/env` 폴더 내부의 예시 파일들을 복사하여 실제 환경변수 파일을 생성해야 합니다.

### 1) 로컬 테스트용 설정 생성

`frontend/env/local.env.example` 파일을 복사하여 `frontend/env/local.env` 파일을 만듭니다.

```powershell
cd frontend
cp env/local.env.example env/local.env
```

이후 생성된 `env/local.env` 파일에서 본인의 테스트 환경에 맞춰 주석을 해제하거나 IP를 입력합니다.

```env
# 예: 실제 폰 Expo Go 테스트를 위해 PC의 IPv4 주소를 입력하는 경우
EXPO_PUBLIC_API_BASE_URL=http://172.29.50.224:3000/api
```

> **PC IP 확인 방법 (Windows):** PowerShell 또는 CMD에서 `ipconfig` 명령을 실행해 `IPv4 Address`를 확인하세요.

### 2) Staging 테스트용 설정 생성

`frontend/env/staging.env.example` 파일을 복사하여 `frontend/env/staging.env` 파일을 만듭니다.

```powershell
cp env/staging.env.example env/staging.env
```

기본적으로 Staging 주소(`https://ecobid-staging.onrender.com/api`)가 입력되어 있으므로 복사만으로 바로 사용 가능합니다.

---

## 3. 실행 및 테스트 명령어

기존의 `npx expo start` 방식 대신, 다음 스크립트 명령어를 사용해 실행합니다.

### 🚀 로컬 API 서버와 연동하여 테스트할 때 (개발 중)

본인 PC의 로컬 백엔드 서버(`localhost` 또는 에뮬레이터 IP)와 연동하여 개발 및 테스트를 수행합니다.

```powershell
cd frontend
npm run start:local
```

### 🌐 공통 Staging 서버와 연동하여 테스트할 때 (PR 제출 전 필수)

모든 팀원이 공통으로 바라보는 Render Cloud Staging 서버와 연동하여 최종 동작을 검증합니다.

```powershell
cd frontend
npm run start:staging
```

---

## 4. 백엔드 실행 방법 (로컬)

로컬 테스트 시 백엔드는 아래 명령어로 기동합니다.

```powershell
cd backend
npm run dev
```

---

## 5. PR 전 체크리스트

풀 리퀘스트(PR)를 작성하여 올리기 전에는 아래 항목을 완벽히 준수해 주세요.

1. **`npm run start:staging`으로 최종 동작을 테스트**했는가?
2. 회원가입 / 로그인 / 상품 등록 / 지도 목록 / 실시간 채팅 등 핵심 기능이 Staging API와 문제없이 연동되는가?
3. 개인 설정 파일(`local.env`, `staging.env`)이 커밋에 포함되지 않았는가?
