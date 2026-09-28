import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text, useTexture } from "@react-three/drei";

const AppCard = ({ angle, radius, url, name }) => {
  const texture = useTexture(url);
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  // Face each card outward from the ring center so the rotation reads like a
  // physical carousel of picture frames, not a billboard that ignores it.
  const rotationY = angle;

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[0.9, 1.05, 0.06]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#101826" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 0.15, 0.1]} renderOrder={1}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
          depthTest={false}
          alphaTest={0.1}
        />
      </mesh>
      <Text
        position={[0, -0.38, 0.1]}
        fontSize={0.1}
        color="#9fb0c3"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8}
        textAlign="center"
        renderOrder={1}
        depthOffset={-1}
      >
        {name}
      </Text>
    </group>
  );
};

const RingGroup = ({ apps, radius }) => {
  const groupRef = useRef(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.15;
  });
  return (
    <group ref={groupRef}>
      {apps.map((app, i) => (
        <AppCard
          key={app._id || i}
          angle={(i / apps.length) * Math.PI * 2}
          radius={radius}
          url={app.svg?.url}
          name={app.name}
        />
      ))}
    </group>
  );
};

const AppsCarouselScene = ({ apps }) => {
  const radius = Math.max(2.6, apps.length * 0.36);
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1, radius + 3.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 3, 3]} intensity={40} />
      <Suspense fallback={null}>
        <RingGroup apps={apps} radius={radius} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 2.3}
      />
    </Canvas>
  );
};

// A horizontal, carousel-style 3D ring of card-like meshes — deliberately a
// different visual language from Skills' bare-icon sphere.
const AppsCarousel = ({ apps }) => {
  if (!apps || apps.length === 0) return null;
  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] rounded-2xl border border-border bg-card/30 overflow-hidden">
      <AppsCarouselScene apps={apps} />
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[11px] text-muted-foreground/70 pointer-events-none">
        drag to spin
      </p>
    </div>
  );
};

export default AppsCarousel;
