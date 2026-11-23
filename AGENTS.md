<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 새코미 MBTI 프로젝트 작업 규칙

## 서비스 소개

- **서비스 이름**: 새코미 MBTI
- **핵심 기능**: 12개 질문에 답하면 16가지 성격 유형 중 하나를 알려주는 MBTI 검사 서비스
- **캐릭터**: 성격 유형마다 3D 동물 캐릭터가 존재함
- **회원 기능**: 회원은 검사 결과를 저장하고 마이페이지에서 다시 볼 수 있음

## 기술 규칙

- **기본 스택**: Next.js(App Router) + TypeScript + Tailwind CSS
- **추후 도입 예정 기술**: 3D 캐릭터는 React Three Fiber로, 데이터베이스와 로그인은 Supabase로 구현할 예정이며, **사용자가 요청하기 전에는 관련 패키지를 미리 설치하지 않는다.**
- **Supabase 단순한 구조**: 학습용 프로젝트이므로 브라우저에서 `@supabase/supabase-js`로 Supabase를 직접 호출하며, `src/lib/supabase.ts`의 클라이언트 하나만 앱 전체에서 사용한다. `@supabase/ssr`, 미들웨어(`proxy`), 서버 액션, 서버 쪽 인증은 쓰지 않는다.
- **Supabase 비밀 키 금지**: 비밀 키(`sb_secret_`로 시작하는 키, `service_role` 키)와 DB 비밀번호는 이 프로젝트 어디에도 넣지 않는다.
- **언어**: 화면에 표시되는 모든 UI 텍스트는 한국어로 작성한다.
- **반응형 기준**: 모바일 퍼스트(휴대폰 화면 가로 `375px` 기준)로 먼저 보기 좋게 만든 뒤, 더 큰 화면에 대응한다.

## 작업 방식

- **작업 범위 준수**: 사용자가 요청한 범위만 작업한다. 요청하지 않은 기능이나 페이지는 임의로 만들지 않는다.
- **주석 작성**: 코드에는 초보자도 이해하며 읽을 수 있도록 친절한 한국어 주석을 작성한다.
- **빌드 검증**: 코드를 수정한 작업을 마친 뒤에는 반드시 `npm run build`를 실행해 오류가 없는지 확인한다.
- **화면 변경 검증**: 화면(UI)을 변경한 작업을 마친 뒤에는 개발 서버가 실행 중인지 확인하고, 내장 브라우저로 바뀐 페이지를 열어 직접 클릭·조작해 본 뒤 화면 캡처를 사용자에게 보여준다.
- **작업 완료 보고**: 작업을 마친 마지막 응답에서는 **바뀐 점**과 **사용자가 브라우저에서 확인할 방법**을 짧게 알려준다.
