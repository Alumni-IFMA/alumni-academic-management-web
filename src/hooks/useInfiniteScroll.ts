import { useEffect, useRef, type RefObject } from "react";

export function useInfiniteScroll({
  onIntersect,
  enabled = true,
}: {
  onIntersect: () => void;
  enabled?: boolean;
}): RefObject<HTMLDivElement | null> {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return sentinelRef;
}
