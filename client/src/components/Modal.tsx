// client/src/components/Modal.tsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function Modal({
  open,
  title,
  onClose,
  children,
  cardClassName,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  cardClassName?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    function onDown(e: PointerEvent) {
      const el = cardRef.current;
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
    <div className="pModalBackdrop" role="presentation">
      <div
        className={cardClassName ? `pModalCard ${cardClassName}` : "pModalCard"}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={cardRef}
      >
        <div className="pModalHeader">
          <button className="pModalX" type="button" onClick={onClose} aria-label="close">
            ×
          </button>
          <div className="pModalTitle">{title}</div>
          <div className="pModalHeaderRight" />
        </div>

        <div className="pModalBody">{children}</div>
      </div>
    </div>,
    document.body
  );
}
