export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Terraced House",
  "Semi-Detached",
  "Detached",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
