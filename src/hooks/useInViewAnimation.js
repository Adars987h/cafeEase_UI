import { useEffect, useRef } from "react";
import useReducedMotion from "./useReducedMotion";

// Scroll-reveal, additive by design: content carries `.js-rv` which is
// invisible-by-CSS only once this hook is mounted and running. If JS fails
// or the observer never fires, a periodic re-check (not just the observer)
// guarantees the class still lands -- see tokens.css .js-rv for the
// underlying "visible unless proven hidden" rule this depends on.
export default function useInViewAnimation({ threshold = 0.2, rootMargin = "0px 0px -10% 0px" } = {}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.classList.add("js-rv--in");
      return;
    }

    el.classList.add("js-rv");

    const reveal = () => el.classList.add("js-rv--in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(el);

    // Failure rule: if the element is already on-screen (or the observer
    // misfires) it must not stay hidden. One-shot safety net, not a poll.
    const sweep = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) reveal();
    }, 400);

    return () => {
      observer.disconnect();
      clearTimeout(sweep);
    };
  }, [reducedMotion, threshold, rootMargin]);

  return ref;
}
