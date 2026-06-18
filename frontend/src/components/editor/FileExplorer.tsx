import type { repoDetailedTypes } from "../../../contexts/repoContext";
import { Icon } from "../Icon";
import Fileicon from "./icons/Fileicon";
import FolderIcon from "./icons/FolderIcon";

type FileExplorerProps = {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  width: number;
  selectedRepo: repoDetailedTypes[];
};

export function FileExplorer({
  isCollapsed,
  onToggleCollapsed,
  width,
  selectedRepo,
}: FileExplorerProps) {
  return (
    <aside
      className="hidden shrink-0 border-r border-[#d5cbbc] bg-[#f5efe3] text-[#151515] lg:block"
      style={{ width: isCollapsed ? 48 : width }}
    >
      <div className="flex h-11 items-center justify-between border-b border-[#d5cbbc] px-4">
        <span
          className={`text-[11px] font-black uppercase tracking-[0.18em] text-[#6d6255] ${
            isCollapsed ? "sr-only" : ""
          }`}
        >
          Explorer
        </span>
        <button
          aria-label={
            isCollapsed ? "Expand file explorer" : "Collapse file explorer"
          }
          className="grid h-7 w-7 place-items-center rounded-md text-[#8c35f8] transition hover:bg-[#e6dcca]"
          onClick={onToggleCollapsed}
          type="button"
        >
          <Icon
            name="chevron"
            className={`h-4 w-4 transition ${
              isCollapsed ? "-rotate-90" : "rotate-90"
            }`}
          />
        </button>
      </div>
      <div
        className={`h-[calc(100%-44px)] items-baseline bg-red-500 justify-center px-8 text-center border-2 ${
          isCollapsed ? "hidden" : "flex flex-col"
        }`}
      >
        {selectedRepo.map((item, idx) => {
          if (item.type == "file") {
            return <Fileicon name={item.name} path={item.path} />;
          } else if (item.type == "dir") {
            return (
              <FolderIcon
                name={item.name}
                path={item.path}
                onpress={item.url}
              />
            );
          }
        })}
      </div>
    </aside>
  );
}
