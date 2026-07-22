# CareerVerse — Design System v1.0

> **Provenance.** The supplied *Frontend UI Experience Bible v1.0* (`CareerVerse.pdf`) is a
> table of contents: it names §21 Color Palette, §22 Typography, §26 Border Radius, §32 Design
> Tokens and so on, but originally specified no values for any of them. This document supplied
> those missing values as proposals, to unblock implementation.
>
> **§21 Color Palette has since been specified.** Every colour in §2 and §3 below is now
> transcribed from it, not proposed — the earlier brass/cyan palette has been fully replaced.
> Typography, radius, spacing, and motion remain **proposals awaiting their sections**.
>
> **Open question.** The Bible's contents name *Part 12 — Dark + Light theme*, but §21 defines
> only one background set. The app is currently built dark-only on that basis. If Part 12
> mandates a light theme, a light palette must be added to §21 before it can be rebuilt.
>
> What *was* directional in the Bible has been honoured: §15 Glassmorphism, §16 Gradients,
> §17 Lighting, Part 13 responsive widths from 320px.
>
> When further values arrive, edit `design-tokens.json` and the whole app follows. No colour,
> font, or spacing value is written anywhere else in the codebase.

---

## 1. Direction — "After hours"

CareerVerse puts a student inside a company before they ever have a job. The app should feel
like the building, not like a course.

The direction is a **city office late at night**: deep blue-black glazing, violet light from
the screens, cool cyan glow off a monitor. This is where the Bible's three visual rules stop
being decoration and become physics — glass is the office glazing, gradients are light falling
off a surface, lighting is the lamp. Every surface in the app is either glass, lit violet, or
screen glow.

The primary brand colour is **violet `#6C5CE7`**, fixed by Bible Part 21. It reads as
premium and AI-native, and it is the single loudest thing in the palette; everything else
stays quiet.

**Signature element — the Employee Badge.** A glass card with a lit violet edge carrying the
user's role, company, tenure ring, and a monospaced employee ID. It is the hero on Home, the
header of Profile, and the face of the Certificate. One object, carrying the whole premise.

---

## 2. Colour

**Every value in this section is transcribed from UI Experience Bible Part 21.** That document
is authoritative; this one only records how its values map onto semantic tokens. No hue may be
added here that does not appear there.

The app is **dark-only**. Part 21 defines one background set and names it "Background", not
"Background (Dark)", so there is no light theme.

### Brand

| Token | Hex | Use |
|---|---|---|
| `brand` | `#6C5CE7` | Primary actions, active tabs, CTAs, progress, selected cards |
| `brandSoft` | `rgba(108,92,231,0.16)` | Selected-chip fill — Primary at low alpha, not a new hue |
| `onBrand` | `#FFFFFF` | Text and icons sitting on brand or the Primary Gradient |

> **Open item.** Part 21 names the primary "Primary 500", which implies a 50–900 ramp that has
> not been supplied. Until it is, there are **no hover or pressed brand tints** — press feedback
> is a scale transform plus `opacity.pressed`, which is how `Button` already worked.

### Accent — monitor glow

| Token | Hex | Use |
|---|---|---|
| `accent` | `#00C2FF` | AI assistant, analytics, information badges |

`accent` is reserved for **the AI manager and anything the system says**. Brand violet is the
user's own agency. Keeping these separate is a rule, not a preference.

### Surfaces

| Token | Hex | Use |
|---|---|---|
| `bg` | `#0B1020` | App background |
| `surface` | `#151C2F` | Cards, sheets, tab bar |
| `card` | `#1F2937` | Raised cards, inputs, pills |
| `divider` | `#2B3447` | Hairlines, rules, inactive indicators |
| `glass` | `rgba(255,255,255,0.06)` | Glass fill |
| `glassBorder` | `rgba(255,255,255,0.12)` | Glass top edge |

> `glass`, `glassBorder`, `lightEdge`, and `scrim` are translucency effects, not hues. They tint
> whatever sits beneath them and introduce no colour of their own, so Part 21's palette rule holds.

### Text

Contrast measured against `bg` `#0B1020`.

| Token | Hex | Contrast on `bg` | Verdict |
|---|---|---|---|
| `textPrimary` | `#FFFFFF` | 18.93:1 | AAA |
| `textSecondary` | `#B6C2D9` | 10.56:1 | AAA |
| `textCaption` | `#94A3B8` | 7.38:1 | AAA |
| `textDisabled` | `#6B7280` | 3.92:1 | Below AA — disabled only |

> `textDisabled` sits under the 4.5:1 body-text floor. WCAG 1.4.3 exempts inactive controls, so
> this is compliant **only** while the token stays on disabled elements. Never use it for
> live body copy.

### Semantic

| Token | Hex |
|---|---|
| `success` | `#22C55E` |
| `warning` | `#F59E0B` |
| `danger` | `#EF4444` |
| `info` | `#00C2FF` |

> **Collision rule.** Semantic colours may only appear on status pills, never on buttons or large
> fills. Brand violet is never a status.

---

## 3. Gradients & lighting (Bible Part 21)

**One gradient**, until the official gradient library is supplied. More reads as decoration.

| Name | Definition | Use |
|---|---|---|
| `primary` | `#7C3AED → #5B21B6`, 135° | Hero banners, premium cards, career highlights, dashboard header, primary buttons |

> The `glow` and `depth` gradients were removed — neither appears in Part 21. `Screen gradient`
> now paints the Primary Gradient as a header wash; everything else falls back to flat `bg`.

**Lighting rule.** Light comes from the top. Raised surfaces get a 1px `rgba(255,255,255,0.10)`
top border and a downward shadow. Never light from below.

**Contrast on the gradient.** `#FFFFFF` measures 5.70:1 on the gradient start `#7C3AED` and
rises toward the end stop, so button labels clear AA across the whole sweep.

---

## 4. Typography

Three faces, three jobs. Loaded via `@expo-google-fonts`.

| Role | Face | Why |
|---|---|---|
| Display | **Space Grotesk** | Geometric with odd, characterful terminals — technical without being cold |
| Body | **Inter** | The most legible UI face at small sizes on both platforms |
| Data | **JetBrains Mono** | Employee IDs, mission codes, timers, countdowns |

The mono face is the detail that sells the premise. Anything the *company* assigns you — an ID,
a ticket number, a deadline — is set in mono. Anything you write is set in Inter.

### Scale

| Token | Size / Line | Weight | Face |
|---|---|---|---|
| `display` | 34 / 40 | 700 | Space Grotesk |
| `h1` | 28 / 34 | 700 | Space Grotesk |
| `h2` | 22 / 28 | 600 | Space Grotesk |
| `h3` | 18 / 24 | 600 | Inter |
| `body` | 16 / 24 | 400 | Inter |
| `bodyMd` | 16 / 24 | 500 | Inter |
| `sm` | 14 / 20 | 400 | Inter |
| `xs` | 12 / 16 | 500 | Inter |
| `mono` | 13 / 18 | 500 | JetBrains Mono, `letterSpacing: 0.5` |
| `label` | 11 / 14 | 600 | Inter, uppercase, `letterSpacing: 1.2` |

Body text never goes below 14. `xs` is for labels and metadata only.

---

## 5. Spacing

4pt base. Use tokens, never raw numbers.

`0:0` · `1:4` · `2:8` · `3:12` · `4:16` · `5:20` · `6:24` · `8:32` · `10:40` · `12:48` · `16:64`

| Rule | Value |
|---|---|
| Screen horizontal padding | `5` (20) |
| Section gap | `8` (32) |
| Card internal padding | `4` (16) |
| Card-to-card gap | `3` (12) |
| Related elements | `2` (8) |

---

## 6. Radius, elevation, shadow

| Token | Value | Use |
|---|---|---|
| `sm` | 8 | Chips, pills, small inputs |
| `md` | 12 | Buttons, inputs |
| `lg` | 16 | Cards |
| `xl` | 24 | Sheets, modals, badge |
| `full` | 999 | Avatars, progress rings |

| Level | Shadow | Use |
|---|---|---|
| `e0` | none | Flat on background |
| `e1` | `y2 blur8 rgba(0,0,0,0.24)` | Cards |
| `e2` | `y6 blur18 rgba(0,0,0,0.32)` | Raised, FAB |
| `e3` | `y12 blur32 rgba(0,0,0,0.44)` | Sheets, modals |
| `brand` | `y4 blur16 rgba(108,92,231,0.32)` | Primary button only |

Android maps to `elevation: 2 / 6 / 12`.

---

## 7. Motion

| Token | Duration | Curve |
|---|---|---|
| `fast` | 140ms | `ease-out` |
| `base` | 220ms | `ease-out` |
| `slow` | 360ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `spring` | — | `damping 18, stiffness 180` |

Press feedback: `scale 0.97`, `fast`. Screen transitions: slide + fade, `base`.
Mission complete and achievement unlock are the only places a celebratory animation is allowed.

**All motion respects `prefers-reduced-motion` / `AccessibilityInfo.isReduceMotionEnabled`** —
transforms collapse to opacity-only.

---

## 8. Accessibility floor (Bible Part 11)

- Body text ≥ 4.5:1, non-text ≥ 3:1. **All 20 gated pairs are machine-verified** — see
  `npm run check:contrast`, which reads `design-tokens.json` directly and fails the build
  on any regression.
- **`brand` is not a body-text colour.** Primary 500 measures 3.90:1 on `bg` and 3.02:1 on
  `card` — valid for active-tab tints, icons, and indicators, never for running text. The
  documented 50–900 ramp will supply a lighter tint for text use.
- **One unresolved conflict:** `error` on `card` is 3.90:1, below AA. It prints as WARN on
  every contrast run and needs a Part 21 decision, not a code change.
- Touch targets ≥ 44×44pt
- Focus ring: 2px `accent.500` at 60% with a 2px offset
- Every icon-only control carries `accessibilityLabel` and `accessibilityRole`
- Type scales with OS font size; layouts use flex, never fixed text heights
- Colour is never the only signal — status always pairs a colour with an icon or a word

## 9. Responsive (Bible Part 13)

| Width | Behaviour |
|---|---|
| 320 | Floor. Cards full-bleed, padding drops to `4` (16) |
| 360–412 | Reference range. Design target is 390 |
| ≥ 600 (tablet) | Content column caps at 560 and centres |
| Landscape | Blocked outside the Document Viewer and Performance Graph |

## 10. Rules for extending this system

1. No colour, font size, or spacing value is written outside `design-tokens.json`.
2. New surfaces compose existing tokens. Never a new hex — Part 21 is the only source of hues.
3. New components ship with all five states: default, loading, empty, error, success.
4. Violet means the user acts. Cyan means the system speaks. Never mix them.
5. Spend boldness once per screen. If two things compete for attention, one is wrong.
