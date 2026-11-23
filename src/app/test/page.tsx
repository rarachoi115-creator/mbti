import type { Metadata } from "next";
import MbtiTestClient from "@/components/MbtiTestClient";

/** 검사 페이지 전용 브라우저 탭 제목과 설명입니다. */
export const metadata: Metadata = {
  title: "성격 유형 검사 | 새코미 MBTI",
  description: "12개 질문에 답하고 나의 MBTI 유형을 확인해 보세요.",
};

/**
 * /test 경로로 접속했을 때 보여줄 검사 페이지입니다.
 * 실제 문항 진행과 버튼 동작은 클라이언트 컴포넌트인 MbtiTestClient가 담당합니다.
 */
export default function TestPage() {
  return <MbtiTestClient />;
}
