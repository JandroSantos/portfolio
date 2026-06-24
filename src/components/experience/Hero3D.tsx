import { Suspense, Component, useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/utils';

const GOLD = '#d2ab5b';
const NAVY = '#34467e';
const DEEP = '#1d2950';

/* ─── Error boundary ─────────────────────────────────────────────────── */
class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/* ─── Neural Network sphere ──────────────────────────────────────────── */
function NeuralNet({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  const { nodePositions, edgeGeometry } = useMemo(() => {
    // Seeded pseudo-RNG for stable layout
    let seed = 0xdeadbeef;
    const rng = () => {
      seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;
      return (seed >>> 0) / 0xffffffff;
    };

    const nodePositions: THREE.Vector3[] = [];
    for (let i = 0; i < 68; i++) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const r = 1.05 + rng() * 0.38;
      nodePositions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ),
      );
    }

    const edgePts: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 0.82) {
          edgePts.push(...nodePositions[i].toArray(), ...nodePositions[j].toArray());
        }
      }
    }

    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgePts, 3));

    return { nodePositions, edgeGeometry };
  }, []);

  useFrame((_, delta) => {
    if (reduced) return;
    clock.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
      groupRef.current.rotation.x = Math.sin(clock.current * 0.22) * 0.12;
    }
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.55 + Math.sin(clock.current * 1.8) * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color={NAVY} transparent opacity={0.45} />
      </lineSegments>

      {/* Nodes */}
      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.026, 7, 7]} />
          <meshStandardMaterial
            color={GOLD}
            metalness={1}
            roughness={0.18}
            emissive={GOLD}
            emissiveIntensity={0.45}
          />
        </mesh>
      ))}

      {/* Pulsing core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.85}
          roughness={0.08}
          emissive={GOLD}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Inner wireframe sphere */}
      <mesh>
        <sphereGeometry args={[1.0, 18, 18]} />
        <meshBasicMaterial color={NAVY} wireframe transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

/* ─── Scene ──────────────────────────────────────────────────────────── */
function Scene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={0.25} color={NAVY} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} color={GOLD} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 3, -4]} intensity={1.6} color={NAVY} />
      <pointLight position={[0, 0, 0]} intensity={1.8} color={GOLD} distance={3} />

      <ModelErrorBoundary fallback={<NeuralNet reduced={reduced} />}>
        <Suspense fallback={<NeuralNet reduced={reduced} />}>
          <NeuralNet reduced={reduced} />
          <Environment preset="city" />
        </Suspense>
      </ModelErrorBoundary>

      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.4}
        scale={8}
        blur={3}
        far={4}
        color={DEEP}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.6}
      />
    </>
  );
}

/* ─── Public component ───────────────────────────────────────────────── */
export default function Hero3D({ lang }: { lang: string }) {
  const [reduced, setReduced] = useState(false);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  const hint = lang === 'es' ? 'Arrastra para girar' : 'Drag to rotate';

  return (
    <div
      className="relative h-[60vh] w-full lg:h-[80vh]"
      onPointerDown={() => setInteracted(true)}
    >
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [0, 0.4, 5.5], fov: 44 }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <Scene reduced={reduced} />
        </Suspense>
      </Canvas>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-700"
        style={{ opacity: interacted ? 0 : 1 }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.4em]"
          style={{ color: `${GOLD}aa` }}
        >
          ✦ {hint} ✦
        </span>
      </div>
    </div>
  );
}
