import type { Metadata } from "next";
import Link from "next/link";
import AnimalAvatarSvg from "@/components/AnimalAvatarSvg";
import { createPageMetadata } from "@/lib/metadata";

/** 없는 주소(404)로 들어왔을 때 브라우저 탭과 공유 카드에 표시할 메타데이터입니다. */
export const metadata: Metadata = createPageMetadata({
  title: "페이지를 찾을 수 없어요 | 새코미 MBTI",
  description:
    "요청하신 페이지를 찾을 수 없어요. 새코미 MBTI 첫 화면으로 돌아가 성격 유형 검사를 시작해 보세요.",
});

/**
 * 존재하지 않는 URL 로 접근했을 때 자동으로 보여 주는 공통 404 페이지입니다.
 * - 루트 not-found.tsx 는 앱 전체 경로와 함께 번들되므로, 3D 캔버스 대신 가벼운 서버 컴포넌트와 SVG 로 구성했습니다.
 */
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <section className="flex flex-col items-center rounded-3xl border border-white bg-white/92 px-6 py-10 text-center shadow-[0_12px_30px_rgba(225,115,145,0.16)]">
        {/* 404 상태 배지 */}
        <span className="inline-block rounded-full bg-rose-100 px-3.5 py-1 text-xs font-bold tracking-wide text-rose-700">
          404 · 길을 잃었어요
        </span>

        {/* 가벼운 2D 포근 곰돌이 캐릭터 아이콘 */}
        <div
          aria-hidden="true"
          className="mt-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/70 pt-1.5 shadow-xs"
        >
          <AnimalAvatarSvg type="ISFJ" />
        </div>

        {/* 안내 제목과 설명 */}
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight break-keep text-slate-800">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed break-keep text-slate-500">
          입력하신 주소가 잘못되었거나 사라진 페이지예요. 아래 버튼을 눌러
          돌아가 보세요.
        </p>

        {/* 첫 화면 / 검사 시작 이동 버튼 */}
        <div className="mt-7 flex w-full flex-col gap-2.5">
          <Link
            href="/"
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-6 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_rgba(217,67,110,0.28)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            홈으로 가기
          </Link>
          <Link
            href="/test"
            className="flex min-h-[50px] w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-6 py-3 text-sm font-bold text-rose-700 shadow-xs transition-all hover:bg-rose-50 active:scale-[0.98]"
          >
            MBTI 검사 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
}
