import { Icon } from "./Icon";

const tools = [
  { icon: "progress", label: "Progress" },
  { icon: "shell", label: "Shell" },
  { icon: "code", label: "Code" },
  { icon: "browser", label: "Browser" },
] as const;

export function AppHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#EAE5DA] px-4 text-sm text-[#131419]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="truncate font-medium ">New session</span>
        <span className="rounded bg-black/[0.06] px-1.5 py-0.5 text-[11px] font-medium ">
          XS
        </span>
      </div>

      <nav className="hidden items-center gap-5 text-xs font-semibold  md:flex">
        {tools.map((tool) => (
          <button
            className="flex items-center gap-3 transition hover:bg-black/[0.06] p-1.5 rounded"
            key={tool.label}
            type="button"
          >
            <Icon name={tool.icon} className="h-3.5 w-3.5" />
            {tool.label}
          </button>
        ))}
        <button
          aria-label="More tools"
          className="grid h-5 w-5 place-items-center rounded-full border border-white/20 "
          type="button"
        >
          <Icon name="minus" className="h-3 w-3" />
        </button>
      </nav>
    </header>
  );
}
