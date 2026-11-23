"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type MbtiTrait } from "@/data/questions";
import { calculateMbtiType } from "@/lib/mbti";

/**
 * 실제 12개 문항 진행 상태와 사용자 클릭을 처리하는 클라이언트 컴포넌트입니다.
 * - 한 화면에 질문을 하나씩 보여줍니다.
 * - 선택지를 누르면 바로 다음 문항으로 넘어가고, 12번째 답을 고르면 결과 페이지로 이동합니다.
 * - "이전" 버튼을 누르면 앞 문항으로 돌아가 답을 다시 고를 수 있습니다.
 */
export default function MbtiTestClient() {
  const router = useRouter();

  // 현재 보고 있는 문항의 순서 인덱스 (0부터 시작, 0은 1번 문항)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 각 문항마다 사용자가 고른 성향 글자를 저장하는 배열 (길이 12)
  const [answers, setAnswers] = useState<(MbtiTrait | undefined)[]>(() =>
    Array(QUESTIONS.length).fill(undefined)
  );

  // 마지막 12번 문항 선택 후 결과 페이지 이동 중 중복 클릭을 막기 위한 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCount = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const currentNumber = currentIndex + 1;

  // 진행 막대 너비(%) 계산: 1번 문항은 약 8.3%, 12번 문항은 100%
  const progressPercent = Math.round((currentNumber / totalCount) * 100);
  const selectedTrait = answers[currentIndex];

  /**
   * 선택지 버튼을 눌렀을 때 실행되는 함수입니다.
   */
  const handleSelectOption = (trait: MbtiTrait) => {
    if (isSubmitting) {
      return;
    }

    // 현재 문항의 답안을 새 배열에 반영합니다.
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = trait;
    setAnswers(nextAnswers);

    // 아직 마지막 문항이 아니라면 바로 다음 질문으로 이동합니다.
    if (currentIndex < totalCount - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    // 12번째(마지막) 답을 골랐다면 유형을 계산해 /result/유형코드 페이지로 이동합니다.
    setIsSubmitting(true);
    const mbtiType = calculateMbtiType(nextAnswers);
    router.push(`/result/${mbtiType}`);
  };

  /**
   * "이전" 버튼을 눌렀을 때 바로 앞 질문으로 돌아가는 함수입니다.
   */
  const handlePrevQuestion = () => {
    if (currentIndex === 0 || isSubmitting) {
      return;
    }
    setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* 상단 진행 상황 영역: 숫자와 진행 막대 표시 */}
      <section aria-label="검사 진행 상황" className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-600">
          <span>진행 중</span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-rose-700 shadow-xs">
            {currentNumber} / {totalCount}
          </span>
        </div>

        {/* 진행 막대 트랙과 채워지는 바 */}
        <div
          role="progressbar"
          aria-label="문항 진행률"
          aria-valuemin={1}
          aria-valuemax={totalCount}
          aria-valuenow={currentNumber}
          className="h-3 w-full overflow-hidden rounded-full bg-white/85 p-0.5 shadow-inner"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#d9436e] to-[#f26b8f] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* 질문 카드 영역 */}
      <section className="flex flex-1 flex-col justify-between rounded-3xl border border-white bg-white/90 p-6 shadow-[0_10px_30px_rgba(225,115,145,0.16)]">
        <div>
          {/* 문항 번호 뱃지 */}
          <span className="inline-block rounded-full bg-rose-100/90 px-3 py-1 text-xs font-bold text-rose-700">
            질문 {currentNumber}
          </span>

          {/* 질문 본문 */}
          <h1 className="mt-4 min-h-[4.5rem] text-xl leading-snug font-extrabold break-keep text-slate-800">
            {currentQuestion.question}
          </h1>

          {/* 큼직한 2지선다 선택지 버튼 목록 */}
          <div className="mt-6 space-y-3.5">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedTrait === option.trait;

              return (
                <button
                  key={`${currentQuestion.id}-${option.trait}-${index}`}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSelectOption(option.trait)}
                  className={`flex min-h-[82px] w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 ${
                    isSelected
                      ? "border-rose-400 bg-rose-50 text-rose-950 shadow-[0_8px_20px_rgba(244,114,148,0.22)]"
                      : "border-rose-100 bg-gradient-to-r from-[#fffafb] to-[#fff2f5] text-slate-700 shadow-[0_6px_16px_rgba(225,115,145,0.09)] hover:border-rose-300 hover:bg-rose-50/80"
                  }`}
                >
                  <span className="text-base leading-relaxed font-semibold break-keep">
                    {option.text}
                  </span>

                  {/* 이전에 골랐던 답을 수정하러 돌아왔을 때 표시되는 작은 선택 표시 */}
                  {isSelected && (
                    <span className="shrink-0 rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold text-white">
                      선택함
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 하단 이전 버튼 영역: 첫 질문(currentIndex === 0)에서는 숨깁니다 */}
        <div className="mt-8 flex min-h-[48px] items-center justify-between">
          {currentIndex > 0 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePrevQuestion}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-xs transition-all hover:bg-rose-50 active:scale-[0.98] disabled:opacity-60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M11 18l-6-6 6-6" />
              </svg>
              <span>이전</span>
            </button>
          ) : (
            <span className="text-xs font-medium text-slate-400">
              편안한 마음으로 직관적으로 골라 보세요
            </span>
          )}

          {isSubmitting && (
            <span className="text-xs font-semibold text-rose-600">
              결과를 계산하고 있어요...
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
