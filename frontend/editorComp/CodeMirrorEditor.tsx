// CodeMirrorEditor.tsx
import { useEffect, useRef } from "react";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import {
  bracketMatching,
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";

interface Props {
  content: string | null;
  filePath: string;
  onChange?: (value: string) => void;
}

function getLangFromPath(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  switch (ext) {
    case "ts":
      return javascript({ typescript: true });
    case "tsx":
      return javascript({ typescript: true, jsx: true });
    case "js":
      return javascript();
    case "jsx":
      return javascript({ jsx: true });
    case "py":
      return python();
    case "css":
      return css();
    case "html":
      return html();
    case "json":
      return json();
    case "md":
      return markdown();
    default:
      return javascript();
  }
}

export default function CodeMirrorEditor({
  content,
  filePath,
  onChange,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: content || "// No content",
      extensions: [
        // Theme
        oneDark,

        // Language support
        getLangFromPath(filePath),

        // Line numbers
        lineNumbers(),
        highlightActiveLineGutter(),

        // Bracket matching
        bracketMatching(),
        closeBrackets(),

        // Syntax highlighting
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),

        // Autocomplete / IntelliSense
        autocompletion(),

        // History (undo/redo)
        history(),

        // Keymaps
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...completionKeymap,
          ...closeBracketsKeymap,
        ]),

        // Update listener
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),

        // Custom styling
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px",
            fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
          },
          ".cm-scroller": { overflow: "auto" },
          ".cm-content": { padding: "12px 0" },
          ".cm-gutters": {
            background: "#1e1e1e",
            borderRight: "1px solid #333",
            color: "#858585",
          },
          ".cm-activeLineGutter": {
            background: "#2a2d2e",
            color: "#c6c6c6",
          },
          ".cm-lineNumbers": {
            minWidth: "40px",
            paddingRight: "8px",
          },
          ".cm-activeLine": {
            background: "#2a2d2e",
          },
          ".cm-tooltip": {
            background: "#252526",
            border: "1px solid #454545",
            color: "#cccccc",
          },
          ".cm-tooltip-autocomplete": {
            background: "#252526",
            border: "1px solid #454545",
          },
          ".cm-completionLabel": {
            color: "#cccccc",
          },
          ".cm-completionMatchedText": {
            color: "#4ec9b0",
            fontWeight: "bold",
          },
        }),
      ],
    });

    viewRef.current = new EditorView({ state, parent: editorRef.current });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  // Update content when file changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const current = view.state.doc.toString();
    if (current !== content) {
      isUpdatingRef.current = true; // flag: we're setting from props, don't fire onChange
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: content || "" },
      });
      isUpdatingRef.current = false;
    }
  }, [content]);
  return (
    <div
      ref={editorRef}
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    />
  );
}
