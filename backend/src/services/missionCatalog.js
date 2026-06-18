const MISSION_CATALOG = [
  {
    id: 'tumbler',
    title: '텀블러 사용하기',
    description: '일회용 컵 대신 텀블러를 사용하고 인증해보세요.',
    rewardPoints: 10,
    verificationCriteria:
      '사진에 텀블러, 개인컵, 재사용 가능한 물병이 하나라도 보이면 유효합니다. 사용 중인 장면이 아니어도 텀블러 자체가 식별되면 충분합니다. 일회용 컵만 보이면 관리자 검토가 필요합니다.',
  },
  {
    id: 'recycle',
    title: '분리수거 하기',
    description: '페트병 라벨 제거, 캔 압축 등 올바른 분리수거를 실천해요.',
    rewardPoints: 10,
    verificationCriteria:
      '사진에 페트병 라벨 제거, 찌그러뜨린 캔, 재활용품, 분리수거함, 분리 배출된 쓰레기 중 하나라도 보이면 유효합니다. 완벽한 분리수거 장면이 아니어도 관련 단서가 있으면 충분합니다.',
  },
  {
    id: 'container',
    title: '다회용기 사용하여 음식 포장하기',
    description: '일회용 포장재 대신 다회용기를 사용해보세요.',
    rewardPoints: 10,
    verificationCriteria:
      '사진에 다회용기, 도시락통, 밀폐용기, 재사용 가능한 음식 용기가 하나라도 보이면 유효합니다. 음식이 담겨 있지 않아도 다회용기 자체가 식별되면 충분합니다. 일회용 포장재만 보이면 관리자 검토가 필요합니다.',
  },
  {
    id: 'no-leftovers',
    title: '음식 남기지 않기',
    description: '음식물 쓰레기를 줄인 하루를 인증해보세요.',
    rewardPoints: 10,
    verificationCriteria:
      '사진에 식사 후 비어 있거나 음식이 거의 남지 않은 접시, 그릇, 식판이 명확히 보이면 유효합니다. 전후 비교 사진이나 먹기 전 사진은 요구하지 않습니다. 빈 그릇, 빈 접시, 깨끗하게 먹은 식판은 이 미션을 충족하는 충분한 증거입니다.',
  },
  {
    id: 'public-transport',
    title: '대중교통 이용하기',
    description: '자가용 대신 대중교통을 이용하고 탄소 배출을 줄여요.',
    rewardPoints: 10,
    verificationCriteria:
      '사진에 버스, 지하철, 전철, 열차, 대중교통 내부, 승차권, 교통카드 화면, 역, 정류장 중 하나라도 보이면 유효합니다. 실제 탑승 중 사진이 아니어도 대중교통 이용 정황이면 충분합니다.',
  },
  {
    id: 'reuse-paper',
    title: '이면지 활용하기',
    description: '새 종이 대신 이면지를 활용한 순간을 인증해보세요.',
    rewardPoints: 10,
    verificationCriteria:
      '사진에 이면지, 뒷면을 활용한 종이, 종이 위 낙서/필기/메모/연습 흔적이 보이면 유효합니다. 종이에 낙서나 필기가 있는 사진만으로도 충분합니다.',
  },
  {
    id: 'walking',
    title: '10,000보 걷기',
    description: '가까운 거리는 걷고 건강한 하루를 만들어보세요.',
    rewardPoints: 10,
    verificationCriteria:
      '사진이나 캡처에 아이폰 건강 앱, 만보기 앱, 스마트워치, 피트니스 앱 등 걸음 수 화면이 보이고 10,000보 이상으로 읽히면 유효합니다. 숫자가 10000 이상이면 충분합니다.',
  },
  {
    id: 'refill',
    title: '리필 제품 구매하기',
    description: '리필 제품으로 포장 쓰레기를 줄여보세요.',
    rewardPoints: 10,
    verificationCriteria:
      '사진에 리필 제품, 리필 스테이션, refill 표기, 리필용 파우치, 재충전 가능한 제품 중 하나라도 보이면 유효합니다.',
  },
  {
    id: 'power-strip',
    title: '안쓰는 멀티탭 뽑기',
    description: '사용하지 않는 전원을 끄고 대기전력을 아껴요.',
    rewardPoints: 10,
    verificationCriteria:
      '사진에 전원 플러그가 콘센트나 멀티탭에서 뽑혀 있거나, 멀티탭 스위치가 꺼져 있는 모습이 보이면 유효합니다. 뽑힌 플러그만 식별되어도 충분합니다.',
  },
];

const SPECIAL_MISSION_CATALOG = [
  {
    id: 'friend-invite',
    title: '친구 초대하기',
    description: '친구에게 EcoBid를 공유하고 함께 친환경 나눔을 시작해요.',
    rewardPoints: 200,
  },
  {
    id: 'ad-view',
    title: '광고 보기',
    description: '짧은 광고를 시청하고 EcoBid 운영을 함께 응원해주세요.',
    rewardPoints: 20,
  },
];

const normalizeTitle = title => String(title || '').trim();

const getMissionCatalog = () => [...MISSION_CATALOG];

const getAllMissionCatalog = () => [
  ...MISSION_CATALOG,
  ...SPECIAL_MISSION_CATALOG,
];

const findMissionCatalogItemByTitle = title => {
  const normalizedTitle = normalizeTitle(title);

  return getAllMissionCatalog().find(item => item.title === normalizedTitle) || null;
};

module.exports = {
  getMissionCatalog,
  getAllMissionCatalog,
  findMissionCatalogItemByTitle,
};
