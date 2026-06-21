import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useApp } from "../../contexts/repoContext";
import { useNavigate } from "react-router-dom";

interface Props {
  fun: () => Promise<void>;
}
interface workingReposType {
  repo_name: string;
  repo_full_name: string;
}
export function RepoDropdown({ fun }: Props) {
  const [workingRepos, setWorkingRepos] = useState<workingReposType[]>([]);
  const [popup, setPopup] = useState(false);
  const { userId, setSelectedRepo } = useApp();
  const navigate = useNavigate();
  const [choosenRepo, setChoosenRepo] = useState("");
  const { setUserName } = useApp();

  async function handleClick() {
    window.location.href = "http://127.0.0.1:8000/api/auth/github";
  }

  useEffect(() => {
    async function fetchCurrentRepoDetails() {
      if (!userId) {
        // no user id available anywhere — redirect to login/connect flow, etc.
        console.error("No user_id found in searchParams or localStorage");
        return;
      }
      // show all the repos in dropdown as persisted data
      try {
        const renderRepoDataRequest = await fetch(
          `http://127.0.0.1:8000/api/userRepos?user_id=${userId}`,
        );
        const repoResponse = await renderRepoDataRequest.json();
        if (repoResponse && Array.isArray(repoResponse.repos)) {
          setWorkingRepos(repoResponse.repos);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchCurrentRepoDetails();
  }, []);
  useEffect(() => {
    // console.log(workingRepos);
  }, [workingRepos]);

  async function fast(name: string) {
    if (!userId) {
      // no user id available anywhere — redirect to login/connect flow, etc.
      console.error("No user_id found in searchParams or localStorage");
      return;
    }
    setChoosenRepo(name);
    setUserName(name);
    console.log(choosenRepo);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/repos/contents?user_id=${userId}&repo=${name}`,
      );
      const data = await response.json();
      setSelectedRepo(data.items);
      console.log(data.items);
      // console.log(data);
      navigate("/editor");
    } catch (err) {
      console.log(err);
    }
  }

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
          onClick={fun}
          className="mt-3 flex w-full items-center justify-between rounded-lg px-2 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.05]"
          type="button"
        >
          <span>
            not setup <span className="ml-1 text-zinc-500">(1)</span>
          </span>
          <Icon name="arrow" className="h-4 w-4 text-zinc-400" />
        </button>

        {workingRepos.length > 0 ? (
          <ul className="mt-2 max-h-[220px] space-y-1 overflow-y-auto">
            {workingRepos.map((repo) => (
              <li
                onClick={() => fast(repo.repo_full_name)}
                key={repo.repo_full_name}
                className="rounded-lg px-2 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05]"
              >
                {repo.repo_name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-2 py-3 text-sm text-zinc-500">Nothing to show</p>
        )}
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
          </div>
        </div>
      )}
    </div>
  );
}
