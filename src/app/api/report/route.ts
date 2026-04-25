import { NextResponse } from "next/server";
import { buildReportPayload } from "@/lib/build-report";
import { parseReportFields } from "@/lib/report-validation";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected a JSON object." }, { status: 400 });
  }

  const parsed = parseReportFields(body as Record<string, unknown>);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const payload = await buildReportPayload(parsed.data);
    return NextResponse.json(payload);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not build report from market data." },
      { status: 500 }
    );
  }
}
