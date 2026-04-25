import { HomeForm } from "./HomeForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f1f5f9] text-[#0f2744]">
      <div className="border-b border-[#1e3a5f]/20 bg-[#0f2744] text-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-10 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e2c66b]">LetMetrics</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Landlord earnings report</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#cbd5e1] sm:text-base">
            Enter property details to generate a professional short-let vs long-let comparison for UK
            co-hosting agencies — built for conversations with landlords, not as financial advice.
          </p>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6">
        <HomeForm />
      </main>

      <footer className="border-t border-[#e2e8f0] bg-white py-6 text-center text-xs text-[#64748b]">
        © {new Date().getFullYear()} LetMetrics — Greater Manchester market benchmarks (illustrative).
      </footer>
    </div>
  );
}
