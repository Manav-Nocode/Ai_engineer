import React from "react";
export interface repoItem {
  clone_url: string;
  default_branch: string;
  description: null;
  full_name: string;
  id: number;
  language: string;
  name: string;
  private: boolean;
  stars: number;
  updated_at: string;
  url: string;
}
interface RepoListPopProps {
  data: repoItem[];
  onClose?: () => void;
  setSelected: (string: string) => void;
}
const RepoListPop = ({ data, setSelected }: RepoListPopProps) => {
  function handleClick(text: string) {
    setSelected(text);
    console.log("clicked");
  }
  return (
    <>
      <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-3 text-xs bg-[#161616] p-3 rounded-lg border border-white/[0.05] font-mono custom-scrollbar">
        {" "}
        <div>
          <span className="text-amber-400">User's Repositories:</span>
        </div>
        {data.map((items, idx) => (
          <li
            onClick={() => handleClick(items.full_name)}
            className="list-none cursor-pointer hover:text-amber-400"
            key={idx}
          >
            {items.full_name}
          </li>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <button className="rounded-md bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition">
          Close
        </button>
      </div>
    </>
  );
};

export default RepoListPop;
