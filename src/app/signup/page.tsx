import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";
import { createPageMetadata } from "@/lib/metadata";

/** 회원가입 페이지 브라우저 탭 제목, 설명, Open Graph 미리보기입니다. */
export const metadata: Metadata = createPageMetadata({
  title: "회원가입 | 새코미 MBTI",
  description: "이메일과 비밀번호로 새코미 MBTI에 가입하고 검사 결과를 저장해 보세요.",
});

/**
 * /signup 회원가입 페이지입니다.
 */
export default function SignupPage() {
  return <SignupForm />;
}
