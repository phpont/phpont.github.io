import { useEffect, useRef, useState } from 'react';

export function useRevealOnView<T extends HTMLElement>(
  options: { threshold?: number } = {}
) {
  const { threshold = 0.52 } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: [0, threshold] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
