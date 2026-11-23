import type { MbtiTrait } from "@/data/questions";

/**
 * 새코미 MBTI에서 사용하는 16가지 성격 유형 코드 목록입니다.
 * 결과 페이지(/result/[type])의 유효성 확인과 정적 경로 생성에 함께 사용합니다.
 */
export const ALL_MBTI_TYPES = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
] as const;

/** 16가지 MBTI 유형 코드 중 하나를 뜻하는 타입입니다. */
export type MbtiType = (typeof ALL_MBTI_TYPES)[number];

/**
 * 각 지표에서 비교할 두 글자 쌍을 순서대로 정의한 상수입니다.
 * 결과 코드는 항상 [E/I] + [S/N] + [T/F] + [J/P] 순서로 만듭니다.
 */
const DIMENSION_PAIRS = [
  ["E", "I"],
  ["S", "N"],
  ["T", "F"],
  ["J", "P"],
] as const;

/**
 * 사용자가 선택한 성향 글자 배열을 받아 최종 4글자 MBTI 유형을 계산합니다.
 * - 각 지표(E/I, S/N, T/F, J/P)마다 더 많이 선택된 쪽의 글자를 고릅니다.
 * - 만약 두 글자 수가 같다면 앞쪽 글자(E, S, T, J)를 기본값으로 선택합니다.
 *
 * @param selectedTraits 사용자가 문항마다 고른 성향 글자 목록
 * @returns 계산된 4글자 MBTI 유형 코드 (예: "ENFP")
 */
export function calculateMbtiType(
  selectedTraits: readonly (MbtiTrait | undefined)[]
): MbtiType {
  // 8가지 성향 글자의 선택 횟수를 0으로 초기화합니다.
  const traitCounts: Record<MbtiTrait, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // 사용자가 고른 답안을 하나씩 확인하며 해당 성향 점수를 1씩 올립니다.
  for (const trait of selectedTraits) {
    if (trait) {
      traitCounts[trait] += 1;
    }
  }

  // 4가지 지표마다 더 많이 선택된 글자를 뽑아 네 글자로 이어 붙입니다.
  const result = DIMENSION_PAIRS.map(([first, second]) =>
    traitCounts[first] >= traitCounts[second] ? first : second
  ).join("");

  return result as MbtiType;
}

/**
 * 전달받은 문자열이 유효한 16가지 MBTI 유형 코드인지 확인합니다.
 */
export function isValidMbtiType(value: string): value is MbtiType {
  return (ALL_MBTI_TYPES as readonly string[]).includes(value);
}
