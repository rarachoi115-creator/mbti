import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";

/** 회원가입 페이지 브라우저 탭 제목과 설명입니다. */
export const metadata: Metadata = {
  title: "회원가입 | 새코미 MBTI",
  description: "이메일과 비밀번호로 새코미 MBTI에 가입해 보세요.",
};

/**
 * /signup 회원가입 페이지입니다.
 */
export default function SignupPage() {
  return <SignupForm />;
}
