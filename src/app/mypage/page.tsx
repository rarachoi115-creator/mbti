import type { Metadata } from "next";
import MypageClient from "@/components/MypageClient";
import { createPageMetadata } from "@/lib/metadata";

/** 마이페이지 브라우저 탭 제목, 설명, Open Graph 미리보기입니다. */
export const metadata: Metadata = createPageMetadata({
  title: "마이페이지 | 새코미 MBTI",
  description:
    "내가 저장한 새코미 MBTI 검사 기록과 3D 동물 캐릭터를 다시 확인해 보세요.",
});

/**
 * /mypage 마이페이지입니다.
 * 로그인한 회원만 볼 수 있으며, 실제 인증/기록 처리는 MypageClient 에서 진행합니다.
 */
export default function MypagePage() {
  return <MypageClient />;
}
