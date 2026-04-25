"use client";

import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Analysing Manchester market data...",
  "Comparing similar properties nearby...",
  "Calculating projected earnings...",
  "Preparing your landlord report...",
] as const;

export function ReportLoadingOverlay() {
  const [entered, setEntered] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const id1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id1);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`fixed inset-0 z-[100] flex flex-col bg-[#0f2744] transition-opacity duration-500 ease-out ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#1e3a5f]/40 to-transparent px-6 pt-12 pb-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#e2c66b]">LetMetrics</p>
        <p className="mt-2 text-sm font-medium tracking-wide text-[#94a3b8]">Landlord earnings report</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div
            className="absolute h-20 w-20 rounded-full border-2 border-[#c9a227]/25 border-t-[#c9a227] animate-spin"
            aria-hidden
          />
          <div
            className="absolute h-12 w-12 rounded-full border border-[#e2c66b]/20 animate-spin [animation-direction:reverse] [animation-duration:1.2s]"
            aria-hidden
          />
          <div
            className="relative h-3 w-3 rounded-full bg-[#c9a227] shadow-[0_0_20px_rgba(201,162,39,0.65)] animate-pulse"
            aria-hidden
          />
        </div>

        <div className="mt-14 min-h-[3.5rem] max-w-md text-center">
          <p
            key={messageIndex}
            className="text-base font-medium leading-snug text-[#e2e8f0] animate-[report-loading-fade_0.45s_ease-out_both] sm:text-lg"
          >
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        <p className="mt-10 text-xs tracking-wide text-[#64748b]">This usually takes just a moment</p>
      </div>
    </div>
  );
}
