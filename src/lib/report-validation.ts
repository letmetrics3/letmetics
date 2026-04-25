import { NEIGHBOURHOODS, type Neighbourhood } from "./neighbourhoods";
import { PROPERTY_TYPES, type PropertyType } from "./property-types";
import type { ReportInput } from "./report-types";

const neighbourhoodSet = new Set<string>(NEIGHBOURHOODS);
const propertyTypeSet = new Set<string>(PROPERTY_TYPES);

function pickString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}

function pickNumber(value: unknown): number | undefined {
  const s = pickString(value);
  if (s === undefined) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

/** Normalise flat fields from JSON body or query parsing. */
export function parseReportFields(raw: Record<string, unknown>): { ok: true; data: ReportInput } | { ok: false; error: string } {
  const agencyName = pickString(raw.agencyName)?.trim();
  const agentName = pickString(raw.agentName)?.trim();
  const propertyAddress =
    pickString(raw.propertyAddress)?.trim() ?? pickString(raw.address)?.trim();
  const neighbourhood = pickString(raw.neighbourhood)?.trim();
  const bedrooms = pickNumber(raw.bedrooms);
  const propertyType = pickString(raw.propertyType)?.trim() as PropertyType | undefined;
  const managementFeePercent = pickNumber(raw.managementFeePercent);
  const longLetMonthlyRent = pickNumber(raw.longLetMonthlyRent);
  const logoRaw = pickString(raw.logoUrl)?.trim();

  if (!agencyName) return { ok: false, error: "Agency name is required." };
  if (!agentName) return { ok: false, error: "Agent name is required." };
  if (!propertyAddress) return { ok: false, error: "Property address is required." };
  if (!neighbourhood || !neighbourhoodSet.has(neighbourhood)) {
    return { ok: false, error: "A valid neighbourhood is required." };
  }
  if (bedrooms === undefined || !Number.isInteger(bedrooms) || bedrooms < 1 || bedrooms > 6) {
    return { ok: false, error: "Bedrooms must be a whole number from 1 to 6." };
  }
  if (!propertyType || !propertyTypeSet.has(propertyType)) {
    return { ok: false, error: "A valid property type is required." };
  }
  if (
    managementFeePercent === undefined ||
    managementFeePercent < 0 ||
    managementFeePercent > 100
  ) {
    return { ok: false, error: "Management fee must be between 0 and 100." };
  }
  if (longLetMonthlyRent === undefined || longLetMonthlyRent <= 0) {
    return { ok: false, error: "Long-let monthly rent must be a positive number." };
  }

  const data: ReportInput = {
    agencyName,
    agentName,
    propertyAddress,
    neighbourhood: neighbourhood as Neighbourhood,
    bedrooms,
    propertyType,
    managementFeePercent,
    longLetMonthlyRent,
  };
  if (logoRaw) data.logoUrl = logoRaw;
  return { ok: true, data };
}

export function searchParamsToRecord(
  sp: Record<string, string | string[] | undefined>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(sp)) {
    out[k] = v;
  }
  return out;
}
