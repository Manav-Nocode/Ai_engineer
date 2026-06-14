import { useSearchParams } from "react-router-dom";
import { AppHeader } from "../src/components/AppHeader";
import { PromptComposer } from "../src/components/PromptComposer";
import { Sidebar } from "../src/components/Sidebar";
import { useState } from "react";
import RepoListPop, { type repoItem } from "../src/components/RepoListPop";

export function HomeScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [repoData, setRepoData] = useState<repoItem[]>([]);
  const [popup, setPopup] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");

  async function importUserRepos() {
    const userId = searchParams.get("user_id");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/repos?user_id=${userId}`,
      );

      const data = await response.json();
      if (data.success && Array.isArray(data.respositories)) {
        setRepoData(data.respositories);
        setPopup(true);
        console.log(selectedRepo);
      } else {
        //Handle the error gracefully without crashing the UI
        console.error("API did not return an array. Received:", data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  console.log(selectedRepo);

  return (
    <main className="min-h-screen overflow-hidden bg-[#252525] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col">
          <AppHeader />

          <div className="flex flex-1 items-start justify-center px-5 py-14 sm:px-8 lg:items-center lg:py-0">
            <div className="mb-20 flex w-full max-w-[980px] flex-col items-center">
              <h1 className="mb-12 text-center text-[34px] font-semibold leading-tight tracking-normal text-zinc-50 sm:text-[44px] lg:text-[52px]">
                What do you want to get done?
              </h1>

              <PromptComposer fun={importUserRepos} />
            </div>
          </div>
        </section>
      </div>
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          {/* Modal Box Container */}
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl transition-all">
            {/* Close Button UI */}
            <button
              onClick={() => setPopup(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1 rounded-lg hover:bg-zinc-800 transition"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Render Repo List component */}
            <RepoListPop data={repoData} setSelected={setSelectedRepo} />
          </div>
        </div>
      )}
    </main>
  );
}
