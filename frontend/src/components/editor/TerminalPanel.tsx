import { useEffect, useRef, type PointerEvent } from "react";
import { Terminal as Xterm } from "@xterm/xterm";
import socket from "../../../socket/socket";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
type TerminalPanelProps = {
  height: number;
  onResizeStart: (event: PointerEvent<HTMLDivElement>) => void;
};

export function TerminalPanel({ height, onResizeStart }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const fitAddon = new FitAddon();

  const isRendered = useRef(false);
  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;
    const term = new Xterm({
      cursorBlink: true,
      rows: 20,
      theme: {
        background: "#1e1e1e",
      },
    });
    term.loadAddon(fitAddon);
    fitAddon.fit();

    if (!terminalRef.current) return;

    term.open(terminalRef.current);
    term.focus();
    term.onData((data) => {
      console.log(data);
      socket.emit("terminal_input", data);
    });

    socket.on("terminal_output", (data) => {
      console.log(data);
      term.write(data.output);
    });

    return () => {
      socket.off("terminal_output");
      term.dispose();
    };
  }, []);

  return (
    <div
      className="relative shrink-0 bg-[#ffffff] text-[#f4eee2]"
      style={{ height }}
    >
      <div
        aria-label="Resize terminal"
        className="absolute -top-1 left-0 h-2 w-full cursor-row-resize bg-transparent transition hover:bg-[#8c35f8]/70"
        onPointerDown={onResizeStart}
        role="separator"
      />
      {/* <div className="flex h-10 items-center justify-between border-b border-white/10 px-4 text-xs">
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
      </div> */}
      <div className="flex-1 overflow-scroll space-y-2 p-4 font-mono text-xs leading-6 text-[#cfc7bb] h-full w-full">
        <div ref={terminalRef} className="text-[#a9a399] h-full w-full"></div>
      </div>
    </div>
  );
}
