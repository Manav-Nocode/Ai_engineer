import { AppHeader } from "../src/components/AppHeader";
import { PromptComposer } from "../src/components/PromptComposer";
import { Sidebar } from "../src/components/Sidebar";

export function HomeScreen() {
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
              <PromptComposer />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
