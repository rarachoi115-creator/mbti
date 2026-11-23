import type { Metadata } from "next";

/** 서비스 전역에서 공통으로 사용하는 사이트 이름입니다. */
const SITE_NAME = "새코미 MBTI";

interface PageMetadataInput {
  /** 브라우저 탭과 공유 카드에 표시할 제목 */
  title: string;
  /** 검색 엔진과 공유 카드에 표시할 한두 줄 설명 */
  description: string;
}

/**
 * 각 페이지의 title, description 과 링크 공유 미리보기(Open Graph) 정보를 일관되게 만듭니다.
 * Next.js는 하위 페이지에서 openGraph 를 지정할 때 상위 openGraph 필드를 덮어쓰므로,
 * siteName, locale, type 을 함께 넣어 모든 페이지에서 미리보기가 깔끔하게 보이도록 합니다.
 */
export function createPageMetadata({
  title,
  description,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
  };
}
