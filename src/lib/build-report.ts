import marketData from "../../data/manchester_market_data.json";
import type { ReportInput, ReportPayload, MarketRow } from "./report-types";

type MarketFile = Record<string, Record<string, MarketRow>>;

const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

function getMarketRow(neighbourhood: string, bedrooms: number): MarketRow {
  const file = marketData as MarketFile;
  const byBed = file[neighbourhood];
  if (!byBed) {
    throw new Error(`No market data for neighbourhood: ${neighbourhood}`);
  }
  const row = byBed[String(bedrooms)];
  if (!row) {
    throw new Error(`No market data for ${bedrooms} bedroom(s) in ${neighbourhood}`);
  }
  return row;
}

async function fetchMarketContextParagraph(neighbourhood: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return (
      `Short-let demand in ${neighbourhood} is shaped by seasonality, local amenities, and travel patterns across Greater Manchester. ` +
      `Co-hosted listings that track median rates and occupancy for this micro-market can outperform static long-let yields when pricing and operations stay aligned with comparable stock. ` +
      `Configure ANTHROPIC_API_KEY to replace this placeholder with a live neighbourhood brief from Claude.`
    );
  }

  const prompt =
    `Write exactly 2 or 3 short sentences (under 90 words total) for UK landlords about short-let / Airbnb-style demand in the "${neighbourhood}" area (Greater Manchester context). ` +
    `Be factual and balanced — no guarantees or investment advice. Plain prose, no bullet points.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 220,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Anthropic API error", res.status, errText);
      return fallbackContext(neighbourhood);
    }

    const body = (await res.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const text = body.content?.find((c) => c.type === "text")?.text?.trim();
    if (!text) return fallbackContext(neighbourhood);
    return text;
  } catch (e) {
    console.error("Anthropic request failed", e);
    return fallbackContext(neighbourhood);
  }
}

function fallbackContext(neighbourhood: string): string {
  return (
    `Short-let demand in ${neighbourhood} typically follows Greater Manchester-wide seasonality, with strength around weekends, events, and corporate stays. ` +
    `Well-run co-hosted homes that price close to the local median and maintain reliable occupancy can compete credibly with long-let alternatives on a gross income basis.`
  );
}

export async function buildReportPayload(input: ReportInput): Promise<ReportPayload> {
  const { medianNightlyRate, occupancyPercent } = getMarketRow(input.neighbourhood, input.bedrooms);

  const grossShortLetMonthly = Math.round(
    medianNightlyRate * 30 * (occupancyPercent / 100)
  );
  const netToLandlordAfterFeeMonthly = Math.round(
    grossShortLetMonthly * (1 - input.managementFeePercent / 100)
  );

  const longLetAnnual = input.longLetMonthlyRent * 12;
  const shortLetGrossAnnual = grossShortLetMonthly * 12;
  const shortLetNetAnnual = netToLandlordAfterFeeMonthly * 12;

  const marketContext = await fetchMarketContextParagraph(input.neighbourhood);

  return {
    ...input,
    medianNightlyRate,
    occupancyPercent,
    grossShortLetMonthly,
    netToLandlordAfterFeeMonthly,
    longLetAnnual,
    shortLetGrossAnnual,
    shortLetNetAnnual,
    marketContext,
  };
}
