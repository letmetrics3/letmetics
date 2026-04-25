"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { NEIGHBOURHOODS } from "@/lib/neighbourhoods";
import { PROPERTY_TYPES } from "@/lib/property-types";
import { ReportLoadingOverlay } from "./ReportLoadingOverlay";

export function HomeForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const pendingHrefRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isNavigating || !pendingHrefRef.current) return;
    const href = pendingHrefRef.current;
    const timer = window.setTimeout(() => {
      router.push(href);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [isNavigating, router]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const agencyName = String(fd.get("agencyName") ?? "").trim();
    const agentName = String(fd.get("agentName") ?? "").trim();
    const propertyAddress = String(fd.get("propertyAddress") ?? "").trim();
    const neighbourhood = String(fd.get("neighbourhood") ?? "").trim();
    const bedrooms = String(fd.get("bedrooms") ?? "").trim();
    const propertyType = String(fd.get("propertyType") ?? "").trim();
    const managementFeePercent = String(fd.get("managementFeePercent") ?? "").trim();
    const longLetMonthlyRent = String(fd.get("longLetMonthlyRent") ?? "").trim();
    const logoUrl = String(fd.get("logoUrl") ?? "").trim();

    if (!agencyName || !agentName || !propertyAddress || !neighbourhood) {
      setError("Please complete all required fields.");
      return;
    }

    const params = new URLSearchParams();
    params.set("agencyName", agencyName);
    params.set("agentName", agentName);
    params.set("propertyAddress", propertyAddress);
    params.set("neighbourhood", neighbourhood);
    params.set("bedrooms", bedrooms);
    params.set("propertyType", propertyType);
    params.set("managementFeePercent", managementFeePercent);
    params.set("longLetMonthlyRent", longLetMonthlyRent);
    if (logoUrl) params.set("logoUrl", logoUrl);

    pendingHrefRef.current = `/report?${params.toString()}`;
    setIsNavigating(true);
  }

  return (
    <>
      {isNavigating ? <ReportLoadingOverlay /> : null}
    <form
      onSubmit={onSubmit}
      aria-busy={isNavigating}
      className={`relative space-y-6 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-8 ${isNavigating ? "pointer-events-none" : ""}`}
    >
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="agencyName" className="block text-sm font-medium text-[#0f2744]">
            Agency name <span className="text-red-600">*</span>
          </label>
          <input
            id="agencyName"
            name="agencyName"
            required
            autoComplete="organization"
            className="mt-1.5 w-full rounded-md border border-[#cbd5e1] px-3 py-2 text-[#0f2744] shadow-sm outline-none ring-[#c9a227] focus:border-[#1e3a5f] focus:ring-2"
            placeholder="e.g. North West Hosts Ltd"
          />
        </div>
        <div>
          <label htmlFor="agentName" className="block text-sm font-medium text-[#0f2744]">
            Agent name <span className="text-red-600">*</span>
          </label>
          <input
            id="agentName"
            name="agentName"
            required
            autoComplete="name"
            className="mt-1.5 w-full rounded-md border border-[#cbd5e1] px-3 py-2 text-[#0f2744] shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#c9a227]"
            placeholder="Prepared for landlords by"
          />
        </div>
        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-[#0f2744]">
            Agency logo URL <span className="font-normal text-[#64748b]">(optional)</span>
          </label>
          <input
            id="logoUrl"
            name="logoUrl"
            type="url"
            inputMode="url"
            className="mt-1.5 w-full rounded-md border border-[#cbd5e1] px-3 py-2 text-[#0f2744] shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#c9a227]"
            placeholder="https://…"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="propertyAddress" className="block text-sm font-medium text-[#0f2744]">
            Property address <span className="text-red-600">*</span>
          </label>
          <input
            id="propertyAddress"
            name="propertyAddress"
            required
            className="mt-1.5 w-full rounded-md border border-[#cbd5e1] px-3 py-2 text-[#0f2744] shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#c9a227]"
            placeholder="Full address including postcode"
          />
        </div>
        <div>
          <label htmlFor="neighbourhood" className="block text-sm font-medium text-[#0f2744]">
            Neighbourhood <span className="text-red-600">*</span>
          </label>
          <select
            id="neighbourhood"
            name="neighbourhood"
            required
            defaultValue=""
            className="mt-1.5 w-full rounded-md border border-[#cbd5e1] bg-white px-3 py-2 text-[#0f2744] shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#c9a227]"
          >
            <option value="" disabled>
              Select neighbourhood…
            </option>
            {NEIGHBOURHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-[#0f2744]">
            Bedrooms <span className="text-red-600">*</span>
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            required
            defaultValue="2"
            className="mt-1.5 w-full rounded-md border border-[#cbd5e1] bg-white px-3 py-2 text-[#0f2744] shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#c9a227]"
          >
            {[1, 2, 3, 4, 5, 6].map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="propertyType" className="block text-sm font-medium text-[#0f2744]">
            Property type <span className="text-red-600">*</span>
          </label>
          <select
            id="propertyType"
            name="propertyType"
            required
            defaultValue="Apartment"
            className="mt-1.5 w-full rounded-md border border-[#cbd5e1] bg-white px-3 py-2 text-[#0f2744] shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#c9a227]"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="managementFeePercent" className="block text-sm font-medium text-[#0f2744]">
            Management fee (%)
          </label>
          <input
            id="managementFeePercent"
            name="managementFeePercent"
            type="number"
            min={0}
            max={100}
            step={0.5}
            defaultValue={20}
            className="mt-1.5 w-full rounded-md border border-[#cbd5e1] px-3 py-2 text-[#0f2744] shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#c9a227]"
          />
        </div>
        <div>
          <label htmlFor="longLetMonthlyRent" className="block text-sm font-medium text-[#0f2744]">
            Est. long-let monthly rent (£) <span className="text-red-600">*</span>
          </label>
          <input
            id="longLetMonthlyRent"
            name="longLetMonthlyRent"
            type="number"
            min={1}
            step={1}
            required
            className="mt-1.5 w-full rounded-md border border-[#cbd5e1] px-3 py-2 text-[#0f2744] shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#c9a227]"
            placeholder="e.g. 1200"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#64748b]">
          Report uses Manchester-area market medians by neighbourhood and bedroom count. Figures are illustrative projections, not guarantees.
        </p>
        <button
          type="submit"
          disabled={isNavigating}
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#0f2744] px-6 py-2.5 text-sm font-semibold text-white shadow-sm ring-[#c9a227] transition hover:bg-[#1e3a5f] focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Generate earnings report
        </button>
      </div>
    </form>
    </>
  );
}
