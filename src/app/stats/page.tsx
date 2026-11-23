import type { Metadata } from "next";
import StatsClient from "@/components/StatsClient";

/** 통계 페이지 브라우저 탭 제목과 설명입니다. */
export const metadata: Metadata = {
  title: "전체 통계 | 새코미 MBTI",
  description: "모두가 저장한 새코미 MBTI 유형별 통계를 확인해 보세요.",
};

/**
 * /stats 전체 통계 페이지입니다.
 * 로그인하지 않아도 누구나 볼 수 있습니다.
 */
export default function StatsPage() {
  return <StatsClient />;
}
