"use client";

import Link from "next/link";
import { useState } from "react";
import AnimalAvatarSvg from "@/components/AnimalAvatarSvg";
import CharacterViewer from "@/components/CharacterViewer";
import { getMbtiTypeInfo, MBTI_TYPE_LIST } from "@/data/types";
import type { MbtiType } from "@/lib/mbti";

/**
 * /types "유형 도감" 페이지의 클라이언트 컴포넌트입니다.
 * - 위쪽에는 한 개의 3D 캔버스만 사용해 선택한 유형의 캐릭터를 크게 보여 줍니다.
 * - 가운데에는 캐릭터 이름, 유형 코드, 별명, 한 줄 소개, "자세히 보기" 버튼을 배치합니다.
 * - 맨 아래에는 16개 유형 버튼을 4줄 4칸으로 나열해 클릭 시 위 캐릭터를 바꿉니다.
 */
export default function TypesGalleryClient() {
  // 현재 도감에서 선택된 MBTI 유형 코드 (첫 번째 항목인 INTJ로 시작)
  const [selectedType, setSelectedType] = useState<MbtiType>(
    MBTI_TYPE_LIST[0].code
  );
  const selectedInfo = getMbtiTypeInfo(selectedType);

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* 1) 상단 3D 캐릭터 무대: 한 화면에 3D 캔버스는 하나만 사용 */}
      <section
        aria-label="선택한 유형의 3D 캐릭터"
        className="relative rounded-3xl border-2 border-white/90 p-3 shadow-[0_12px_30px_rgba(225,115,145,0.14)] transition-colors duration-300"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${selectedInfo.color}66 0%, rgba(255, 255, 255, 0.55) 80%)`,
        }}
      >
        <CharacterViewer
          type={selectedType}
          className="h-[300px] w-full sm:h-[340px]"
        />
        <p className="pb-1 text-center text-xs font-medium text-slate-500">
          끌어서 돌려 보고, 클릭하거나 마우스로 튕겨 보세요!
        </p>
      </section>

      {/* 2) 선택한 유형의 상세 요약 정보 + 자세히 보기 버튼 */}
      <section className="rounded-3xl border border-white bg-white/92 p-5 shadow-[0_8px_24px_rgba(225,115,145,0.12)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block rounded-full px-3 py-0.5 text-xs font-extrabold tracking-wide text-slate-800"
                style={{ backgroundColor: selectedInfo.color }}
              >
                {selectedInfo.code}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {selectedInfo.character.animal}
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-800">
              {selectedInfo.character.name}
            </h1>
            <p className="mt-0.5 text-sm font-bold text-rose-600">
              {selectedInfo.nickname}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed break-keep text-slate-600">
          {selectedInfo.summary}
        </p>

        <Link
          href={`/result/${selectedInfo.code}`}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(217,67,110,0.28)] transition-all hover:brightness-105 active:scale-[0.98]"
        >
          <span>자세히 보기</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </Link>
      </section>

      {/* 3) 하단 16개 유형 선택 버튼 (4줄 4칸 격자) */}
      <section aria-label="16가지 성격 유형 목록">
        <div className="mb-2.5 flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold text-slate-700">
            유형 도감 (16종)
          </h2>
          <span className="text-xs font-medium text-slate-500">
            버튼을 눌러 캐릭터를 바꿔 보세요
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {MBTI_TYPE_LIST.map((item) => {
            const isSelected = item.code === selectedType;

            return (
              <button
                key={item.code}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedType(item.code)}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 px-1 py-2.5 text-center transition-all active:scale-[0.96] ${
                  isSelected
                    ? "border-rose-400 bg-white text-slate-900 shadow-[0_6px_16px_rgba(217,67,110,0.2)]"
                    : "border-white/90 bg-white/80 text-slate-700 shadow-xs hover:bg-white"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: `${item.color}55` }
                    : undefined
                }
              >
                <AnimalAvatarSvg type={item.code} />
                <span className="text-xs font-extrabold tracking-wide">
                  {item.code}
                </span>
                <span className="mt-0.5 text-[11px] font-medium text-slate-500">
                  {item.character.animal}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
