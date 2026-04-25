import type { Neighbourhood } from "./neighbourhoods";
import type { PropertyType } from "./property-types";

export type ReportInput = {
  agencyName: string;
  agentName: string;
  propertyAddress: string;
  neighbourhood: Neighbourhood;
  bedrooms: number;
  propertyType: PropertyType;
  managementFeePercent: number;
  longLetMonthlyRent: number;
  logoUrl?: string;
};

export type MarketRow = {
  medianNightlyRate: number;
  occupancyPercent: number;
};

export type ReportPayload = ReportInput & {
  medianNightlyRate: number;
  occupancyPercent: number;
  grossShortLetMonthly: number;
  netToLandlordAfterFeeMonthly: number;
  longLetAnnual: number;
  shortLetGrossAnnual: number;
  shortLetNetAnnual: number;
  marketContext: string;
};
