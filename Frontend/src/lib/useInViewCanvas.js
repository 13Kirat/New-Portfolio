import { useEffect, useRef, useState } from "react";

// Three.js scenes render a fresh frame forever by default, even when
// scrolled far out of view — with multiple scenes on one page (hero
// starfield, skills sphere, apps constellation) that adds up to real jank.
// This hook mounts a scene once it first enters the viewport (so off-screen
// sections don't pay the texture-load/parse cost up front), and reports
// live visibility so the caller can pass frameloop="always"/"never" to
// <Canvas> to pause rendering entirely while scrolled away.
export function useInViewCanvas(margin = "200px") {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      setHasBeenVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenVisible(true);
      },
      { rootMargin: margin, threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, isInView, hasBeenVisible };
}
