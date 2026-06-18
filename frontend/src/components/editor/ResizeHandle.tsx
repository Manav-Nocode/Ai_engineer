import type { PointerEvent } from "react";

type ResizeHandleProps = {
  ariaLabel: string;
  className: string;
  disabled?: boolean;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
};

export function ResizeHandle({
  ariaLabel,
  className,
  disabled = false,
  onPointerDown,
}: ResizeHandleProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={`${className} ${disabled ? "pointer-events-none opacity-50" : ""}`}
      onPointerDown={onPointerDown}
      role="separator"
    />
  );
}
