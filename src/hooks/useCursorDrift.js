import { useEffect, useRef } from "react";
import useReducedMotion from "./useReducedMotion";

// Floating cards only, per the 2.0 motion table: the element drifts a few
// pixels toward the pointer's offset from viewport centre. Signals
// liveness, not depth (that's useParallax) -- kept small and separate
// rather than folded into the parallax transform.
export default function useCursorDrift(amplitude = 20) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    let ticking = false;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetX = nx * amplitude;
      targetY = ny * amplitude;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          el.style.transform = `translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [amplitude, reducedMotion]);

  return ref;
}
