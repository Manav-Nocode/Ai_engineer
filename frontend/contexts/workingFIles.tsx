import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { Buffer } from "buffer";

export interface WorkingFile {
  name: string;
  content: string;
  encoding: string;
}

interface FileContextType {
  currentlyWorkingFiles: WorkingFile[];
  setCurrentlyWorkingFiles: React.Dispatch<React.SetStateAction<WorkingFile[]>>;
  filename: string | null;
  displayText: string | null;
  closeFile: (name: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [currentlyWorkingFiles, setCurrentlyWorkingFiles] = useState<
    WorkingFile[]
  >([]);
  const [filename, setFilename] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string | null>(null);

  const closeFile = (nameToRemove: string) => {
    setCurrentlyWorkingFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== nameToRemove),
    );
  };

  useEffect(() => {
    if (currentlyWorkingFiles.length > 0) {
      const activeFile = currentlyWorkingFiles[0];

      setFilename(activeFile.name);

      try {
        const cleanString = activeFile.content.replace(/\s/g, "");
        const decodedText = Buffer.from(cleanString, "base64").toString(
          "utf-8",
        );
        setDisplayText(decodedText);
      } catch (err) {
        console.error("Error decoding base64 file content:", err);
        setDisplayText(null);
      }
    } else {
      setFilename(null);
      setDisplayText(null);
    }
  }, [currentlyWorkingFiles]);

  return (
    <FileContext.Provider
      value={{
        currentlyWorkingFiles,
        setCurrentlyWorkingFiles,
        filename,
        displayText,
        closeFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};
