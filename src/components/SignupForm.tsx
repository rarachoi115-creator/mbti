"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getKoreanAuthErrorMessage } from "@/lib/authErrors";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

/**
 * 회원가입(/signup) 폼 클라이언트 컴포넌트입니다.
 * - 닉네임, 이메일, 비밀번호(6자 이상), 비밀번호 확인을 입력받습니다.
 * - 닉네임은 별도 테이블을 만들지 않고 Supabase Auth의 user_metadata.nickname 에 저장합니다.
 * - 바로 세션이 생기면 홈(/)으로 이동하고, 이메일 인증이 켜져 있으면 안내 문구를 보여 줍니다.
 */
export default function SignupForm() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage("");
    setInfoMessage("");

    const trimmedNickname = nickname.trim();
    const trimmedEmail = email.trim();

    // 1) 클라이언트 입력값 검증 (모든 오류 문구는 한국어로 안내)
    if (!trimmedNickname) {
      setErrorMessage("닉네임을 입력해 주세요.");
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("올바른 이메일 주소 형식으로 입력해 주세요.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("비밀번호는 6자 이상으로 입력해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호 확인이 일치하지 않아요.");
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase 연결 설정(.env.local)이 아직 완료되지 않았어요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2) Supabase Auth 로 회원가입 요청 (닉네임은 user_metadata 에 함께 저장)
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            nickname: trimmedNickname,
          },
        },
      });

      if (error) {
        setErrorMessage(getKoreanAuthErrorMessage(error));
        return;
      }

      // 이메일 인증이 켜진 프로젝트에서 이미 가입된 이메일로 시도하면
      // 보안상 identities 가 빈 배열로 내려오므로 중복 가입으로 안내합니다.
      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        setErrorMessage("이미 가입된 이메일이에요. 로그인해 주세요.");
        return;
      }

      // 3) 바로 로그인 세션이 발급된 경우 홈으로 이동합니다.
      if (data.session) {
        router.push("/");
        return;
      }

      // 4) 이메일 인증이 켜져 있어 아직 로그인되지 않은 경우 안내 문구를 표시합니다.
      setInfoMessage(
        "가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요."
      );
    } catch {
      setErrorMessage("요청을 처리하는 중 문제가 생겼어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center">
      <section className="rounded-3xl border border-white bg-white/92 p-6 shadow-[0_12px_30px_rgba(225,115,145,0.16)]">
        <div className="text-center">
          <span className="inline-block rounded-full bg-rose-100 px-3.5 py-1 text-xs font-bold text-rose-700">
            새코미 MBTI 회원
          </span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-800">
            회원가입
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            닉네임과 이메일로 가볍게 시작해 보세요.
          </p>
        </div>

        {/* 이메일 인증 대기 안내 메시지 */}
        {infoMessage ? (
          <div
            role="status"
            className="mt-6 space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 text-center"
          >
            <p className="text-sm leading-relaxed font-semibold break-keep text-emerald-800">
              {infoMessage}
            </p>
            <Link
              href="/login"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(217,67,110,0.28)] transition-all hover:brightness-105 active:scale-[0.98]"
            >
              로그인 페이지로 가기
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {/* 닉네임 입력 칸 */}
            <div>
              <label
                htmlFor="signup-nickname"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                닉네임
              </label>
              <input
                id="signup-nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={isSubmitting}
                placeholder="예: 다정한 다람쥐"
                className="min-h-[48px] w-full rounded-2xl border border-rose-100 bg-rose-50/35 px-4 py-3 text-sm text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-rose-400 focus:bg-white disabled:opacity-60"
              />
            </div>

            {/* 이메일 입력 칸 */}
            <div>
              <label
                htmlFor="signup-email"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                이메일
              </label>
              <input
                id="signup-email"
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
                htmlFor="signup-password"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                비밀번호
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="6자 이상 입력해 주세요"
                className="min-h-[48px] w-full rounded-2xl border border-rose-100 bg-rose-50/35 px-4 py-3 text-sm text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-rose-400 focus:bg-white disabled:opacity-60"
              />
            </div>

            {/* 비밀번호 확인 입력 칸 */}
            <div>
              <label
                htmlFor="signup-password-confirm"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                비밀번호 확인
              </label>
              <input
                id="signup-password-confirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                disabled={isSubmitting}
                placeholder="비밀번호를 한 번 더 입력해 주세요"
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

            {/* 회원가입 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex min-h-[52px] w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-[#d9436e] to-[#eb5c84] px-5 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_rgba(217,67,110,0.28)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "처리 중..." : "회원가입"}
            </button>
          </form>
        )}

        <div className="mt-5 border-t border-rose-100/80 pt-4 text-center text-sm text-slate-500">
          이미 회원이신가요?{" "}
          <Link
            href="/login"
            className="font-bold text-rose-600 underline-offset-4 hover:underline"
          >
            로그인
          </Link>
        </div>
      </section>
    </div>
  );
}
