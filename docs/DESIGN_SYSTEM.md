# CareerVerse — Design System v1.0

> **Provenance.** The supplied *Frontend UI Experience Bible v1.0* (`CareerVerse.pdf`) is a
> table of contents: it names §21 Color Palette, §22 Typography, §26 Border Radius, §32 Design
> Tokens and so on, but specifies no values for any of them. This document supplies those
> missing values. It was authored to unblock implementation and is **subject to your review** —
> every value is a proposal, not a fact.
>
> What *was* directional in the Bible has been honoured: §15 Glassmorphism, §16 Gradients,
> §17 Lighting, Part 12 Dark + Light theme, Part 13 responsive widths from 320px.
>
> When real values arrive, replace `src/theme/tokens.ts` and the whole app follows. No colour,
> font, or spacing value is written anywhere else in the codebase.

---

## 1. Direction — "After hours"

CareerVerse puts a student inside a company before they ever have a job. The app should feel
like the building, not like a course.

The direction is a **city office late at night**: deep blue-black glazing, warm brass light
from a desk lamp, cool glow off a monitor. This is where the Bible's three visual rules stop
being decoration and become physics — glass is the office glazing, gradients are light falling
off a surface, lighting is the lamp. Every surface in the app is either glass, lit brass, or
screen glow.

**The deliberate risk:** the primary brand colour is **brass**, not the indigo-violet that
almost every AI product reaches for. Brass reads as nameplate, lift button, award — corporate
and earned. It is the single loudest thing in the palette; everything else stays quiet.

**Signature element — the Employee Badge.** A glass card with a lit brass edge carrying the
user's role, company, tenure ring, and a monospaced employee ID. It is the hero on Home, the
header of Profile, and the face of the Certificate. One object, carrying the whole premise.

---

## 2. Colour

Dark is the primary theme. Light is a supported alternative, not the default.

### Brand

| Token | Hex | Use |
|---|---|---|
| `brand.500` | `#D9A441` | Primary actions, active states, the badge edge |
| `brand.400` | `#E8BC6B` | Hover / pressed lift |
| `brand.600` | `#B8862F` | Pressed depth, gradient end |
| `brand.muted` | `#3A2F1A` | Brass at 12% over ink — quiet fills |

### Accent — monitor glow

| Token | Hex | Use |
|---|---|---|
| `accent.500` | `#4FD1E0` | AI voice, links, focus rings, data viz |
| `accent.muted` | `#16323A` | Accent fills |

`accent` is reserved for **the AI manager and anything the system says**. Brass is the user's
own agency. Keeping these separate is a rule, not a preference.

### Surfaces (dark)

| Token | Hex | Use |
|---|---|---|
| `bg` | `#080C16` | App background |
| `surface.1` | `#0E1424` | Cards, sheets |
| `surface.2` | `#161E32` | Raised cards, inputs |
| `surface.3` | `#202A44` | Pressed, dividers-on-raised |
| `border` | `#243049` | Hairlines |
| `glass` | `rgba(255,255,255,0.06)` | Glass fill |
| `glassBorder` | `rgba(255,255,255,0.12)` | Glass top edge |

### Text (dark)

| Token | Hex | Contrast on `bg` |
|---|---|---|
| `text.primary` | `#F2F5FA` | 17.88:1 |
| `text.secondary` | `#A7B3C7` | 9.23:1 |
| `text.tertiary` | `#79879D` | 5.37:1 (4.55:1 on `surface.2`) |
| `text.inverse` | `#080C16` | 8.69:1 on brass |

> `text.tertiary` was originally `#6B7A92`. Measurement put it at 4.49:1 on `bg` and
> 3.81:1 on `surface.2` — both below AA. It was lightened to the value above.

### Semantic

| Token | Hex |
|---|---|
| `success` | `#3DD68C` |
| `warning` | `#FF8A3D` |
| `danger` | `#FF5C6C` |
| `info` | `#4FD1E0` |

> **Collision rule.** `warning` is orange, `brand` is brass — close in hue. Semantic colours may
> only appear on status pills, never on buttons or large fills. Brass is never a status.

### Light theme

| Token | Hex |
|---|---|
| `bg` | `#F7F8FB` |
| `surface.1` | `#FFFFFF` |
| `surface.2` | `#F0F2F7` |
| `border` | `#DFE4ED` |
| `text.primary` | `#0C1220` |
| `text.secondary` | `#4A566B` |
| `brand.500` | `#9A6E1C` (darkened for 4.6:1 on white) |

---

## 3. Gradients & lighting (Bible §16, §17)

Three gradients only. More than three reads as decoration.

| Name | Definition | Use |
|---|---|---|
| `brass` | `#E8BC6B → #B8862F`, 135° | Primary buttons, badge edge |
| `glow` | `#4FD1E0 @18% → transparent`, radial | Behind AI avatar, active ring |
| `depth` | `#0E1424 → #080C16`, 180° | Screen backgrounds, sheet tops |

**Lighting rule.** Light comes from the top. Raised surfaces get a 1px `rgba(255,255,255,0.10)`
top border and a downward shadow. Never light from below.

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
| `brass` | `y4 blur16 rgba(217,164,65,0.32)` | Primary button only |

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

- Body text ≥ 4.5:1. **All 17 foreground/background pairs are machine-verified** — see
  `npm run check:contrast`. Three tokens were corrected after the first run failed
  (`text.tertiary` in both themes, and the light-mode `accent`).
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

1. No colour, font size, or spacing value is written outside `src/theme/tokens.ts`.
2. New surfaces compose existing tokens. Never a new hex.
3. New components ship with all five states: default, loading, empty, error, success.
4. Brass means the user acts. Cyan means the system speaks. Never mix them.
5. Spend boldness once per screen. If two things compete for attention, one is wrong.
