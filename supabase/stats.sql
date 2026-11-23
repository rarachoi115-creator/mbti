-- ============================================================================
-- 새코미 MBTI: 전체 회원 MBTI 유형별 통계 조회 함수(get_type_stats) SQL
-- Supabase 대시보드의 SQL Editor 에 그대로 붙여 넣어 실행하세요.
-- 두 번 이상 실행해도 오류가 나지 않도록(멱등성) 작성했습니다.
-- ============================================================================

-- 1. 같은 이름의 기존 함수가 있다면 먼저 깔끔히 지워 반환 형식 변경 시에도 오류가 나지 않게 합니다.
drop function if exists public.get_type_stats();

-- 2. 전체 검사 결과를 MBTI 유형별로 묶어 개수만 돌려주는 함수를 만듭니다.
create or replace function public.get_type_stats()
-- 반환 표(TABLE): 개별 회원 id 나 created_at 없이 유형 코드(mbti_type)와 개수(count)만 내보냅니다.
returns table (
  mbti_type text,
  count bigint
)
-- 순수 SQL 로 작성하며, 데이터 조회만 수행하므로 stable 로 표시합니다.
language sql
stable
-- security definer: RLS가 켜진 test_results 테이블을 함수 생성자 권한으로 안전하게 집계합니다.
security definer
-- search_path 를 빈 문자열로 고정해 악의적인 스키마 가로채기를 방지합니다. (내부 테이블은 반드시 public. 으로 지정)
set search_path = ''
as $$
  select
    tr.mbti_type,
    count(*)::bigint as count
  from public.test_results as tr
  group by tr.mbti_type
  order by count(*) desc, tr.mbti_type asc;
$$;

-- 3. 실행 권한 설정
-- 기본 public 역할의 실행 권한을 먼저 회수한 뒤,
revoke all on function public.get_type_stats() from public;
-- 비로그인 방문자(anon)와 로그인 회원(authenticated) 모두 통계를 볼 수 있도록 실행 권한을 줍니다.
grant execute on function public.get_type_stats() to anon, authenticated;
