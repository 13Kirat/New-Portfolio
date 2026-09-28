import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

function randomInSphere(count, radius) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function Starfield({ count }) {
  const pointsRef = useRef(null);
  const positions = useMemo(() => randomInSphere(count, 2.4), [count]);
  const { viewport } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    // gentle mouse-driven parallax
    target.current.x = (state.pointer.x * viewport.width) / 80;
    target.current.y = (state.pointer.y * viewport.height) / 80;

    pointsRef.current.rotation.y += delta * 0.045;
    pointsRef.current.rotation.x +=
      (target.current.y - pointsRef.current.rotation.x) * 0.02;
    pointsRef.current.rotation.y +=
      (target.current.x - pointsRef.current.rotation.y) * 0.0005;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#39ff88"
        size={0.014}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

const ParticleField = ({ density = "high", frameloop = "always" }) => {
  const count = density === "low" ? 700 : 2200;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1.6], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
      frameloop={frameloop}
    >
      <Starfield count={count} />
    </Canvas>
  );
};

export default ParticleField;
