import { Icon } from "../Icon";
import { chatMessages } from "./editorData";

type AiChatPanelProps = {
  width: number;
};

export function AiChatPanel({ width }: AiChatPanelProps) {
  return (
    <aside
      className="hidden shrink-0 border-l border-[#2d2922] bg-[#141514] text-[#f4eee2] xl:flex xl:flex-col"
      style={{ width }}
    >
      <div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Icon name="spark" className="h-4 w-4 text-[#8c35f8]" />
          <span className="truncate text-sm font-bold">AI Chat</span>
        </div>
        <button
          aria-label="New chat"
          className="grid h-7 w-7 place-items-center rounded-md text-[#a9a399] transition hover:bg-white/10 hover:text-[#f4eee2]"
          type="button"
        >
          <Icon name="plus" className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
        {chatMessages.map((message) => (
          <div
            className={`rounded-md border p-4 text-sm leading-6 ${
              message.role === "assistant"
                ? "border-[#8c35f8]/30 bg-[#20142e] text-[#f4eee2]"
                : "border-white/10 bg-white/[0.04] text-[#d7d0c6]"
            }`}
            key={message.body}
          >
            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#8c35f8]">
              {message.role === "assistant" ? "Assistant" : "You"}
            </div>
            {message.body}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-4">
        <textarea
          className="h-28 w-full resize-none rounded-md border border-white/10 bg-[#1e1f1d] p-3 text-sm leading-6 text-[#f4eee2] outline-none placeholder:text-[#76716a] focus:border-[#8c35f8]"
          placeholder="Ask about this repo..."
        />
        <div className="mt-3 flex items-center justify-between">
          <button
            className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs font-bold text-[#cfc7bb] transition hover:border-[#8c35f8] hover:text-[#f4eee2]"
            type="button"
          >
            <Icon name="attach" className="h-4 w-4" />
            Context
          </button>
          <button
            className="flex items-center gap-2 rounded-md bg-[#8c35f8] px-4 py-2 text-xs font-black text-white transition hover:bg-[#7627df]"
            type="button"
          >
            Send
            <Icon name="send" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
