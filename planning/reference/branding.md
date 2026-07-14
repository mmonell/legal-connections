# Branding — Legal Connections

Source of truth: `Brand Kit.pdf` (repo root), p.5 for palette. This doc mirrors
that PDF for quick reference and maps each color to its CSS token in
`src/public/global.css` (soon `test/public/global.css`).

## Identity

* **Name:** Legal Connections
* **Tagline:** "Connected by Trust"
* **Voice:** energetic, confident, friendly
* **What we are:** a referral network connecting car accident injury victims
  with trusted attorneys and medical professionals — not a law firm. Public
  copy must carry a disclaimer and never promise legal outcomes.
* **Audience:** heavily Spanish-speaking; every user-facing string ships in
  English and Spanish.

## Color Palette

| Swatch | Name | Hex | CSS token | Usage |
| --- | --- | --- | --- | --- |
| 🟩 | Emerald Deep | `#0F2F25` | `--lc-emerald-deep` | Darkest brand green, backgrounds/depth |
| 🟩 | Emerald | `#174D40` | `--lc-emerald` | Primary brand green |
| 🟩 | Emerald Mid | `#2E6B5A` | `--lc-emerald-mid` | Secondary green accents |
| 🟧 | Signature Orange | `#E66A2C` | `--lc-cta` | Conversion CTAs only (buttons, key actions) |
| ⬜ | Off White | `#F1F1EE` | `--lc-offwhite` | Light backgrounds |

Supporting tokens defined in `global.css` beyond the official brand kit
(neutrals for text/UI, not part of the official palette page):

| Token | Hex | Usage |
| --- | --- | --- |
| `--lc-black` | `#0A0A0A` | Dark section backgrounds |
| `--lc-ink` | `#16181D` | Body text |
| `--lc-charcoal` | `#23262D` | Dark hover states |
| `--lc-gray` | `#5B616E` | Secondary text (kickers) |
| `--lc-light` | `#F4F5F7` | Light section backgrounds |
| `--lc-white` | `#FFFFFF` | Base white |
| `--lc-cta-dark` | `#C9581F` | CTA hover/gradient |
| `--lc-whatsapp` | `#25D366` | WhatsApp chat affordance only |

**Rule:** Signature Orange (`--lc-cta`) is reserved for conversion CTAs
(free case evaluation, WhatsApp start, submit buttons) — don't use it as a
decorative accent elsewhere, or it loses its signal as "click here."

## Typography

* Font stack: `--lc-font` → `"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif`

## Logo

* Working assets: `src/public/assets/logo/` (soon `test/public/assets/logo/`)
* Source files: `/Logo` (zips, root of repo)

## Bilingual Requirement

Every user-facing string (buttons, form labels, error messages, disclaimers)
needs an English and a Spanish version — see `src/i18n.js` (soon
`test/public/i18n.js`) for the pattern components follow.
