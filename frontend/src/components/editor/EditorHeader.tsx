import { Icon } from "../Icon";
import { WindowDots } from "./WindowDots";

const menuItems = ["File", "Edit", "Run", "Terminal"];

export function EditorHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#26221b] bg-[#0f1110] px-4 text-xs font-semibold text-[#f4eee2]">
      <div className="flex items-center gap-4">
        <WindowDots />
        <div className="hidden items-center gap-3 text-[#a9a399] sm:flex">
          {menuItems.map((item) => (
            <button
              className="transition hover:text-[#8c35f8]"
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-[#8c35f8]" />
        <span className="truncate text-sm">AI Engineer Workspace</span>
      </div>

      <div className="flex items-center gap-2 text-[#a9a399]">
        <button
          aria-label="Search workspace"
          className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-white/10 hover:text-[#f4eee2]"
          type="button"
        >
          <Icon name="search" className="h-4 w-4" />
        </button>
        <button
          aria-label="Workspace settings"
          className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-white/10 hover:text-[#f4eee2]"
          type="button"
        >
          <Icon name="gear" className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
