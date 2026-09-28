import React, { Suspense, lazy, useEffect, useState } from "react";
import { useInViewCanvas } from "@/lib/useInViewCanvas";

const ParticleField = lazy(() => import("./ParticleField"));

// Lazily loads the three.js hero scene so the bundle only pays for it here,
// skips it entirely on small/low-power screens, and pauses its render loop
// whenever it's scrolled out of view (it otherwise renders forever).
const HeroCanvas = () => {
  const [enabled, setEnabled] = useState(true);
  const { ref, isInView, hasBeenVisible } = useInViewCanvas("100px");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setEnabled(!mq.matches);
    const handler = (e) => setEnabled(!e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {enabled && hasBeenVisible && (
        <Suspense fallback={null}>
          <ParticleField density="high" frameloop={isInView ? "always" : "never"} />
        </Suspense>
      )}
    </div>
  );
};

export default HeroCanvas;
