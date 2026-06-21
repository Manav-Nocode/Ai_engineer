import { useFileContext } from "../../../contexts/workingFIles";
import CodeMirrorEditor from "../../../editorComp/CodeMirrorEditor";
import { Icon } from "../Icon";
interface Props {
  title: string;
}

export function EditorTabs() {
  const {
    currentlyWorkingFiles,
    filename,
    setCurrentlyWorkingFiles,
    closeFile,
  } = useFileContext();

  // If there are no open files, don't display the tab bar layout at all
  if (currentlyWorkingFiles.length === 0) {
    return (
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#d5cbbc] bg-[#e8dfcf] px-4 text-sm text-[#6d6255]">
        <span>No files open</span>
      </div>
    );
  }
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#d5cbbc] bg-[#e8dfcf] text-[#151515]">
      <div className="flex min-w-0 items-center overflow-x-auto">
        {currentlyWorkingFiles.map((file) => {
          const isActive = file.name === filename;

          return (
            <button
              key={file.name}
              onClick={() => {
                // Clicking a tab switches the active file by moving it to the front of the array
                setCurrentlyWorkingFiles((prev) => {
                  const target = prev.find((f) => f.name === file.name);
                  const filtered = prev.filter((f) => f.name !== file.name);
                  return target ? [target, ...filtered] : prev;
                });
              }}
              className={`flex h-11 items-center gap-2 border-r border-[#d5cbbc] px-4 text-sm transition-colors ${
                isActive
                  ? "bg-[#f6efe3] font-bold"
                  : "bg-[#e8dfcf] text-[#6d6255] hover:bg-[#dfd5c3]"
              }`}
              type="button"
            >
              <Icon name="code" className="h-4 w-4 text-[#8c35f8]" />
              <span className="truncate max-w-[120px]">{file.name}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation(); // Prevents switching to the tab right as you close it
                  closeFile(file.name);
                }}
                className="ml-1 rounded px-1 font-bold text-pink-800 hover:bg-gray-400/50 hover:text-black"
              >
                ×
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-3 text-[#6d6255]">
        <button
          aria-label="Run project"
          className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-[#d9cfbd] hover:text-[#8c35f8]"
          type="button"
        >
          <Icon name="arrow" className="h-4 w-4" />
        </button>
        <button
          aria-label="More editor actions"
          className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-[#d9cfbd] hover:text-[#8c35f8]"
          type="button"
        >
          <Icon name="more" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
