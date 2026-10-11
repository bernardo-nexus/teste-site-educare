import { ContactShadows, Environment, Html, Lightformer, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import { type ReactNode, useMemo, useRef } from 'react';
import * as THREE from 'three';

import icon from '../../assets/icon-192.png';
import { I18nBridge, useI18n } from '../../i18n';

/*
 * iPhone 17 Pro Max, modelled in code.
 * Units: 1 = 10 mm. Real body: 163.4 × 78.0 × 8.75 mm.
 */
const W = 7.8;
const H = 16.34;
const D = 0.875;
const CORNER = 1.18; // plan-view corner radius
const BEVEL = 0.2; // rounded side edge
const FRONT_Z = D / 2;
const BACK_Z = -D / 2;

// Screen (display area) — bezel ≈ 1.2 mm
const SCREEN_W = W - 0.52;
const SCREEN_H = H - 0.52;
const PX_PER_UNIT = 40; // drei <Html transform> default: 1 unit = 40 css px

function roundedRectShape(w: number, h: number, r: number, rBottom = r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + rBottom, y);
  s.lineTo(x + w - rBottom, y);
  s.quadraticCurveTo(x + w, y, x + w, y + rBottom);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + rBottom);
  s.quadraticCurveTo(x, y, x + rBottom, y);
  return s;
}

function useSlab(w: number, h: number, depth: number, r: number, bevel: number, rBottom = r) {
  return useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRectShape(w - bevel * 2, h - bevel * 2, Math.max(r - bevel, 0.01), Math.max(rBottom - bevel, 0.01)), {
      depth: Math.max(depth - bevel * 2, 0.001),
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 10,
      curveSegments: 48,
    });
    g.translate(0, 0, -(depth - bevel * 2) / 2);
    g.computeVertexNormals();
    return g;
  }, [w, h, depth, r, bevel, rBottom]);
}

function usePlane(w: number, h: number, r: number) {
  return useMemo(() => new THREE.ShapeGeometry(roundedRectShape(w, h, r), 48), [w, h, r]);
}

/* ─── Materials ─────────────────────────────────────────────────────────── */

function useMaterials() {
  return useMemo(
    () => ({
      aluminium: new THREE.MeshPhysicalMaterial({
        color: '#d9dbde',
        metalness: 1,
        roughness: 0.32,
        clearcoat: 0.25,
        clearcoatRoughness: 0.4,
      }),
      backGlass: new THREE.MeshPhysicalMaterial({
        color: '#f0f1f2',
        metalness: 0.2,
        roughness: 0.55, // frosted
        clearcoat: 0.6,
        clearcoatRoughness: 0.5,
      }),
      frontGlass: new THREE.MeshPhysicalMaterial({
        color: '#020203',
        metalness: 0,
        roughness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        reflectivity: 0.6,
      }),
      screenGlare: new THREE.MeshPhysicalMaterial({
        color: '#000000',
        metalness: 0,
        roughness: 0.02,
        transparent: true,
        opacity: 0.12,
        clearcoat: 1,
        depthWrite: false,
      }),
      island: new THREE.MeshStandardMaterial({ color: '#000000', roughness: 0.3 }),
      lensRing: new THREE.MeshPhysicalMaterial({ color: '#bfc2c6', metalness: 1, roughness: 0.18 }),
      lensGlass: new THREE.MeshPhysicalMaterial({
        color: '#05070a',
        metalness: 0.1,
        roughness: 0.02,
        clearcoat: 1,
        iridescence: 0.9,
        iridescenceIOR: 1.6,
        iridescenceThicknessRange: [200, 500],
      }),
      lensInner: new THREE.MeshPhysicalMaterial({ color: '#141a24', metalness: 0.6, roughness: 0.15 }),
      flash: new THREE.MeshPhysicalMaterial({ color: '#f4ecd2', roughness: 0.35, transmission: 0.2, clearcoat: 1 }),
      sensor: new THREE.MeshPhysicalMaterial({ color: '#15171b', roughness: 0.1, clearcoat: 1 }),
      button: new THREE.MeshPhysicalMaterial({ color: '#cfd2d6', metalness: 1, roughness: 0.25 }),
      sapphire: new THREE.MeshPhysicalMaterial({ color: '#9da3aa', metalness: 0.6, roughness: 0.08, clearcoat: 1 }),
      antenna: new THREE.MeshStandardMaterial({ color: '#9fa3a8', roughness: 0.6 }),
    }),
    [],
  );
}

/* ─── Parts ─────────────────────────────────────────────────────────────── */

function Lens({ x, y, z, m }: { x: number; y: number; z: number; m: ReturnType<typeof useMaterials> }) {
  return (
    <group position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* metal ring (cylinder axis is Y, rotated to point out of the back) */}
      <mesh material={m.lensRing} position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.66, 0.68, 0.18, 64]} />
      </mesh>
      <mesh material={m.lensGlass} position={[0, 0.185, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.02, 64]} />
      </mesh>
      <mesh material={m.lensInner} position={[0, 0.192, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.012, 48]} />
      </mesh>
    </group>
  );
}

function Device({ angle, screen }: { angle: MotionValue<number>; screen: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const m = useMaterials();
  const iconImg = useTexture(icon);
  const iconTex = useMemo(() => {
    // Clip the square app icon to the iOS squircle-ish radius
    const img = iconImg.image as HTMLImageElement;
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d')!;
    const r = size * 0.23;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, r);
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [iconImg]);

  const body = useSlab(W, H, D, CORNER, BEVEL);
  const frontGlass = usePlane(W - 0.18, H - 0.18, CORNER - 0.09);
  const glare = usePlane(SCREEN_W, SCREEN_H, CORNER - 0.26);
  const backGlass = usePlane(W - 0.42, H - 4.95, CORNER - 0.25);
  const plateau = useSlab(W - 0.18, 4.25, 0.16, CORNER - 0.09, 0.06, 0.32);

  useFrame((state) => {
    if (!group.current) return;
    const deg = angle.get();
    const rad = THREE.MathUtils.degToRad(deg);
    group.current.rotation.y = rad;
    group.current.rotation.x = Math.sin(rad) * 0.08 - 0.04;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08; // idle float
    // Hide the DOM screen whenever the front is turned away
    if (screenRef.current) {
      const facing = Math.cos(rad);
      screenRef.current.style.visibility = facing > 0.02 ? 'visible' : 'hidden';
    }
  });

  return (
    <group ref={group}>
      {/* Unibody: aluminium frame */}
      <mesh geometry={body} material={m.aluminium} castShadow />

      {/* Antenna bands on the frame */}
      {[-1, 1].map((sx) =>
        [H / 2 - 1.6, -(H / 2 - 1.6)].map((y) => (
          <mesh key={`${sx}-${y}`} position={[(sx * W) / 2, y, 0]} material={m.antenna}>
            <boxGeometry args={[0.02, 0.06, D * 0.55]} />
          </mesh>
        )),
      )}

      {/* ── Front ── */}
      <mesh geometry={frontGlass} material={m.frontGlass} position={[0, 0, FRONT_Z + 0.002]} />
      <Html
        transform
        position={[0, 0, FRONT_Z + 0.012]}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={screenRef}
          style={{
            width: SCREEN_W * PX_PER_UNIT,
            height: SCREEN_H * PX_PER_UNIT,
            borderRadius: (CORNER - 0.26) * PX_PER_UNIT,
            overflow: 'hidden',
            background: '#fff',
            position: 'relative',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {screen}
          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: 0.34 * PX_PER_UNIT,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 2.3 * PX_PER_UNIT,
              height: 0.68 * PX_PER_UNIT,
              borderRadius: 999,
              background: '#000',
              zIndex: 30,
            }}
          />
        </div>
      </Html>
      <mesh geometry={glare} material={m.screenGlare} position={[0, 0, FRONT_Z + 0.02]} />

      {/* ── Side buttons ── left: action + volume, right: side + camera control */}
      {[
        { y: 5.15, h: 0.62 },
        { y: 3.9, h: 1.15 },
        { y: 2.45, h: 1.15 },
      ].map((b) => (
        <mesh key={b.y} position={[-W / 2 - 0.03, b.y, 0]} material={m.button}>
          <boxGeometry args={[0.09, b.h, 0.34]} />
        </mesh>
      ))}
      <mesh position={[W / 2 + 0.03, 3.55, 0]} material={m.button}>
        <boxGeometry args={[0.09, 1.7, 0.34]} />
      </mesh>
      <mesh position={[W / 2 + 0.015, -2.6, 0]} material={m.sapphire}>
        <boxGeometry args={[0.05, 1.45, 0.3]} />
      </mesh>

      {/* ── Back ── frosted glass panel below the plateau */}
      <mesh
        geometry={backGlass}
        material={m.backGlass}
        position={[0, -2.05, BACK_Z - 0.002]}
        rotation={[0, Math.PI, 0]}
      />
      {/* Brand mark on the back glass */}
      <mesh position={[0, -1.6, BACK_Z - 0.006]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.15, 1.15]} />
        <meshBasicMaterial map={iconTex} toneMapped={false} transparent />
      </mesh>

      {/* Camera plateau — full width across the top */}
      <mesh geometry={plateau} material={m.aluminium} position={[0, H / 2 - 0.09 - 4.25 / 2, BACK_Z - 0.08]} />

      {/* Lenses in a triangle on the left (as seen from the back, so +x) */}
      {(() => {
        const z = BACK_Z - 0.16;
        return (
          <>
            <Lens x={2.35} y={6.95} z={z} m={m} />
            <Lens x={2.35} y={5.0} z={z} m={m} />
            <Lens x={0.72} y={5.97} z={z} m={m} />
            {/* flash + LiDAR */}
            <mesh position={[-0.55, 6.85, z - 0.01]} rotation={[-Math.PI / 2, 0, 0]} material={m.flash}>
              <cylinderGeometry args={[0.24, 0.24, 0.02, 40]} />
            </mesh>
            <mesh position={[-0.55, 5.1, z - 0.01]} rotation={[-Math.PI / 2, 0, 0]} material={m.sensor}>
              <cylinderGeometry args={[0.2, 0.2, 0.02, 40]} />
            </mesh>
          </>
        );
      })()}
    </group>
  );
}

/* ─── Studio ────────────────────────────────────────────────────────────── */

function Studio() {
  return (
    <Environment resolution={512}>
      {/* Neutral studio walls — what the aluminium mostly reflects */}
      <color attach="background" args={['#8d9297']} />
      {/* Soft overhead box */}
      <Lightformer form="rect" intensity={2.2} position={[0, 12, 6]} rotation-x={Math.PI / 2} scale={[20, 8, 1]} />
      {/* Long strip lights — these paint the vertical highlights on the aluminium */}
      <Lightformer form="rect" intensity={4} position={[-9, 2, 4]} rotation-y={Math.PI / 2.4} scale={[2, 26, 1]} />
      <Lightformer form="rect" intensity={3} position={[9, 0, 3]} rotation-y={-Math.PI / 2.4} scale={[1.2, 26, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[0, -2, -12]} scale={[18, 10, 1]} />
      {/* Warm kicker to keep it from looking clinical */}
      <Lightformer form="ring" color="#fff1d6" intensity={2} position={[6, 8, -6]} scale={4} />
    </Environment>
  );
}

interface IPhone3DProps {
  angle: MotionValue<number>;
  screen: ReactNode;
  className?: string;
}

export default function IPhone3D({ angle, screen, className }: IPhone3DProps) {
  // drei <Html> mounts its own React root, so the language context has to be bridged in
  const i18n = useI18n();
  const bridged = <I18nBridge value={i18n}>{screen}</I18nBridge>;
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        camera={{ position: [0, 0, 46], fov: 24 }}
        shadows
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 10, 12]} intensity={1.1} castShadow />
        <Studio />
        <Device angle={angle} screen={bridged} />
        <ContactShadows position={[0, -H / 2 - 1.2, 0]} opacity={0.38} scale={18} blur={2.6} far={6} resolution={512} />
      </Canvas>
    </div>
  );
}
