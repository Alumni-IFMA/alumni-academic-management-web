import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NetworkUser } from "../../../services/userService";
import type { ConnectStatus } from "../../../hooks/useConnection";
import { HighlightCard } from "./HighlightCard";
import { Typography } from "../../../components/Typography/Typography";

const SCROLL_AMOUNT = 264; // largura do card (240px) + gap (24px)

export function HighlightsCarousel({
  users,
  loading,
  error,
  statusFor,
  onConnect,
}: {
  users: NetworkUser[];
  loading: boolean;
  error: string | null;
  statusFor: (userId: number) => ConnectStatus;
  onConnect: (userId: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startScrollLeft: number; dragging: boolean }>({
    startX: 0,
    startScrollLeft: 0,
    dragging: false,
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    updateScrollState();
  }, [users]);

  function scrollBy(direction: -1 | 1) {
    scrollRef.current?.scrollBy({ left: direction * SCROLL_AMOUNT, behavior: "smooth" });
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { startX: e.clientX, startScrollLeft: el.scrollLeft, dragging: true };
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el || !dragState.current.dragging) return;
    el.scrollLeft = dragState.current.startScrollLeft - (e.clientX - dragState.current.startX);
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    dragState.current.dragging = false;
    if (el) el.style.scrollSnapType = "";
    el?.releasePointerCapture(e.pointerId);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function handleWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el!.scrollLeft += e.deltaY;
    }

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section>
      <Typography variant="h2" className="text-center mb-5">
        Destaques
      </Typography>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-72 w-48 shrink-0 rounded-2xl bg-gray-200 animate-pulse ${i % 2 === 1 ? "mt-6" : ""}`}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="relative">
            <div
              ref={scrollRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onScroll={updateScrollState}
              className="flex gap-4 overflow-x-auto snap-x scrollbar-hide pb-2 cursor-grab select-none touch-pan-y active:cursor-grabbing"
            >
              {users.map((user, index) => (
                <div key={user.id} className={index % 2 === 1 ? "mt-6" : ""}>
                  <HighlightCard user={user} status={statusFor(user.id)} onConnect={onConnect} />
                </div>
              ))}
            </div>

            {canScrollRight && (
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-page-bg/80 to-transparent" />
            )}
            {canScrollLeft && (
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-page-bg/80 to-transparent" />
            )}
          </div>

          <div className="mt-3 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Ver destaques anteriores"
              className="rounded-full border border-gray-200 p-1.5 text-dark-green hover:bg-gray-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Ver próximos destaques"
              className="rounded-full border border-gray-200 p-1.5 text-dark-green hover:bg-gray-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
