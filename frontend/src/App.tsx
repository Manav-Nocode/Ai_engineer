import { HomeScreen } from "../pages/HomeScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "../contexts/repoContext";
import CodeEditor from "../pages/CodeEditor";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route path="/d" element={<HomeScreen />} />
            <Route path="/editor" element={<CodeEditor />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </>
  );
}
