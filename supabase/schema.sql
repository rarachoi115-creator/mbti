-- ============================================================================
-- 새코미 MBTI: 검사 결과(test_results) 테이블 생성 및 보안(권한·RLS) 설정 SQL
-- Supabase 대시보드의 SQL Editor 에 붙여 넣어 실행하세요.
-- 같은 SQL 을 여러 번 다시 실행해도 오류가 나지 않도록(멱등성) 작성했습니다.
-- ============================================================================

-- 1. 검사 결과를 저장할 public.test_results 테이블을 생성합니다 (이미 있으면 건너뜁니다).
create table if not exists public.test_results (
  -- id: 행이 추가될 때마다 DB가 자동으로 1, 2, 3... 번호를 매기는 64비트 정수 기본 키입니다.
  id bigint generated always as identity primary key,

  -- user_id: 결과를 저장한 회원의 고유 ID(UUID)이며 비어 있을 수 없습니다(not null).
  user_id uuid not null
    -- default auth.uid(): 앱에서 user_id 를 보내지 않아도 현재 로그인한 회원 ID를 자동으로 넣습니다.
    default auth.uid()
    -- references auth.users (id) on delete cascade: Supabase 회원(auth.users)과 연결하고, 회원 탈퇴 시 결과도 함께 삭제합니다.
    references auth.users (id) on delete cascade,

  -- mbti_type: 4글자 MBTI 유형 코드를 저장하는 문자열 컬럼이며 비어 있을 수 없습니다.
  mbti_type text not null,

  -- created_at: 결과가 저장된 날짜·시각(시간대 포함)이며, 따로 안 보내면 현재 시각(now())이 들어갑니다.
  created_at timestamptz not null default now(),

  -- test_results_mbti_type_check: 정확히 4글자이면서 E/I, S/N, T/F, J/P 조합(예: ENFP)만 허용하는 check 제약입니다.
  constraint test_results_mbti_type_check
    check (char_length(mbti_type) = 4 and mbti_type ~ '^[EI][SN][TF][JP]$')
);

-- 2. 내 검사 기록을 최신순으로 빠르게 찾기 위한 (user_id, created_at) 복합 인덱스를 생성합니다.
-- already exists 오류를 막기 위해 if not exists 를 붙였고, 최신순(내림차순: desc) 정렬에 맞췄습니다.
create index if not exists idx_test_results_user_id_created_at
  on public.test_results (user_id, created_at desc);

-- 3. 역할(Role)별 테이블 접근 권한(GRANT/REVOKE)을 설정합니다.
-- 새 Supabase 프로젝트는 테이블을 만들어도 API 역할에 권한이 자동으로 열리지 않으므로 직접 지정해야 합니다.
-- 기본 public 역할과 비로그인 방문자(anon)의 모든 권한을 회수해 인증 없는 접근을 차단합니다.
revoke all on table public.test_results from public;
revoke all on table public.test_results from anon;

-- 로그인한 회원(authenticated)의 기존 권한을 한 번 비워 깔끔하게 맞춥니다.
revoke all on table public.test_results from authenticated;
-- 로그인한 회원(authenticated)에게만 조회(select), 저장(insert), 삭제(delete) 권한을 직접 부여합니다.
grant select, insert, delete on table public.test_results to authenticated;

-- 4. 행 수준 보안(RLS: Row Level Security)을 켭니다 (이미 켜져 있어도 오류 없이 통과합니다).
alter table public.test_results enable row level security;

-- 5. [RLS 정책 1/3] 조회(SELECT): 로그인한 회원은 자기 자신의 결과만 볼 수 있습니다.
-- 두 번 실행해도 오류가 나지 않도록 같은 이름의 기존 정책이 있으면 먼저 삭제합니다.
drop policy if exists "본인 검사 결과만 조회 가능" on public.test_results;
-- test_results 테이블에 새로운 조회 정책을 만듭니다.
create policy "본인 검사 결과만 조회 가능"
  -- 이 정책을 적용할 대상 테이블입니다.
  on public.test_results
  -- SELECT(조회) 요청일 때만 이 규칙을 검사합니다.
  for select
  -- 로그인한 회원(authenticated 역할)에게만 적용합니다.
  to authenticated
  -- 현재 로그인한 사용자 ID((select auth.uid()))와 행의 user_id 가 같은 행만 읽도록 허용합니다.
  using ((select auth.uid()) = user_id);

-- 6. [RLS 정책 2/3] 저장(INSERT): 로그인한 회원은 자기 자신의 user_id 로만 저장할 수 있습니다.
-- 두 번 실행해도 오류가 나지 않도록 같은 이름의 기존 정책이 있으면 먼저 삭제합니다.
drop policy if exists "본인 이름으로만 검사 결과 저장 가능" on public.test_results;
-- test_results 테이블에 새로운 저장 정책을 만듭니다.
create policy "본인 이름으로만 검사 결과 저장 가능"
  -- 이 정책을 적용할 대상 테이블입니다.
  on public.test_results
  -- INSERT(새 행 추가) 요청일 때만 이 규칙을 검사합니다.
  for insert
  -- 로그인한 회원(authenticated 역할)에게만 적용합니다.
  to authenticated
  -- 새로 넣으려는 행의 user_id 가 현재 로그인한 사용자 ID와 같을 때만 저장을 허용합니다.
  with check ((select auth.uid()) = user_id);

-- 7. [RLS 정책 3/3] 삭제(DELETE): 로그인한 회원은 자기 자신의 결과만 삭제할 수 있습니다.
-- 두 번 실행해도 오류가 나지 않도록 같은 이름의 기존 정책이 있으면 먼저 삭제합니다.
drop policy if exists "본인 검사 결과만 삭제 가능" on public.test_results;
-- test_results 테이블에 새로운 삭제 정책을 만듭니다.
create policy "본인 검사 결과만 삭제 가능"
  -- 이 정책을 적용할 대상 테이블입니다.
  on public.test_results
  -- DELETE(행 삭제) 요청일 때만 이 규칙을 검사합니다.
  for delete
  -- 로그인한 회원(authenticated 역할)에게만 적용합니다.
  to authenticated
  -- 현재 로그인한 사용자 ID와 행의 user_id 가 같은 행만 삭제하도록 허용합니다.
  using ((select auth.uid()) = user_id);
