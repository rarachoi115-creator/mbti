import type { Metadata } from "next";
import MbtiTestClient from "@/components/MbtiTestClient";
import { createPageMetadata } from "@/lib/metadata";

/** 검사 페이지 전용 브라우저 탭 제목, 설명, Open Graph 미리보기입니다. */
export const metadata: Metadata = createPageMetadata({
  title: "성격 유형 검사 | 새코미 MBTI",
  description:
    "12개 질문에 답하고 나의 MBTI 성격 유형과 3D 동물 캐릭터를 확인해 보세요.",
});

/**
 * /test 경로로 접속했을 때 보여줄 검사 페이지입니다.
 * 실제 문항 진행과 버튼 동작은 클라이언트 컴포넌트인 MbtiTestClient가 담당합니다.
 */
export default function TestPage() {
  return <MbtiTestClient />;
}
