import type { datatype } from "../../../pages/CodeEditor";
import { Icon } from "../Icon";
interface Props {
  tabs: datatype[];
}
export function EditorTabs() {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#d5cbbc] bg-[#e8dfcf] text-[#151515]">
      <div className="flex min-w-0 items-center">
        <button
          className="flex h-11 items-center gap-2 border-r border-[#d5cbbc] bg-[#f6efe3] px-4 text-sm font-bold"
          type="button"
        >
          <Icon name="code" className="h-4 w-4 text-[#8c35f8]" />
          <span className="truncate">man.tsx</span>
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 text-[#6d6255] border-2">
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
