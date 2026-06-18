export const editorLines = [
  "import { createRoot } from 'react-dom/client';",
  "import { App } from './App';",
  "",
  "type WorkspaceSession = {",
  "  repo: string;",
  "  branch: string;",
  "  status: 'ready' | 'building' | 'idle';",
  "};",
  "",
  "const session: WorkspaceSession = {",
  "  repo: 'selected-repository',",
  "  branch: 'main',",
  "  status: 'ready',",
  "};",
  "",
  "createRoot(document.getElementById('root')!).render(",
  "  <App workspace={session} />",
  ");",
];

export const chatMessages = [
  {
    body: "I opened the selected repo workspace. Ask me to inspect files, explain code, or plan the next change.",
    role: "assistant",
  },
  {
    body: "Build the authentication flow and point out the files I should edit first.",
    role: "user",
  },
];
