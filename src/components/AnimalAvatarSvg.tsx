import type { MbtiType } from "@/lib/mbti";

interface AnimalAvatarSvgProps {
  /** 표시할 MBTI 유형 코드 */
  type: MbtiType;
}

/**
 * 유형 도감의 16개 선택 버튼 안에 들어가는 가벼운 2D SVG 미니 캐릭터 아이콘입니다.
 * 3D 캔버스(WebGL)를 여러 개 띄우지 않으면서도 각 동물 캐릭터의 특징을 한눈에 보여 줍니다.
 */
export default function AnimalAvatarSvg({ type }: AnimalAvatarSvgProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="mb-1.5 h-10 w-10 rounded-xl shadow-xs"
    >
      {/* 부드러운 크림 파스텔 배경 */}
      <rect width="48" height="48" rx="12" fill="#fff7f9" />
      <circle cx="24" cy="25" r="18" fill="#ffeaf0" opacity="0.7" />

      {renderAnimalVector(type)}
    </svg>
  );
}

/**
 * 유형 코드마다 서로 다른 귀, 털 색, 눈 무늬, 소품을 SVG 도형으로 조합합니다.
 */
function renderAnimalVector(type: MbtiType) {
  switch (type) {
    case "INTJ":
      // 부엉이: 갈색 깃털, 크림 안면, 동그란 금테 안경
      return (
        <g>
          <polygon points="10,16 14,9 19,14" fill="#8c6244" />
          <polygon points="38,16 34,9 29,14" fill="#8c6244" />
          <circle cx="24" cy="26" r="13.5" fill="#8c6244" />
          <circle cx="19" cy="24" r="6" fill="#f7ebd9" />
          <circle cx="29" cy="24" r="6" fill="#f7ebd9" />
          <circle cx="19" cy="24" r="2.6" fill="#231915" />
          <circle cx="29" cy="24" r="2.6" fill="#231915" />
          <circle cx="18.2" cy="23.2" r="0.9" fill="#ffffff" />
          <circle cx="28.2" cy="23.2" r="0.9" fill="#ffffff" />
          <circle cx="19" cy="24" r="5" fill="none" stroke="#e6b84c" strokeWidth="1.5" />
          <circle cx="29" cy="24" r="5" fill="none" stroke="#e6b84c" strokeWidth="1.5" />
          <line x1="23.5" y1="24" x2="24.5" y2="24" stroke="#e6b84c" strokeWidth="1.5" />
          <polygon points="22,27 26,27 24,31" fill="#e69e35" />
        </g>
      );

    case "INTP":
      // 고양이: 회갈색 줄무늬, 세모 귀, 펼친 책
      return (
        <g>
          <polygon points="10,21 12,9 21,15" fill="#c4bab1" />
          <polygon points="38,21 36,9 27,15" fill="#c4bab1" />
          <polygon points="12.5,19 13.5,12 19,15.5" fill="#f39ab3" />
          <polygon points="35.5,19 34.5,12 29,15.5" fill="#f39ab3" />
          <circle cx="24" cy="25" r="12.5" fill="#c4bab1" />
          <ellipse cx="24" cy="28" rx="6" ry="4" fill="#fdf9f4" />
          <path d="M21 15 L21 18 M24 14 L24 18 M27 15 L27 18" stroke="#7d726b" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="19" cy="24" r="2.3" fill="#231f24" />
          <circle cx="29" cy="24" r="2.3" fill="#231f24" />
          <circle cx="18.3" cy="23.3" r="0.8" fill="#ffffff" />
          <circle cx="28.3" cy="23.3" r="0.8" fill="#ffffff" />
          <circle cx="24" cy="27.2" r="1.5" fill="#f39ab3" />
          <polygon points="14,34 24,36 24,42 14,40" fill="#7d5238" />
          <polygon points="34,34 24,36 24,42 34,40" fill="#7d5238" />
          <polygon points="15.5,35 23.5,36.8 23.5,40.8 15.5,39.2" fill="#faf3e6" />
          <polygon points="32.5,35 24.5,36.8 24.5,40.8 32.5,39.2" fill="#faf3e6" />
        </g>
      );

    case "ENTJ":
      // 사자: 갈기, 금색 왕관
      return (
        <g>
          <circle cx="24" cy="26" r="14.5" fill="#a45826" />
          <circle cx="15" cy="17" r="3.6" fill="#eab45a" />
          <circle cx="33" cy="17" r="3.6" fill="#eab45a" />
          <circle cx="24" cy="26" r="10.5" fill="#eab45a" />
          <polygon points="17,14 19,8 22,12 24,7 26,12 29,8 31,14" fill="#f7c948" />
          <ellipse cx="24" cy="29" rx="5.5" ry="3.8" fill="#fff3dd" />
          <circle cx="20" cy="24.5" r="2" fill="#221916" />
          <circle cx="28" cy="24.5" r="2" fill="#221916" />
          <circle cx="19.3" cy="23.8" r="0.7" fill="#ffffff" />
          <circle cx="27.3" cy="23.8" r="0.7" fill="#ffffff" />
          <circle cx="24" cy="27.5" r="1.6" fill="#3a241b" />
        </g>
      );

    case "ENTP":
      // 여우: 큰 삼각 귀, 하얀 볼 털
      return (
        <g>
          <polygon points="9,22 12,8 22,16" fill="#e97836" />
          <polygon points="39,22 36,8 26,16" fill="#e97836" />
          <polygon points="12,11 13.5,8 16,11.5" fill="#2e1f1c" />
          <polygon points="36,11 34.5,8 32,11.5" fill="#2e1f1c" />
          <polygon points="12.5,20 14,13 19.5,17" fill="#fff7ef" />
          <polygon points="35.5,20 34,13 28.5,17" fill="#fff7ef" />
          <circle cx="24" cy="27" r="12.5" fill="#e97836" />
          <ellipse cx="18" cy="31" rx="6" ry="5" fill="#fff7ef" />
          <ellipse cx="30" cy="31" rx="6" ry="5" fill="#fff7ef" />
          <ellipse cx="24" cy="32" rx="7" ry="4.8" fill="#fff7ef" />
          <circle cx="19" cy="25" r="2.2" fill="#231915" />
          <circle cx="29" cy="25" r="2.2" fill="#231915" />
          <circle cx="18.3" cy="24.3" r="0.8" fill="#ffffff" />
          <circle cx="28.3" cy="24.3" r="0.8" fill="#ffffff" />
          <circle cx="24" cy="29.5" r="1.6" fill="#2e1f1c" />
        </g>
      );

    case "INFJ":
      // 사슴: 옆으로 난 귀, 아담한 뿔, 점 무늬
      return (
        <g>
          <path d="M18 14 L15 7 M16 10 L13 9" stroke="#8d5b3a" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 14 L33 7 M32 10 L35 9" stroke="#8d5b3a" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="11" cy="21" rx="5.5" ry="3" transform="rotate(-22 11 21)" fill="#c78b59" />
          <ellipse cx="37" cy="21" rx="5.5" ry="3" transform="rotate(22 37 21)" fill="#c78b59" />
          <circle cx="24" cy="26" r="12" fill="#c78b59" />
          <ellipse cx="24" cy="30" rx="5.5" ry="4.2" fill="#fff4e4" />
          <circle cx="16" cy="20" r="1.2" fill="#fff4e4" />
          <circle cx="32" cy="20" r="1.2" fill="#fff4e4" />
          <circle cx="19" cy="25" r="2.2" fill="#231915" />
          <circle cx="29" cy="25" r="2.2" fill="#231915" />
          <circle cx="18.3" cy="24.3" r="0.8" fill="#ffffff" />
          <circle cx="28.3" cy="24.3" r="0.8" fill="#ffffff" />
          <circle cx="24" cy="28.5" r="1.5" fill="#3a231c" />
        </g>
      );

    case "INFP":
      // 토끼: 긴 귀 + 분홍 꽃
      return (
        <g>
          <ellipse cx="18" cy="14" rx="4" ry="9" transform="rotate(-10 18 14)" fill="#f5ede8" />
          <ellipse cx="30" cy="14" rx="4" ry="9" transform="rotate(10 30 14)" fill="#f5ede8" />
          <ellipse cx="18" cy="14" rx="2.1" ry="6" transform="rotate(-10 18 14)" fill="#f598b4" />
          <ellipse cx="30" cy="14" rx="2.1" ry="6" transform="rotate(10 30 14)" fill="#f598b4" />
          <circle cx="24" cy="28" r="12" fill="#f5ede8" stroke="#e8ddd6" strokeWidth="0.8" />
          <circle cx="19" cy="27" r="2.1" fill="#231915" />
          <circle cx="29" cy="27" r="2.1" fill="#231915" />
          <circle cx="18.3" cy="26.3" r="0.7" fill="#ffffff" />
          <circle cx="28.3" cy="26.3" r="0.7" fill="#ffffff" />
          <circle cx="24" cy="30" r="1.5" fill="#f598b4" />
          <circle cx="33" cy="37" r="3.6" fill="#f7a8c0" />
          <circle cx="33" cy="37" r="1.5" fill="#ffd15c" />
        </g>
      );

    case "ENFJ":
      // 강아지: 처진 귀, 분홍 혀, 넥타이
      return (
        <g>
          <ellipse cx="11.5" cy="25" rx="4.2" ry="8.5" transform="rotate(12 11.5 25)" fill="#d89747" />
          <ellipse cx="36.5" cy="25" rx="4.2" ry="8.5" transform="rotate(-12 36.5 25)" fill="#d89747" />
          <circle cx="24" cy="24" r="12" fill="#efc072" />
          <ellipse cx="24" cy="28" rx="6" ry="4.5" fill="#fff6e3" />
          <circle cx="19.5" cy="23" r="2.1" fill="#231915" />
          <circle cx="28.5" cy="23" r="2.1" fill="#231915" />
          <circle cx="18.8" cy="22.3" r="0.7" fill="#ffffff" />
          <circle cx="27.8" cy="22.3" r="0.7" fill="#ffffff" />
          <circle cx="24" cy="26.5" r="1.6" fill="#3a241b" />
          <ellipse cx="24" cy="31" rx="2" ry="2.6" fill="#ff7e9c" />
          <polygon points="22,35 26,35 25,42 23,42" fill="#3c5e94" />
          <circle cx="24" cy="35" r="1.8" fill="#d9485b" />
        </g>
      );

    case "ENFP":
      // 다람쥐: 풍성한 꼬리 배경, 볼록한 볼, 도토리
      return (
        <g>
          <circle cx="35" cy="24" r="8" fill="#de7b39" />
          <circle cx="15" cy="14" r="3.5" fill="#de7b39" />
          <circle cx="29" cy="14" r="3.5" fill="#de7b39" />
          <circle cx="22" cy="25" r="12" fill="#de7b39" />
          <ellipse cx="16.5" cy="28" rx="4.5" ry="4" fill="#fff2df" />
          <ellipse cx="27.5" cy="28" rx="4.5" ry="4" fill="#fff2df" />
          <circle cx="18" cy="23" r="2.1" fill="#231915" />
          <circle cx="26.5" cy="23" r="2.1" fill="#231915" />
          <circle cx="17.3" cy="22.3" r="0.7" fill="#ffffff" />
          <circle cx="25.8" cy="22.3" r="0.7" fill="#ffffff" />
          <circle cx="22" cy="26.5" r="1.5" fill="#3a2218" />
          <ellipse cx="32" cy="36" rx="3.4" ry="4" fill="#9e5a28" />
          <ellipse cx="32" cy="33.5" rx="3.8" ry="2.2" fill="#5c3318" />
        </g>
      );

    case "ISTJ":
      // 거북이: 뒤로 넓게 보이는 올리브 등딱지 + 민트 거북이 얼굴
      return (
        <g>
          <circle cx="24" cy="29" r="14" fill="#4d7655" />
          <circle cx="24" cy="29" r="11.5" fill="none" stroke="#eae2bd" strokeWidth="1.6" />
          <circle cx="24" cy="24" r="11" fill="#7ab59a" />
          <circle cx="19" cy="23" r="2.1" fill="#231915" />
          <circle cx="29" cy="23" r="2.1" fill="#231915" />
          <circle cx="18.3" cy="22.3" r="0.7" fill="#ffffff" />
          <circle cx="28.3" cy="22.3" r="0.7" fill="#ffffff" />
          <path d="M21 28 Q24 30 27 28" stroke="#365c49" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
      );

    case "ISFJ":
      // 곰: 코코아 테디베어 + 황금 꿀봉
      return (
        <g>
          <circle cx="14" cy="15" r="4.5" fill="#c88a58" />
          <circle cx="34" cy="15" r="4.5" fill="#c88a58" />
          <circle cx="14" cy="15" r="2.4" fill="#fcead2" />
          <circle cx="34" cy="15" r="2.4" fill="#fcead2" />
          <circle cx="24" cy="26" r="12.5" fill="#c88a58" />
          <ellipse cx="24" cy="29" rx="5.6" ry="4.4" fill="#fcead2" />
          <circle cx="19.5" cy="24" r="2.1" fill="#231915" />
          <circle cx="28.5" cy="24" r="2.1" fill="#231915" />
          <circle cx="18.8" cy="23.3" r="0.7" fill="#ffffff" />
          <circle cx="27.8" cy="23.3" r="0.7" fill="#ffffff" />
          <circle cx="24" cy="27.5" r="1.8" fill="#3a2520" />
          <line x1="33" y1="40" x2="38" y2="31" stroke="#ba8149" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="38" cy="31" r="2.8" fill="#f5a623" />
        </g>
      );

    case "ESTJ":
      // 펭귄: 슬레이트 머리 + 하트형 하얀 얼굴
      return (
        <g>
          <circle cx="24" cy="26" r="13.5" fill="#37445b" />
          <circle cx="20" cy="25" r="6" fill="#ffffff" />
          <circle cx="28" cy="25" r="6" fill="#ffffff" />
          <ellipse cx="24" cy="29.5" rx="8.5" ry="6.2" fill="#ffffff" />
          <circle cx="19.5" cy="24.5" r="2.1" fill="#1d2430" />
          <circle cx="28.5" cy="24.5" r="2.1" fill="#1d2430" />
          <circle cx="18.8" cy="23.8" r="0.7" fill="#ffffff" />
          <circle cx="27.8" cy="23.8" r="0.7" fill="#ffffff" />
          <polygon points="22,27.5 26,27.5 24,31" fill="#232936" />
        </g>
      );

    case "ESFJ":
      // 양: 구름 양털 머리 + 니트 목도리
      return (
        <g>
          <ellipse cx="10" cy="24" rx="4.2" ry="2.4" fill="#f3d4cd" />
          <ellipse cx="38" cy="24" rx="4.2" ry="2.4" fill="#f3d4cd" />
          <circle cx="24" cy="25" r="12" fill="#f3d4cd" />
          <circle cx="18" cy="14" r="5" fill="#fcf8f3" />
          <circle cx="24" cy="12.5" r="5.5" fill="#fcf8f3" />
          <circle cx="30" cy="14" r="5" fill="#fcf8f3" />
          <circle cx="19.5" cy="24.5" r="2" fill="#231915" />
          <circle cx="28.5" cy="24.5" r="2" fill="#231915" />
          <circle cx="18.8" cy="23.8" r="0.7" fill="#ffffff" />
          <circle cx="27.8" cy="23.8" r="0.7" fill="#ffffff" />
          <circle cx="24" cy="27.5" r="1.4" fill="#5e3d3a" />
          <rect x="14" y="34.5" width="20" height="5" rx="2.5" fill="#c8a388" />
        </g>
      );

    case "ISTP":
      // 고슴도치: 뾰족 갈색 가시 후드 + 크림 얼굴
      return (
        <g>
          <circle cx="24" cy="24" r="15" fill="#593e31" />
          <polygon points="10,19 14,13 17,18" fill="#593e31" />
          <polygon points="21,11 24,6 27,11" fill="#593e31" />
          <polygon points="31,18 34,13 38,19" fill="#593e31" />
          <circle cx="24" cy="27" r="11" fill="#f3e3d3" />
          <circle cx="19.5" cy="25.5" r="2.1" fill="#231915" />
          <circle cx="28.5" cy="25.5" r="2.1" fill="#231915" />
          <circle cx="18.8" cy="24.8" r="0.7" fill="#ffffff" />
          <circle cx="27.8" cy="24.8" r="0.7" fill="#ffffff" />
          <circle cx="24" cy="29.5" r="1.8" fill="#2b1c1a" />
        </g>
      );

    case "ISFP":
      // 판다: 흰 얼굴 + 검은 귀 + 물방울 눈 무늬 + 초록 대나무
      return (
        <g>
          <circle cx="14" cy="15" r="4.5" fill="#262a32" />
          <circle cx="34" cy="15" r="4.5" fill="#262a32" />
          <circle cx="24" cy="26" r="12.5" fill="#ffffff" stroke="#e4e7ec" strokeWidth="0.8" />
          <ellipse cx="19" cy="25" rx="3.4" ry="4.4" transform="rotate(-18 19 25)" fill="#262a32" />
          <ellipse cx="29" cy="25" rx="3.4" ry="4.4" transform="rotate(18 29 25)" fill="#262a32" />
          <circle cx="19" cy="24.5" r="1.4" fill="#ffffff" />
          <circle cx="29" cy="24.5" r="1.4" fill="#ffffff" />
          <circle cx="19" cy="24.5" r="1" fill="#181a20" />
          <circle cx="29" cy="24.5" r="1" fill="#181a20" />
          <circle cx="24" cy="29" r="1.7" fill="#262a32" />
          <line x1="27" y1="36" x2="37" y2="30" stroke="#58a660" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );

    case "ESTP":
      // 원숭이: 큰 옆귀 + 하트형 복숭아 얼굴 마스크
      return (
        <g>
          <circle cx="10.5" cy="24" r="5" fill="#9e613c" />
          <circle cx="37.5" cy="24" r="5" fill="#9e613c" />
          <circle cx="10.5" cy="24" r="2.8" fill="#f4cb9f" />
          <circle cx="37.5" cy="24" r="2.8" fill="#f4cb9f" />
          <circle cx="24" cy="25" r="12" fill="#9e613c" />
          <circle cx="19.5" cy="23.5" r="5.2" fill="#f4cb9f" />
          <circle cx="28.5" cy="23.5" r="5.2" fill="#f4cb9f" />
          <ellipse cx="24" cy="29.5" rx="8.5" ry="5.5" fill="#f4cb9f" />
          <circle cx="19.5" cy="23.5" r="2.1" fill="#231915" />
          <circle cx="28.5" cy="23.5" r="2.1" fill="#231915" />
          <circle cx="18.8" cy="22.8" r="0.7" fill="#ffffff" />
          <circle cx="27.8" cy="22.8" r="0.7" fill="#ffffff" />
          <circle cx="24" cy="27.5" r="1.5" fill="#522c1b" />
        </g>
      );

    case "ESFP":
      // 앵무새: 빨간 얼굴 + 노란 볼 + 알록달록 벼슬 + 굽은 부리
      return (
        <g>
          <ellipse cx="21" cy="11" rx="2.5" ry="4.5" transform="rotate(-18 21 11)" fill="#3fb774" />
          <ellipse cx="24" cy="10" rx="2.5" ry="5" fill="#ffca3a" />
          <ellipse cx="27" cy="11" rx="2.5" ry="4.5" transform="rotate(18 27 11)" fill="#3a86ff" />
          <circle cx="24" cy="26" r="12.5" fill="#e6495c" />
          <circle cx="18.5" cy="26" r="4.6" fill="#ffca3a" />
          <circle cx="29.5" cy="26" r="4.6" fill="#ffca3a" />
          <circle cx="19" cy="24.5" r="2" fill="#1e1b22" />
          <circle cx="29" cy="24.5" r="2" fill="#1e1b22" />
          <circle cx="18.3" cy="23.8" r="0.7" fill="#ffffff" />
          <circle cx="28.3" cy="23.8" r="0.7" fill="#ffffff" />
          <polygon points="21.5,27.5 26.5,27.5 24,32.5" fill="#ffb74d" />
        </g>
      );
  }
}
