import React, { Suspense, lazy, useEffect, useState } from "react";

const ParticleField = lazy(() => import("./ParticleField"));

// Lazily loads the three.js hero scene so the bundle only pays for it here,
// and skips it entirely on small/low-power screens.
const HeroCanvas = () => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setEnabled(!mq.matches);
    const handler = (e) => setEnabled(!e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <ParticleField density="high" />
    </Suspense>
  );
};

export default HeroCanvas;
