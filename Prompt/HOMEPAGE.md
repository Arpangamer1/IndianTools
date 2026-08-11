# HOMEPAGE.md — Landing Page Design Brief

## 1. Positioning

IndianTools isn't just a utility site — it's positioned as **India's entry in
the online tools space**, built with the same polish as any global SaaS
product. The homepage should communicate this quietly through craft and
identity, not through flags-and-fanfare. The tools work for anyone,
anywhere — the Indian identity is a point of pride and origin story, not a
gate on who it's for.

Suggested headline directions:
- "Built in India. Free for everyone."
- "India's own file toolkit."
- "Convert anything. Nothing ever leaves your device." (privacy-first angle,
  with a smaller line underneath: "Proudly built in India 🇮🇳")

Optional bilingual touch — a short Hindi line under the English tagline adds
genuine character without being a gimmick, e.g. a subhead like
"भारत में बना, दुनिया के लिए" (made in India, for the world) in a lighter
weight beneath the main English tagline. Keep it to one line, one place —
don't bilingual-ize the whole site for v1.

## 2. Important Legal Note on Flag/Emblem Use

India's Emblems and Names (Prevention of Improper Use) Act and the Flag Code
restrict commercial/trade use of the **official** National Flag and the
Ashoka Chakra emblem specifically. To stay safely on the right side of this:

- Use the **tricolor as a color palette** (saffron / a neutral instead of
  white / green) — this is common practice across Indian consumer brands and
  is not the same as reproducing the flag itself.
- Do **not** render an actual rectangular tricolor flag graphic, and do not
  reproduce the Ashoka Chakra (the navy wheel) anywhere on the site.
- The subtle 3-segment stripe already in your logo (saffron / gray / green,
  as thin separate bars, not a flag shape) is the safe pattern to keep
  reusing — it evokes the identity without depicting the protected emblem.

## 3. Hero Section

```
Header (logo, nav, login)
─────────────────────────────
        [3D PDF icon graphic]     ← see §4
        Headline (H1)
        Subheadline
        [ Search / jump-to-tool box ]
        small trust line: "24 tools · 100% free · nothing uploaded"
─────────────────────────────
```

Keep the hero otherwise exactly as minimal as originally planned — the 3D
graphic and tricolor stripe are the only "decoration" on the entire page.
No background gradients, no pattern-fill behind the hero.

## 4. The "3D-Look" PDF Icon — Static, No Library, Pure CSS/SVG

**Confirmed approach: no Three.js, no Lottie, no animation library, no
motion at all.** This is a single static graphic that *looks* three-
dimensional through shading and gradients only — built as one SVG (or
exported PNG/WebP), rendered like any other image in the React app. Zero
added dependencies, zero extra JS, zero animation.

**How the 3D look is faked, with plain SVG/CSS:**
- A soft drop shadow beneath the page shape (SVG `feGaussianBlur` filter, or
  a CSS `box-shadow` if built as a styled div instead) — this alone does most
  of the work of making a flat shape read as "lifted off the page."
- A subtle linear gradient across the page face (slightly lighter top-left,
  slightly darker bottom-right) to suggest a bevel/light source, instead of
  a single flat fill color.
- The folded top corner rendered as a slightly darker shade than the page
  body — a simple visual trick that reads as "this corner is folded over
  and casting its own tiny shadow," with no actual 3D geometry involved.
- That's it. No rotation, no parallax, no hover tilt, no scroll animation.

This ships as a plain `<img>` (or inlined `<svg>`) in the hero — same
performance profile as any other static image on the page.

**Indian visual character (not cliché "Incredible India" tourist imagery,
not the flag/emblem):**
- A thin vertical accent edge on the page's left side, in a soft
  saffron-to-green gradient — a color cue, not a flag shape (same "don't
  combine all three colors into one solid block" rule as §6 below).
- A very faint, low-opacity **jali (lattice) pattern** — the small repeating
  diamond/geometric perforation pattern seen in Indian stone latticework —
  used only as a thin decorative strip along the bottom edge of the icon.
  This is a genuine, non-stereotyped design motif rather than a stock
  "temple/elephant/mandala" cliché, and it stays quiet enough not to
  compete with the minimalist aesthetic.
- "PDF" mark in the center in the same charcoal used everywhere else on the
  site — the icon should still read as *your* brand icon first, Indian
  motif second.

A ready-to-use version of this exact icon (`pdf-icon-3d.svg`) is attached
below — drop it straight into the hero as a static image.

## 5. Below-the-Fold Sections

```
Hero (§3)
─────────────────────────────
Tool grid — "PDF Tools" / "Image Tools" (as in PAGE_STRUCTURE.md)
─────────────────────────────
Ad slot #1 (per PAGE_STRUCTURE.md)
─────────────────────────────
"Why IndianTools" — 3 short value props, plain text + icon, no cards-with-
  shadow overload:
    • "Nothing is uploaded" — all conversions run in your browser
    • "Free, no limits" — no paywalls, no sign-up required to convert
    • "Built in India" — one line on the team/story, links to /about
─────────────────────────────
Ad slot #2
─────────────────────────────
Footer (with the tricolor stripe accent from the logo, used once, thin,
  under the footer nav — not spanning the full page width)
```

## 6. Color Usage Table (extends MASTER_PROMPT.md §4)

| Element | Color | Notes |
|---|---|---|
| Body text | `#1F2937` (charcoal) | primary text color everywhere |
| Accent / CTA / links | `#E8630A` (saffron) | used sparingly — buttons, active states, "Tools" in wordmark |
| Secondary accent | `#138808` (green) | used only in the 3-segment stripe, never as a large fill |
| Neutral accent | `#9CA3AF` (gray) | middle segment of the stripe, standing in for white-on-white |
| Backgrounds | white / near-white | no gradient backgrounds anywhere |

The stripe (saffron/gray/green, three short separate bars) is the *only*
place all three brand colors appear together — never combine all three in a
single solid shape, to avoid resembling the flag itself.

## 7. Accessibility & Performance Checklist for the Hero

- [ ] 3D-look icon is a plain static image/SVG — no animation, so nothing to
      gate behind `prefers-reduced-motion`
- [ ] Icon has explicit width/height reserved before load (no CLS)
- [ ] Hero headline is real text (not baked into the image) — needed for SEO
      and screen readers
- [ ] Hindi subhead (if used) has `lang="hi"` attribute for correct screen
      reader pronunciation
- [ ] Search/jump-to-tool box is keyboard accessible and is the first
      focusable element after the logo (skip-link friendly)
