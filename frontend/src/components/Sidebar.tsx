import { Icon } from "./Icon";

const sessions = [
  {
    accent: "bg-sky-400",
    title: "Verify repo access and PR",
    time: "now",
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-[268px] shrink-0 border-r border-white/[0.06] bg-[#F3F2EE] md:flex">
      <div className="flex w-11 flex-col items-center border-r border-white/[0.04] bg-[#EAE5DA] py-4">
        <button
          className="mb-7 text-[#131419] transition hover:text-[#8C35F8]"
          type="button"
        >
          <Icon name="menu" />
        </button>

        <div className="flex flex-1 flex-col items-center gap-4">
          {["gear", "search", "grid"].map((name, index) => (
            <button
              aria-label={`${name} navigation`}
              className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                index === 0
                  ? "bg-white/[0.10] text-[#131419]"
                  : "text-[#131419] hover:bg-white/[0.06] hover:text-[#8C35F8]"
              }`}
              key={name}
              type="button"
            >
              <Icon
                name={name as "gear" | "search" | "grid"}
                className="h-4 w-4"
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 text-zinc-500 hover:text-[#8C35F8]">
          <button aria-label="Settings" type="button">
            <Icon name="gear" className="h-4 w-4" />
          </button>
          <button aria-label="Help" type="button">
            ?
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col text-[#131419]">
        <div className="flex h-12 items-center gap-2 border-b border-white/[0.04] px-4">
          <Icon name="github" className="h-4 w-4 " />
          <button
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            type="button"
          >
            <span className="truncate text-sm font-semibold ">
              DanielDemoVR
            </span>
            <Icon name="chevron" className="h-3.5 w-3.5 text-zinc-500" />
          </button>
        </div>

        <div className="border-b border-white/[0.04] px-4 py-3">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-[#131419] transition hover:bg-white/[0.05]"
            type="button"
          >
            <Icon name="plus" className="h-4 w-4" />
            New session
          </button>
          <button
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-[#131419] transition hover:bg-white/[0.05]"
            type="button"
          >
            <Icon name="all" className="h-4 w-4" />
            All sessions
          </button>
          <button
            className="mt-3 flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-semibold text-[#131419] transition hover:bg-white/[0.05]"
            type="button"
          >
            <span className="flex items-center gap-3">
              <Icon name="search" className="h-4 w-4" />
              Search
            </span>
            <span className="h-1.5 w-4 rounded-full bg-zinc-500" />
          </button>
        </div>

        <div className="px-4 py-3 text-xs">
          <div className="mb-3 flex items-center gap-2 text-zinc-500">
            <Icon name="mail" className="h-3.5 w-3.5" />
            <span className="truncate font-semibold">
              test.danielaffiliate@gmail.com
            </span>
            <span className="ml-auto h-2 w-2 rounded-full bg-zinc-600" />
          </div>

          <div className="space-y-1 hover:text-[#8C35F8]">
            {sessions.map((session) => (
              <button
                className="flex w-full items-center gap-3 rounded-sm bg-[#EAE5DA] px-3 py-3 text-left hover:bg-[#e4dac4]  hover:cursor-pointer hover:border-[#8C35F8]"
                key={session.title}
                type="button"
              >
                <span className={`h-2 w-2 rounded-full ${session.accent}`} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-[#131419]">
                    {session.title}
                  </span>
                  <span className="block text-zinc-500">{session.time}</span>
                </span>
                <span className="h-3 w-3 rounded-full bg-[#8C35F8]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
