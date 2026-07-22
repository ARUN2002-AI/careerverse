/**
 * Small, locale-independent formatters. We avoid `toLocaleString` so output is identical on
 * every device and JS engine (Hermes included).
 */

/** 30000 -> "30,000". Rounds to a whole number first. */
export function withThousands(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
};

/** 30000, "USD" -> "$30,000". Falls back to a trailing code for unknown currencies. */
export function formatMoney(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return symbol ? `${symbol}${withThousands(amount)}` : `${withThousands(amount)} ${currency}`;
}

/** "problem_solving" | "ui-ux" -> "Problem Solving" | "Ui Ux". For labels derived from data. */
export function titleCase(value: string): string {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
