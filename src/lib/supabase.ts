import { createClient } from "@supabase/supabase-js";

// .env.local 파일에 적은 공개용 Supabase 주소와 Publishable 키를 읽어옵니다.
// NEXT_PUBLIC_ 로 시작하는 환경 변수는 브라우저에서 직접 사용할 수 있는 공개 값입니다.
// (주의: sb_secret_ 키, service_role 키, DB 비밀번호 같은 비밀 정보는 절대 넣지 않습니다.)
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const rawPublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

// 아직 .env.local 에 실제 URL 대신 안내 문구("여기에_내_Project_URL")가 들어 있을 때도
// 모듈을 불러오는 단계에서 오류가 나지 않도록 http/https URL 형식을 먼저 확인합니다.
const isValidHttpUrl = /^https?:\/\//i.test(rawUrl.trim());
const supabaseUrl = isValidHttpUrl
  ? rawUrl.trim()
  : "https://placeholder.supabase.co";
const supabasePublishableKey =
  rawPublishableKey.trim() || "placeholder-publishable-key";

/**
 * .env.local 에 실제 Supabase Project URL 과 Publishable 키가 입력되었는지 확인합니다.
 */
export const isSupabaseConfigured =
  isValidHttpUrl &&
  Boolean(rawPublishableKey.trim()) &&
  !rawPublishableKey.includes("여기에_내_");

/**
 * 새코미 MBTI 앱 전체에서 단 하나만 만들어 공유하는 Supabase 클라이언트입니다.
 * 브라우저에서 데이터베이스와 로그인 기능을 호출할 때는 항상 이 supabase 객체만 가져와 사용합니다.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
