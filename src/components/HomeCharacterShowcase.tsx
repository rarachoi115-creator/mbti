"use client";

import { useEffect, useState } from "react";
import CharacterViewer from "@/components/CharacterViewer";
import { MBTI_TYPE_LIST } from "@/data/types";

/** 캐릭터가 다음 유형으로 전환되는 주기 (3초) */
const ROTATE_INTERVAL_MS = 3000;

/**
 * 첫 화면(/) 제목 아래에 3D 캐릭터 1개를 띄우고 3초마다 다른 유형으로 바꿔 주는 컴포넌트입니다.
 * - 한 화면에 3D 캔버스(Canvas)는 하나만 유지한 채 캐릭터 종류만 교체합니다.
 */
export default function HomeCharacterShowcase() {
  const [typeIndex, setTypeIndex] = useState(0);

  // 3초마다 다음 유형 인덱스로 순환하며, 화면을 벗어나면 타이머를 정리합니다.
  useEffect(() => {
    const timer = setInterval(() => {
      setTypeIndex((prev) => (prev + 1) % MBTI_TYPE_LIST.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const currentInfo = MBTI_TYPE_LIST[typeIndex];

  return (
    <div
      className="mt-4 rounded-3xl border border-white/90 px-3 pt-2 pb-3 shadow-[0_8px_24px_rgba(225,115,145,0.14)] transition-colors duration-500"
      style={{
        background: `radial-gradient(circle at 50% 45%, ${currentInfo.color}66 0%, rgba(255, 255, 255, 0.55) 82%)`,
      }}
    >
      {/* 단일 3D 캔버스 */}
      <CharacterViewer
        type={currentInfo.code}
        className="h-[220px] w-full sm:h-[240px]"
      />

      {/* 현재 보여 주고 있는 캐릭터의 유형 코드와 이름 뱃지 */}
      <div className="mt-1 flex flex-col items-center gap-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-xs">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full border border-white shadow-xs"
            style={{ backgroundColor: currentInfo.color }}
          />
          <span>{currentInfo.code}</span>
          <span className="text-slate-400">·</span>
          <span>{currentInfo.character.name}</span>
        </span>
        <p className="text-[11px] font-medium text-slate-500">
          클릭하거나 마우스로 튕겨 보세요!
        </p>
      </div>
    </div>
  );
}
