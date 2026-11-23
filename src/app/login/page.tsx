import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import { createPageMetadata } from "@/lib/metadata";

/** 로그인 페이지 브라우저 탭 제목, 설명, Open Graph 미리보기입니다. */
export const metadata: Metadata = createPageMetadata({
  title: "로그인 | 새코미 MBTI",
  description: "새코미 MBTI 계정에 로그인하고 내 검사 기록을 확인해 보세요.",
});

/**
 * /login 로그인 페이지입니다.
 * - useSearchParams()를 사용하는 LoginForm 을 Suspense 로 감싸 Next.js 16 빌드 규칙을 지킵니다.
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-sm font-semibold text-rose-500">
          로그인 화면 불러오는 중...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
