import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Billboard, OrbitControls, Text, useTexture } from "@react-three/drei";

// Evenly distributes `count` points across a sphere surface (Fibonacci sphere).
function sphereLayout(count, radius) {
  const points = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * increment;
    points.push([Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius]);
  }
  return points;
}

const IconNode = ({ position, url, title }) => {
  const texture = useTexture(url);
  const [hovered, setHovered] = React.useState(false);
  return (
    <Billboard position={position}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1}
        renderOrder={1}
      >
        <planeGeometry args={[0.36, 0.36]} />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
          depthWrite={false}
          alphaTest={0.1}
        />
      </mesh>
      {hovered && (
        <Text
          position={[0, -0.42, 0]}
          fontSize={0.16}
          color="#39ff88"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
      )}
    </Billboard>
  );
};

const RotatingGroup = ({ items, positions }) => {
  return (
    <group>
      {items.map((item, i) => (
        <IconNode key={item._id || i} position={positions[i]} url={item.svg?.url} title={item.title} />
      ))}
    </group>
  );
};

const SkillsOrbitScene = ({ items }) => {
  const radius = Math.max(2.6, Math.sqrt(items.length) * 0.62);
  const positions = useMemo(() => sphereLayout(items.length, radius), [items.length, radius]);
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, radius + 3.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <RotatingGroup items={items} positions={positions} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.8}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
};

// Wraps the sphere scene with a stable sizing container; the parent decides
// whether to render this at all (desktop) vs. falling back to a flat grid.
const SkillsOrbit = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[560px] rounded-2xl border border-border bg-card/30 overflow-hidden">
      <SkillsOrbitScene items={items} />
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[11px] text-muted-foreground/70 pointer-events-none">
        drag to rotate
      </p>
    </div>
  );
};

export default SkillsOrbit;
