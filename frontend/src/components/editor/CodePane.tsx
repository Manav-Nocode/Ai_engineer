import { useState } from "react";
import type { datatype } from "../../../pages/CodeEditor";
import { editorLines } from "./editorData";

interface Props {
  fileText: string;
}

export function CodePane() {
  const [filewrite, setfilewrite] = useState("");
  // async function bring() {

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-[#171817] font-mono text-sm text-[#f3eadc]">
      <div className="min-w-[760px] px-0 py-5">
        {editorLines.map((line, index) => (
          <div
            className="grid grid-cols-[64px_1fr] border-l-2 border-transparent leading-7 hover:border-[#8c35f8] hover:bg-white/[0.04]"
            key={`${line}-${index}`}
          >
            <span className="select-none pr-4 text-right text-[#7d776e]">
              {index + 1}
            </span>
            <code className="whitespace-pre text-[#f4eee2]">
              {line.replace("selected-repository", "hi") || " "}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
