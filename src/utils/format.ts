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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * A stored epoch-ms timestamp -> "22 Jul 2026". We build the string from the Date's parts
 * rather than `toLocaleDateString` so the output is identical on every device and engine.
 * This reads a persisted value, never the live clock, so it stays deterministic per run.
 */
export function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Simulated working-day counter -> a tenure label. Five working days to a week. */
export function tenureLabel(day: number): string {
  if (day <= 1) return 'First day';
  if (day < 5) return `Day ${day}`;
  const weeks = Math.floor(day / 5);
  return weeks === 1 ? '1 week in' : `${weeks} weeks in`;
}
