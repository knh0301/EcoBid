const MISSION_CATALOG = [
  {
    id: 'tumbler',
    title: '텀블러 사용하기',
    description: '일회용 컵 대신 텀블러를 사용하고 인증해보세요.',
    rewardPoints: 50,
  },
  {
    id: 'recycle',
    title: '분리수거 하기',
    description: '페트병 라벨 제거, 캔 압축 등 올바른 분리수거를 실천해요.',
    rewardPoints: 50,
  },
  {
    id: 'container',
    title: '내 용기 이용하여 음식 포장하기',
    description: '일회용 포장재 대신 개인 용기를 사용해보세요.',
    rewardPoints: 50,
  },
  {
    id: 'no-leftovers',
    title: '음식 남기지 않기',
    description: '음식물 쓰레기를 줄인 하루를 인증해보세요.',
    rewardPoints: 50,
  },
  {
    id: 'public-transport',
    title: '대중교통 이용하기',
    description: '자가용 대신 대중교통을 이용하고 탄소 배출을 줄여요.',
    rewardPoints: 50,
  },
  {
    id: 'reuse-paper',
    title: '이면지 활용하기',
    description: '새 종이 대신 이면지를 활용한 순간을 인증해보세요.',
    rewardPoints: 50,
  },
  {
    id: 'walking',
    title: '10,000보 걷기',
    description: '가까운 거리는 걷고 건강한 하루를 만들어보세요.',
    rewardPoints: 50,
  },
  {
    id: 'refill',
    title: '리필 제품 구매하기',
    description: '리필 제품으로 포장 쓰레기를 줄여보세요.',
    rewardPoints: 50,
  },
  {
    id: 'power-strip',
    title: '안쓰는 멀티탭 뽑기',
    description: '사용하지 않는 전원을 끄고 대기전력을 아껴요.',
    rewardPoints: 50,
  },
];

const SPECIAL_MISSION_CATALOG = [
  {
    id: 'friend-invite',
    title: '친구 초대하기',
    description: '친구에게 EcoBid를 공유하고 함께 친환경 나눔을 시작해요.',
    rewardPoints: 2000,
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
