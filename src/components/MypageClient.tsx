"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import CharacterViewer from "@/components/CharacterViewer";
import { getMbtiTypeInfo } from "@/data/types";
import { getKoreanDbErrorMessage } from "@/lib/dbErrors";
import { isValidMbtiType, type MbtiType } from "@/lib/mbti";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

/**
 * test_results 테이블에서 읽어 온 검사 기록 한 줄의 데이터 구조입니다.
 */
interface TestResultRecord {
  id: number;
  mbti_type: MbtiType;
  created_at: string;
}

/**
 * ISO 날짜 문자열을 "2026.11.17" 형식(YYYY.MM.DD)으로 변환합니다.
 */
function formatResultDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * Supabase test_results 테이블에서 로그인 회원의 검사 기록을 최신순으로 가져옵니다.
 * 상태 변경(setState)을 포함하지 않는 순수 비동기 조회 함수입니다.
 */
async function fetchMyTestResults(): Promise<{
  rows: TestResultRecord[];
  errorMsg: string;
}> {
  if (!isSupabaseConfigured) {
    return {
      rows: [],
      errorMsg: "Supabase 연결 설정(.env.local)이 아직 완료되지 않았어요.",
    };
  }

  try {
    const { data, error } = await supabase
      .from("test_results")
      .select("id, mbti_type, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        rows: [],
        errorMsg: getKoreanDbErrorMessage(error, "load"),
      };
    }

    const validRows: TestResultRecord[] = (data ?? []).filter(
      (row): row is { id: number; mbti_type: MbtiType; created_at: string } =>
        typeof row.id === "number" &&
        typeof row.mbti_type === "string" &&
        isValidMbtiType(row.mbti_type) &&
        typeof row.created_at === "string"
    );

    return { rows: validRows, errorMsg: "" };
  } catch {
    return {
      rows: [],
      errorMsg: "검사 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    };
  }
}

/**
 * 마이페이지(/mypage) 클라이언트 컴포넌트입니다.
 * - 로그인한 회원만 접근할 수 있으며, 비로그인 시 /login?next=/mypage 로 이동합니다.
 * - 맨 위에 "닉네임 님의 기록" 과 가입 이메일을 보여 줍니다.
 * - 가장 최근 저장 결과의 3D 캐릭터 1개를 보여 주고, 아래에 최신순 목록과 삭제 기능을 제공합니다.
 */
export default function MypageClient() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [results, setResults] = useState<TestResultRecord[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 비로그인 상태가 확정되면 로그인 페이지(/login?next=/mypage)로 보냅니다.
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login?next=/mypage");
    }
  }, [isAuthLoading, user, router]);

  // 로그인된 회원의 검사 기록을 최신순으로 비동기 조회합니다.
  useEffect(() => {
    if (isAuthLoading || !user) return;
    let isMounted = true;

    void fetchMyTestResults().then(({ rows, errorMsg }) => {
      if (!isMounted) return;
      setResults(rows);
      setErrorMessage(errorMsg);
      setIsFetching(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, user]);

  // 오류 발생 시 "다시 불러오기" 버튼 클릭 처리
  const handleRetryLoad = async () => {
    if (!user) return;
    setErrorMessage("");
    setIsFetching(true);
    const { rows, errorMsg } = await fetchMyTestResults();
    setResults(rows);
    setErrorMessage(errorMsg);
    setIsFetching(false);
  };

  // 삭제 확인 후 실제 DB 행을 지우고 화면 목록에서도 즉시 제거합니다.
  const handleConfirmDelete = async (targetId: number) => {
    if (deletingId !== null) return;

    setErrorMessage("");
    setDeletingId(targetId);

    try {
      const { error } = await supabase
        .from("test_results")
        .delete()
        .eq("id", targetId);

      if (error) {
        setErrorMessage(getKoreanDbErrorMessage(error, "delete"));
        return;
      }

      setResults((prev) => prev.filter((item) => item.id !== targetId));
      setConfirmDeleteId(null);
    } catch {
      setErrorMessage(
        "검사 기록을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // 로그인 확인 중이거나 비로그인 리다이렉트 중이거나 기록을 불러오는 동안 안내 문구 표시
  if (isAuthLoading || !user || isFetching) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-3xl border border-white bg-white/88 p-8 shadow-[0_8px_24px_rgba(225,115,145,0.12)]">
        <p className="text-sm font-semibold text-rose-500">불러오는 중...</p>
      </div>
    );
  }

  // 회원가입 시 user_metadata.nickname 에 저장해 둔 닉네임 읽기
  const rawNickname =
    typeof user.user_metadata?.nickname === "string"
      ? user.user_metadata.nickname.trim()
      : "";
  const nickname = rawNickname || "회원";

  // 가장 최근 저장한 기록 (배열 첫 번째 항목)
  const latestRecord = results[0] ?? null;
  const latestInfo = latestRecord
    ? getMbtiTypeInfo(latestRecord.mbti_type)
    : null;

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* 1) 맨 위: "닉네임 님의 기록" 과 가입 이메일 */}
      <section className="rounded-3xl border border-white bg-white/92 p-5 shadow-[0_10px_28px_rgba(225,115,145,0.14)]">
        <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
          마이페이지
        </span>
        <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-800">
          {nickname} 님의 기록
        </h1>
        <p className="mt-1 text-sm font-medium break-all text-slate-500">
          {user.email ?? "이메일 정보 없음"}
        </p>
      </section>

      {/* 오류 알림 영역 */}
      {errorMessage && (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-3xl border border-rose-200 bg-rose-50/95 p-5 text-center"
        >
          <p className="text-sm font-semibold break-keep text-rose-700">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={() => void handleRetryLoad()}
            className="cursor-pointer rounded-full bg-white px-4 py-1.5 text-xs font-bold text-rose-700 shadow-xs transition-colors hover:bg-rose-100"
          >
            다시 불러오기
          </button>
        </div>
      )}

      {/* 2) 기록이 없을 때: "아직 저장한 결과가 없어요" + "검사하러 가기" 버튼 */}
      {results.length === 0 && !errorMessage ? (
        <section className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-white bg-white/92 px-6 py-12 text-center shadow-[0_10px_28px_rgba(225,115,145,0.12)]">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <p className="mt-4 text-base font-bold text-slate-700">
            아직 저장한 결과가 없어요
          </p>
          <p className="mt-1.5 text-sm text-slate-500">
            12개 질문에 답하고 나만의 3D 동물 캐릭터를 저장해 보세요.
          </p>
          <Link
            href="/test"
            className="mt-6 inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(217,67,110,0.28)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            검사하러 가기
          </Link>
        </section>
      ) : null}

      {/* 3) 가장 최근에 저장한 유형의 3D 캐릭터 (단일 캔버스) */}
      {latestInfo && (
        <section
          aria-label="가장 최근 저장한 유형의 3D 캐릭터"
          className="rounded-3xl border-2 border-white/90 px-3 pt-3 pb-4 text-center shadow-[0_12px_28px_rgba(225,115,145,0.14)]"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${latestInfo.color}66 0%, rgba(255, 255, 255, 0.72) 82%)`,
          }}
        >
          <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-rose-700 shadow-xs">
            최근 저장 캐릭터
          </span>
          <CharacterViewer
            type={latestInfo.code}
            className="h-[240px] w-full sm:h-[260px]"
          />
          <div className="mt-1 flex items-center justify-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-extrabold text-slate-800"
              style={{ backgroundColor: latestInfo.color }}
            >
              {latestInfo.code}
            </span>
            <span className="text-base font-extrabold text-slate-800">
              {latestInfo.character.name}
            </span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-rose-600">
            {latestInfo.nickname}
          </p>
        </section>
      )}

      {/* 4) 내 검사 기록 목록 (최신순: 날짜 · 유형 코드 · 별명 · 삭제 버튼) */}
      {results.length > 0 && (
        <section
          aria-label="내 검사 기록 목록"
          className="rounded-3xl border border-white bg-white/92 p-5 shadow-[0_8px_24px_rgba(140,100,120,0.09)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-800">
              내 검사 기록 ({results.length}건)
            </h2>
            <span className="text-xs font-medium text-slate-400">최신순</span>
          </div>

          <ul className="space-y-2.5">
            {results.map((item) => {
              const info = getMbtiTypeInfo(item.mbti_type);
              const isConfirming = confirmDeleteId === item.id;
              const isDeleting = deletingId === item.id;

              return (
                <li
                  key={item.id}
                  className="rounded-2xl border border-rose-100/90 bg-[#fffafb] px-3.5 py-2.5 transition-colors hover:bg-rose-50/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* 날짜, 유형 코드, 별명을 한 줄에 표시하고 누르면 결과 페이지로 이동 */}
                    <Link
                      href={`/result/${item.mbti_type}`}
                      className="flex min-w-0 flex-1 items-center gap-2 py-0.5"
                    >
                      <span className="shrink-0 text-xs font-medium text-slate-400 tabular-nums">
                        {formatResultDate(item.created_at)}
                      </span>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-xs font-extrabold tracking-wide text-slate-800"
                        style={{ backgroundColor: info.color }}
                      >
                        {info.code}
                      </span>
                      <span className="truncate text-sm font-bold text-slate-700">
                        {info.nickname}
                      </span>
                    </Link>

                    {/* 삭제 버튼 (누르면 정말 지울지 먼저 확인합니다) */}
                    {!isConfirming && (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        disabled={deletingId !== null}
                        className="shrink-0 cursor-pointer rounded-xl border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        삭제
                      </button>
                    )}
                  </div>

                  {/* 정말 지울지 확인하는 인라인 안내 */}
                  {isConfirming && (
                    <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-rose-100/80 pt-2.5">
                      <span className="text-xs font-semibold text-rose-700">
                        이 기록을 정말 지울까요?
                      </span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={isDeleting}
                          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleConfirmDelete(item.id)}
                          disabled={isDeleting}
                          className="cursor-pointer rounded-xl bg-rose-600 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeleting ? "처리 중..." : "삭제 확인"}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
