"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CharacterViewer from "@/components/CharacterViewer";
import { MBTI_TYPE_LIST, type MbtiTypeInfo } from "@/data/types";
import { getKoreanDbErrorMessage } from "@/lib/dbErrors";
import { isValidMbtiType, type MbtiType } from "@/lib/mbti";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface TypeStatItem {
  info: MbtiTypeInfo;
  count: number;
}

/**
 * 비율(%)을 보기 좋은 숫자로 정리합니다 (예: 25%, 12.5%).
 */
function formatPercent(ratio: number): string {
  const rounded = Math.round(ratio * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/**
 * DB 함수 get_type_stats() 를 호출해 유형별 개수를 읽어옵니다.
 * 상태 변경(setState)이 없는 순수 비동기 조회 함수입니다.
 */
async function fetchTypeStats(): Promise<{
  counts: Partial<Record<MbtiType, number>>;
  errorMsg: string;
}> {
  if (!isSupabaseConfigured) {
    return {
      counts: {},
      errorMsg: "Supabase 연결 설정(.env.local)이 아직 완료되지 않았어요.",
    };
  }

  try {
    const { data, error } = await supabase.rpc("get_type_stats");

    if (error) {
      return {
        counts: {},
        errorMsg: getKoreanDbErrorMessage(error, "stats"),
      };
    }

    const counts: Partial<Record<MbtiType, number>> = {};
    if (Array.isArray(data)) {
      for (const row of data) {
        if (!row || typeof row !== "object") continue;
        const rawType: unknown = (row as { mbti_type?: unknown }).mbti_type;
        const rawCount: unknown = (row as { count?: unknown }).count;

        if (typeof rawType === "string" && isValidMbtiType(rawType)) {
          const parsedCount = Number(rawCount ?? 0);
          counts[rawType] = Number.isFinite(parsedCount)
            ? Math.max(0, parsedCount)
            : 0;
        }
      }
    }

    return { counts, errorMsg: "" };
  } catch {
    return {
      counts: {},
      errorMsg: "통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    };
  }
}

/**
 * /stats 전체 회원 MBTI 통계 페이지의 클라이언트 컴포넌트입니다.
 * - 로그인하지 않은 방문자도 볼 수 있으며, DB 함수 get_type_stats() 로 개수만 집계해 옵니다.
 * - 가장 많은 1위 유형의 3D 캐릭터 1개와 16개 유형 전체 가로 막대 그래프를 보여 줍니다.
 */
export default function StatsClient() {
  const [counts, setCounts] = useState<Partial<Record<MbtiType, number>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    void fetchTypeStats().then(({ counts: fetchedCounts, errorMsg }) => {
      if (!isMounted) return;
      setCounts(fetchedCounts);
      setErrorMessage(errorMsg);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = async () => {
    setErrorMessage("");
    setIsLoading(true);
    const { counts: fetchedCounts, errorMsg } = await fetchTypeStats();
    setCounts(fetchedCounts);
    setErrorMessage(errorMsg);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-3xl border border-white bg-white/88 p-8 shadow-[0_8px_24px_rgba(225,115,145,0.12)]">
        <p className="text-sm font-semibold text-rose-500">
          통계를 불러오는 중...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/95 p-6 text-center shadow-[0_8px_24px_rgba(225,115,145,0.12)]">
        <p role="alert" className="text-sm font-semibold break-keep text-rose-700">
          {errorMessage}
        </p>
        <button
          type="button"
          onClick={() => void handleRetry()}
          className="cursor-pointer rounded-full bg-white px-5 py-2 text-xs font-bold text-rose-700 shadow-xs transition-colors hover:bg-rose-100"
        >
          다시 불러오기
        </button>
      </div>
    );
  }

  // 16개 유형 전체를 개수 많은 순서로 정렬합니다.
  const sortedStats: TypeStatItem[] = MBTI_TYPE_LIST.map((info) => ({
    info,
    count: counts[info.code] ?? 0,
  })).sort((a, b) => b.count - a.count);

  const totalCount = sortedStats.reduce((sum, item) => sum + item.count, 0);

  // 저장된 결과가 아직 하나도 없을 때 안내 화면
  if (totalCount === 0) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-white bg-white/92 px-6 py-12 text-center shadow-[0_10px_28px_rgba(225,115,145,0.12)]">
        <span className="inline-block rounded-full bg-rose-100 px-3.5 py-1 text-xs font-bold text-rose-700">
          전체 통계
        </span>
        <p className="mt-4 text-lg font-extrabold text-slate-800">
          아직 모인 결과가 없어요
        </p>
        <p className="mt-1.5 text-sm text-slate-500">
          첫 번째로 검사를 마치고 결과를 저장해 보세요!
        </p>
        <Link
          href="/test"
          className="mt-6 inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(217,67,110,0.28)] transition-all hover:brightness-105 active:scale-[0.98]"
        >
          검사하러 가기
        </Link>
      </section>
    );
  }

  const topItem = sortedStats[0];
  const maxCount = topItem.count;

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* 1) 맨 위: 지금까지 저장된 전체 결과 수 */}
      <section className="rounded-3xl border border-white bg-white/92 p-5 text-center shadow-[0_10px_28px_rgba(225,115,145,0.14)]">
        <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
          새코미 MBTI 통계
        </span>
        <h1 className="mt-2.5 text-xl font-extrabold tracking-tight break-keep text-slate-800 sm:text-2xl">
          지금까지{" "}
          <span className="text-rose-600 tabular-nums">
            {totalCount.toLocaleString("ko-KR")}
          </span>
          개의 결과가 모였어요
        </h1>
      </section>

      {/* 2) 가장 많은 유형(1위)의 3D 캐릭터와 별명 (단일 3D 캔버스) */}
      <section
        aria-label="가장 많은 성격 유형 3D 캐릭터"
        className="rounded-3xl border-2 border-white/90 px-3 pt-3 pb-4 text-center shadow-[0_12px_28px_rgba(225,115,145,0.14)]"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${topItem.info.color}66 0%, rgba(255, 255, 255, 0.72) 82%)`,
        }}
      >
        <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-rose-700 shadow-xs">
          가장 많은 유형 1위 · {topItem.count.toLocaleString("ko-KR")}개 (
          {formatPercent((topItem.count / totalCount) * 100)}%)
        </span>
        <CharacterViewer
          type={topItem.info.code}
          className="h-[240px] w-full sm:h-[260px]"
        />
        <div className="mt-1 flex items-center justify-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-slate-800"
            style={{ backgroundColor: topItem.info.color }}
          >
            {topItem.info.code}
          </span>
          <span className="text-base font-extrabold text-slate-800">
            {topItem.info.nickname}
          </span>
        </div>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {topItem.info.character.name}
        </p>
      </section>

      {/* 3) 16개 유형 전체 가로 막대 그래프 (그래프 라이브러리 없이 순수 HTML/CSS 구현) */}
      <section
        aria-label="16가지 성격 유형 분포 그래프"
        className="rounded-3xl border border-white bg-white/92 p-5 shadow-[0_8px_24px_rgba(140,100,120,0.09)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-800">
            유형별 순위 (16종)
          </h2>
          <span className="text-xs font-medium text-slate-400">
            개수 많은 순
          </span>
        </div>

        <ul className="space-y-3">
          {sortedStats.map(({ info, count }, index) => {
            const ratio = (count / totalCount) * 100;
            // 개수가 1개 이상이면 아주 작은 비율이어도 막대가 눈에 보이도록 최소 3% 너비를 줍니다.
            const barWidth =
              count > 0 && maxCount > 0
                ? Math.max(3, (count / maxCount) * 100)
                : 0;

            return (
              <li key={info.code}>
                <Link
                  href={`/result/${info.code}`}
                  className="block rounded-2xl p-1.5 transition-colors hover:bg-rose-50/45"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-5 shrink-0 font-extrabold text-slate-400 tabular-nums">
                        {index + 1}
                      </span>
                      <span className="shrink-0 font-extrabold tracking-wide text-slate-800">
                        {info.code}
                      </span>
                      <span className="truncate font-medium text-slate-500">
                        {info.nickname}
                      </span>
                    </div>
                    <span className="shrink-0 font-bold text-slate-700 tabular-nums">
                      {count.toLocaleString("ko-KR")}개 ({formatPercent(ratio)}%)
                    </span>
                  </div>

                  {/* 유형 대표 색상을 채운 가로 막대 */}
                  <div className="h-3.5 w-full overflow-hidden rounded-full border border-slate-200/50 bg-slate-100/90">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: info.color,
                      }}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
