/** Safe filename segment from a property address (no path separators or OS-reserved chars). */
export function pdfReportFilename(propertyAddress: string): string {
  const slug = propertyAddress
    .trim()
    .replace(/[\\/:*?"<>|#]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
  return `LetMetrics-Report-${slug || "Property"}.pdf`;
}
