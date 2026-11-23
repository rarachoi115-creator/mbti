/**
 * MBTI 8가지 성향 글자 타입입니다.
 * - E(외향) / I(내향)
 * - S(감각) / N(직관)
 * - T(사고) / F(감정)
 * - J(판단) / P(인식)
 */
export type MbtiTrait = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

/**
 * MBTI를 구성하는 4가지 성격 지표 타입입니다.
 */
export type MbtiDimension = "EI" | "SN" | "TF" | "JP";

/**
 * 문항 안에 들어가는 선택지 1개의 구조입니다.
 */
export interface QuestionOption {
  /** 사용자에게 보여줄 선택지 문장 */
  text: string;
  /** 이 선택지를 고르면 점수가 더해질 성향 글자 */
  trait: MbtiTrait;
}

/**
 * 검사 문항 1개의 구조입니다.
 * 선택지는 반드시 2개만 들어가도록 고정 길이 배열(튜플) 타입을 사용했습니다.
 */
export interface Question {
  /** 문항 순서 번호 (1 ~ 12) */
  id: number;
  /** 이 문항이 측정하는 지표 (EI, SN, TF, JP 중 하나) */
  dimension: MbtiDimension;
  /** 일상 속 상황을 묻는 한 문장 질문 */
  question: string;
  /** 2지선다 선택지 목록 */
  options: readonly [QuestionOption, QuestionOption];
}

/**
 * 새코미 MBTI 검사에 사용할 12개 문항 데이터입니다.
 * - EI, SN, TF, JP 지표마다 3문항씩 총 12문항으로 구성했습니다.
 * - 같은 지표의 문항이 연속으로 나오지 않도록 순서를 섞어 배치했습니다.
 */
export const QUESTIONS: readonly Question[] = [
  {
    id: 1,
    dimension: "EI",
    question: "오랜만에 생긴 휴일, 갑자기 친구가 모임을 제안하면 어떨까요?",
    options: [
      {
        text: "반가운 마음에 바로 준비해서 모임에 나가요",
        trait: "E",
      },
      {
        text: "미안하지만 오늘은 집에서 혼자 조용히 쉬고 싶어요",
        trait: "I",
      },
    ],
  },
  {
    id: 2,
    dimension: "SN",
    question: "새로 산 가전제품을 처음 사용할 때 가장 먼저 하는 행동은 무엇인가요?",
    options: [
      {
        text: "설명서를 순서대로 읽어 보며 기능을 차근히 확인해요",
        trait: "S",
      },
      {
        text: "일단 전원을 켜 보고 감으로 이것저것 눌러 봐요",
        trait: "N",
      },
    ],
  },
  {
    id: 3,
    dimension: "TF",
    question: "친구가 새로 산 옷이 조금 안 어울려 보이는데 의견을 묻는다면 어떻게 말하나요?",
    options: [
      {
        text: "색감이나 장점을 먼저 칭찬하며 기분 좋게 말해 줘요",
        trait: "F",
      },
      {
        text: "솔직하게 어떤 점이 아쉽고 어떤 스타일이 더 나을지 알려 줘요",
        trait: "T",
      },
    ],
  },
  {
    id: 4,
    dimension: "JP",
    question: "주말에 떠날 당일치기 여행을 준비할 때 어떤 스타일인가요?",
    options: [
      {
        text: "갈 곳과 식사할 식당, 이동 시간까지 미리 정해 둬요",
        trait: "J",
      },
      {
        text: "큰 방향만 정해 두고 당일 기분에 따라 자유롭게 움직여요",
        trait: "P",
      },
    ],
  },
  {
    id: 5,
    dimension: "SN",
    question: "수업 과제나 회사 프로젝트를 처음 맡았을 때 어떤 생각부터 드나요?",
    options: [
      {
        text: "필요한 자료와 현실적인 진행 순서부터 차근히 정리해요",
        trait: "S",
      },
      {
        text: "전체적인 큰 그림과 새로운 아이디어부터 자유롭게 떠올려요",
        trait: "N",
      },
    ],
  },
  {
    id: 6,
    dimension: "TF",
    question: "친한 동료가 업무 실수로 속상해하며 연락했을 때 가장 먼저 나오는 반응은 무엇인가요?",
    options: [
      {
        text: "어디서 문제가 생겼는지 듣고 해결할 방법부터 같이 찾아요",
        trait: "T",
      },
      {
        text: "얼마나 놀라고 속상했을지 떠올리며 따뜻한 위로 먼저 건네요",
        trait: "F",
      },
    ],
  },
  {
    id: 7,
    dimension: "EI",
    question: "바쁜 한 주를 보낸 금요일 저녁, 에너지를 채우는 나만의 방법은 무엇인가요?",
    options: [
      {
        text: "조용한 방에서 좋아하는 영상을 보거나 음악을 들으며 푹 쉬어요",
        trait: "I",
      },
      {
        text: "지인들을 만나 맛있는 음식을 먹으며 신나게 이야기 나눠요",
        trait: "E",
      },
    ],
  },
  {
    id: 8,
    dimension: "JP",
    question: "집 근처 마트에서 장을 볼 때 장바구니는 어떻게 채워지나요?",
    options: [
      {
        text: "눈에 띄는 할인 상품이나 먹고 싶은 걸 보면서 그때그때 담아요",
        trait: "P",
      },
      {
        text: "미리 적어 온 메모를 보며 필요한 물건만 빠르게 골라 담아요",
        trait: "J",
      },
    ],
  },
  {
    id: 9,
    dimension: "SN",
    question: "영화 한 편을 보고 난 뒤, 친구에게 소개할 때 어떤 이야기를 많이 하나요?",
    options: [
      {
        text: "인상 깊었던 장면이나 줄거리 흐름을 있는 그대로 자세히 설명해요",
        trait: "S",
      },
      {
        text: "영화가 전하려는 숨은 의미나 결말 이후의 이야기를 상상해 말해요",
        trait: "N",
      },
    ],
  },
  {
    id: 10,
    dimension: "EI",
    question: "처음 참여하는 원데이 클래스에서 어색한 분위기가 흐르면 어떻게 하나요?",
    options: [
      {
        text: "먼저 밝게 인사를 건네며 가벼운 대화를 시작해요",
        trait: "E",
      },
      {
        text: "조용히 미소만 짓고 내 작업에 차분히 집중해요",
        trait: "I",
      },
    ],
  },
  {
    id: 11,
    dimension: "JP",
    question: "며칠 뒤로 다가온 집 대청소를 앞두고 있을 때 보통 어떻게 움직이나요?",
    options: [
      {
        text: "구역별 순서와 끝낼 시간을 정해 두고 계획대로 치워요",
        trait: "J",
      },
      {
        text: "눈에 보이는 곳부터 시작하다가 마음이 내킬 때 한꺼번에 치워요",
        trait: "P",
      },
    ],
  },
  {
    id: 12,
    dimension: "TF",
    question: "함께 준비하던 모임 장소가 갑작스럽게 취소되었을 때 어떤 생각이 먼저 드나요?",
    options: [
      {
        text: "다들 기대했을 텐데 아쉽고 실망할 친구들 기분부터 걱정돼요",
        trait: "F",
      },
      {
        text: "근처에 바로 예약할 수 있는 대안 장소를 빠르게 검색해 봐요",
        trait: "T",
      },
    ],
  },
];
