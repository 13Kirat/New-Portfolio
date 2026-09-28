import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Line, OrbitControls, Text, useTexture } from "@react-three/drei";
import { useInViewCanvas } from "@/lib/useInViewCanvas";

// Spreads points across a flattened ellipsoid (a "disk cloud") using a golden-
// angle spiral, so icons read as an orbiting cluster rather than a rigid ring
// or a perfect sphere.
function ellipsoidCloud(count, rx, ry, rz) {
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = count <= 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push([Math.cos(theta) * radiusAtY * rx, y * ry, Math.sin(theta) * radiusAtY * rz]);
  }
  return points;
}

const CoreHub = () => {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 1.4) * 0.08;
    ref.current.scale.setScalar(s);
    ref.current.rotation.y = t * 0.3;
    ref.current.rotation.x = t * 0.2;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.32, 0]} />
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.8} toneMapped={false} />
    </mesh>
  );
};

const SatelliteIcon = ({ position, url, name, phase, hoveredName, setHoveredName }) => {
  const texture = useTexture(url);
  const groupRef = useRef(null);
  const isHovered = hoveredName === name;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.7 + phase) * 0.15;
    groupRef.current.position.x = position[0] + Math.cos(t * 0.5 + phase) * 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      <Billboard>
        <mesh
          renderOrder={1}
          scale={isHovered ? 1.35 : 1}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredName(name);
          }}
          onPointerOut={() => setHoveredName(null)}
        >
          <planeGeometry args={[0.42, 0.42]} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthWrite={false}
            alphaTest={0.1}
            toneMapped={false}
          />
        </mesh>
        {isHovered && (
          <Text position={[0, -0.34, 0]} fontSize={0.13} color="#22d3ee" anchorX="center" anchorY="middle">
            {name}
          </Text>
        )}
      </Billboard>
    </group>
  );
};

const ConstellationGroup = ({ apps, positions }) => {
  const groupRef = useRef(null);
  const [hoveredName, setHoveredName] = React.useState(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.09;
  });

  return (
    <group ref={groupRef}>
      <CoreHub />
      {positions.map((pos, i) => (
        <Line
          key={`line-${i}`}
          points={[[0, 0, 0], pos]}
          color="#22d3ee"
          transparent
          opacity={0.18}
          lineWidth={1}
        />
      ))}
      {apps.map((app, i) => (
        <SatelliteIcon
          key={app._id || i}
          position={positions[i]}
          url={app.svg?.url}
          name={app.name}
          phase={i * 0.7}
          hoveredName={hoveredName}
          setHoveredName={setHoveredName}
        />
      ))}
    </group>
  );
};

const AppsConstellationScene = ({ apps, frameloop }) => {
  const spread = Math.max(2.4, Math.sqrt(apps.length) * 0.6);
  const positions = useMemo(
    () => ellipsoidCloud(apps.length, spread, spread * 0.55, spread),
    [apps.length, spread]
  );

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, spread * 0.6, spread + 3], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={frameloop}
    >
      <Suspense fallback={null}>
        <ConstellationGroup apps={apps} positions={positions} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.6}
      />
    </Canvas>
  );
};

// A glowing core hub with your tools orbiting it as bobbing satellites,
// connected by faint constellation lines — a deliberately different feel
// from Skills' rigid sphere: looser, alive, and more "network" than "globe".
const AppsConstellation = ({ apps }) => {
  const { ref, isInView, hasBeenVisible } = useInViewCanvas("50px");
  if (!apps || apps.length === 0) return null;
  return (
    <div
      ref={ref}
      className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] rounded-2xl border border-border bg-card/30 overflow-hidden"
    >
      {hasBeenVisible && (
        <AppsConstellationScene apps={apps} frameloop={isInView ? "always" : "never"} />
      )}
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[11px] text-muted-foreground/70 pointer-events-none">
        drag to explore
      </p>
    </div>
  );
};

export default AppsConstellation;
