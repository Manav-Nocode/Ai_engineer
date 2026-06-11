import { useState } from "react";
import { Icon } from "./Icon";
import { useSearchParams } from "react-router-dom";

interface repoItem {
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
interface ApiResponse {
  repo: string;
}

export function RepoDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [choosenRepo, setChooseRepo] = useState<string[]>([]);
  const [popup, setPopup] = useState(false);
  const [repoData, setRepoData] = useState<repoItem[]>([]);
  async function handleClick() {
    window.location.href = "http://127.0.0.1:8000/api/auth/github";
  }

  async function importRepo() {
    try {
      const userId = searchParams.get("user_id");
      // const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://127.0.0.1:8000/api/repos?user_id=${userId}`,
      );

      const data = await response.json();
      // console.log(data.respositories);
      if (data.success && Array.isArray(data?.respositories)) {
        setRepoData(data.respositories);
        setPopup(true);
      } else {
        //Handle the error gracefully without crashing the UI
        console.error("API did not return an array. Received:", data);
      }
    } catch (err) {
      console.log("errrors");
    }
  }

  async function getname(name: string) {
    const userId = searchParams.get("user_id");
    const response = await fetch(
      `http://127.0.0.1:8000/api/repos/select?user_id=${userId}&repo_full_name=${name}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data: ApiResponse = await response.json();
    // console.log(data);
    const repoName = data.repo;
    setChooseRepo((prev) => [repoName, ...prev]);
  }
  console.log(choosenRepo);

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-[calc(100%-10px)] hidden w-[430px] -translate-x-1/2 rounded-[18px] border border-white/[0.09] bg-[#232323] p-3 text-left shadow-[0_16px_44px_rgba(0,0,0,0.42)] sm:block">
        <div className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.14] bg-[#202020] px-4 text-zinc-300 ring-1 ring-black/20">
          <Icon name="search" className="h-5 w-5 text-zinc-500" />
          <span className="text-[18px] font-semibold text-zinc-300">
            <input className="" />
          </span>
        </div>

        <button
          onClick={importRepo}
          className="mt-3 flex w-full items-center justify-between rounded-lg px-2 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.05]"
          type="button"
        >
          <span>
            not setup <span className="ml-1 text-zinc-500">(1)</span>
          </span>
          <Icon name="arrow" className="h-4 w-4 text-zinc-400" />
        </button>
        {choosenRepo?.map((item, index) => (
          <li
            key={index}
            className="border-2 text-white border-green-400 m-2 pl-4"
          >
            {item}
          </li>
        ))}
        <div className="flex items-center justify-between border-t border-white/[0.04] px-2 pt-3 text-sm font-semibold text-zinc-500">
          <span>0/1 repos set up</span>
          <button
            onClick={handleClick}
            className="text-zinc-300 underline underline-offset-2 hover:cursor-pointer"
            type="button"
          >
            Manage
          </button>
        </div>
      </div>
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-scroll">
          <div className="w-[360px] max-h-[80vh] flex flex-col rounded-xl border border-white/[0.1] bg-[#1e1e1e] p-5 text-zinc-200 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              {" "}
              <h3 className="text-base font-semibold">Repository Details</h3>
              <button
                onClick={() => setPopup(false)}
                className="text-zinc-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            {/* Future Props Display Area */}
            <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-3 text-xs bg-[#161616] p-3 rounded-lg border border-white/[0.05] font-mono custom-scrollbar">
              {" "}
              <p className="text-zinc-500">// Future props will go here</p>
              <div>
                <span className="text-amber-400">User's Repositories:</span>

                {repoData?.map((item, index) => (
                  <li
                    onClick={() => getname(item.name)}
                    key={index}
                    className="w-full h-6 mt-2 border-1 border-amber-400 list-none hover:cursor-pointer"
                  >
                    {item.name}
                  </li>
                ))}
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setPopup(false)}
                className="rounded-md bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
