import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import "./globals.css";

/**
 * next/font/google 로 Noto Sans KR 가변 글꼴을 불러옵니다.
 * 빌드 시 Next.js가 폰트를 최적화해 주므로 화면 깜빡임 없이 깔끔하게 표시됩니다.
 */
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

/** 브라우저 탭 제목과 검색 엔진용 한국어 설명입니다. */
export const metadata: Metadata = {
  title: "새코미 MBTI",
  description: "12개 질문으로 알아보는 나만의 3D 동물 캐릭터 성격 유형 검사",
};

/**
 * 모든 페이지가 공통으로 사용하는 최상위 레이아웃입니다.
 * - PC 화면에서도 최대 너비 480px 가운데 정렬을 유지해 휴대폰 화면처럼 보이도록 구성했습니다.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.className} ${notoSansKr.variable} min-h-full antialiased`}
    >
      <body className="min-h-dvh">
        {/* 가운데 정렬된 최대 너비 480px 모바일 앱 틀 (체리색 파스텔 배경) */}
        <AuthProvider>
          <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-gradient-to-b from-[#fffbfc] via-[#fff3f6] to-[#ffeaf0] sm:border-x sm:border-white/90 sm:shadow-[0_12px_40px_rgba(225,115,145,0.18)]">
            {/* 모든 페이지 공통 상단 헤더 */}
            <Header />

            {/* 각 페이지 내용이 들어가는 본문 영역 */}
            <main className="flex flex-1 flex-col px-5 pt-7 pb-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
