// client/src/components/FloatingPanel.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function FloatingPanel({
  open,
  anchorRef,
  onClose,
  width = 360,
  children,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  const anchor = anchorRef.current;

  const computePos = useMemo(() => {
    return () => {
      const a = anchorRef.current;
      if (!a) return;

      const r = a.getBoundingClientRect();
      const pad = 12;
      const top = r.bottom + 10;

      const maxLeft = window.innerWidth - width - pad;
      const left = clamp(r.left, pad, Math.max(pad, maxLeft));

      setPos({ left, top });
    };
  }, [anchorRef, width]);

  useEffect(() => {
    if (!open) return;

    computePos();

    function onResize() {
      computePos();
    }

    function onScroll() {
      computePos();
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    function onDown(e: PointerEvent) {
      const el = panelRef.current;
      const a = anchorRef.current;
      if (!el || !a) return;

      if (!(e.target instanceof Node)) return;

      const clickedInsidePanel = el.contains(e.target);
      const clickedAnchor = a.contains(e.target);

      if (!clickedInsidePanel && !clickedAnchor) onClose();
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown, { capture: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown, { capture: true } as any);
    };
  }, [open, onClose, computePos, anchor]);

  if (!open) return null;

  return createPortal(
    <div
      className="pFloat"
      style={{
        width,
        left: pos.left,
        top: pos.top,
      }}
      ref={panelRef}
      role="dialog"
      aria-modal="false"
    >
      {children}
    </div>,
    document.body
  );
}
