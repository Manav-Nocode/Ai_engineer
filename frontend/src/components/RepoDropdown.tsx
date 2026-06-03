import { Icon } from "./Icon";

export function RepoDropdown() {
  return (
    <div className="absolute left-1/2 top-[calc(100%-10px)] hidden w-[430px] -translate-x-1/2 rounded-[18px] border border-white/[0.09] bg-[#232323] p-3 text-left shadow-[0_16px_44px_rgba(0,0,0,0.42)] sm:block">
      <div className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.14] bg-[#202020] px-4 text-zinc-300 ring-1 ring-black/20">
        <Icon name="search" className="h-5 w-5 text-zinc-500" />
        <span className="text-[18px] font-semibold text-zinc-300">Search for a repo</span>
      </div>

      <button
        className="mt-3 flex w-full items-center justify-between rounded-lg px-2 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.05]"
        type="button"
      >
        <span>
          not setup <span className="ml-1 text-zinc-500">(1)</span>
        </span>
        <Icon name="arrow" className="h-4 w-4 text-zinc-400" />
      </button>

      <div className="flex items-center justify-between border-t border-white/[0.04] px-2 pt-3 text-sm font-semibold text-zinc-500">
        <span>0/1 repos set up</span>
        <button className="text-zinc-300 underline underline-offset-2" type="button">
          Manage
        </button>
      </div>
    </div>
  );
}
