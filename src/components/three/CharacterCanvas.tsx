"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, type PointerEvent } from "react";
import MbtiCharacter, {
  type CharacterFlickImpulse,
} from "@/components/three/MbtiCharacter";
import type { MbtiType } from "@/lib/mbti";

interface CharacterCanvasProps {
  /** 화면에 그릴 MBTI 유형 코드 */
  type?: MbtiType;
}

/**
 * 3D 캐릭터와 조명, 바닥 그림자, 회전/튕김 입력을 함께 관리하는 캔버스 컴포넌트입니다.
 * - 외부 HDR 환경맵 없이 코드로 배치한 부드러운 조명만 사용합니다.
 * - 마우스를 빠르게 스치거나(호버 플릭) 드래그로 튕기면 캐릭터가 탄성 있게 움직입니다.
 * - 확대/축소와 화면 이동은 막아 두고, 드래그 회전과 클릭/튕김만 허용합니다.
 */
export default function CharacterCanvas({ type = "ISFJ" }: CharacterCanvasProps) {
  // 마우스/터치로 튕겼을 때의 속도 벡터를 React 리렌더 없이 3D 프레임 루프로 전달합니다.
  const impulseRef = useRef<CharacterFlickImpulse>({
    vx: 0,
    vy: 0,
    nonce: 0,
  });

  // 포인터 속도 및 마지막 튕김 시각 추적용 참조 값
  const pointerTrackRef = useRef({
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    isDown: false,
    downX: 0,
    downY: 0,
    smoothVx: 0,
    smoothVy: 0,
    lastFlickAt: 0,
  });

  const emitFlickImpulse = (pxPerSecX: number, pxPerSecY: number, scale = 1) => {
    const clamp = (val: number, limit: number) =>
      Math.max(-limit, Math.min(limit, val));

    impulseRef.current.vx = clamp((pxPerSecX / 750) * scale, 2.5);
    // 화면 좌표 Y(아래가 양수)를 3D 월드 Y(위가 양수)로 뒤집어 전달합니다.
    impulseRef.current.vy = clamp((-pxPerSecY / 750) * scale, 2.2);
    impulseRef.current.nonce += 1;
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const now = performance.now();
    const track = pointerTrackRef.current;
    track.isDown = true;
    track.downX = e.clientX;
    track.downY = e.clientY;
    track.lastX = e.clientX;
    track.lastY = e.clientY;
    track.lastTime = now;
    track.smoothVx = 0;
    track.smoothVy = 0;
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const now = performance.now();
    const track = pointerTrackRef.current;

    if (track.lastTime === 0) {
      track.lastX = e.clientX;
      track.lastY = e.clientY;
      track.lastTime = now;
      return;
    }

    const dtMs = now - track.lastTime;
    if (dtMs < 6) return;

    const dx = e.clientX - track.lastX;
    const dy = e.clientY - track.lastY;
    const clampedDtSec = Math.max(0.008, Math.min(dtMs / 1000, 0.08));
    const vx = dx / clampedDtSec;
    const vy = dy / clampedDtSec;
    const dist = Math.hypot(dx, dy);
    const speed = Math.hypot(vx, vy);

    // 드래그를 떼는 순간에도 튕김 속도를 반영할 수 있도록 부드러운 평균 속도를 기록합니다.
    track.smoothVx = track.smoothVx * 0.45 + vx * 0.55;
    track.smoothVy = track.smoothVy * 0.45 + vy * 0.55;
    track.lastX = e.clientX;
    track.lastY = e.clientY;
    track.lastTime = now;

    // 캔버스 중앙 캐릭터 영역을 마우스로 빠르게 스쳐 튕기면 버튼을 누르지 않아도 즉시 반응합니다.
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const relY = (e.clientY - rect.top) / Math.max(rect.height, 1);
    const isNearCharacter =
      relX >= 0.18 && relX <= 0.82 && relY >= 0.12 && relY <= 0.88;

    const sinceLastFlick = now - track.lastFlickAt;
    if (!track.isDown && isNearCharacter && dist >= 14 && speed >= 420 && sinceLastFlick >= 170) {
      track.lastFlickAt = now;
      emitFlickImpulse(vx, vy, 1.0);
    } else if (track.isDown && isNearCharacter && dist >= 28 && speed >= 1100 && sinceLastFlick >= 220) {
      track.lastFlickAt = now;
      emitFlickImpulse(vx, vy, 1.05);
    }
  };

  const handlePointerUpOrCancel = (e: PointerEvent<HTMLDivElement>) => {
    const track = pointerTrackRef.current;
    if (!track.isDown) return;
    track.isDown = false;

    const now = performance.now();
    const totalTravel = Math.hypot(
      e.clientX - track.downX,
      e.clientY - track.downY
    );
    const releaseSpeed = Math.hypot(track.smoothVx, track.smoothVy);

    // 짧게 튕기듯 드래그 후 손을 떼면 캐릭터도 탄성 있게 흔들리며 튀어 오릅니다.
    if (
      totalTravel > 12 &&
      releaseSpeed >= 340 &&
      now - track.lastFlickAt >= 120
    ) {
      track.lastFlickAt = now;
      emitFlickImpulse(track.smoothVx, track.smoothVy, 1.15);
    }
  };

  return (
    <div
      className="relative h-full w-full"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.3, 5.1], fov: 38 }}
        style={{ background: "transparent" }}
        fallback={
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm font-medium text-slate-500">
            이 브라우저에서는 3D 화면을 표시할 수 없어요.
          </div>
        }
      >
        {/* 동화책 장난감 같은 부드러운 3점 + 반구 조명 (외부 환경맵 미사용) */}
        <ambientLight intensity={0.88} color="#fff8f5" />
        <hemisphereLight args={["#ffffff", "#ffe0eb", 0.78]} />
        <directionalLight position={[3.2, 5.2, 4.4]} intensity={1.25} color="#fffaf2" />
        <directionalLight position={[-3.2, 2.2, -2.2]} intensity={0.48} color="#ffd8e7" />
        <directionalLight position={[0, -2.0, 2.5]} intensity={0.22} color="#fff1dc" />

        {/* 선택한 MBTI 유형에 맞는 3D 동물 캐릭터 */}
        <MbtiCharacter type={type} flickImpulseRef={impulseRef} />

        {/* 캐릭터 아래 은은한 바닥 그림자 (모바일 최적화 설정 유지) */}
        <ContactShadows
          position={[0, -1.07, 0]}
          opacity={0.34}
          scale={4.1}
          blur={2.4}
          far={2.7}
          resolution={128}
          smooth={false}
          color="#8c4a62"
        />

        {/* 드래그/터치 회전만 허용하고 확대·축소·이동은 비활성화 */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.07}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0.23, 0]}
        />
      </Canvas>
    </div>
  );
}
