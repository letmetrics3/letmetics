const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const gbpWithDecimals = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatGbp(value: number): string {
  return gbp.format(Math.round(value));
}

export function formatGbpDetailed(value: number): string {
  return gbpWithDecimals.format(value);
}
