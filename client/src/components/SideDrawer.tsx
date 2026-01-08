// client/src/components/SideDrawer.tsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function SideDrawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    function onDown(e: PointerEvent) {
      const el = drawerRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) onClose();
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown, { capture: true });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown, { capture: true } as any);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="pDrawerBackdrop" role="presentation">
      <div className="pDrawer" role="dialog" aria-modal="true" aria-label={title} ref={drawerRef}>
        <div className="pDrawerHeader">
          <button className="pDrawerX" type="button" onClick={onClose} aria-label="close">
            ×
          </button>
          <div className="pDrawerTitle">{title}</div>
        </div>
        <div className="pDrawerBody">{children}</div>
      </div>
    </div>,
    document.body
  );
}
