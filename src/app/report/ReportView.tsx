import Link from "next/link";
import type { ReportPayload } from "@/lib/report-types";
import { formatGbp, formatGbpDetailed } from "@/lib/format-currency";
import { ReportActionBar } from "./ReportActionBar";

function pct(n: number): string {
  return `${Math.round(n)}%`;
}

export function ReportView({ data }: { data: ReportPayload }) {
  const generated = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const shortDeltaVsLong =
    data.netToLandlordAfterFeeMonthly * 12 - data.longLetAnnual;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f2744] print:bg-white print:text-black">
      <div className="mx-auto max-w-3xl px-4 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="mb-6 flex flex-col gap-4 print:mb-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm text-[#64748b] print:text-[#334155]">
            Private landlord earnings projection — {generated}
          </p>
          <ReportActionBar propertyAddress={data.propertyAddress} />
        </div>

        <div id="letmetrics-report-pdf-root">
          <article className="report-sheet overflow-hidden rounded-lg border border-[#e2e8f0] bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
          <header className="border-b-4 border-[#c9a227] bg-[#0f2744] px-6 py-8 text-white print:border-[#c9a227]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e2c66b]">
                  LetMetrics
                </p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{data.agencyName}</h1>
                <p className="text-sm text-[#cbd5e1]">
                  Prepared by <span className="text-white">{data.agentName}</span>
                </p>
              </div>
              {data.logoUrl ? (
                <div className="shrink-0 rounded-md bg-white/10 p-3 print:bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element -- dynamic user-supplied URL */}
                  <img
                    src={data.logoUrl}
                    alt={`${data.agencyName} logo`}
                    className="max-h-16 max-w-[200px] object-contain sm:max-h-20"
                  />
                </div>
              ) : null}
            </div>
          </header>

          <div className="space-y-8 px-6 py-8 print:space-y-6 print:px-0 print:py-6">
            <section className="break-inside-avoid">
              <h2 className="border-b border-[#e2e8f0] pb-2 text-lg font-semibold text-[#0f2744]">
                Property summary
              </h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[#64748b]">Address</dt>
                  <dd className="font-medium text-[#0f2744]">{data.propertyAddress}</dd>
                </div>
                <div>
                  <dt className="text-[#64748b]">Neighbourhood</dt>
                  <dd className="font-medium text-[#0f2744]">{data.neighbourhood}</dd>
                </div>
                <div>
                  <dt className="text-[#64748b]">Bedrooms</dt>
                  <dd className="font-medium text-[#0f2744]">{data.bedrooms}</dd>
                </div>
                <div>
                  <dt className="text-[#64748b]">Property type</dt>
                  <dd className="font-medium text-[#0f2744]">{data.propertyType}</dd>
                </div>
                <div>
                  <dt className="text-[#64748b]">Agency management fee</dt>
                  <dd className="font-medium text-[#0f2744]">{pct(data.managementFeePercent)}</dd>
                </div>
                <div>
                  <dt className="text-[#64748b]">Long-let benchmark (monthly)</dt>
                  <dd className="font-medium text-[#0f2744]">{formatGbp(data.longLetMonthlyRent)}</dd>
                </div>
              </dl>
            </section>

            <section className="break-inside-avoid">
              <h2 className="border-b border-[#e2e8f0] pb-2 text-lg font-semibold text-[#0f2744]">
                Projected short-let income
              </h2>
              <p className="mt-2 text-sm text-[#475569]">
                Based on median nightly rate and typical occupancy for this neighbourhood and bedroom count
                from internal Manchester market benchmarks.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 print:bg-white">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
                    Median nightly rate
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#0f2744]">
                    {formatGbpDetailed(data.medianNightlyRate)}
                  </p>
                </div>
                <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 print:bg-white">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
                    Typical occupancy
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#0f2744]">{pct(data.occupancyPercent)}</p>
                </div>
                <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 print:bg-white">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
                    Gross monthly (projected)
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#c9a227]">{formatGbp(data.grossShortLetMonthly)}</p>
                </div>
                <div className="rounded-lg border border-[#1e3a5f] bg-[#0f2744] p-4 text-white print:border-[#0f2744]">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">
                    Net to landlord (after {pct(data.managementFeePercent)} fee)
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#e2c66b]">
                    {formatGbp(data.netToLandlordAfterFeeMonthly)}<span className="text-sm font-normal"> /mo</span>
                  </p>
                </div>
              </div>
            </section>

            <section className="break-inside-avoid">
              <h2 className="border-b border-[#e2e8f0] pb-2 text-lg font-semibold text-[#0f2744]">
                Long-let vs short-let comparison
              </h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-[#e2e8f0]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0f2744] text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Metric</th>
                      <th className="px-4 py-3 font-semibold">Long-let</th>
                      <th className="px-4 py-3 font-semibold">Short-let (gross)</th>
                      <th className="px-4 py-3 font-semibold">Short-let (net)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0] bg-white">
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#334155]">Monthly</td>
                      <td className="px-4 py-3">{formatGbp(data.longLetMonthlyRent)}</td>
                      <td className="px-4 py-3 text-[#b45309]">{formatGbp(data.grossShortLetMonthly)}</td>
                      <td className="px-4 py-3 font-semibold text-[#0f2744]">
                        {formatGbp(data.netToLandlordAfterFeeMonthly)}
                      </td>
                    </tr>
                    <tr className="bg-[#f8fafc] print:bg-white">
                      <td className="px-4 py-3 font-medium text-[#334155]">Annualised</td>
                      <td className="px-4 py-3">{formatGbp(data.longLetAnnual)}</td>
                      <td className="px-4 py-3 text-[#b45309]">{formatGbp(data.shortLetGrossAnnual)}</td>
                      <td className="px-4 py-3 font-semibold text-[#0f2744]">{formatGbp(data.shortLetNetAnnual)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-[#475569]">
                On these assumptions, projected net short-let income to the landlord is{" "}
                <strong className="text-[#0f2744]">
                  {formatGbp(Math.abs(shortDeltaVsLong))}
                  {shortDeltaVsLong >= 0 ? " ahead of " : " below "}
                </strong>
                the long-let benchmark on an annual basis (before tax, voids on long-lets, and other costs).
              </p>
            </section>

            <section className="break-inside-avoid border-t border-[#e2e8f0] pt-6">
              <h2 className="text-lg font-semibold text-[#0f2744]">Market context</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#334155]">{data.marketContext}</p>
            </section>

            <footer className="border-t border-[#e2e8f0] pt-4 text-center text-xs text-[#94a3b8] print:text-[#64748b]">
              Illustrative projection for discussion purposes only — not financial, tax, or legal advice.
            </footer>
          </div>
        </article>
        </div>

        <p className="mt-6 text-center text-sm print:hidden">
          <Link
            href="/"
            className="font-medium text-[#1e3a5f] underline decoration-[#c9a227] underline-offset-2"
          >
            ← Generate another report
          </Link>
        </p>
      </div>
    </div>
  );
}
