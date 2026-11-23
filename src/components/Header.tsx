"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

/**
 * 모든 페이지 상단에 공통으로 표시되는 헤더 컴포넌트입니다.
 * - 왼쪽: 서비스 이름("새코미 MBTI")을 누르면 첫 화면(/)으로 이동합니다.
 * - 오른쪽: "유형 도감", (로그인 시에만) "마이페이지", 로그인 상태에 따른 "로그인"/"로그아웃" 버튼을 배치합니다.
 * - 로그인 상태를 확인하는 짧은 순간에는 인증 버튼 자리를 비워 깜빡임을 방지합니다.
 * - 휴대폰 너비(375px)에서도 4개 항목이 줄 바꿈·넘침 없이 한 줄에 들어가도록 크기를 조절했습니다.
 */
export default function Header() {
  const { user, isLoading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-rose-100/90 bg-white/85 px-3 backdrop-blur-md sm:px-5">
      {/* 왼쪽 서비스 이름: 클릭하면 홈(/)으로 이동 */}
      <Link
        href="/"
        className="flex min-w-0 items-center gap-1.5 rounded-xl py-1 pr-1 transition-opacity hover:opacity-80 sm:gap-2"
      >
        {/* 귀여운 체리색 파스텔 로고 배지 (별도 아이콘 패키지 없이 SVG로 구현) */}
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffd0dc] via-[#ffb8cb] to-[#ffe1ea] text-rose-700 shadow-xs sm:h-8 sm:w-8 sm:rounded-xl"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l1.9 4.3L18.5 9l-4.6 1.7L12 15l-1.9-4.3L5.5 9l4.6-1.7L12 3z" />
            <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
          </svg>
        </span>
        <span className="truncate text-sm font-extrabold tracking-tight whitespace-nowrap text-slate-800 sm:text-lg">
          새코미 MBTI
        </span>
      </Link>

      {/* 오른쪽 상단 메뉴: 유형 도감 + (로그인 시 마이페이지) + 로그인/로그아웃 */}
      <nav
        aria-label="주 메뉴"
        className="flex shrink-0 items-center gap-1 sm:gap-1.5"
      >
        <Link
          href="/types"
          className="inline-flex items-center rounded-full bg-rose-100/90 px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-rose-700 shadow-xs transition-all hover:bg-rose-200/80 active:scale-[0.97] sm:px-3 sm:text-xs"
        >
          유형 도감
        </Link>

        {/* 로그인 상태를 확인하는 동안에는 자리를 비워 메뉴가 깜빡이지 않게 합니다 */}
        {isLoading ? (
          <span
            aria-hidden="true"
            className="inline-block h-7 w-[56px] sm:h-8 sm:w-[66px]"
          />
        ) : user ? (
          <>
            <Link
              href="/mypage"
              className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-rose-700 ring-1 ring-rose-200/80 transition-all hover:bg-rose-100 active:scale-[0.97] sm:px-3 sm:text-xs"
            >
              마이페이지
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex min-w-[56px] cursor-pointer items-center justify-center rounded-full border border-rose-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-rose-700 shadow-xs transition-all hover:bg-rose-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[66px] sm:px-3 sm:text-xs"
            >
              {isSigningOut ? "처리 중..." : "로그아웃"}
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="inline-flex min-w-[56px] items-center justify-center rounded-full bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-white shadow-xs transition-all hover:brightness-105 active:scale-[0.97] sm:min-w-[66px] sm:px-3 sm:text-xs"
          >
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
}
