"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getKoreanDbErrorMessage } from "@/lib/dbErrors";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { MbtiType } from "@/lib/mbti";

interface SaveResultButtonProps {
  /** 현재 결과 페이지의 4글자 MBTI 유형 코드 */
  type: MbtiType;
}

/**
 * 결과 페이지(/result/[type])에서 검사 결과를 DB(test_results)에 저장하는 버튼 컴포넌트입니다.
 * - 로그인 상태: test_results 테이블에 mbti_type 만 보냅니다 (user_id, created_at 은 DB 기본값으로 자동 저장).
 * - 저장 완료 시 버튼 문구가 "저장했어요" 로 바뀌며 다시 누를 수 없게 됩니다.
 * - 로그아웃 상태: /login?next=/result/유형코드 로 이동해 로그인 후 결과 페이지로 돌아오게 합니다.
 */
export default function SaveResultButton({ type }: SaveResultButtonProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    if (isLoading || isSaving || isSaved) return;

    // 1) 로그아웃 상태라면 로그인 후 다시 현재 결과 페이지로 돌아오도록 보냅니다.
    if (!user) {
      router.push(`/login?next=/result/${type}`);
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase 연결 설정(.env.local)이 아직 완료되지 않았어요.");
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    try {
      // 2) user_id 와 created_at 은 DB 기본값(auth.uid(), now())이 채우므로 mbti_type 만 저장합니다.
      const { error } = await supabase
        .from("test_results")
        .insert({ mbti_type: type });

      if (error) {
        setErrorMessage(getKoreanDbErrorMessage(error, "save"));
        return;
      }

      setIsSaved(true);
    } catch {
      setErrorMessage(
        "검사 결과를 저장하지 못했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving || isSaved}
        className={`flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border px-6 py-3.5 text-base font-bold shadow-xs transition-all ${
          isSaved
            ? "cursor-default border-emerald-200 bg-emerald-50 text-emerald-700"
            : "cursor-pointer border-rose-200 bg-white/95 text-rose-700 hover:bg-rose-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        }`}
      >
        {isSaved ? (
          <>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span>저장했어요</span>
          </>
        ) : isSaving ? (
          <span>저장 중...</span>
        ) : (
          <>
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
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>내 기록에 저장</span>
          </>
        )}
      </button>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold break-keep text-rose-700"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
