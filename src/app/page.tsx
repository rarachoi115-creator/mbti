import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 첫 화면에 보여줄 특징 카드 데이터 타입입니다.
 */
interface FeatureCardItem {
  title: string;
  description: string;
  badgeBgClass: string;
  cardBgClass: string;
  icon: ReactNode;
}

/**
 * 첫 화면에 표시할 특징 카드 3개의 정보 목록입니다.
 * 반복되는 카드 UI를 배열로 관리하면 코드를 깔끔하게 유지할 수 있습니다.
 */
const FEATURE_CARDS: FeatureCardItem[] = [
  {
    title: "12문항 · 2분",
    description: "짧고 가벼운 질문에 답하면 금방 끝나요",
    badgeBgClass: "bg-pink-100 text-pink-600",
    cardBgClass: "bg-white/90 border-pink-100/90",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "16가지 유형",
    description: "나의 성향을 16개 동물 친구 중 하나로 매칭해요",
    badgeBgClass: "bg-purple-100 text-purple-600",
    cardBgClass: "bg-white/90 border-purple-100/90",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="4" width="7" height="7" rx="2" />
        <rect x="13" y="4" width="7" height="7" rx="2" />
        <rect x="4" y="13" width="7" height="7" rx="2" />
        <rect x="13" y="13" width="7" height="7" rx="2" />
      </svg>
    ),
  },
  {
    title: "유형별 3D 캐릭터",
    description: "나만의 귀여운 3D 동물 캐릭터를 만날 수 있어요",
    badgeBgClass: "bg-sky-100 text-sky-600",
    cardBgClass: "bg-white/90 border-sky-100/90",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5" />
        <path d="M12 12v9" />
        <path d="M12 12L4 7.5" />
      </svg>
    ),
  },
];

/**
 * 서비스의 첫 화면(/) 컴포넌트입니다.
 * - 큰 제목, 한 줄 소개, "검사 시작하기" 버튼(/test), 특징 카드 3개, 안내 문구를 순서대로 보여줍니다.
 */
export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* 상단 히어로 카드: 연한 파란색 계열의 밝은 파스텔 배경과 부드러운 그림자 적용 */}
      <section className="rounded-3xl border border-white bg-gradient-to-br from-[#e2f0ff] via-[#edf6ff] to-[#dff1ff] p-6 text-center shadow-[0_10px_30px_rgba(105,155,220,0.16)]">
        {/* 작은 서비스 말머리 뱃지 */}
        <span className="inline-block rounded-full bg-white/90 px-3.5 py-1 text-xs font-semibold text-sky-700 shadow-xs">
          새코미 동물 성격 테스트
        </span>

        {/* 귀여운 3D 느낌 파스텔 심볼 원형 영역 */}
        <div
          aria-hidden="true"
          className="mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/95 text-sky-500 shadow-[0_8px_20px_rgba(56,189,248,0.2)]"
        >
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="h-11 w-11"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 귀여운 동물 귀와 얼굴 윤곽 라인 */}
            <path d="M13 18l-2-9 8 5a13 13 0 0 1 10 0l8-5-2 9a12 12 0 0 1 2 7c0 7.5-6 13-13 13s-13-5.5-13-13a12 12 0 0 1 2-7z" />
            <circle cx="19" cy="24" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="29" cy="24" r="1.5" fill="currentColor" stroke="none" />
            <path d="M21.5 28.5c1.5 1.3 3.5 1.3 5 0" />
          </svg>
        </div>

        {/* 큰 제목 */}
        <h1 className="mt-5 text-[1.75rem] font-extrabold tracking-tight text-slate-800">
          나는 어떤 유형일까?
        </h1>

        {/* 한 줄 소개 문구 */}
        <p className="mt-2.5 text-sm leading-relaxed font-medium text-slate-600">
          12개 질문에 답하고 나와 꼭 닮은 3D 동물 캐릭터를 찾아보세요.
        </p>

        {/* 한층 더 크고 큼직한 검사 시작 버튼: 다음 단계에서 만들 /test 경로로 이동 */}
        <Link
          href="/test"
          className="mt-6 flex min-h-[64px] w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#4b83f2] to-[#6366f1] px-7 py-5 text-xl font-bold tracking-tight text-white shadow-[0_12px_28px_rgba(75,131,242,0.34)] transition-all hover:brightness-105 active:scale-[0.98]"
        >
          <span>검사 시작하기</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
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

      {/* 특징 카드 3개 섹션 */}
      <section aria-label="검사 특징" className="mt-6 space-y-3">
        {FEATURE_CARDS.map((card) => (
          <div
            key={card.title}
            className={`flex items-center gap-4 rounded-2xl border p-4 shadow-[0_6px_18px_rgba(110,155,215,0.1)] ${card.cardBgClass}`}
          >
            <div
              aria-hidden="true"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.badgeBgClass}`}
            >
              {card.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-800">
                {card.title}
              </h2>
              <p className="mt-0.5 text-xs leading-snug text-slate-500">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 맨 아래 작은 안내 문구 */}
      <footer className="mt-auto pt-8 text-center">
        <p className="text-xs leading-relaxed text-slate-500">
          이 검사는 재미로 보는 간이 검사이며, 공식 MBTI® 검사가 아닙니다.
        </p>
      </footer>
    </div>
  );
}
