import type { PointerEvent } from "react";
import { useState } from "react";
import { useApp } from "../contexts/repoContext";
import { AiChatPanel } from "../src/components/editor/AiChatPanel";
import { CodePane } from "../src/components/editor/CodePane";
import { EditorHeader } from "../src/components/editor/EditorHeader";
import { EditorTabs } from "../src/components/editor/EditorTabs";
import { FileExplorer } from "../src/components/editor/FileExplorer";
import { ResizeHandle } from "../src/components/editor/ResizeHandle";
import { TerminalPanel } from "../src/components/editor/TerminalPanel";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function CodeEditor() {
  const { selectedRepo } = useApp();
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(360);
  const [terminalHeight, setTerminalHeight] = useState(210);
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(false);

  const selectedRepoName = selectedRepo[0]?.path || "selected-repository";

  function startHorizontalResize(
    event: PointerEvent<HTMLDivElement>,
    side: "left" | "right",
  ) {
    event.preventDefault();
    const startX = event.clientX;
    const startingWidth = side === "left" ? leftWidth : rightWidth;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    function handleMove(moveEvent: globalThis.PointerEvent) {
      const delta =
        side === "left"
          ? moveEvent.clientX - startX
          : startX - moveEvent.clientX;
      const nextWidth = clamp(startingWidth + delta, 220, 520);

      if (side === "left") {
        setLeftWidth(nextWidth);
      } else {
        setRightWidth(nextWidth);
      }
    }

    function stopResize() {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stopResize);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", stopResize);
  }

  function startTerminalResize(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const startY = event.clientY;
    const startingHeight = terminalHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    function handleMove(moveEvent: globalThis.PointerEvent) {
      const delta = startY - moveEvent.clientY;
      setTerminalHeight(clamp(startingHeight + delta, 120, 420));
    }

    function stopResize() {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stopResize);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", stopResize);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#151515] text-[#f4eee2]">
      <section className="flex h-screen min-h-[720px] flex-col border border-[#2f2c26] bg-[#f1eadc] shadow-2xl">
        <EditorHeader />

        <div className="flex min-h-0 flex-1">
          <FileExplorer
            isCollapsed={isExplorerCollapsed}
            onToggleCollapsed={() =>
              setIsExplorerCollapsed((current) => !current)
            }
            width={leftWidth}
            selectedRepo={selectedRepo}
          />

          <ResizeHandle
            ariaLabel="Resize file explorer"
            className="hidden w-1.5 shrink-0 cursor-col-resize bg-[#d5cbbc] transition hover:bg-[#8c35f8] lg:block"
            disabled={isExplorerCollapsed}
            onPointerDown={(event) => startHorizontalResize(event, "left")}
          />

          <section className="flex min-w-0 flex-1 flex-col bg-[#eee6d7]">
            <EditorTabs />
            <CodePane selectedRepoName={selectedRepoName} />
            <TerminalPanel
              height={terminalHeight}
              onResizeStart={startTerminalResize}
            />
          </section>

          <ResizeHandle
            ariaLabel="Resize AI chat"
            className="hidden w-1.5 shrink-0 cursor-col-resize bg-[#2d2922] transition hover:bg-[#8c35f8] xl:block"
            onPointerDown={(event) => startHorizontalResize(event, "right")}
          />

          <AiChatPanel width={rightWidth} />
        </div>
      </section>
    </main>
  );
}
