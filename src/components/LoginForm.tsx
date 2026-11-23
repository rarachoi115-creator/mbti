"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getKoreanAuthErrorMessage, getSafeNextPath } from "@/lib/authErrors";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

/**
 * 로그인(/login) 폼 클라이언트 컴포넌트입니다.
 * - 이메일과 비밀번호로 로그인합니다.
 * - 로그인에 성공하면 주소의 next 값(우리 사이트 내부 "/" 시작 주소만 허용)으로 이동하며, 없으면 홈("/")으로 이동합니다.
 */
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage("");
    const trimmedEmail = email.trim();

    // 1) 입력값 검증 (한국어 안내)
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("올바른 이메일 주소 형식으로 입력해 주세요.");
      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력해 주세요.");
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase 연결 설정(.env.local)이 아직 완료되지 않았어요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2) Supabase Auth 로 이메일·비밀번호 로그인 요청
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setErrorMessage(getKoreanAuthErrorMessage(error));
        return;
      }

      // 3) 안전한 내부 경로(next) 또는 홈("/")으로 이동
      const targetPath = getSafeNextPath(searchParams.get("next"));
      router.push(targetPath);
    } catch {
      setErrorMessage("로그인 중 문제가 생겼어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center">
      <section className="rounded-3xl border border-white bg-white/92 p-6 shadow-[0_12px_30px_rgba(225,115,145,0.16)]">
        <div className="text-center">
          <span className="inline-block rounded-full bg-rose-100 px-3.5 py-1 text-xs font-bold text-rose-700">
            다시 만나 반가워요
          </span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-800">
            로그인
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            가입하신 이메일과 비밀번호를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          {/* 이메일 입력 칸 */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-bold text-slate-700"
            >
              이메일
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="example@email.com"
              className="min-h-[48px] w-full rounded-2xl border border-rose-100 bg-rose-50/35 px-4 py-3 text-sm text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-rose-400 focus:bg-white disabled:opacity-60"
            />
          </div>

          {/* 비밀번호 입력 칸 */}
          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-bold text-slate-700"
            >
              비밀번호
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="비밀번호를 입력해 주세요"
              className="min-h-[48px] w-full rounded-2xl border border-rose-100 bg-rose-50/35 px-4 py-3 text-sm text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-rose-400 focus:bg-white disabled:opacity-60"
            />
          </div>

          {/* 한국어 오류 안내 영역 */}
          {errorMessage && (
            <p
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold break-keep text-rose-700"
            >
              {errorMessage}
            </p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex min-h-[52px] w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-5 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_rgba(217,67,110,0.28)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "처리 중..." : "로그인"}
          </button>
        </form>

        {/* 아직 회원이 아닌 사람을 위한 회원가입 링크 */}
        <div className="mt-5 border-t border-rose-100/80 pt-4 text-center text-sm text-slate-500">
          아직 회원이 아니신가요?{" "}
          <Link
            href="/signup"
            className="font-bold text-rose-600 underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </div>
      </section>
    </div>
  );
}
