import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PricingBreakdown } from "./types";
import { ALL_CURRENCIES, findCurrency } from "./currencies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-exported mapping for backwards compatibility
export const CURRENCY_SYMBOLS: Record<string, string> = Object.fromEntries(
  ALL_CURRENCIES.map((c) => [c.code, c.symbol])
);

export function getCurrencySymbol(currency: string = "USD"): string {
  return findCurrency(currency)?.symbol || "$";
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const curr = (currency || "USD").toUpperCase();

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    const symbol = getCurrencySymbol(curr);
    return `${symbol}${Number(amount).toLocaleString()}`;
  }
}

export function calculateTierPricing(anchor: number, floor: number, currency: string = "USD"): PricingBreakdown {
  const curr = (currency || "USD").toUpperCase();
  const symbol = getCurrencySymbol(curr);

  // Flat, currency-agnostic defaults
  const defaultAnchor = 2500;
  const defaultFloor = 800;
  const minAnchor = 1000;
  const minDiff = 200;
  const roundStep = 50;

  const safeAnchor = Math.max(anchor || defaultAnchor, minAnchor);
  const safeFloor = Math.min(floor || defaultFloor, safeAnchor - minDiff);

  const rawTarget = safeFloor + (safeAnchor - safeFloor) * 0.45;
  const target = Math.round(rawTarget / roundStep) * roundStep;

  return {
    anchorPrice: safeAnchor,
    targetPrice: target,
    floorPrice: safeFloor,
    currency: curr,
    currencySymbol: symbol,
  };
}
