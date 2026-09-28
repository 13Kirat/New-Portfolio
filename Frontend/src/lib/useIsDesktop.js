import { useEffect, useState } from "react";

// Drag-to-rotate 3D scenes need real screen space and precise pointer control,
// so they're only worth showing at tablet width and up; phones get a flat grid.
export function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [breakpoint]);

  return isDesktop;
}
