import type { PointerEvent } from "react";

type TerminalPanelProps = {
  height: number;
  onResizeStart: (event: PointerEvent<HTMLDivElement>) => void;
};

export function TerminalPanel({ height, onResizeStart }: TerminalPanelProps) {
  return (
    <div
      className="relative shrink-0 border-t border-[#2d2922] bg-[#101110] text-[#f4eee2]"
      style={{ height }}
    >
      <div
        aria-label="Resize terminal"
        className="absolute -top-1 left-0 h-2 w-full cursor-row-resize bg-transparent transition hover:bg-[#8c35f8]/70"
        onPointerDown={onResizeStart}
        role="separator"
      />
      <div className="flex h-10 items-center justify-between border-b border-white/10 px-4 text-xs">
        <div className="flex items-center gap-4 font-bold">
          <button className="text-[#8c35f8]" type="button">
            Terminal
          </button>
          <button className="text-[#a9a399]" type="button">
            Problems
          </button>
          <button className="text-[#a9a399]" type="button">
            Output
          </button>
        </div>
        <span className="rounded bg-[#8c35f8] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
          ready
        </span>
      </div>
      <div className="space-y-2 p-4 font-mono text-xs leading-6 text-[#cfc7bb]">
        <p>
          <span className="text-[#8c35f8]">$</span> npm run dev
        </p>
        <p className="text-[#8ddf8a]">Local: http://localhost:5173/</p>
        <p className="text-[#a9a399]">
          waiting for your repo tools and editor actions...
        </p>
      </div>
    </div>
  );
}
