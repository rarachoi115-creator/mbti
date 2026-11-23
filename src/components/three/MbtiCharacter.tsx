"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, type MutableRefObject } from "react";
import type { Group } from "three";
import type { MbtiType } from "@/lib/mbti";

/**
 * 16가지 MBTI 유형마다 사용하는 동물 종류입니다.
 */
type AnimalKind =
  | "owl"
  | "cat"
  | "lion"
  | "fox"
  | "deer"
  | "rabbit"
  | "dog"
  | "squirrel"
  | "turtle"
  | "bear"
  | "penguin"
  | "sheep"
  | "hedgehog"
  | "panda"
  | "monkey"
  | "parrot";

/**
 * 캔버스에서 마우스/터치로 캐릭터를 튕겼을 때 전달하는 힘(임펄스) 정보입니다.
 */
export interface CharacterFlickImpulse {
  vx: number;
  vy: number;
  nonce: number;
}

/**
 * 각 동물의 색상·눈동자·팔 자세·소품 옵션 설정입니다.
 */
interface AnimalVisualConfig {
  animal: AnimalKind;
  /** 기본 머리/몸 털(깃털) 색상 */
  mainColor: string;
  /** 배/입가/귀 안쪽 등 밝은 보조 색상 */
  subColor: string;
  /** 갈기/가시/왕관/포인트 색상 */
  accentColor: string;
  /** 눈동자 홍채(테두리) 색상 */
  irisColor: string;
  /** 날개형 팔을 사용하는 조류 여부 (부엉이, 펭귄, 앵무새) */
  hasWings?: boolean;
  /** 앞가슴 쪽으로 소품을 안고 있는 동물인지 여부 */
  hugsFront?: boolean;
  /** 기본 배 패치를 표시할지 여부 */
  showBelly?: boolean;
}

/**
 * 16가지 MBTI 유형별 3D 동물 캐릭터 색상·특징 설정표입니다.
 * 사용자가 보내준 일러스트의 포근하고 생동감 있는 색감과 소품 특징을 담았습니다.
 */
const ANIMAL_CONFIGS: Record<MbtiType, AnimalVisualConfig> = {
  INTJ: {
    animal: "owl",
    mainColor: "#8c6244",
    subColor: "#f7ebd9",
    accentColor: "#e6b84c",
    irisColor: "#d98e2b",
    hasWings: true,
    showBelly: true,
  },
  INTP: {
    animal: "cat",
    mainColor: "#c4bab1",
    subColor: "#fdf9f4",
    accentColor: "#f39ab3",
    irisColor: "#5b82a6",
    hugsFront: true,
    showBelly: true,
  },
  ENTJ: {
    animal: "lion",
    mainColor: "#eab45a",
    subColor: "#fff3dd",
    accentColor: "#a45826",
    irisColor: "#783f1a",
    showBelly: true,
  },
  ENTP: {
    animal: "fox",
    mainColor: "#e97836",
    subColor: "#fff7ef",
    accentColor: "#2e1f1c",
    irisColor: "#42271d",
    showBelly: true,
  },
  INFJ: {
    animal: "deer",
    mainColor: "#c78b59",
    subColor: "#fff4e4",
    accentColor: "#8d5b3a",
    irisColor: "#543222",
    showBelly: true,
  },
  INFP: {
    animal: "rabbit",
    mainColor: "#f5ede8",
    subColor: "#ffffff",
    accentColor: "#f598b4",
    irisColor: "#4a2f33",
    hugsFront: true,
    showBelly: true,
  },
  ENFJ: {
    animal: "dog",
    mainColor: "#efc072",
    subColor: "#fff6e3",
    accentColor: "#ff7e9c",
    irisColor: "#4e3120",
    showBelly: true,
  },
  ENFP: {
    animal: "squirrel",
    mainColor: "#de7b39",
    subColor: "#fff2df",
    accentColor: "#9c471e",
    irisColor: "#472719",
    hugsFront: true,
    showBelly: true,
  },
  ISTJ: {
    animal: "turtle",
    mainColor: "#7ab59a",
    subColor: "#eae2bd",
    accentColor: "#4d7655",
    irisColor: "#36634b",
    showBelly: true,
  },
  ISFJ: {
    animal: "bear",
    mainColor: "#c88a58",
    subColor: "#fcead2",
    accentColor: "#3a2520",
    irisColor: "#47291c",
    hugsFront: true,
    showBelly: true,
  },
  ESTJ: {
    animal: "penguin",
    mainColor: "#37445b",
    subColor: "#ffffff",
    accentColor: "#232934",
    irisColor: "#1d2430",
    hasWings: true,
    showBelly: true,
  },
  ESFJ: {
    animal: "sheep",
    mainColor: "#f3d4cd",
    subColor: "#fcf8f3",
    accentColor: "#c8a388",
    irisColor: "#452d2a",
    showBelly: false,
  },
  ISTP: {
    animal: "hedgehog",
    mainColor: "#f3e3d3",
    subColor: "#fff8f1",
    accentColor: "#593e31",
    irisColor: "#3b2621",
    showBelly: true,
  },
  ISFP: {
    animal: "panda",
    mainColor: "#ffffff",
    subColor: "#262a32",
    accentColor: "#5cae65",
    irisColor: "#23262e",
    hugsFront: true,
    showBelly: false,
  },
  ESTP: {
    animal: "monkey",
    mainColor: "#9e613c",
    subColor: "#f4cb9f",
    accentColor: "#633720",
    irisColor: "#4a2b1c",
    showBelly: true,
  },
  ESFP: {
    animal: "parrot",
    mainColor: "#e6495c",
    subColor: "#ffca3a",
    accentColor: "#3fb774",
    irisColor: "#2b232a",
    hasWings: true,
    showBelly: false,
  },
};

interface MbtiCharacterProps {
  /** 화면에 그릴 4글자 MBTI 유형 코드 */
  type: MbtiType;
  /** 캔버스에서 전달하는 마우스/터치 튕김 속도 벡터 참조 */
  flickImpulseRef?: MutableRefObject<CharacterFlickImpulse>;
}

/**
 * 16가지 유형 코드를 받아 동화풍 3D 동물 캐릭터를 그리는 통합 컴포넌트입니다.
 * - 공통 2등신 체형과 또렷하게 빛나는 눈을 공유하면서 동물별 특징·소품을 세밀하게 조합합니다.
 * - 클릭하면 폴짝 뛰어오르며 반기고, 마우스로 빠르게 튕기면 오뚝이처럼 탄성 있게 흔들립니다.
 */
export default function MbtiCharacter({
  type,
  flickImpulseRef,
}: MbtiCharacterProps) {
  const config = ANIMAL_CONFIGS[type];
  const {
    animal,
    mainColor,
    subColor,
    accentColor,
    irisColor,
    hasWings,
    hugsFront,
    showBelly,
  } = config;

  // 애니메이션과 스프링 물리 움직임을 제어하는 각 부위 참조
  const rootGroupRef = useRef<Group>(null);
  const headGroupRef = useRef<Group>(null);
  const leftEyeRef = useRef<Group>(null);
  const rightEyeRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const tailGroupRef = useRef<Group>(null);
  const propGroupRef = useRef<Group>(null);

  // 마지막으로 처리한 튕김(nonce)과 클릭 횟수
  const lastNonceRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);

  // 탄성 스프링 물리 상태 (기울기·비틀림·바운스·스쿼시·머리 흔들림)
  const physicsRef = useRef({
    tiltZ: 0,
    velTiltZ: 0,
    tiltX: 0,
    velTiltX: 0,
    twistY: 0,
    velTwistY: 0,
    hopY: 0,
    velHopY: 0,
    squash: 0,
    velSquash: 0,
    headLagZ: 0,
    velHeadLagZ: 0,
    headLagX: 0,
    velHeadLagX: 0,
    happyTimer: 0,
  });

  // 유형이 바뀌면 진행 중이던 물리 상태를 깔끔히 초기화합니다.
  useEffect(() => {
    const phys = physicsRef.current;
    phys.tiltZ = 0;
    phys.velTiltZ = 0;
    phys.tiltX = 0;
    phys.velTiltX = 0;
    phys.twistY = 0;
    phys.velTwistY = 0;
    phys.hopY = 0;
    phys.velHopY = 0;
    phys.squash = 0;
    phys.velSquash = 0;
    phys.headLagZ = 0;
    phys.velHeadLagZ = 0;
    phys.headLagX = 0;
    phys.velHeadLagX = 0;
    phys.happyTimer = 0;

    if (flickImpulseRef) {
      lastNonceRef.current = flickImpulseRef.current.nonce;
    }

    if (rootGroupRef.current) {
      rootGroupRef.current.position.set(0, 0, 0);
      rootGroupRef.current.rotation.set(0, 0, 0);
      rootGroupRef.current.scale.set(1, 1, 1);
    }
    if (headGroupRef.current) {
      headGroupRef.current.rotation.set(0, 0, 0);
    }
  }, [type, flickImpulseRef]);

  // 언마운트 시 커서 스타일 복원
  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  /** 캐릭터를 직접 클릭·탭했을 때: 폴짝 뛰어오르며 반갑게 반응합니다. */
  const handleCharacterClick = (event: ThreeEvent<MouseEvent>) => {
    // 드래그로 카메라를 돌린 경우에는 클릭 반응으로 처리하지 않습니다.
    if (event.delta > 8) {
      return;
    }
    event.stopPropagation();

    const phys = physicsRef.current;
    clickCountRef.current += 1;
    const dir = clickCountRef.current % 2 === 0 ? 1 : -1;

    phys.velHopY = Math.max(phys.velHopY + 2.8, 3.1);
    phys.velTwistY += dir * 4.8;
    phys.velTiltZ += dir * 1.1;
    phys.velHeadLagZ += -dir * 1.6;
    phys.velSquash -= 1.8;
    phys.happyTimer = 0.55;
  };

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.04);
    const t = clock.getElapsedTime();
    const phys = physicsRef.current;

    // 0) 캔버스에서 새 마우스 튕김(플릭) 입력이 들어왔다면 스프링 물리 속도에 더합니다.
    if (flickImpulseRef && flickImpulseRef.current.nonce !== lastNonceRef.current) {
      lastNonceRef.current = flickImpulseRef.current.nonce;
      const { vx, vy } = flickImpulseRef.current;

      // 오른쪽으로 튕기면 몸이 오른쪽으로 기울었다가 탄성으로 되돌아옵니다.
      phys.velTiltZ += -vx * 3.1;
      phys.velTiltX += -vy * 1.8;
      phys.velTwistY += vx * 4.4;
      phys.velHopY = Math.max(
        phys.velHopY,
        0.95 + Math.abs(vy) * 1.05 + Math.abs(vx) * 0.45
      );
      // 머리는 반동으로 살짝 늦게 따라가며 찰랑거립니다.
      phys.velHeadLagZ += vx * 2.3;
      phys.velHeadLagX += vy * 1.4;
      phys.velSquash -= 1.5;
      phys.happyTimer = Math.max(phys.happyTimer, 0.4);
    }

    // 1) 스프링-감쇠 물리 계산 (클릭/튕김 뒤 자연스럽게 통통 흔들리며 멈춤)
    const stepSpring = (
      value: number,
      velocity: number,
      stiffness: number,
      damping: number
    ): [number, number] => {
      const accel = -stiffness * value - damping * velocity;
      const nextVel = velocity + accel * dt;
      const nextVal = value + nextVel * dt;
      return [nextVal, nextVel];
    };

    [phys.tiltZ, phys.velTiltZ] = stepSpring(phys.tiltZ, phys.velTiltZ, 135, 8.5);
    [phys.tiltX, phys.velTiltX] = stepSpring(phys.tiltX, phys.velTiltX, 135, 8.5);
    [phys.twistY, phys.velTwistY] = stepSpring(phys.twistY, phys.velTwistY, 95, 7.2);
    [phys.squash, phys.velSquash] = stepSpring(phys.squash, phys.velSquash, 180, 11);
    [phys.headLagZ, phys.velHeadLagZ] = stepSpring(
      phys.headLagZ,
      phys.velHeadLagZ,
      115,
      7.4
    );
    [phys.headLagX, phys.velHeadLagX] = stepSpring(
      phys.headLagX,
      phys.velHeadLagX,
      115,
      7.4
    );

    // 중력과 바닥 반발(통통 튀기)
    phys.velHopY -= 16.0 * dt;
    phys.hopY += phys.velHopY * dt;
    if (phys.hopY <= 0) {
      if (phys.velHopY < -0.95) {
        phys.velHopY = -phys.velHopY * 0.42;
        phys.velSquash -= 2.2;
      } else {
        phys.velHopY = 0;
      }
      phys.hopY = 0;
    } else if (phys.hopY > 0.34) {
      // 화면 위쪽 경계를 넘기지 않도록 안전 높이 제한
      phys.hopY = 0.34;
      phys.velHopY = Math.min(phys.velHopY, 0);
    }

    if (phys.happyTimer > 0) {
      phys.happyTimer = Math.max(0, phys.happyTimer - dt);
    }

    // 2) 공통 눈 깜빡임 (약 3.5초 주기 + 클릭 직후 반가운 눈웃음)
    const blinkCycle = t % 3.5;
    const blinkDuration = 0.16;
    const autoBlink =
      blinkCycle < blinkDuration
        ? 1 - 0.9 * Math.sin((blinkCycle / blinkDuration) * Math.PI)
        : 1;
    const happySquint =
      phys.happyTimer > 0.3
        ? 1 - 0.55 * Math.sin(((phys.happyTimer - 0.3) / 0.25) * Math.PI)
        : 1;
    const eyeScaleY = Math.min(autoBlink, happySquint);

    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = eyeScaleY;
      rightEyeRef.current.scale.y = eyeScaleY;
    }

    // 3) 유형별 고유 성격 기본 움직임 계산
    let baseY = Math.sin(t * 1.6) * 0.035;
    let bodyRotZ = 0;
    let bodyRotY = 0;
    let headRotX = 0;
    let headRotY = 0;
    let headRotZ = 0;
    let breath = Math.sin(t * 2.2) * 0.018;
    let armWave = Math.sin(t * 1.6) * 0.04;

    switch (type) {
      case "INTJ":
        headRotZ = Math.sin(t * 1.1) * 0.1;
        headRotY = Math.sin(t * 0.65) * 0.08;
        break;
      case "INTP":
        headRotZ = Math.sin(t * 1.4) * 0.12;
        headRotY = Math.sin(t * 0.9) * 0.09;
        break;
      case "ENTJ":
        baseY = Math.sin(t * 1.8) * 0.03;
        headRotX = -0.04 + Math.sin(t * 1.4) * 0.03;
        breath = Math.sin(t * 2.0) * 0.025;
        break;
      case "ENTP":
        bodyRotY = Math.sin(t * 2.3) * 0.11;
        headRotZ = Math.sin(t * 2.8) * 0.07;
        armWave = Math.sin(t * 2.8) * 0.09;
        break;
      case "INFJ":
        baseY = Math.sin(t * 1.2) * 0.035;
        bodyRotZ = Math.sin(t * 1.0) * 0.035;
        headRotY = Math.sin(t * 0.8) * 0.06;
        break;
      case "INFP":
        baseY = Math.sin(t * 1.7) * 0.045;
        headRotZ = Math.sin(t * 1.5) * 0.09;
        armWave = Math.sin(t * 1.7) * 0.07;
        break;
      case "ENFJ":
        baseY = Math.abs(Math.sin(t * 3.0)) * 0.045;
        bodyRotZ = Math.sin(t * 3.0) * 0.05;
        armWave = Math.sin(t * 4.0) * 0.12;
        break;
      case "ENFP":
        baseY = Math.abs(Math.sin(t * 4.4)) * 0.11;
        bodyRotZ = Math.sin(t * 4.4) * 0.07;
        armWave = Math.sin(t * 4.4) * 0.14;
        break;
      case "ISTJ":
        baseY = Math.sin(t * 0.9) * 0.018;
        headRotX = Math.max(0, Math.sin(t * 1.1)) * 0.11;
        breath = Math.sin(t * 1.1) * 0.014;
        break;
      case "ISFJ":
        baseY = Math.sin(t * 1.4) * 0.032;
        bodyRotZ = Math.sin(t * 1.2) * 0.04;
        headRotZ = Math.sin(t * 1.2) * 0.04;
        break;
      case "ESTJ":
        baseY = Math.abs(Math.sin(t * 2.6)) * 0.032;
        bodyRotZ = Math.sin(t * 2.6) * 0.085;
        armWave = Math.sin(t * 2.6) * 0.09;
        break;
      case "ESFJ":
        baseY = Math.sin(t * 2.0) * 0.035;
        bodyRotZ = Math.sin(t * 2.0) * 0.05;
        headRotZ = Math.sin(t * 2.0) * 0.07;
        break;
      case "ISTP":
        baseY = Math.sin(t * 1.3) * 0.022;
        headRotX = Math.max(0, Math.sin(t * 1.2)) * 0.08;
        break;
      case "ISFP":
        baseY = Math.sin(t * 1.0) * 0.025;
        bodyRotZ = Math.sin(t * 1.0) * 0.04;
        break;
      case "ESTP":
        bodyRotY = Math.sin(t * 2.6) * 0.11;
        armWave = Math.sin(t * 3.2) * 0.12;
        break;
      case "ESFP":
        bodyRotZ = Math.sin(t * 4.0) * 0.11;
        baseY = Math.abs(Math.sin(t * 4.0)) * 0.055;
        armWave = Math.sin(t * 6.0) * 0.2;
        break;
    }

    // 탄성 물리 반응 크기에 따라 팔·꼬리·소품도 함께 생동감 있게 흔들립니다.
    const motionEnergy =
      Math.abs(phys.velTiltZ) * 0.12 +
      Math.abs(phys.velTwistY) * 0.08 +
      (phys.happyTimer > 0 ? 0.22 : 0);

    const clampTilt = (val: number, max: number) =>
      Math.max(-max, Math.min(max, val));

    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = baseY + phys.hopY;
      rootGroupRef.current.rotation.set(
        clampTilt(phys.tiltX, 0.34),
        bodyRotY + phys.twistY,
        clampTilt(bodyRotZ + phys.tiltZ, 0.45)
      );
      const squashVal = clampTilt(phys.squash, 0.2);
      const stretchY = 1 - breath * 0.45 + squashVal + phys.hopY * 0.18;
      const spreadXZ = 1 + breath - squashVal * 0.5 - phys.hopY * 0.08;
      rootGroupRef.current.scale.set(spreadXZ, stretchY, spreadXZ);
    }

    if (headGroupRef.current) {
      headGroupRef.current.rotation.set(
        clampTilt(headRotX + phys.headLagX, 0.32),
        headRotY + phys.twistY * 0.18,
        clampTilt(headRotZ + phys.headLagZ, 0.42)
      );
    }

    if (leftArmRef.current && rightArmRef.current) {
      const baseAngle = hasWings ? 0.38 : hugsFront ? 0.28 : 0.54;
      const extraFlap = Math.sin(t * 14) * Math.min(motionEnergy, 0.32);
      leftArmRef.current.rotation.z = baseAngle + armWave + extraFlap;
      rightArmRef.current.rotation.z = -baseAngle - armWave - extraFlap;
    }

    if (tailGroupRef.current) {
      if (animal === "dog") {
        tailGroupRef.current.rotation.y =
          Math.sin(t * 9.5) * (0.42 + motionEnergy * 0.5);
      } else if (animal === "cat" || animal === "fox" || animal === "monkey") {
        tailGroupRef.current.rotation.y =
          Math.sin(t * 2.8) * (0.25 + motionEnergy * 0.4);
      } else if (animal === "squirrel") {
        tailGroupRef.current.rotation.x =
          Math.sin(t * 4.2) * (0.08 + motionEnergy * 0.2);
      }
    }

    if (propGroupRef.current) {
      propGroupRef.current.rotation.z =
        Math.sin(t * 5.0) * (0.02 + Math.min(motionEnergy, 0.25) * 0.25);
    }
  });

  // 동물별 몸통/팔다리/발 색상 결정
  const headColor = animal === "sheep" ? subColor : mainColor;
  const torsoColor =
    animal === "sheep"
      ? subColor
      : animal === "parrot"
      ? accentColor
      : mainColor;
  const limbColor =
    animal === "panda"
      ? subColor
      : animal === "sheep"
      ? subColor
      : animal === "parrot"
      ? accentColor
      : mainColor;
  const footTipColor =
    animal === "penguin"
      ? "#2b3547"
      : animal === "sheep"
      ? "#e8a8a4"
      : animal === "parrot"
      ? "#ffb74d"
      : limbColor;

  return (
    <group
      ref={rootGroupRef}
      onClick={handleCharacterClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* === 1. 공통 커다란 둥근 머리 + 동물별 얼굴 무늬/눈/부리/귀 === */}
      <group ref={headGroupRef} position={[0, 0.52, 0]}>
        {/* 머리 기본 구 */}
        <mesh scale={[1.08, 0.96, 0.98]}>
          <sphereGeometry args={[0.64, 22, 16]} />
          <meshStandardMaterial color={headColor} roughness={0.62} metalness={0.02} />
        </mesh>

        {/* 동물별 얼굴 마스크/무늬 (z-fighting 방지를 위해 머리 타원 앞쪽으로 명확히 돌출) */}
        <AnimalFaceOverlay config={config} />

        {/* 동물별 입체적인 눈동자와 반짝임 */}
        <group
          ref={leftEyeRef}
          position={[
            -0.225,
            0.05,
            animal === "owl" || animal === "penguin" || animal === "monkey"
              ? 0.61
              : animal === "panda"
              ? 0.595
              : 0.575,
          ]}
        >
          <CharacterEye irisColor={irisColor} isPanda={animal === "panda"} />
        </group>

        <group
          ref={rightEyeRef}
          position={[
            0.225,
            0.05,
            animal === "owl" || animal === "penguin" || animal === "monkey"
              ? 0.61
              : animal === "panda"
              ? 0.595
              : 0.575,
          ]}
        >
          <CharacterEye irisColor={irisColor} isPanda={animal === "panda"} />
        </group>

        {/* 은은한 볼터치 */}
        {animal !== "penguin" && animal !== "parrot" && (
          <>
            <mesh position={[-0.38, -0.09, 0.475]} scale={[1.15, 0.72, 0.42]}>
              <sphereGeometry args={[0.078, 12, 8]} />
              <meshStandardMaterial color="#f9a8be" roughness={0.68} />
            </mesh>
            <mesh position={[0.38, -0.09, 0.475]} scale={[1.15, 0.72, 0.42]}>
              <sphereGeometry args={[0.078, 12, 8]} />
              <meshStandardMaterial color="#f9a8be" roughness={0.68} />
            </mesh>
          </>
        )}

        {/* 여우·다람쥐: 포근하게 볼록한 뺨 털 뭉치 */}
        {(animal === "squirrel" || animal === "fox") && (
          <group>
            <mesh position={[-0.34, -0.14, 0.44]} scale={[1.08, 0.94, 0.88]}>
              <sphereGeometry args={[0.21, 14, 10]} />
              <meshStandardMaterial color={subColor} roughness={0.64} />
            </mesh>
            <mesh position={[0.34, -0.14, 0.44]} scale={[1.08, 0.94, 0.88]}>
              <sphereGeometry args={[0.21, 14, 10]} />
              <meshStandardMaterial color={subColor} roughness={0.64} />
            </mesh>
          </group>
        )}

        {/* 주둥이/부리/코/수염/혀 */}
        <AnimalSnout config={config} />

        {/* 귀, 뿔, 갈기, 왕관, 안경, 가시, 벼슬, 양털 장식 */}
        <AnimalHeadAccessories config={config} />
      </group>

      {/* === 2. 공통 통통한 몸통 + 배 무늬 + 등 장식 + 소품 === */}
      <mesh position={[0, -0.35, 0]} scale={[0.98, 0.92, 0.9]}>
        <sphereGeometry args={[0.5, 22, 16]} />
        <meshStandardMaterial color={torsoColor} roughness={0.62} metalness={0.02} />
      </mesh>

      {/* 배 부분 밝은 무늬 */}
      {showBelly && (
        <mesh position={[0, -0.37, 0.22]} scale={[0.92, 0.95, 0.72]}>
          <sphereGeometry args={[0.36, 18, 14]} />
          <meshStandardMaterial color={subColor} roughness={0.64} metalness={0.02} />
        </mesh>
      )}

      {/* 앵무새: 초록 가슴 아래쪽에 겹침 없이 cleanly 분리된 노란 배 깃털 */}
      {animal === "parrot" && (
        <mesh position={[0, -0.46, 0.26]} scale={[0.82, 0.68, 0.78]}>
          <sphereGeometry args={[0.32, 18, 14]} />
          <meshStandardMaterial color={subColor} roughness={0.6} />
        </mesh>
      )}

      {/* 판다: 양 어깨를 잇는 검은 가슴 띠 */}
      {animal === "panda" && (
        <mesh position={[0, -0.145, 0.02]} rotation={[Math.PI / 2.25, 0, 0]} scale={[1.05, 0.9, 0.85]}>
          <torusGeometry args={[0.32, 0.085, 10, 22]} />
          <meshStandardMaterial color={subColor} roughness={0.64} />
        </mesh>
      )}

      {/* 부엉이 배 깃털 무늬 / 거북이 등딱지 / 사슴 점 / 양 털 / 고슴도치 등 가시 */}
      <AnimalBackFeatures config={config} />

      {/* 캐릭터별 개성 있는 소품 (책, 꽃, 넥타이, 도토리, 꿀봉, 클립보드, 목도리, 대나무 등) */}
      <group ref={propGroupRef}>
        <AnimalHeldProps config={config} />
      </group>

      {/* === 3. 짧은 팔 (소품을 안은 동물은 팔이 살짝 앞으로 모임) === */}
      <group
        ref={leftArmRef}
        position={[hugsFront ? -0.41 : -0.48, -0.26, hugsFront ? 0.17 : 0.05]}
        rotation={[hugsFront ? -0.6 : 0.08, hugsFront ? 0.38 : 0, hasWings ? 0.38 : 0.52]}
      >
        <mesh
          position={[0, -0.11, 0]}
          scale={hasWings ? [0.65, 1.15, 0.85] : [1, 1, 1]}
        >
          <capsuleGeometry args={[0.105, 0.16, 6, 12]} />
          <meshStandardMaterial color={limbColor} roughness={0.6} />
        </mesh>
        {animal === "parrot" && (
          <mesh position={[-0.02, -0.15, -0.02]} scale={[0.55, 0.9, 0.75]}>
            <capsuleGeometry args={[0.09, 0.14, 5, 10]} />
            <meshStandardMaterial color="#3a86ff" roughness={0.55} />
          </mesh>
        )}
      </group>

      <group
        ref={rightArmRef}
        position={[hugsFront ? 0.41 : 0.48, -0.26, hugsFront ? 0.17 : 0.05]}
        rotation={[hugsFront ? -0.6 : 0.08, hugsFront ? -0.38 : 0, hasWings ? -0.38 : -0.52]}
      >
        <mesh
          position={[0, -0.11, 0]}
          scale={hasWings ? [0.65, 1.15, 0.85] : [1, 1, 1]}
        >
          <capsuleGeometry args={[0.105, 0.16, 6, 12]} />
          <meshStandardMaterial color={limbColor} roughness={0.6} />
        </mesh>
        {animal === "parrot" && (
          <mesh position={[0.02, -0.15, -0.02]} scale={[0.55, 0.9, 0.75]}>
            <capsuleGeometry args={[0.09, 0.14, 5, 10]} />
            <meshStandardMaterial color="#ffca3a" roughness={0.55} />
          </mesh>
        )}
      </group>

      {/* === 4. 짧은 다리 2개 === */}
      <mesh position={[-0.2, -0.84, 0.06]} scale={[1.05, 1, 1.15]}>
        <capsuleGeometry args={[0.12, 0.13, 6, 12]} />
        <meshStandardMaterial color={footTipColor} roughness={0.62} />
      </mesh>
      <mesh position={[0.2, -0.84, 0.06]} scale={[1.05, 1, 1.15]}>
        <capsuleGeometry args={[0.12, 0.13, 6, 12]} />
        <meshStandardMaterial color={footTipColor} roughness={0.62} />
      </mesh>

      {/* === 5. 동물별 꼬리 === */}
      <group ref={tailGroupRef}>
        <AnimalTail config={config} />
      </group>
    </group>
  );
}

/**
 * 동화풍 3D 캐릭터의 입체적인 눈동자 (홍채 + 검은 동공 + 2단 빛 반사점)를 그립니다.
 */
function CharacterEye({
  irisColor,
  isPanda,
}: {
  irisColor: string;
  isPanda: boolean;
}) {
  return (
    <group>
      {isPanda && (
        <mesh position={[0, 0, -0.01]} scale={[1.18, 1.24, 0.55]}>
          <sphereGeometry args={[0.075, 12, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
      {/* 1) 깊이감 있는 홍채 외곽 */}
      <mesh scale={[1.0, 1.1, 0.72]}>
        <sphereGeometry args={[0.078, 14, 10]} />
        <meshStandardMaterial color={irisColor} roughness={0.18} metalness={0.08} />
      </mesh>
      {/* 2) 촉촉하고 반짝이는 검은 동공 */}
      <mesh position={[0, 0, 0.014]} scale={[0.78, 0.88, 0.72]}>
        <sphereGeometry args={[0.068, 12, 10]} />
        <meshStandardMaterial color="#120f17" roughness={0.08} metalness={0.1} />
      </mesh>
      {/* 3) 왼쪽 위 큰 반짝임 + 오른쪽 아래 작은 반짝임 */}
      <mesh position={[-0.024, 0.028, 0.058]}>
        <sphereGeometry args={[0.023, 10, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.022, -0.02, 0.056]}>
        <sphereGeometry args={[0.011, 8, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

/**
 * 얼굴 위 색상 패치(펭귄 하트 마스크, 부엉이 안면 디스크, 원숭이 하트 얼굴, 판다 눈 무늬 등)를 그립니다.
 * 모든 패치는 z-fighting이 나지 않도록 머리 타원보다 충분히 앞쪽(+)에 볼록하게 얹습니다.
 */
function AnimalFaceOverlay({ config }: { config: AnimalVisualConfig }) {
  const { animal, subColor } = config;

  if (animal === "owl") {
    return (
      <group>
        {[-1, 1].map((dir) => (
          <mesh
            key={dir}
            position={[dir * 0.21, 0.04, 0.535]}
            rotation={[0, dir * 0.25, 0]}
            scale={[1.04, 1.02, 0.36]}
          >
            <sphereGeometry args={[0.25, 16, 12]} />
            <meshStandardMaterial color={subColor} roughness={0.68} />
          </mesh>
        ))}
      </group>
    );
  }

  if (animal === "cat") {
    // 고양이 이마의 부드러운 회색 태비 줄무늬 3가닥
    return (
      <group>
        {[-0.09, 0, 0.09].map((x, idx) => (
          <mesh
            key={idx}
            position={[x, 0.34, 0.52]}
            rotation={[-0.45, 0, x * 1.4]}
            scale={[0.85, 1, 0.6]}
          >
            <capsuleGeometry args={[0.018, 0.11, 4, 8]} />
            <meshStandardMaterial color="#7d726b" roughness={0.65} />
          </mesh>
        ))}
      </group>
    );
  }

  if (animal === "penguin") {
    // 펭귄: 좌우 눈 영역 원반 2개 + 턱 브리지로 z-fighting 없는 하트형 하얀 얼굴
    return (
      <group>
        {[-1, 1].map((dir) => (
          <mesh
            key={dir}
            position={[dir * 0.165, -0.01, 0.545]}
            rotation={[0, dir * 0.22, 0]}
            scale={[0.92, 1.08, 0.36]}
          >
            <sphereGeometry args={[0.25, 16, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.58} />
          </mesh>
        ))}
        <mesh position={[0, -0.16, 0.55]} scale={[1.08, 0.78, 0.36]}>
          <sphereGeometry args={[0.24, 16, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.58} />
        </mesh>
      </group>
    );
  }

  if (animal === "monkey") {
    // 원숭이: 눈 주변이 또렷하게 드러나는 하트 모양 복숭아빛 얼굴 마스크
    return (
      <group>
        {[-1, 1].map((dir) => (
          <mesh
            key={dir}
            position={[dir * 0.175, 0.055, 0.545]}
            rotation={[0, dir * 0.22, 0]}
            scale={[0.92, 0.96, 0.36]}
          >
            <sphereGeometry args={[0.23, 16, 12]} />
            <meshStandardMaterial color={subColor} roughness={0.62} />
          </mesh>
        ))}
      </group>
    );
  }

  if (animal === "panda") {
    // 판다: 눈가 주변에 비스듬한 물방울 모양 검은 무늬
    return (
      <group>
        {[-1, 1].map((dir) => (
          <mesh
            key={dir}
            position={[dir * 0.22, 0.04, 0.56]}
            rotation={[0, dir * 0.25, dir * -0.34]}
            scale={[0.85, 1.12, 0.28]}
          >
            <sphereGeometry args={[0.175, 14, 10]} />
            <meshStandardMaterial color={subColor} roughness={0.64} />
          </mesh>
        ))}
      </group>
    );
  }

  if (animal === "parrot") {
    // 앵무새: 빨간 얼굴 양옆에 겹침 없이 볼록하게 얹은 노란 볼 패치
    return (
      <group>
        {[-1, 1].map((dir) => (
          <mesh
            key={dir}
            position={[dir * 0.24, -0.02, 0.545]}
            rotation={[0, dir * 0.34, 0]}
            scale={[0.88, 0.94, 0.44]}
          >
            <sphereGeometry args={[0.19, 16, 12]} />
            <meshStandardMaterial color={subColor} roughness={0.6} />
          </mesh>
        ))}
      </group>
    );
  }

  return null;
}

/**
 * 주둥이·부리·코·수염·혀 등 입 주변 특징을 그립니다.
 */
function AnimalSnout({ config }: { config: AnimalVisualConfig }) {
  const { animal, mainColor, subColor, accentColor } = config;

  // 부엉이 & 펭귄: 작고 오똑한 부리
  if (animal === "owl" || animal === "penguin") {
    const beakColor = animal === "owl" ? accentColor : "#232936";
    return (
      <mesh position={[0, -0.075, 0.675]} rotation={[Math.PI * 0.62, 0, 0]}>
        <coneGeometry args={[0.09, 0.19, 12]} />
        <meshStandardMaterial color={beakColor} roughness={0.28} />
      </mesh>
    );
  }

  // 앵무새: 상아·금빛 윗부리와 짙은 아랫부리가 어우러진 굽은 부리
  if (animal === "parrot") {
    return (
      <group position={[0, -0.075, 0.64]}>
        <mesh position={[0, 0.025, 0.055]} rotation={[Math.PI * 0.56, 0, 0]}>
          <coneGeometry args={[0.098, 0.21, 12]} />
          <meshStandardMaterial color="#ffca64" roughness={0.28} />
        </mesh>
        <mesh position={[0, -0.065, 0.095]} rotation={[Math.PI * 0.9, 0, 0]}>
          <coneGeometry args={[0.058, 0.14, 12]} />
          <meshStandardMaterial color="#38343b" roughness={0.32} />
        </mesh>
        <mesh position={[0, -0.035, 0.015]}>
          <sphereGeometry args={[0.075, 12, 10]} />
          <meshStandardMaterial color="#ffe8ad" roughness={0.35} />
        </mesh>
      </group>
    );
  }

  // 여우 & 고슴도치: 오똑하게 앞으로 나온 코와 주둥이
  if (animal === "fox" || animal === "hedgehog") {
    const snoutColor = animal === "fox" ? subColor : mainColor;
    return (
      <group>
        <mesh position={[0, -0.12, 0.635]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.175, 0.34, 14]} />
          <meshStandardMaterial color={snoutColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.12, 0.8]} scale={[1.12, 0.9, 0.9]}>
          <sphereGeometry args={[0.056, 12, 10]} />
          <meshStandardMaterial color="#2b1c1a" roughness={0.2} />
        </mesh>
      </group>
    );
  }

  // 고양이: 포근한 볼 주둥이 + 분홍 코 + 얼굴에 단단히 연결된 수염 6가닥
  if (animal === "cat") {
    return (
      <group>
        <mesh position={[0, -0.14, 0.555]} scale={[1.1, 0.74, 0.62]}>
          <sphereGeometry args={[0.175, 14, 10]} />
          <meshStandardMaterial color={subColor} roughness={0.62} />
        </mesh>
        <mesh position={[0, -0.09, 0.66]} scale={[1.15, 0.85, 0.8]}>
          <sphereGeometry args={[0.048, 12, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.28} />
        </mesh>
        {[-1, 1].map((dir) =>
          [-0.09, -0.135, -0.18].map((y, idx) => (
            <mesh
              key={`${dir}-${idx}`}
              position={[dir * 0.31, y, 0.545]}
              rotation={[0, dir * -0.28, Math.PI / 2 + dir * (idx - 1) * 0.13]}
            >
              <cylinderGeometry args={[0.007, 0.007, 0.21, 6]} />
              <meshStandardMaterial color="#4a4846" roughness={0.4} />
            </mesh>
          ))
        )}
      </group>
    );
  }

  // 나머지 동물: 둥근 주둥이와 코 (+ 강아지 혀)
  const muzzleColor =
    animal === "turtle"
      ? mainColor
      : animal === "sheep"
      ? mainColor
      : animal === "panda"
      ? mainColor
      : subColor;

  return (
    <group>
      <mesh
        position={[0, -0.14, 0.55]}
        scale={animal === "monkey" ? [1.34, 0.86, 0.7] : [1.14, 0.85, 0.7]}
      >
        <sphereGeometry args={[0.195, 16, 12]} />
        <meshStandardMaterial color={muzzleColor} roughness={0.62} />
      </mesh>
      <mesh position={[0, -0.08, 0.68]} scale={[1.22, 0.86, 0.78]}>
        <sphereGeometry args={[0.06, 12, 10]} />
        <meshStandardMaterial
          color={animal === "rabbit" ? accentColor : "#362422"}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, -0.15, 0.67]}>
        <capsuleGeometry args={[0.011, 0.034, 4, 8]} />
        <meshStandardMaterial color="#362422" roughness={0.3} />
      </mesh>

      {animal === "dog" && (
        <mesh
          position={[0.02, -0.23, 0.64]}
          rotation={[0.45, 0, -0.08]}
          scale={[1, 1, 0.45]}
        >
          <capsuleGeometry args={[0.048, 0.06, 5, 10]} />
          <meshStandardMaterial color={accentColor} roughness={0.35} />
        </mesh>
      )}
    </group>
  );
}

/**
 * 귀, 뿔, 금테 안경, 사자 갈기+왕관, 고슴도치 가시, 양털, 앵무새 벼슬을 그립니다.
 */
function AnimalHeadAccessories({ config }: { config: AnimalVisualConfig }) {
  const { animal, mainColor, subColor, accentColor } = config;

  switch (animal) {
    case "turtle":
      return null;

    case "owl":
      // 부엉이: 귀깃 2개 + 동그란 금테 안경 (양쪽 렌즈 테, 코 브리지, 양옆 안경다리)
      return (
        <group>
          {[-1, 1].map((dir) => (
            <group key={dir}>
              {/* 뾰족한 깃털 귀깃 */}
              <mesh
                position={[dir * 0.42, 0.52, 0.02]}
                rotation={[0.05, 0, dir * -0.42]}
                scale={[1, 1, 0.65]}
              >
                <coneGeometry args={[0.13, 0.28, 12]} />
                <meshStandardMaterial color={mainColor} roughness={0.6} />
              </mesh>
              {/* 금테 안경 동그란 테 */}
              <mesh
                position={[dir * 0.225, 0.05, 0.65]}
                rotation={[0, dir * 0.14, 0]}
              >
                <torusGeometry args={[0.128, 0.015, 10, 24]} />
                <meshStandardMaterial
                  color={accentColor}
                  roughness={0.22}
                  metalness={0.6}
                />
              </mesh>
              {/* 머리에 자연스럽게 이어지는 안경다리 */}
              <mesh
                position={[dir * 0.44, 0.055, 0.47]}
                rotation={[0, dir * -0.82, Math.PI / 2]}
              >
                <capsuleGeometry args={[0.012, 0.28, 4, 8]} />
                <meshStandardMaterial
                  color={accentColor}
                  roughness={0.24}
                  metalness={0.55}
                />
              </mesh>
            </group>
          ))}
          {/* 안경 코 브리지 */}
          <mesh position={[0, 0.065, 0.665]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.013, 0.13, 4, 8]} />
            <meshStandardMaterial
              color={accentColor}
              roughness={0.22}
              metalness={0.6}
            />
          </mesh>
        </group>
      );

    case "cat":
      // 고양이: 뾰족한 세모 귀 2개
      return (
        <group>
          {[-1, 1].map((dir) => (
            <group
              key={dir}
              position={[dir * 0.42, 0.51, 0.02]}
              rotation={[0.05, 0, dir * -0.32]}
            >
              <mesh scale={[1, 1, 0.55]}>
                <coneGeometry args={[0.2, 0.34, 14]} />
                <meshStandardMaterial color={mainColor} roughness={0.62} />
              </mesh>
              <mesh position={[0, -0.02, 0.06]} scale={[0.58, 0.62, 0.5]}>
                <coneGeometry args={[0.18, 0.3, 12]} />
                <meshStandardMaterial color={accentColor} roughness={0.58} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case "fox":
      // 여우: 크고 뾰족한 귀 2개 (하얀 안쪽 + 짙은 끝)
      return (
        <group>
          {[-1, 1].map((dir) => (
            <group
              key={dir}
              position={[dir * 0.43, 0.55, 0]}
              rotation={[0.04, 0, dir * -0.28]}
            >
              <mesh scale={[1, 1, 0.52]}>
                <coneGeometry args={[0.22, 0.44, 14]} />
                <meshStandardMaterial color={mainColor} roughness={0.6} />
              </mesh>
              <mesh position={[0, -0.03, 0.065]} scale={[0.58, 0.65, 0.48]}>
                <coneGeometry args={[0.19, 0.37, 12]} />
                <meshStandardMaterial color={subColor} roughness={0.62} />
              </mesh>
              <mesh position={[0, 0.15, 0]} scale={[0.4, 0.35, 0.35]}>
                <coneGeometry args={[0.21, 0.42, 12]} />
                <meshStandardMaterial color={accentColor} roughness={0.58} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case "lion": {
      // 사자: 풍성한 갈기 2겹 + 귀 + 머리 위 반짝이는 금색 왕관
      const maneCount = 14;
      const crownAngles = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2);
      return (
        <group>
          {Array.from({ length: maneCount }).map((_, idx) => {
            const angle = (idx / maneCount) * Math.PI * 2;
            return (
              <mesh
                key={idx}
                position={[Math.cos(angle) * 0.62, Math.sin(angle) * 0.57, -0.09]}
                scale={[1.08, 1.08, 0.82]}
              >
                <sphereGeometry args={[0.25, 14, 10]} />
                <meshStandardMaterial color={accentColor} roughness={0.68} />
              </mesh>
            );
          })}
          {[-1, 1].map((dir) => (
            <mesh key={dir} position={[dir * 0.45, 0.49, 0.16]} scale={[1, 1, 0.7]}>
              <sphereGeometry args={[0.165, 14, 10]} />
              <meshStandardMaterial color={mainColor} roughness={0.6} />
            </mesh>
          ))}
          {/* 머리 위 금색 왕관 */}
          <group position={[0, 0.64, 0.06]}>
            <mesh>
              <cylinderGeometry args={[0.18, 0.16, 0.11, 16]} />
              <meshStandardMaterial
                color="#f7c948"
                roughness={0.22}
                metalness={0.55}
              />
            </mesh>
            {crownAngles.map((angle, idx) => (
              <group
                key={idx}
                position={[Math.cos(angle) * 0.14, 0.09, Math.sin(angle) * 0.14]}
              >
                <mesh>
                  <coneGeometry args={[0.045, 0.11, 8]} />
                  <meshStandardMaterial
                    color="#f7c948"
                    roughness={0.22}
                    metalness={0.55}
                  />
                </mesh>
                <mesh position={[0, 0.065, 0]}>
                  <sphereGeometry args={[0.022, 8, 6]} />
                  <meshStandardMaterial color="#fff3cf" roughness={0.18} metalness={0.3} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      );
    }

    case "deer":
      // 사슴: 옆으로 크게 펼친 귀 + 상단에 여유 있는 아담한 가지 뿔
      return (
        <group>
          {[-1, 1].map((dir) => (
            <group key={dir}>
              <mesh
                position={[dir * 0.68, 0.3, -0.02]}
                rotation={[0, 0, dir * -1.04]}
                scale={[0.7, 1.28, 0.46]}
              >
                <sphereGeometry args={[0.19, 14, 10]} />
                <meshStandardMaterial color={mainColor} roughness={0.62} />
              </mesh>
              <mesh
                position={[dir * 0.68, 0.28, 0.035]}
                rotation={[0, 0, dir * -1.04]}
                scale={[0.45, 0.96, 0.25]}
              >
                <sphereGeometry args={[0.17, 10, 8]} />
                <meshStandardMaterial color={subColor} roughness={0.65} />
              </mesh>
              <group position={[dir * 0.27, 0.59, 0]} rotation={[0, 0, dir * -0.22]}>
                <mesh position={[0, 0.13, 0]}>
                  <capsuleGeometry args={[0.032, 0.26, 5, 10]} />
                  <meshStandardMaterial color={accentColor} roughness={0.52} />
                </mesh>
                <mesh position={[dir * 0.08, 0.16, 0.02]} rotation={[0, 0, dir * -0.68]}>
                  <capsuleGeometry args={[0.023, 0.15, 4, 8]} />
                  <meshStandardMaterial color={accentColor} roughness={0.52} />
                </mesh>
                <mesh position={[dir * -0.05, 0.21, -0.02]} rotation={[0, 0, dir * 0.55]}>
                  <capsuleGeometry args={[0.022, 0.11, 4, 8]} />
                  <meshStandardMaterial color={accentColor} roughness={0.52} />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      );

    case "rabbit":
      // 토끼: 잘리지 않고 단정하게 솟은 보드라운 긴 귀 2개
      return (
        <group>
          {[-1, 1].map((dir) => (
            <group
              key={dir}
              position={[dir * 0.26, 0.69, -0.01]}
              rotation={[0.05, 0, dir * -0.15]}
            >
              <mesh scale={[1, 1, 0.55]}>
                <capsuleGeometry args={[0.115, 0.4, 6, 12]} />
                <meshStandardMaterial color={mainColor} roughness={0.62} />
              </mesh>
              <mesh position={[0, -0.02, 0.045]} scale={[0.58, 0.82, 0.45]}>
                <capsuleGeometry args={[0.095, 0.35, 6, 10]} />
                <meshStandardMaterial color={accentColor} roughness={0.62} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case "dog":
      // 강아지: 보드랍게 볼을 감싸며 처진 긴 귀 2개
      return (
        <group>
          {[-1, 1].map((dir) => (
            <mesh
              key={dir}
              position={[dir * 0.63, 0.1, 0.04]}
              rotation={[0.08, 0, dir * 0.26]}
              scale={[0.92, 1.02, 0.64]}
            >
              <capsuleGeometry args={[0.145, 0.36, 6, 12]} />
              <meshStandardMaterial color="#d89747" roughness={0.62} />
            </mesh>
          ))}
        </group>
      );

    case "squirrel":
      return (
        <group>
          {[-1, 1].map((dir) => (
            <group
              key={dir}
              position={[dir * 0.4, 0.52, 0.02]}
              rotation={[0.06, 0, dir * -0.25]}
            >
              <mesh scale={[0.92, 1.15, 0.58]}>
                <sphereGeometry args={[0.175, 14, 10]} />
                <meshStandardMaterial color={mainColor} roughness={0.6} />
              </mesh>
              <mesh position={[0, -0.01, 0.06]} scale={[0.52, 0.72, 0.4]}>
                <sphereGeometry args={[0.14, 10, 8]} />
                <meshStandardMaterial color={subColor} roughness={0.64} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case "penguin":
    case "bear":
    case "panda":
    case "monkey": {
      if (animal === "penguin") return null;
      const earRadius = animal === "monkey" ? 0.235 : 0.19;
      const earPos: [number, number, number] =
        animal === "monkey" ? [0.71, 0.05, -0.01] : [0.46, 0.47, 0.02];
      const earColor = animal === "panda" ? subColor : mainColor;

      return (
        <group>
          {[-1, 1].map((dir) => (
            <group
              key={dir}
              position={[dir * earPos[0], earPos[1], earPos[2]]}
            >
              <mesh scale={[0.94, 1, 0.54]}>
                <sphereGeometry args={[earRadius, 14, 10]} />
                <meshStandardMaterial color={earColor} roughness={0.62} />
              </mesh>
              {animal !== "panda" && (
                <mesh position={[dir * -0.01, 0, 0.06]} scale={[0.6, 0.64, 0.36]}>
                  <sphereGeometry args={[earRadius * 0.85, 12, 10]} />
                  <meshStandardMaterial color={subColor} roughness={0.64} />
                </mesh>
              )}
            </group>
          ))}
        </group>
      );
    }

    case "sheep": {
      // 양: 이마 위 몽글몽글 풍성한 양털 구 7개 + 옆으로 난 복숭아빛 귀 2개
      const headPuffs: [number, number, number, number][] = [
        [0, 0.59, 0.16, 0.21],
        [-0.22, 0.56, 0.1, 0.19],
        [0.22, 0.56, 0.1, 0.19],
        [-0.38, 0.45, -0.04, 0.18],
        [0.38, 0.45, -0.04, 0.18],
        [0, 0.56, -0.15, 0.22],
        [0, 0.36, -0.45, 0.2],
      ];
      return (
        <group>
          {[-1, 1].map((dir) => (
            <mesh
              key={dir}
              position={[dir * 0.67, 0.1, 0]}
              rotation={[0, 0, dir * 1.28]}
              scale={[0.75, 1, 0.48]}
            >
              <capsuleGeometry args={[0.095, 0.21, 5, 10]} />
              <meshStandardMaterial color={mainColor} roughness={0.62} />
            </mesh>
          ))}
          {headPuffs.map(([x, y, z, r], idx) => (
            <mesh key={idx} position={[x, y, z]}>
              <sphereGeometry args={[r, 12, 10]} />
              <meshStandardMaterial color={subColor} roughness={0.72} />
            </mesh>
          ))}
        </group>
      );
    }

    case "hedgehog": {
      // 고슴도치: 얼굴을 감싸는 진한 갈색 가시 후드 + 방사형으로 솟은 크림 끝 가시들
      const headSpikes: [number, number, number, number, number][] = [
        [0, 0.72, -0.1, -0.15, 0],
        [-0.3, 0.68, -0.08, -0.15, 0.45],
        [0.3, 0.68, -0.08, -0.15, -0.45],
        [-0.58, 0.5, -0.08, -0.1, 0.9],
        [0.58, 0.5, -0.08, -0.1, -0.9],
        [-0.72, 0.22, -0.1, 0, 1.25],
        [0.72, 0.22, -0.1, 0, -1.25],
        [-0.68, -0.08, -0.14, 0, 1.48],
        [0.68, -0.08, -0.14, 0, -1.48],
        [0, 0.52, -0.48, -0.82, 0],
        [-0.36, 0.46, -0.44, -0.78, 0.5],
        [0.36, 0.46, -0.44, -0.78, -0.5],
        [0, 0.16, -0.68, -1.45, 0],
        [-0.38, 0.14, -0.6, -1.35, 0.55],
        [0.38, 0.14, -0.6, -1.35, -0.55],
      ];

      return (
        <group>
          {/* 얼굴 뒤를 둥글게 받쳐 정면에서도 테두리가 선명한 갈색 가시 후드 */}
          <mesh position={[0, 0.04, -0.17]} scale={[1.22, 1.12, 1.06]}>
            <sphereGeometry args={[0.63, 20, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.68} />
          </mesh>
          {/* 작고 둥근 귀 2개 */}
          {[-1, 1].map((dir) => (
            <mesh
              key={dir}
              position={[dir * 0.52, 0.36, 0.12]}
              scale={[1, 1, 0.55]}
            >
              <sphereGeometry args={[0.125, 12, 10]} />
              <meshStandardMaterial color={mainColor} roughness={0.62} />
            </mesh>
          ))}
          {/* 끝부분이 크림빛으로 밝은 고슴도치 가시 */}
          {headSpikes.map(([x, y, z, rx, rz], idx) => (
            <group key={idx} position={[x, y, z]} rotation={[rx, 0, rz]}>
              <mesh>
                <coneGeometry args={[0.115, 0.36, 10]} />
                <meshStandardMaterial color={accentColor} roughness={0.65} />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <coneGeometry args={[0.065, 0.17, 8]} />
                <meshStandardMaterial color="#e8d4c0" roughness={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      );
    }

    case "parrot":
      // 앵무새: 알록달록 무지개빛 머리 위 깃털 3가닥
      return (
        <group position={[0, 0.58, 0.06]}>
          <mesh position={[-0.08, 0.08, -0.02]} rotation={[-0.25, 0, 0.35]}>
            <capsuleGeometry args={[0.055, 0.18, 5, 10]} />
            <meshStandardMaterial color="#3fb774" roughness={0.55} />
          </mesh>
          <mesh position={[0.01, 0.12, 0.01]} rotation={[-0.18, 0, -0.04]}>
            <capsuleGeometry args={[0.055, 0.22, 5, 10]} />
            <meshStandardMaterial color="#ffca3a" roughness={0.55} />
          </mesh>
          <mesh position={[0.09, 0.07, -0.02]} rotation={[-0.28, 0, -0.36]}>
            <capsuleGeometry args={[0.05, 0.16, 5, 10]} />
            <meshStandardMaterial color="#3a86ff" roughness={0.55} />
          </mesh>
        </group>
      );
  }
}

/**
 * 등딱지, 등 무늬, 양털, 고슴도치 등 가시처럼 몸통에 붙는 특징을 그립니다.
 */
function AnimalBackFeatures({ config }: { config: AnimalVisualConfig }) {
  const { animal, subColor, accentColor } = config;

  if (animal === "owl") {
    // 부엉이 배 깃털 반점 무늬 (배 타원 앞쪽으로 살짝 띄워 z-fighting 없음)
    const speckles: [number, number, number][] = [
      [-0.11, -0.31, 0.455],
      [0.11, -0.31, 0.455],
      [0, -0.39, 0.47],
      [-0.12, -0.46, 0.445],
      [0.12, -0.46, 0.445],
    ];
    return (
      <group>
        {speckles.map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]} scale={[1.1, 1.4, 0.45]}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshStandardMaterial color="#70492e" roughness={0.62} />
          </mesh>
        ))}
      </group>
    );
  }

  if (animal === "turtle") {
    // 거북이: 앞과 옆에서도 단단한 실루엣이 바로 드러나는 넓은 육각 등딱지
    const scutes: [number, number, number, number][] = [
      [0, 0.04, -0.45, 0.22],
      [-0.27, 0.18, -0.32, 0.17],
      [0.27, 0.18, -0.32, 0.17],
      [-0.31, -0.14, -0.3, 0.17],
      [0.31, -0.14, -0.3, 0.17],
      [0, 0.29, -0.26, 0.17],
      [0, -0.26, -0.32, 0.17],
    ];
    return (
      <group position={[0, -0.34, -0.14]}>
        <mesh scale={[1.24, 1.1, 0.94]}>
          <sphereGeometry args={[0.53, 20, 14]} />
          <meshStandardMaterial color={accentColor} roughness={0.44} />
        </mesh>
        <mesh position={[0, 0, 0.13]} rotation={[0.06, 0, 0]} scale={[1.23, 1.09, 1]}>
          <torusGeometry args={[0.525, 0.068, 10, 22]} />
          <meshStandardMaterial color={subColor} roughness={0.58} />
        </mesh>
        {scutes.map(([x, y, z, r], idx) => (
          <mesh key={idx} position={[x, y, z]} scale={[1, 0.95, 0.45]}>
            <sphereGeometry args={[r, 12, 10]} />
            <meshStandardMaterial color="#6e9b6b" roughness={0.48} />
          </mesh>
        ))}
      </group>
    );
  }

  if (animal === "deer") {
    // 사슴: 뒷등과 좌우 옆구리에 고루 퍼져 반측면에서도 잘 보이는 하얀 반점
    const spots: [number, number, number, number][] = [
      [-0.36, -0.26, -0.22, 0.056],
      [0.36, -0.26, -0.22, 0.056],
      [-0.38, -0.42, -0.18, 0.052],
      [0.38, -0.42, -0.18, 0.052],
      [-0.18, -0.22, -0.39, 0.06],
      [0.18, -0.24, -0.39, 0.058],
      [0, -0.35, -0.44, 0.065],
      [-0.22, -0.45, -0.37, 0.052],
      [0.2, -0.46, -0.37, 0.055],
    ];
    return (
      <group>
        {spots.map(([x, y, z, r], idx) => (
          <mesh key={idx} position={[x, y, z]}>
            <sphereGeometry args={[r, 10, 8]} />
            <meshStandardMaterial color={subColor} roughness={0.62} />
          </mesh>
        ))}
      </group>
    );
  }

  if (animal === "sheep") {
    // 양: 몸통 전체를 구름처럼 포근하게 감싸는 양털 구 클러스터
    const woolPuffs: [number, number, number, number][] = [
      [-0.26, -0.24, 0.34, 0.21],
      [0.26, -0.24, 0.34, 0.21],
      [-0.34, -0.42, 0.22, 0.22],
      [0.34, -0.42, 0.22, 0.22],
      [0, -0.44, 0.38, 0.23],
      [-0.28, -0.36, -0.28, 0.23],
      [0.28, -0.36, -0.28, 0.23],
      [0, -0.28, -0.38, 0.24],
      [0, -0.5, -0.34, 0.22],
    ];
    return (
      <group>
        {woolPuffs.map(([x, y, z, r], idx) => (
          <mesh key={idx} position={[x, y, z]}>
            <sphereGeometry args={[r, 12, 10]} />
            <meshStandardMaterial color={subColor} roughness={0.74} />
          </mesh>
        ))}
      </group>
    );
  }

  if (animal === "hedgehog") {
    // 고슴도치: 등과 옆구리를 채우는 2중 가시 망토
    const backSpikes: [number, number, number, number, number][] = [
      [0, -0.15, -0.56, -1.18, 0],
      [-0.4, -0.2, -0.48, -1.08, 0.68],
      [0.4, -0.2, -0.48, -1.08, -0.68],
      [0, -0.39, -0.6, -1.52, 0],
      [-0.46, -0.41, -0.42, -1.45, 0.88],
      [0.46, -0.41, -0.42, -1.45, -0.88],
      [0, -0.6, -0.5, -1.9, 0],
    ];
    return (
      <group>
        <mesh position={[0, -0.35, -0.14]} scale={[1.18, 1.02, 0.96]}>
          <sphereGeometry args={[0.51, 18, 14]} />
          <meshStandardMaterial color={accentColor} roughness={0.68} />
        </mesh>
        {backSpikes.map(([x, y, z, rx, rz], idx) => (
          <group key={idx} position={[x, y, z]} rotation={[rx, 0, rz]}>
            <mesh>
              <coneGeometry args={[0.115, 0.36, 10]} />
              <meshStandardMaterial color={accentColor} roughness={0.65} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <coneGeometry args={[0.065, 0.17, 8]} />
              <meshStandardMaterial color="#e8d4c0" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  return null;
}

/**
 * 일러스트 속 각 동물 캐릭터만의 개성 있는 소품(책, 꽃, 넥타이, 도토리, 꿀봉, 클립보드, 목도리, 대나무 등)을 그립니다.
 */
function AnimalHeldProps({ config }: { config: AnimalVisualConfig }) {
  const { animal } = config;

  if (animal === "cat") {
    // 고양이(INTP): 양손으로 펼쳐 읽고 있는 따뜻한 갈색 표지의 책
    return (
      <group position={[0, -0.36, 0.455]} rotation={[-0.34, 0, 0]}>
        <mesh position={[-0.12, 0, 0]} rotation={[0, 0.32, -0.14]}>
          <boxGeometry args={[0.24, 0.27, 0.024]} />
          <meshStandardMaterial color="#7d5238" roughness={0.58} />
        </mesh>
        <mesh position={[0.12, 0, 0]} rotation={[0, -0.32, 0.14]}>
          <boxGeometry args={[0.24, 0.27, 0.024]} />
          <meshStandardMaterial color="#7d5238" roughness={0.58} />
        </mesh>
        <mesh position={[-0.11, 0, 0.02]} rotation={[0, 0.32, -0.14]}>
          <boxGeometry args={[0.21, 0.24, 0.022]} />
          <meshStandardMaterial color="#faf3e6" roughness={0.75} />
        </mesh>
        <mesh position={[0.11, 0, 0.02]} rotation={[0, -0.32, 0.14]}>
          <boxGeometry args={[0.21, 0.24, 0.022]} />
          <meshStandardMaterial color="#faf3e6" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <capsuleGeometry args={[0.024, 0.24, 4, 8]} />
          <meshStandardMaterial color="#66402a" roughness={0.55} />
        </mesh>
        <mesh position={[0.05, -0.14, 0.02]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.028, 0.09, 0.008]} />
          <meshStandardMaterial color="#e25874" roughness={0.5} />
        </mesh>
      </group>
    );
  }

  if (animal === "rabbit") {
    // 토끼(INFP): 앞발에 조심스레 쥔 분홍 데이지 꽃 한 송이
    const petalAngles = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
    return (
      <group position={[0.18, -0.34, 0.5]} rotation={[0.12, 0, -0.32]}>
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.014, 0.016, 0.3, 8]} />
          <meshStandardMaterial color="#63a86b" roughness={0.55} />
        </mesh>
        <mesh position={[0.055, -0.14, 0.01]} rotation={[0, 0, -0.8]} scale={[0.7, 1.3, 0.3]}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshStandardMaterial color="#6ec077" roughness={0.52} />
        </mesh>
        <group position={[0, 0.04, 0.02]}>
          <mesh>
            <sphereGeometry args={[0.045, 10, 8]} />
            <meshStandardMaterial color="#ffd15c" roughness={0.45} />
          </mesh>
          {petalAngles.map((angle, idx) => (
            <mesh
              key={idx}
              position={[Math.cos(angle) * 0.068, Math.sin(angle) * 0.068, -0.01]}
              rotation={[0, 0, angle]}
              scale={[1.45, 0.78, 0.45]}
            >
              <sphereGeometry args={[0.036, 8, 6]} />
              <meshStandardMaterial color="#f7a8c0" roughness={0.55} />
            </mesh>
          ))}
        </group>
      </group>
    );
  }

  if (animal === "dog") {
    // 강아지(ENFJ): 단정한 하얀 셔츠 카라와 빨강·파랑 줄무늬 넥타이
    return (
      <group>
        <mesh position={[0, -0.02, 0.06]} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[0.33, 0.045, 8, 22]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <group position={[0, -0.06, 0.455]}>
          {/* 넥타이 매듭 */}
          <mesh position={[0, 0.01, 0.025]} scale={[1.1, 0.9, 0.7]}>
            <sphereGeometry args={[0.062, 10, 8]} />
            <meshStandardMaterial color="#d9485b" roughness={0.45} />
          </mesh>
          {/* 넥타이 몸체 */}
          <mesh position={[0, -0.17, 0.035]} rotation={[-0.22, 0, 0]}>
            <boxGeometry args={[0.088, 0.29, 0.026]} />
            <meshStandardMaterial color="#3c5e94" roughness={0.48} />
          </mesh>
          {/* 사선 줄무늬 포인트 2줄 */}
          <mesh position={[0, -0.12, 0.046]} rotation={[-0.22, 0, 0.45]}>
            <boxGeometry args={[0.095, 0.028, 0.018]} />
            <meshStandardMaterial color="#e8586a" roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.22, 0.065]} rotation={[-0.22, 0, 0.45]}>
            <boxGeometry args={[0.095, 0.028, 0.018]} />
            <meshStandardMaterial color="#f5e6d3" roughness={0.45} />
          </mesh>
        </group>
      </group>
    );
  }

  if (animal === "squirrel") {
    // 다람쥐(ENFP): 두 손에 꼭 쥔 반짝이는 도토리
    return (
      <group position={[0, -0.35, 0.5]} rotation={[0.15, 0, -0.18]}>
        <mesh position={[0, -0.03, 0]} scale={[0.92, 1.15, 0.92]}>
          <sphereGeometry args={[0.125, 14, 10]} />
          <meshStandardMaterial color="#9e5a28" roughness={0.28} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.06, 0]} scale={[1.04, 0.7, 1.04]}>
          <sphereGeometry args={[0.132, 14, 10]} />
          <meshStandardMaterial color="#5c3318" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.17, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.016, 0.06, 4, 8]} />
          <meshStandardMaterial color="#4a2812" roughness={0.65} />
        </mesh>
      </group>
    );
  }

  if (animal === "bear") {
    // 곰(ISFJ): 오른손 쪽으로 비스듬히 든 나무 꿀봉과 반짝이는 황금빛 꿀
    return (
      <group position={[0.29, -0.28, 0.47]} rotation={[0.18, 0, -0.58]}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.42, 10]} />
          <meshStandardMaterial color="#ba8149" roughness={0.52} />
        </mesh>
        {[-0.04, 0, 0.04].map((dy, idx) => (
          <mesh key={idx} position={[0, 0.14 + dy, 0]} scale={[1, 0.65, 1]}>
            <sphereGeometry args={[0.062, 12, 10]} />
            <meshStandardMaterial color="#d4974b" roughness={0.45} />
          </mesh>
        ))}
        {/* 반짝이는 꿀 코팅과 꿀방울 */}
        <mesh position={[0, 0.16, 0.01]} scale={[1.06, 0.95, 1.06]}>
          <sphereGeometry args={[0.064, 12, 10]} />
          <meshStandardMaterial color="#f5a623" roughness={0.14} metalness={0.06} />
        </mesh>
        <mesh position={[0.02, 0.07, 0.05]} scale={[0.7, 1.3, 0.7]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#ffb830" roughness={0.12} />
        </mesh>
      </group>
    );
  }

  if (animal === "penguin") {
    // 펭귄(ESTJ): 왼팔 쪽에 야무지게 낀 체크리스트 클립보드
    return (
      <group position={[-0.43, -0.34, 0.36]} rotation={[0.08, 0.56, 0.1]}>
        <mesh>
          <boxGeometry args={[0.24, 0.32, 0.024]} />
          <meshStandardMaterial color="#c49464" roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.01, 0.016]}>
          <boxGeometry args={[0.19, 0.25, 0.014]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.135, 0.024]}>
          <boxGeometry args={[0.09, 0.036, 0.022]} />
          <meshStandardMaterial color="#6a7587" roughness={0.3} metalness={0.5} />
        </mesh>
        {[0.05, 0, -0.05].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.026]}>
            <boxGeometry args={[0.13, 0.014, 0.008]} />
            <meshStandardMaterial color="#7d8a9c" roughness={0.5} />
          </mesh>
        ))}
      </group>
    );
  }

  if (animal === "sheep") {
    // 양(ESFJ): 목을 포근히 감싼 베이지색 니트 목도리와 두 가닥 끝자락
    return (
      <group>
        <mesh position={[0, -0.02, 0.04]} rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[0.37, 0.076, 10, 24]} />
          <meshStandardMaterial color="#c8a388" roughness={0.78} />
        </mesh>
        <mesh position={[0.12, -0.22, 0.5]} rotation={[-0.22, 0, -0.14]}>
          <capsuleGeometry args={[0.055, 0.17, 5, 10]} />
          <meshStandardMaterial color="#c8a388" roughness={0.78} />
        </mesh>
        <mesh position={[0.22, -0.19, 0.47]} rotation={[-0.25, 0, -0.3]}>
          <capsuleGeometry args={[0.05, 0.14, 5, 10]} />
          <meshStandardMaterial color="#b89176" roughness={0.78} />
        </mesh>
      </group>
    );
  }

  if (animal === "panda") {
    // 판다(ISFP): 앞발에 쥐고 잎사귀가 달린 싱그러운 초록 대나무
    return (
      <group position={[0.14, -0.28, 0.51]} rotation={[0.15, 0, -0.45]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.028, 0.032, 0.46, 10]} />
          <meshStandardMaterial color="#58a660" roughness={0.5} />
        </mesh>
        {[-0.08, 0.08].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.031, 0.008, 6, 12]} />
            <meshStandardMaterial color="#3d8246" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0.07, 0.17, 0.01]} rotation={[0, 0, -0.7]} scale={[0.55, 1.35, 0.25]}>
          <sphereGeometry args={[0.055, 8, 6]} />
          <meshStandardMaterial color="#70c277" roughness={0.48} />
        </mesh>
        <mesh position={[-0.06, 0.1, 0.01]} rotation={[0, 0, 0.75]} scale={[0.5, 1.2, 0.25]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color="#70c277" roughness={0.48} />
        </mesh>
      </group>
    );
  }

  if (animal === "monkey") {
    // 원숭이(ESTP): 손에 쥔 앙증맞은 정글 초록 덩굴 잎사귀
    return (
      <group position={[0.48, -0.35, 0.19]} rotation={[0.2, 0.3, -0.4]}>
        <mesh>
          <capsuleGeometry args={[0.015, 0.24, 4, 8]} />
          <meshStandardMaterial color="#5d9448" roughness={0.55} />
        </mesh>
        <mesh position={[0.06, 0.1, 0.01]} rotation={[0, 0, -0.65]} scale={[0.65, 1.35, 0.25]}>
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshStandardMaterial color="#6fb858" roughness={0.5} />
        </mesh>
      </group>
    );
  }

  return null;
}

/**
 * 동물마다 다른 꼬리 모양을 그립니다.
 */
function AnimalTail({ config }: { config: AnimalVisualConfig }) {
  const { animal, mainColor, subColor, accentColor } = config;

  switch (animal) {
    case "turtle":
    case "hedgehog":
      return null;

    case "cat":
      return (
        <group position={[0, -0.58, -0.42]}>
          <mesh position={[0, 0.06, -0.14]} rotation={[-0.9, 0, 0]}>
            <capsuleGeometry args={[0.055, 0.24, 5, 10]} />
            <meshStandardMaterial color={mainColor} roughness={0.62} />
          </mesh>
          <mesh position={[0, 0.24, -0.25]} rotation={[-0.25, 0, 0]}>
            <capsuleGeometry args={[0.052, 0.24, 5, 10]} />
            <meshStandardMaterial color="#7d726b" roughness={0.62} />
          </mesh>
        </group>
      );

    case "fox":
      return (
        <group position={[0, -0.56, -0.44]} rotation={[-0.78, 0, 0]}>
          <mesh scale={[1.1, 1, 1.1]}>
            <capsuleGeometry args={[0.13, 0.3, 6, 12]} />
            <meshStandardMaterial color={mainColor} roughness={0.62} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.135, 12, 10]} />
            <meshStandardMaterial color={subColor} roughness={0.64} />
          </mesh>
        </group>
      );

    case "squirrel":
      return (
        <group position={[0, -0.46, -0.46]}>
          <mesh position={[0, 0.16, -0.16]} rotation={[-0.68, 0, 0]} scale={[1.15, 1, 1.15]}>
            <capsuleGeometry args={[0.175, 0.36, 6, 12]} />
            <meshStandardMaterial color={mainColor} roughness={0.64} />
          </mesh>
          <mesh position={[0, 0.44, -0.24]} scale={[1.15, 1.15, 1.15]}>
            <sphereGeometry args={[0.205, 14, 10]} />
            <meshStandardMaterial color={mainColor} roughness={0.64} />
          </mesh>
          <mesh position={[0, 0.56, -0.13]}>
            <sphereGeometry args={[0.13, 12, 10]} />
            <meshStandardMaterial color={accentColor} roughness={0.64} />
          </mesh>
        </group>
      );

    case "lion":
      return (
        <group position={[0, -0.56, -0.44]}>
          <mesh position={[0, 0.06, -0.13]} rotation={[-0.92, 0, 0]}>
            <capsuleGeometry args={[0.036, 0.34, 5, 8]} />
            <meshStandardMaterial color={mainColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.19, -0.29]}>
            <sphereGeometry args={[0.095, 12, 10]} />
            <meshStandardMaterial color={accentColor} roughness={0.65} />
          </mesh>
        </group>
      );

    case "dog":
      // 강아지(ENFJ): 엉덩이 뒤쪽으로 또렷하게 뻗어 신나게 흔드는 꼬리
      return (
        <mesh position={[0, -0.39, -0.5]} rotation={[-0.78, 0, 0]}>
          <capsuleGeometry args={[0.082, 0.28, 6, 12]} />
          <meshStandardMaterial color={mainColor} roughness={0.6} />
        </mesh>
      );

    case "monkey":
      return (
        <group position={[0, -0.56, -0.42]}>
          <mesh position={[0, 0.04, -0.16]} rotation={[-1.0, 0, 0]}>
            <capsuleGeometry args={[0.04, 0.3, 5, 10]} />
            <meshStandardMaterial color={mainColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.24, -0.28]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.12, 0.036, 8, 16, Math.PI * 1.35]} />
            <meshStandardMaterial color={mainColor} roughness={0.6} />
          </mesh>
        </group>
      );

    case "owl":
    case "penguin":
    case "parrot":
      return (
        <group position={[0, -0.62, -0.42]} rotation={[-0.95, 0, 0]}>
          <mesh scale={[1.2, 1, 0.52]}>
            <coneGeometry args={[0.14, 0.28, 10]} />
            <meshStandardMaterial
              color={animal === "parrot" ? "#3a86ff" : mainColor}
              roughness={0.58}
            />
          </mesh>
          {animal === "parrot" && (
            <>
              <mesh position={[-0.08, -0.02, 0]} rotation={[0, 0, 0.22]} scale={[0.9, 0.9, 0.45]}>
                <coneGeometry args={[0.11, 0.24, 10]} />
                <meshStandardMaterial color={subColor} roughness={0.55} />
              </mesh>
              <mesh position={[0.08, -0.02, 0]} rotation={[0, 0, -0.22]} scale={[0.9, 0.9, 0.45]}>
                <coneGeometry args={[0.11, 0.24, 10]} />
                <meshStandardMaterial color={mainColor} roughness={0.55} />
              </mesh>
            </>
          )}
        </group>
      );

    default: {
      // 사슴, 토끼, 곰, 양, 판다: 동글동글한 솜방울 꼬리
      const puffColor =
        animal === "panda" ? subColor : animal === "rabbit" ? subColor : mainColor;
      return (
        <mesh position={[0, -0.56, -0.45]}>
          <sphereGeometry args={[0.125, 12, 10]} />
          <meshStandardMaterial color={puffColor} roughness={0.66} />
        </mesh>
      );
    }
  }
}
