"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { pdfReportFilename } from "@/lib/pdf-filename";

const PDF_ROOT_ID = "letmetrics-report-pdf-root";

export function ReportActionBar({ propertyAddress }: { propertyAddress: string }) {
  const [pdfLoading, setPdfLoading] = useState(false);

  const downloadPdf = useCallback(async () => {
    const el = document.getElementById(PDF_ROOT_ID);
    if (!el) return;

    setPdfLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const filename = pdfReportFilename(propertyAddress);

      await html2pdf()
        .set({
          margin: [14, 14, 14, 14],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            letterRendering: true,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(el)
        .save();
    } catch (e) {
      console.error("PDF export failed", e);
    } finally {
      setPdfLoading(false);
    }
  }, [propertyAddress]);

  return (
    <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
      {pdfLoading ? (
        <div
          className="flex items-center justify-center gap-2 rounded-md border border-[#c9a227]/40 bg-[#0f2744]/5 px-4 py-2.5 text-sm font-medium text-[#0f2744]"
          aria-live="polite"
        >
          <span
            className="h-4 w-4 shrink-0 rounded-full border-2 border-[#c9a227]/30 border-t-[#c9a227] animate-spin"
            aria-hidden
          />
          Generating PDF...
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-[#1e3a5f] bg-white px-4 py-2 text-sm font-medium text-[#1e3a5f] shadow-sm transition hover:bg-[#f8fafc] print:hidden"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="print:hidden rounded-md border border-[#1e3a5f] bg-white px-4 py-2 text-sm font-medium text-[#1e3a5f] shadow-sm transition hover:bg-[#f8fafc]"
          >
            Print / Save as PDF
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            className="print:hidden inline-flex items-center justify-center rounded-md border border-amber-600/80 bg-gradient-to-b from-amber-400 to-amber-500 px-4 py-2 text-sm font-semibold text-[#0f2744] shadow-md transition hover:from-amber-300 hover:to-amber-400 hover:shadow-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
