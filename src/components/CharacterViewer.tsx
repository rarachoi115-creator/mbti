"use client";

import dynamic from "next/dynamic";
import type { MbtiType } from "@/lib/mbti";

/**
 * 3D 캔버스는 브라우저 전용 WebGL API를 쓰므로 ssr: false 로 서버 렌더링에서 제외합니다.
 * JS 번들을 불러오는 동안 "캐릭터 불러오는 중..." 안내 문구를 표시합니다.
 */
const CharacterCanvas = dynamic(
  () => import("@/components/three/CharacterCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-rose-500">
        캐릭터 불러오는 중...
      </div>
    ),
  }
);

interface CharacterViewerProps {
  /** 표시할 MBTI 유형 코드 (기본값: ISFJ 곰) */
  type?: MbtiType;
  /** 바깥 컨테이너에 추가로 적용할 Tailwind 클래스 */
  className?: string;
}

/**
 * 페이지 어디서나 안전하게 3D 캐릭터를 불러와 띄울 수 있는 래퍼 컴포넌트입니다.
 */
export default function CharacterViewer({
  type = "ISFJ",
  className = "h-[340px] w-full",
}: CharacterViewerProps) {
  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      aria-label={`${type} 3D 캐릭터 뷰어`}
    >
      <CharacterCanvas type={type} />
    </div>
  );
}
