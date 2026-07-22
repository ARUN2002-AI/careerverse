#!/usr/bin/env node
/**
 * Verifies every foreground/background pair in the design system against WCAG AA.
 *
 * Reads design-tokens.json directly, so it fails the moment someone edits a colour
 * below threshold. Run with `npm run check:contrast`.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { palette: p } = JSON.parse(readFileSync(join(root, 'design-tokens.json'), 'utf8'));

const luminance = (hex) => {
  const h = hex.replace('#', '');
  const chan = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
};

const ratio = (a, b) => {
  const [la, lb] = [luminance(a), luminance(b)];
  return ((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(2);
};

/** WCAG 1.4.3 body text. */
const AA_TEXT = 4.5;
/** WCAG 1.4.11 non-text contrast — UI components, indicators, and large text. */
const AA_UI = 3.0;

/** Body copy. These must clear 4.5:1 or the build fails. */
const TEXT_PAIRS = [
  ['body on bg', p.textPrimary, p.bg],
  ['body on surface', p.textPrimary, p.surface],
  ['body on card', p.textPrimary, p.card],
  ['secondary on bg', p.textSecondary, p.bg],
  ['secondary on card', p.textSecondary, p.card],
  ['caption on bg', p.textCaption, p.bg],
  ['caption on card', p.textCaption, p.card],
  ['onBrand on brand', p.textPrimary, p.primary500],
  ['onBrand on gradient start', p.textPrimary, p.gradientStart],
  ['onBrand on gradient end', p.textPrimary, p.gradientEnd],
  ['accent on bg', p.secondary, p.bg],
  ['accent on card', p.secondary, p.card],
  ['success on card', p.success, p.card],
  ['warning on card', p.warning, p.card],
  ['error on bg', p.error, p.bg],
  ['error on surface', p.error, p.surface],
];

/**
 * Non-text and exempt pairs, held to 3:1.
 *
 * `brand on *` is here deliberately: Primary 500 measures below 4.5:1 on every surface,
 * so it is valid as an active-tab tint, indicator, or icon, but NOT as body copy. The
 * documented 50-900 ramp will supply a lighter tint for text use.
 *
 * `disabled on *` is exempt under WCAG 1.4.3, which excludes inactive controls.
 */
const UI_PAIRS = [
  ['brand on bg', p.primary500, p.bg],
  ['brand on surface', p.primary500, p.surface],
  ['brand on card', p.primary500, p.card],
  ['disabled on bg', p.textDisabled, p.bg],
];

/**
 * Unresolved conflicts between Part 21's fixed hues and WCAG AA. These print as WARN
 * rather than FAIL because no fix exists that does not invent an unapproved colour —
 * resolving them needs a spec decision, not a code change. Do not add entries here to
 * silence a failure you could fix by recomposing existing tokens.
 */
const KNOWN_CONFLICTS = [
  [
    'error on card',
    p.error,
    p.card,
    AA_TEXT,
    'Status pills fill with `card`. Needs either a lighter error tint in Part 21 or a rule that error tone never appears on `card`.',
  ],
];

let failed = 0;

const run = (label, pairs, threshold) => {
  console.log(`\n${label} (>= ${threshold}:1)`);
  for (const [name, fg, bg] of pairs) {
    const r = Number(ratio(fg, bg));
    const ok = r >= threshold;
    if (!ok) failed += 1;
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  ${name}`);
  }
};

run('Body text — WCAG 1.4.3', TEXT_PAIRS, AA_TEXT);
run('Non-text & exempt — WCAG 1.4.11', UI_PAIRS, AA_UI);

if (KNOWN_CONFLICTS.length) {
  console.log('\nUnresolved spec conflicts (awaiting a Part 21 decision)');
  for (const [name, fg, bg, threshold, note] of KNOWN_CONFLICTS) {
    console.log(`  WARN  ${ratio(fg, bg).padStart(5)}:1  ${name} (needs ${threshold}:1)`);
    console.log(`        ${note}`);
  }
}

const total = TEXT_PAIRS.length + UI_PAIRS.length;
console.log(`\n${total - failed}/${total} gated pairs pass.`);

if (failed > 0) {
  console.error(`\n${failed} pair(s) below threshold. Adjust design-tokens.json.`);
  process.exit(1);
}
