import Link from "next/link";
import { buildReportPayload } from "@/lib/build-report";
import { parseReportFields, searchParamsToRecord } from "@/lib/report-validation";
import { ReportView } from "./ReportView";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const parsed = parseReportFields(searchParamsToRecord(sp));

  if (!parsed.ok) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 py-16 text-[#0f2744]">
        <div className="max-w-md rounded-lg border border-[#e2e8f0] bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold">Report could not be loaded</h1>
          <p className="mt-2 text-sm text-[#64748b]">{parsed.error}</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-[#0f2744] px-5 py-2 text-sm font-medium text-white hover:bg-[#1e3a5f]"
          >
            Back to form
          </Link>
        </div>
      </div>
    );
  }

  const data = await buildReportPayload(parsed.data);
  return <ReportView data={data} />;
}
