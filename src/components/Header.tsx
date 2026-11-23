import Link from "next/link";

/**
 * 모든 페이지 상단에 공통으로 표시되는 헤더 컴포넌트입니다.
 * - 왼쪽: 서비스 이름("새코미 MBTI")을 누르면 첫 화면(/)으로 이동합니다.
 * - 오른쪽: 현재는 "유형 도감" 메뉴만 두어 /types 경로로 연결합니다.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-rose-100/90 bg-white/85 px-5 backdrop-blur-md">
      {/* 왼쪽 서비스 이름: 클릭하면 홈(/)으로 이동 */}
      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl py-1 pr-2 transition-opacity hover:opacity-80"
      >
        {/* 귀여운 체리색 파스텔 로고 배지 (별도 아이콘 패키지 없이 SVG로 구현) */}
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffd0dc] via-[#ffb8cb] to-[#ffe1ea] text-rose-700 shadow-xs"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l1.9 4.3L18.5 9l-4.6 1.7L12 15l-1.9-4.3L5.5 9l4.6-1.7L12 3z" />
            <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
          </svg>
        </span>
        <span className="text-lg font-extrabold tracking-tight text-slate-800">
          새코미 MBTI
        </span>
      </Link>

      {/* 오른쪽 상단 메뉴: 지금은 "유형 도감" 하나만 배치 */}
      <nav aria-label="주 메뉴">
        <Link
          href="/types"
          className="inline-flex items-center rounded-full bg-rose-100/90 px-4 py-2 text-sm font-semibold text-rose-700 shadow-xs transition-all hover:bg-rose-200/80 active:scale-[0.97]"
        >
          유형 도감
        </Link>
      </nav>
    </header>
  );
}
