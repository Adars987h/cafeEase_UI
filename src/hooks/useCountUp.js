import { useEffect, useRef, useState } from "react";
import useReducedMotion from "./useReducedMotion";

// Animates from 0 to `value` once, when the element enters view. Never
// invents the number -- `value` must already be real; this only changes
// how it arrives on screen (cubic ease-out, ~1100ms, once per element).
export default function useCountUp(value, { duration = 1100 } = {}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const reducedMotion = useReducedMotion();
  const played = useRef(false);

  useEffect(() => {
    if (value == null || Number.isNaN(value)) return;
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (played.current) return;
      played.current = true;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        setDisplay(Math.round(value * ease(progress)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, reducedMotion]);

  return [ref, display];
}
