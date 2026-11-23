/**
 * Supabase 인증 과정에서 발생하는 오류 메시지를 친절한 한국어로 바꿔 줍니다.
 * (Supabase 에러 코드와 영문 메시지를 함께 확인해 상황에 맞는 안내를 돌려줍니다.)
 */
export function getKoreanAuthErrorMessage(
  error: { code?: string; message?: string } | null | undefined
): string {
  if (!error) {
    return "알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
  }

  const code = (error.code ?? "").toLowerCase();
  const message = (error.message ?? "").toLowerCase();

  // 1) 이미 가입된 이메일
  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    message.includes("already registered") ||
    message.includes("already exists")
  ) {
    return "이미 가입된 이메일이에요. 로그인해 주세요.";
  }

  // 2) 이메일 또는 비밀번호 불일치
  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return "이메일 또는 비밀번호가 맞지 않아요.";
  }

  // 3) 이메일 미인증
  if (
    code === "email_not_confirmed" ||
    message.includes("email not confirmed")
  ) {
    return "이메일 인증이 아직 완료되지 않았어요. 메일함의 인증 링크를 먼저 눌러 주세요.";
  }

  // 4) 비밀번호가 너무 짧거나 약함
  if (
    code === "weak_password" ||
    message.includes("password should be at least") ||
    message.includes("weak password")
  ) {
    return "비밀번호는 6자 이상으로 입력해 주세요.";
  }

  // 5) 올바르지 않은 이메일 형식
  if (
    code === "email_address_invalid" ||
    message.includes("invalid email") ||
    message.includes("unable to validate email")
  ) {
    return "올바른 이메일 주소 형식으로 입력해 주세요.";
  }

  // 6) 요청 횟수 제한
  if (
    code === "over_request_rate_limit" ||
    code === "over_email_send_rate_limit" ||
    message.includes("rate limit")
  ) {
    return "요청이 너무 많아요. 잠시 뒤에 다시 시도해 주세요.";
  }

  // 7) 네트워크 / 연결 문제
  if (message.includes("failed to fetch") || message.includes("fetch")) {
    return "서버와 연결하지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.";
  }

  return "요청을 처리하는 중 문제가 생겼어요. 입력 내용을 확인하고 다시 시도해 주세요.";
}

/**
 * 로그인 후 이동할 next 주소를 안전하게 검사합니다.
 * - 외부 사이트로 빠져나가는 것을 막기 위해 "/" 로 시작하는 우리 사이트 내부 주소만 허용합니다.
 * - "//evil.com" 처럼 슬래시가 연속으로 시작하는 주소는 허용하지 않고 홈("/")으로 돌립니다.
 */
export function getSafeNextPath(nextParam: string | null): string {
  if (!nextParam) {
    return "/";
  }

  const trimmed = nextParam.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\")
  ) {
    return "/";
  }

  return trimmed;
}
