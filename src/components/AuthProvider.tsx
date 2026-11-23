"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

/**
 * 앱 전역에서 공유할 로그인 상태와 함수들의 타입입니다.
 */
interface AuthContextValue {
  /** 현재 로그인한 회원 정보 (로그아웃 상태이면 null) */
  user: User | null;
  /** 현재 활성화된 Supabase 세션 정보 */
  session: Session | null;
  /** 처음 페이지가 열릴 때 로그인 상태를 확인하는 중인지 여부 */
  isLoading: boolean;
  /** 현재 계정을 로그아웃하는 함수 */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * 앱 전체를 감싸 로그인 상태를 실시간으로 공유하는 AuthProvider 컴포넌트입니다.
 * - 브라우저에서 src/lib/supabase.ts 의 단일 클라이언트로 세션을 읽고 변화를 감지합니다.
 * - 로그인/회원가입/로그아웃이 일어나면 헤더 등 모든 구독 컴포넌트가 즉시 바뀝니다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1) 처음 마운트될 때 브라우저에 저장된 현재 로그인 세션을 읽어옵니다.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setSession(data.session ?? null);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setSession(null);
        setIsLoading(false);
      });

    // 2) 로그인·로그아웃·토큰 갱신 등 인증 상태 변화를 실시간으로 감지합니다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 로그아웃 처리: 서버 세션 정리가 실패하더라도 브라우저 로컬 세션은 확실히 지웁니다.
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      await supabase.auth.signOut({ scope: "local" });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 컴포넌트 안에서 현재 로그인 상태(user, isLoading, signOut 등)를 꺼내 쓰는 훅입니다.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 는 AuthProvider 내부에서만 사용할 수 있어요.");
  }
  return context;
}
