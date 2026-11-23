/**
 * Supabase 데이터베이스(test_results 테이블 등) 조회·저장·삭제 과정에서
 * 발생한 오류를 사용자가 이해하기 쉬운 한국어 메시지로 바꿔 줍니다.
 */
export function getKoreanDbErrorMessage(
  error: { code?: string; message?: string } | null | undefined,
  action: "load" | "save" | "delete" | "stats" = "save"
): string {
  if (!error) {
    return "요청 처리 중 알 수 없는 오류가 발생했어요.";
  }

  const code = (error.code ?? "").toUpperCase();
  const message = (error.message ?? "").toLowerCase();

  // 0) 통계 RPC 함수(get_type_stats)가 아직 생성되지 않은 경우
  if (
    code === "PGRST202" ||
    code === "42883" ||
    message.includes("could not find the function")
  ) {
    return "아직 통계 함수(get_type_stats)가 준비되지 않았어요. Supabase SQL Editor에서 supabase/stats.sql 을 먼저 실행해 주세요.";
  }

  // 1) 테이블이 아직 생성되지 않았거나 스키마 캐시에 없는 경우
  if (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("could not find the table") ||
    message.includes("does not exist")
  ) {
    return "아직 검사 결과를 저장할 테이블(test_results)이 준비되지 않았어요. Supabase SQL Editor에서 테이블 SQL을 먼저 실행해 주세요.";
  }

  // 2) 로그인 만료 또는 RLS 권한 부족
  if (
    code === "42501" ||
    code === "PGRST301" ||
    message.includes("permission denied") ||
    message.includes("row-level security") ||
    message.includes("jwt")
  ) {
    return "로그인 상태가 만료되었거나 권한이 없어요. 다시 로그인한 뒤 시도해 주세요.";
  }

  // 3) 유형 코드 형식(check 제약) 위반
  if (code === "23514" || message.includes("check constraint")) {
    return "올바른 MBTI 유형 형식이 아니어서 저장할 수 없어요.";
  }

  // 4) 네트워크 연결 문제
  if (message.includes("failed to fetch") || message.includes("fetch")) {
    return "인터넷 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.";
  }

  if (action === "load") {
    return "검사 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  if (action === "stats") {
    return "통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  if (action === "delete") {
    return "검사 기록을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  return "검사 결과를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.";
}
