import { Icon } from "./Icon";

const tools = [
  { icon: "progress", label: "Progress" },
  { icon: "shell", label: "Shell" },
  { icon: "code", label: "Code" },
  { icon: "browser", label: "Browser" },
] as const;

export function AppHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#222222] px-4 text-sm text-zinc-300">
      <div className="flex min-w-0 items-center gap-3">
        <span className="truncate font-medium text-zinc-100">New session</span>
        <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-zinc-500">
          XS
        </span>
      </div>

      <nav className="hidden items-center gap-5 text-xs font-semibold text-zinc-300 md:flex">
        {tools.map((tool) => (
          <button
            className="flex items-center gap-1.5 transition hover:text-white"
            key={tool.label}
            type="button"
          >
            <Icon name={tool.icon} className="h-3.5 w-3.5" />
            {tool.label}
          </button>
        ))}
        <button
          aria-label="More tools"
          className="grid h-5 w-5 place-items-center rounded-full border border-white/20 text-zinc-400"
          type="button"
        >
          <Icon name="minus" className="h-3 w-3" />
        </button>
      </nav>
    </header>
  );
}
