// EditorPanel.tsx
import { useState } from "react";
import CodeMirrorEditor from "./../../../editorComp/CodeMirrorEditor";
import { useFileContext } from "../../../contexts/workingFIles";

interface Props {
  content: string;
}
export function CodePane({ content }: Props) {
  const { displayText, filename } = useFileContext();
  if (displayText === null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: "#1e1e1e",
          color: "#6d6255",
        }}
      >
        <p>Select a file from the sidebar to start editing</p>
      </div>
    );
  }

  console.log(displayText);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#1e1e1e",
        overflow: "scroll",
      }}
    >
      <div style={{ flex: 1, minHeight: 0 }}>
        <CodeMirrorEditor content={displayText} filePath={filename || "src"} />
      </div>
    </div>
  );
}
