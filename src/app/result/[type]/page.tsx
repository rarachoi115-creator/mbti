import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import CharacterViewer from "@/components/CharacterViewer";
import ShareResultButton from "@/components/ShareResultButton";
import { getMbtiTypeInfo } from "@/data/types";
import { ALL_MBTI_TYPES, isValidMbtiType } from "@/lib/mbti";

/** 결과 페이지 브라우저 탭 제목과 설명입니다. */
export const metadata: Metadata = {
  title: "검사 결과 | 새코미 MBTI",
  description: "나의 새코미 MBTI 성격 유형과 3D 동물 캐릭터를 확인해 보세요.",
};

/**
 * 빌드 시 16가지 유효한 MBTI 결과 경로(/result/ENFP 등)를 미리 생성합니다.
 */
export function generateStaticParams() {
  return ALL_MBTI_TYPES.map((type) => ({ type }));
}

/**
 * 강점 / 조심할 점 목록을 동일한 카드 형태로 보여 주는 보조 컴포넌트입니다.
 */
function TraitListCard({
  title,
  items,
  accentColor,
  bulletClassName,
}: {
  title: string;
  items: readonly string[];
  accentColor: string;
  bulletClassName: string;
}) {
  return (
    <div className="rounded-3xl border border-white bg-white/92 p-5 shadow-[0_8px_24px_rgba(140,100,120,0.08)]">
      <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-800">
        <span
          aria-hidden="true"
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        {title}
      </h2>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed break-keep text-slate-700"
          >
            <span
              aria-hidden="true"
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${bulletClassName}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 16가지에 없는 잘못된 유형 코드일 때 보여줄 안내 카드입니다.
 */
function InvalidTypeView() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-white bg-white/90 px-6 py-12 text-center shadow-[0_10px_30px_rgba(225,115,145,0.16)]">
      <span className="inline-block rounded-full bg-rose-100 px-3.5 py-1 text-xs font-bold text-rose-700">
        안내
      </span>

      <h1 className="mt-4 text-2xl font-extrabold text-slate-800">
        없는 유형이에요
      </h1>

      <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
        요청하신 성격 유형을 찾을 수 없어요. 첫 화면으로 돌아가 다시 시작해 보세요.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-7 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_rgba(217,67,110,0.3)] transition-all hover:brightness-105 active:scale-[0.98]"
      >
        홈으로 가기
      </Link>
    </section>
  );
}

/**
 * URL 파라미터(type)를 읽어 해당 유형의 결과 화면을 그리는 서버 컴포넌트입니다.
 * - 소문자(/result/enfp)로 들어와도 대문자로 변환해 정상 동작합니다.
 * - Next.js 16 Cache Components 규칙에 맞춰 Suspense 내부에서 params를 await 합니다.
 */
async function ResultContent({
  params,
}: Pick<PageProps<"/result/[type]">, "params">) {
  const { type } = await params;
  const normalizedType = type.toUpperCase();

  // 16가지에 없는 코드면 안내 문구와 홈 버튼을 보여줍니다.
  if (!isValidMbtiType(normalizedType)) {
    return <InvalidTypeView />;
  }

  const typeInfo = getMbtiTypeInfo(normalizedType);

  return (
    /* 페이지 전체에 유형 대표 색상이 은은하게 퍼지도록 상하좌우 여백까지 채운 배경 래퍼 */
    <div
      className="-mx-5 -mt-7 -mb-8 flex flex-1 flex-col gap-5 px-5 pt-7 pb-8"
      style={{
        background: `linear-gradient(180deg, ${typeInfo.color}4D 0%, ${typeInfo.color}24 50%, rgba(255, 255, 255, 0) 100%)`,
      }}
    >
      {/* 1) 상단 요약: "당신의 유형은", 큰 유형 코드, 별명 */}
      <section className="text-center">
        <p className="text-sm font-bold text-slate-600">당신의 유형은</p>
        <h1 className="mt-1 text-5xl font-extrabold tracking-widest text-slate-800">
          {typeInfo.code}
        </h1>
        <p
          className="mt-2.5 inline-block rounded-full border border-white/90 px-4 py-1.5 text-base font-bold text-slate-800 shadow-xs"
          style={{ backgroundColor: `${typeInfo.color}99` }}
        >
          {typeInfo.nickname}
        </p>
      </section>

      {/* 2) 캐릭터 자리: 해당 유형의 3D 캐릭터와 캐릭터 이름 표시 (단일 캔버스) */}
      <section
        aria-label="캐릭터 영역"
        className="flex flex-col items-center rounded-3xl border-2 border-white/90 px-3 pt-2 pb-4 text-center shadow-[0_12px_28px_rgba(120,85,105,0.12)]"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${typeInfo.color}CC 0%, ${typeInfo.color}7A 100%)`,
        }}
      >
        <CharacterViewer
          type={typeInfo.code}
          className="h-[260px] w-full sm:h-[290px]"
        />
        <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-800">
          {typeInfo.character.name}
        </p>
        <p className="mt-0.5 text-xs font-medium text-slate-700/80">
          끌어서 돌려 보고, 클릭하거나 마우스로 튕겨 보세요!
        </p>
      </section>

      {/* 3) 한 줄 소개와 성격 설명 */}
      <section className="rounded-3xl border border-white bg-white/92 p-5 shadow-[0_8px_24px_rgba(140,100,120,0.09)]">
        <p
          className="border-l-4 pl-3 text-base leading-snug font-bold break-keep text-slate-800"
          style={{ borderColor: typeInfo.color }}
        >
          {typeInfo.summary}
        </p>
        <p className="mt-3.5 text-sm leading-7 break-keep text-slate-600">
          {typeInfo.description}
        </p>
      </section>

      {/* 4) 강점 목록과 조심할 점 목록 */}
      <section className="grid grid-cols-1 gap-4">
        <TraitListCard
          title="강점"
          items={typeInfo.strengths}
          accentColor={typeInfo.color}
          bulletClassName="bg-rose-400"
        />
        <TraitListCard
          title="조심할 점"
          items={typeInfo.cautions}
          accentColor={typeInfo.color}
          bulletClassName="bg-amber-400"
        />
      </section>

      {/* 5) 잘 맞는 유형 2개: 누르면 해당 유형 결과 페이지로 이동 */}
      <section className="rounded-3xl border border-white bg-white/92 p-5 shadow-[0_8px_24px_rgba(140,100,120,0.08)]">
        <h2 className="text-base font-extrabold text-slate-800">잘 맞는 유형</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {typeInfo.bestMatches.map((matchCode) => {
            const matchInfo = getMbtiTypeInfo(matchCode);
            return (
              <Link
                key={matchCode}
                href={`/result/${matchCode}`}
                className="flex flex-col justify-between rounded-2xl border border-rose-100/80 bg-[#fffafb] p-3.5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-extrabold tracking-wide text-slate-800">
                    {matchInfo.code}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: matchInfo.color }}
                  />
                </div>
                <p className="mt-1.5 text-xs font-semibold break-keep text-slate-500">
                  {matchInfo.nickname}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6) 하단 버튼 2개: "다시 검사하기"와 "결과 공유하기" */}
      <section aria-label="결과 이동 및 공유" className="mt-1 flex flex-col gap-3">
        <ShareResultButton />

        <Link
          href="/test"
          className="flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-rose-200 bg-white/95 px-6 py-3.5 text-base font-bold text-slate-700 shadow-xs transition-all hover:bg-rose-50 active:scale-[0.98]"
        >
          다시 검사하기
        </Link>
      </section>
    </div>
  );
}

/**
 * /result/[type] 경로의 결과 페이지입니다.
 */
export default function ResultPage({ params }: PageProps<"/result/[type]">) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center rounded-3xl border border-white bg-white/85 p-8 text-sm font-medium text-slate-500">
          결과를 불러오는 중이에요...
        </div>
      }
    >
      <ResultContent params={params} />
    </Suspense>
  );
}
