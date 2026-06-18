const DEFAULT_AUTO_APPROVE_CONFIDENCE = 0.85;

const missionVerificationJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    isValid: {
      type: 'boolean',
      description: '사진과 설명이 미션 조건을 충족하면 true',
    },
    confidence: {
      type: 'number',
      description: '판정 확신도. 0 이상 1 이하',
    },
    reason: {
      type: 'string',
      description: '판정 이유를 한국어 한 문장으로 설명',
    },
    evidence: {
      type: 'array',
      items: { type: 'string' },
      description: '사진에서 확인한 핵심 단서',
    },
  },
  required: ['isValid', 'confidence', 'reason', 'evidence'],
  propertyOrdering: ['isValid', 'confidence', 'reason', 'evidence'],
};

const getAutoApproveConfidence = () => {
  const confidence = Number(process.env.AI_MISSION_AUTO_APPROVE_CONFIDENCE);

  return Number.isFinite(confidence) && confidence > 0 && confidence <= 1
    ? confidence
    : DEFAULT_AUTO_APPROVE_CONFIDENCE;
};

const getGeminiMissionModels = () => {
  const primaryModel =
    process.env.GEMINI_MISSION_VERIFICATION_MODEL ||
    process.env.GEMINI_PRODUCT_DRAFT_MODEL ||
    'gemini-2.5-flash-lite';
  const fallbackModels = (
    process.env.GEMINI_MISSION_VERIFICATION_FALLBACK_MODELS ||
    process.env.GEMINI_PRODUCT_DRAFT_FALLBACK_MODELS ||
    'gemini-3.1-flash-lite,gemini-flash-lite-latest'
  )
    .split(',')
    .map(model => model.trim())
    .filter(Boolean);

  return [primaryModel, ...fallbackModels].filter(
    (model, index, models) => models.indexOf(model) === index,
  );
};

const readConfiguredEnv = value => {
  const trimmedValue = String(value || '').trim();

  return trimmedValue && !trimmedValue.toLowerCase().startsWith('your_')
    ? trimmedValue
    : '';
};

const getMissionVerificationPrompt = ({
  missionTitle,
  missionDescription,
  verificationCriteria,
  content,
}) =>
  [
    '너는 EcoBid 친환경 미션 사진 인증 심사 도우미야.',
    '사용자 사진과 활동 설명이 지정된 미션 조건을 충족하는지 판단해.',
    '검증 기준에 적힌 긍정 증거가 사진에 하나라도 명확히 보이면 isValid를 true로 판단해.',
    '완벽한 인증 사진을 요구하지 말고, 미션 대상이나 핵심 단서가 식별되면 통과시켜.',
    '검증 기준이 결과 사진만 요구한다면 전후 비교 사진이나 추가 증거를 요구하지 마.',
    '사진이 전혀 무관하거나, 너무 흐리거나, 핵심 대상을 식별할 수 없을 때만 isValid를 false로 판단해.',
    '',
    `미션명: ${missionTitle}`,
    `미션 설명: ${missionDescription || '없음'}`,
    `검증 기준: ${verificationCriteria || '사진과 설명이 미션 수행을 명확히 보여야 함'}`,
    `사용자 활동 설명: ${content}`,
  ].join('\n');

const includesAny = (value, keywords) => {
  const text = String(value || '').toLowerCase();

  return keywords.some(keyword => text.includes(keyword));
};

const extractNumbers = value =>
  String(value || '')
    .replace(/,/g, '')
    .match(/\d+/g)
    ?.map(number => Number(number))
    .filter(number => Number.isFinite(number)) || [];

const missionPositiveRules = {
  '텀블러 사용하기': {
    keywords: [
      '텀블러',
      '개인컵',
      '개인 컵',
      '재사용 가능한 물병',
      '물병',
      '보온병',
      'travel mug',
      'tumbler',
      'reusable bottle',
    ],
    reason: '사진에서 텀블러 또는 재사용 가능한 컵/물병이 확인되어 미션 조건을 충족합니다.',
  },
  '분리수거 하기': {
    keywords: [
      '분리수거',
      '분리 배출',
      '재활용',
      '재활용품',
      '페트병',
      'pet병',
      '라벨 제거',
      '라벨이 제거',
      '캔 압축',
      '찌그러진 캔',
      '압축된 캔',
      '분리수거함',
      'recycle',
      'recycling',
    ],
    reason: '사진에서 재활용품 또는 분리수거 관련 단서가 확인되어 미션 조건을 충족합니다.',
  },
  '다회용기 사용하여 음식 포장하기': {
    keywords: [
      '다회용기',
      '도시락통',
      '밀폐용기',
      '반찬통',
      '재사용 가능한 용기',
      '음식 용기',
      'container',
      'lunch box',
      'food container',
    ],
    reason: '사진에서 다회용기 또는 재사용 가능한 음식 용기가 확인되어 미션 조건을 충족합니다.',
  },
  '음식 남기지 않기': {
    keywords: [
      '빈 접시',
      '빈 그릇',
      '빈 식판',
      '깨끗한 접시',
      '깨끗하게 먹',
      '거의 남지',
      '음식물이 거의',
      '음식이 거의',
      'empty plate',
      'empty bowl',
    ],
    reason: '사진에서 음식이 거의 남지 않은 그릇/접시가 확인되어 음식 남기지 않기 미션 조건을 충족합니다.',
  },
  '대중교통 이용하기': {
    keywords: [
      '버스',
      '지하철',
      '전철',
      '열차',
      '기차',
      '정류장',
      '버스 정류장',
      '역',
      '승차권',
      '교통카드',
      '대중교통',
      'subway',
      'bus',
      'train',
      'station',
    ],
    reason: '사진에서 대중교통 또는 대중교통 이용 정황이 확인되어 미션 조건을 충족합니다.',
  },
  '이면지 활용하기': {
    keywords: [
      '이면지',
      '종이',
      '낙서',
      '필기',
      '메모',
      '연습장',
      '뒷면',
      'scratch paper',
      'memo',
      'writing',
      'doodle',
    ],
    reason: '사진에서 이면지 활용 또는 종이 위 필기/낙서 흔적이 확인되어 미션 조건을 충족합니다.',
  },
  '리필 제품 구매하기': {
    keywords: [
      '리필',
      '리필 제품',
      '리필용',
      '리필 스테이션',
      'refill',
      '파우치',
      '재충전',
    ],
    reason: '사진에서 리필 제품 또는 리필 관련 단서가 확인되어 미션 조건을 충족합니다.',
  },
  '안쓰는 멀티탭 뽑기': {
    keywords: [
      '멀티탭',
      '플러그',
      '콘센트',
      '뽑힌',
      '뽑혀',
      '전원 차단',
      '스위치가 꺼',
      '꺼진 멀티탭',
      'power strip',
      'plug',
      'unplugged',
      'outlet',
    ],
    reason: '사진에서 뽑힌 플러그 또는 꺼진 멀티탭이 확인되어 미션 조건을 충족합니다.',
  },
};

const hasWalkingStepEvidence = evidenceText => {
  if (
    !includesAny(evidenceText, [
      '걸음',
      '걸음 수',
      '보',
      'steps',
      'step count',
      'health',
      '건강 앱',
      '만보기',
      '피트니스',
      'fitness',
    ])
  ) {
    return false;
  }

  return extractNumbers(evidenceText).some(number => number >= 10000);
};

const applyMissionSpecificRules = ({ missionTitle, result }) => {
  const title = String(missionTitle || '').trim();
  const evidenceText = [
    result.reason,
    ...(result.evidence || []),
  ].join(' ');

  if (title === '10,000보 걷기' && hasWalkingStepEvidence(evidenceText)) {
    return {
      ...result,
      isValid: true,
      confidence: Math.max(result.confidence, 0.9),
      reason: '사진에서 10,000보 이상 걸음 수가 확인되어 미션 조건을 충족합니다.',
    };
  }

  const positiveRule = missionPositiveRules[title];

  if (positiveRule && includesAny(evidenceText, positiveRule.keywords)) {
    return {
      ...result,
      isValid: true,
      confidence: Math.max(result.confidence, 0.9),
      reason: positiveRule.reason,
    };
  }

  return result;
};

const normalizeVerificationResult = ({ missionTitle, result }) => {
  const confidence = Number(result?.confidence);
  const evidence = Array.isArray(result?.evidence)
    ? result.evidence.map(item => String(item || '').trim()).filter(Boolean)
    : [];

  return applyMissionSpecificRules({
    missionTitle,
    result: {
    provider: 'gemini',
    isValid: result?.isValid === true,
    confidence:
      Number.isFinite(confidence) && confidence >= 0 && confidence <= 1
        ? confidence
        : 0,
    reason: String(result?.reason || '').trim() || 'AI 판정 사유가 없습니다.',
    evidence,
    checkedAt: new Date(),
    },
  });
};

const requestGeminiVerification = async ({
  apiKey,
  model,
  base64,
  mimeType,
  prompt,
}) => {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}` +
    `:generateContent?key=${apiKey}`;

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        response_json_schema: missionVerificationJsonSchema,
        maxOutputTokens: 500,
      },
    }),
  });
};

const verifyMissionSubmission = async ({
  missionTitle,
  missionDescription,
  verificationCriteria,
  content,
  base64,
  mimeType,
}) => {
  const apiKey = readConfiguredEnv(process.env.GEMINI_API_KEY);

  if (!base64 || !mimeType || !apiKey) {
    return null;
  }

  const prompt = getMissionVerificationPrompt({
    missionTitle,
    missionDescription,
    verificationCriteria,
    content,
  });

  for (const model of getGeminiMissionModels()) {
    try {
      const response = await requestGeminiVerification({
        apiKey,
        model,
        base64,
        mimeType,
        prompt,
      });
      const responseBody = await response.json();

      if (!response.ok) {
        console.warn(
          `Gemini mission verification failed (${model}):`,
          responseBody.error?.message || response.statusText,
        );
        continue;
      }

      const outputText = (responseBody.candidates || [])
        .flatMap(candidate => candidate.content?.parts || [])
        .map(part => part.text || '')
        .join('');

      return normalizeVerificationResult({
        missionTitle,
        result: JSON.parse(outputText),
      });
    } catch (error) {
      console.warn(`Gemini mission verification parse failed (${model}):`, error.message);
    }
  }

  return null;
};

const shouldAutoApproveMission = verification =>
  verification?.isValid === true &&
  verification.confidence >= getAutoApproveConfidence();

module.exports = {
  getAutoApproveConfidence,
  shouldAutoApproveMission,
  verifyMissionSubmission,
};
