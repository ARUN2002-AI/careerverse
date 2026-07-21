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
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const AA = 4.5;

const PAIRS = [
  ['dark  body on bg', p.textDark, p.ink],
  ['dark  secondary on bg', p.textDarkMuted, p.ink],
  ['dark  tertiary on bg', p.textDarkFaint, p.ink],
  ['dark  tertiary on surface2', p.textDarkFaint, p.navy2],
  ['dark  brand on bg', p.brass500, p.ink],
  ['dark  accent on bg', p.cyan500, p.ink],
  ['dark  onBrand on brand', p.ink, p.brass500],
  ['dark  danger on bg', p.danger, p.ink],
  ['dark  success on bg', p.success, p.ink],
  ['dark  warning on bg', p.warning, p.ink],
  ['light body on bg', p.textLight, p.paper],
  ['light secondary on bg', p.textLightMuted, p.paper],
  ['light tertiary on bg', p.textLightFaint, p.paper],
  ['light tertiary on white', p.textLightFaint, p.white],
  ['light brand on white', p.brassDark, p.white],
  ['light onBrand on brand', p.white, p.brassDark],
  ['light accent on bg', p.cyanDark, p.paper],
  ['light danger on bg', p.dangerDark, p.paper],
];

let failed = 0;
for (const [name, fg, bg] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= AA;
  if (!ok) failed += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  ${name}`);
}

console.log(`\n${PAIRS.length - failed}/${PAIRS.length} pass at WCAG AA (${AA}:1)`);

if (failed > 0) {
  console.error(`\n${failed} pair(s) below AA. Adjust design-tokens.json.`);
  process.exit(1);
}
