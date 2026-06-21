import { HomeScreen } from "../pages/HomeScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "../contexts/repoContext";
import { FileProvider } from "../contexts/workingFIles";
import CodeEditor from "../pages/CodeEditor";
import QueryProvider from "../Providers/FileQueryProvider";
export default function App() {
  return (
    <>
      <BrowserRouter>
        <AppProvider>
          <QueryProvider>
            <FileProvider>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/editor" element={<CodeEditor />} />
              </Routes>
            </FileProvider>
          </QueryProvider>
        </AppProvider>
      </BrowserRouter>
    </>
  );
}
