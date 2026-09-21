import { useEffect, useRef } from "react";
import useReducedMotion from "./useReducedMotion";

// Applies translate3d(0, scrollY * coefficient, 0) to the element, batched
// into a single rAF-guarded scroll listener so multiple layers on one page
// share the same tick instead of each registering their own listener.
// Negative coefficients drift up (background layers), positive drift down.
export default function useParallax(coefficient = 0.2) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    let ticking = false;
    const apply = () => {
      const rect = el.getBoundingClientRect();
      const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(distanceFromCenter * coefficient).toFixed(2)}px, 0)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [coefficient, reducedMotion]);

  return ref;
}
