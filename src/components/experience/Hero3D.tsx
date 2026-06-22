import { Suspense, Component, useState, useEffect, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Float,
  ContactShadows,
  useGLTF,
} from '@react-three/drei';
import { prefersReducedMotion } from '@/lib/utils';

const GOLD = '#d2ab5b';
const NAVY = '#34467e';
const DEEP = '#1d2950';
const GLB_URL = '/experience-object.glb';

/* ─── Error boundary: try real GLB, fall back to procedural ──────────── */
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

/* ─── Real GLB attempt (throws on 404, caught by boundary) ───────────── */
function GLBModel() {
  const { scene } = useGLTF(GLB_URL);
  return <primitive object={scene} scale={1.4} />;
}

/* ─── Procedural luxury sculpture: polished gold torus-knot ──────────── */
function ProceduralSculpture() {
  return (
    <group>
      {/* Hero: polished gold torus knot */}
      <mesh castShadow receiveShadow rotation={[0.4, 0, 0.2]}>
        <torusKnotGeometry args={[1, 0.34, 220, 36, 2, 3]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={1}
          roughness={0.15}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Faceted navy gem orbiting inside for contrast */}
      <mesh castShadow position={[0, 0, 0]} scale={0.55}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={DEEP}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.2}
          flatShading
        />
      </mesh>
    </group>
  );
}

function ModelOrFallback() {
  return (
    <ModelErrorBoundary fallback={<ProceduralSculpture />}>
      <Suspense fallback={<ProceduralSculpture />}>
        <GLBModel />
      </Suspense>
    </ModelErrorBoundary>
  );
}

/* ─── Scene contents ─────────────────────────────────────────────────── */
function Scene({ reduced }: { reduced: boolean }) {
  const inner = <ModelOrFallback />;

  return (
    <>
      {/* Soft ambient base */}
      <ambientLight intensity={0.35} color={NAVY} />

      {/* Warm gold key light */}
      <directionalLight
        position={[5, 6, 4]}
        intensity={2.4}
        color={GOLD}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Cool navy rim light from behind */}
      <directionalLight position={[-5, 3, -4]} intensity={1.8} color={NAVY} />
      <pointLight position={[0, -3, 3]} intensity={1.2} color={GOLD} />

      <Environment preset="city" />

      {reduced ? (
        inner
      ) : (
        <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.9}>
          {inner}
        </Float>
      )}

      {/* Subtle reflective navy floor shadow */}
      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.55}
        scale={10}
        blur={2.6}
        far={4}
        color={DEEP}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!reduced}
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
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

  const hint =
    lang === 'es' ? 'Arrastra para girar' : 'Drag to rotate';

  return (
    <div
      className="relative h-[60vh] w-full lg:h-[80vh]"
      onPointerDown={() => setInteracted(true)}
    >
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [0, 0.5, 6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <Scene reduced={reduced} />
        </Suspense>
      </Canvas>

      {/* Drag hint — fades after first interaction */}
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

// Preload attempt is intentionally omitted — useGLTF would throw on 404.
