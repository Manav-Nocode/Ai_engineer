import { useState } from "react";
import { Icon } from "./Icon";
import { RepoDropdown } from "./RepoDropdown";

interface Props {
  fun: () => Promise<void>;
}
export function PromptComposer({ fun }: Props) {
  const [dropdown, setDropdown] = useState(false);
  function openDD() {
    setDropdown(!dropdown);
  }

  async function handleClick() {
    const response = await fetch("http://127.0.0.1:8000/ai_resp");
    const data = await response.json();
    console.log(data);
  }
  return (
    <div className="relative w-full max-w-[850px]">
      <section className="min-h-[190px] rounded-[22px] border border-white/[0.03] bg-[#343434] shadow-[0_18px_80px_rgba(0,0,0,0.18)]">
        <label className="sr-only" htmlFor="home-prompt">
          Describe your task
        </label>
        <textarea
          className="h-32 w-full resize-none rounded-t-[22px] bg-transparent px-7 py-6 text-[18px] font-semibold leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-500 sm:text-[20px]"
          id="home-prompt"
          placeholder="Describe your task or ask a question"
        />

        <div className="flex h-16 items-center justify-between px-5 pb-2 text-zinc-400">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Mention context"
              className="icon-button"
              type="button"
            >
              @
            </button>
            <button
              aria-label="Attach file"
              className="icon-button"
              type="button"
            >
              <Icon name="attach" />
            </button>
            <button
              onClick={openDD}
              className="flex h-9 items-center gap-2 rounded-lg bg-white/[0.12] px-3 text-sm font-bold text-zinc-300"
              type="button"
            >
              1 repos
              <Icon name="chevron" className="h-3.5 w-3.5 rotate-180" />
            </button>
            <button
              className="hidden h-9 items-center gap-2 rounded-lg px-2 text-sm font-bold text-zinc-300 transition hover:bg-white/[0.08] sm:flex"
              type="button"
            >
              Agent
              <Icon name="chevron" className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              aria-label="More options"
              className="icon-button hidden sm:grid"
              type="button"
            >
              <Icon name="more" />
            </button>
            <button
              onClick={handleClick}
              aria-label="Send prompt"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#8C35F8] text-zinc-950 shadow-sm transition hover:bg-white"
              type="button"
            >
              <Icon name="send" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {dropdown && <RepoDropdown fun={fun} />}
    </div>
  );
}
