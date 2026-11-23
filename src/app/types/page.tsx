import type { Metadata } from "next";
import TypesGalleryClient from "@/components/TypesGalleryClient";
import { createPageMetadata } from "@/lib/metadata";

/** 유형 도감 페이지의 브라우저 탭 제목, 설명, Open Graph 미리보기입니다. */
export const metadata: Metadata = createPageMetadata({
  title: "유형 도감 | 새코미 MBTI",
  description:
    "16가지 성격 유형의 귀여운 3D 동물 캐릭터와 특징을 모두 구경해 보세요.",
});

/**
 * 헤더의 "유형 도감" 메뉴(/types)로 연결되는 페이지입니다.
 * 선택한 3D 캐릭터와 정보, 16개 유형 선택 버튼을 보여 줍니다.
 */
export default function TypesPage() {
  return <TypesGalleryClient />;
}
