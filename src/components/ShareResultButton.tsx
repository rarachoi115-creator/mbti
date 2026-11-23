"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 현재 결과 페이지 주소(URL)를 클립보드에 복사해 주는 버튼 컴포넌트입니다.
 * 브라우저의 window.location과 클립보드 API를 사용하므로 클라이언트 컴포넌트로 작성했습니다.
 */
export default function ShareResultButton() {
  // 복사 완료 안내 문구를 화면에 보여줄지 여부
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 컴포넌트가 사라질 때 남아 있는 타이머를 정리해 메모리 누수를 막습니다.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /**
   * "결과 공유하기" 버튼을 눌렀을 때 현재 주소를 복사합니다.
   */
  const handleCopyUrl = async () => {
    const currentUrl = window.location.href;
    let copied = false;

    // 최신 브라우저의 클립보드 API로 먼저 복사를 시도합니다.
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        copied = true;
      } catch {
        copied = false;
      }
    }

    // 일부 환경에서 클립보드 API가 제한된 경우 임시 입력 상자로 대체 복사합니다.
    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = currentUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setIsCopied(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // 2.5초 뒤 안내 문구를 자연스럽게 숨깁니다.
      timerRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleCopyUrl}
        className="flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-6 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(217,67,110,0.3)] transition-all hover:brightness-105 active:scale-[0.98]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span>결과 공유하기</span>
      </button>

      {/* 주소 복사가 완료되면 버튼 아래에 안내 문구를 표시합니다 */}
      <div aria-live="polite" className="mt-2 min-h-[1.5rem]">
        {isCopied && (
          <p
            role="status"
            className="rounded-full bg-rose-100 px-3.5 py-1 text-xs font-bold text-rose-700 shadow-xs"
          >
            주소를 복사했어요
          </p>
        )}
      </div>
    </div>
  );
}
