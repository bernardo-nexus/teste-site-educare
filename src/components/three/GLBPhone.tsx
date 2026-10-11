import { ContactShadows, Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/*
 * Model: "iPhone 17 Pro" by Ranguel — https://sketchfab.com/3d-models/iphone-17-pro-4541aa8a28324b33a2baaf81d263aaec
 * License: CC BY 4.0 (commercial use allowed, attribution required — credited in the footer).
 */
export const PHONE_MODEL_URL = '/models/iphone-17-pro.glb';

const TARGET_HEIGHT = 16; // world units the phone is scaled to
const SCREEN_MESH = 'educare-screen';

interface GLBPhoneProps {
  angle: MotionValue<number>;
  /** One image per screen; index chosen by the spin (0, 1, 2…) */
  screens: string[];
  screenIndex: number;
  className?: string;
}

function Model({ angle, screens, screenIndex }: Omit<GLBPhoneProps, 'className'>) {
  const { scene } = useGLTF(PHONE_MODEL_URL);
  const textures = useTexture(screens);
  const spin = useRef<THREE.Group>(null);

  textures.forEach((t) => {
    t.flipY = false; // glTF UV convention
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    // The display mesh is seen from its inner face, which mirrors the UVs — flip back
    t.repeat.set(-1, 1);
    t.offset.set(1, 0);
  });

  // Swap the display for our screenshots, drop any Apple logo, and centre/scale the device
  const { phone } = useMemo(() => {
    const root = scene.clone(true);

    const screenMat = new THREE.MeshBasicMaterial({
      toneMapped: false,
      side: THREE.DoubleSide, // the display mesh's faces point inward in this file
      polygonOffset: true, // it sits flush with the black display frame — pull it forward
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    root.traverse((o) => {
      if (/apple_logo/i.test(o.name)) o.visible = false;
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat?.name === 'OLED' || mat?.name === 'Screen') {
          mesh.material = screenMat;
          mesh.name = SCREEN_MESH;
        }
        // Thin the tinted cover glass so the screenshot reads at full brightness
        if (mat?.name === 'Glass') {
          const glass = mat.clone();
          glass.opacity = 0.06;
          mesh.material = glass;
        }
        mesh.castShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const holder = new THREE.Group();
    root.position.sub(center);
    // The file's front faces −Z; turn it so the display faces the camera at 0°
    const facing = new THREE.Group();
    facing.rotation.y = Math.PI;
    facing.add(root);
    holder.add(facing);
    // Scale by the tallest side so the phone fills the frame regardless of the file's units
    holder.scale.setScalar(TARGET_HEIGHT / Math.max(size.x, size.y, size.z));
    return { phone: holder };
  }, [scene]);

  const activeTexture = textures[Math.min(screenIndex, textures.length - 1)] ?? null;

  useFrame((state) => {
    // Swap the screenshot on the display when the role changes. The material is reached through the
    // scene graph (not the memoised value) because three.js objects are mutated in place.
    const screenMesh = spin.current?.getObjectByName(SCREEN_MESH) as THREE.Mesh | undefined;
    const mat = screenMesh?.material as THREE.MeshBasicMaterial | undefined;
    if (mat && mat.map !== activeTexture) {
      mat.map = activeTexture;
      mat.needsUpdate = true;
    }
    if (!spin.current) return;
    const rad = THREE.MathUtils.degToRad(angle.get());
    spin.current.rotation.y = rad;
    spin.current.rotation.x = Math.sin(rad) * 0.08 - 0.04;
    spin.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
  });

  return (
    <group ref={spin}>
      <primitive object={phone} />
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={512}>
      <color attach="background" args={['#7f858b']} />
      <Lightformer form="rect" intensity={2.4} position={[0, 12, 6]} rotation-x={Math.PI / 2} scale={[20, 8, 1]} />
      <Lightformer form="rect" intensity={4} position={[-9, 2, 4]} rotation-y={Math.PI / 2.4} scale={[2, 26, 1]} />
      <Lightformer form="rect" intensity={3} position={[9, 0, 3]} rotation-y={-Math.PI / 2.4} scale={[1.2, 26, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[0, -2, -12]} scale={[18, 10, 1]} />
      <Lightformer form="ring" color="#fff1d6" intensity={2} position={[6, 8, -6]} scale={4} />
    </Environment>
  );
}

export default function GLBPhone({ angle, screens, screenIndex, className }: GLBPhoneProps) {
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
        <Model angle={angle} screens={screens} screenIndex={screenIndex} />
        <ContactShadows position={[0, -TARGET_HEIGHT / 2 - 1.2, 0]} opacity={0.38} scale={18} blur={2.6} far={6} resolution={512} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(PHONE_MODEL_URL);
