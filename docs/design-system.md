# TripCollab — Design System ("Wayline")

> **Purpose:** Define TripCollab's **original** visual language so we never clone a competitor, and so every future screen is consistent, accessible, and premium. **This is a principles + tokens spec, not app code.** The design language is named **`Wayline`** — a nod to the journey, the route, and the line we draw through the world.

## 1. Design principles

1. **A line through the world (`Wayline`)** — the visual metaphor is a continuous, flowing route line connecting places, people, and moments. It appears as a subtle path/arc in wayfinding, progress, and connection moments (group matching, itinerary, settle-up, 3D flow). It is decorative and never substitutes for function.
2. **Group-first clarity** — surfaces are designed to read for a *group*: who's going, who's paying, what's decided. Identity chips, avatars, and split indicators are first-class, not footnotes.
3. **Trust by construction** — real photography, verified-guide badges, and provenance cues are *visual trust markers*. No AI imagery. Nothing that looks stock.
4. **Calm premium, not cluttered dense** — generous whitespace, restrained palettes, one leading color, quiet gradients. We do **not** copy OTAs' dense, promo-heavy, conversion-max layouts.
5. **Mobile-first, thumb-first** — bottom tabs, primary CTA low, 44px targets, single primary action.
6. **Accessible by default** — WCAG 2.2 AA. Contrast, focus order, reduced motion, and text-always carry meaning.
7. **Progressive & optional immersion** — the signature "lightweight 3D" is opt-in and degrades to a static 2D fallback. Core function is never gated behind immersion.

## 2. Brand colour system

The palette is **grounded and warm-premium**: deep horizon ink, warm earth neutrals, a single signature **waypoint teal** as the leading colour, and an **amber** for advisory/attention (budget → a careful, not alarming, accent). We avoid competitor signifiers: no Booking blue-dense, no Airbnb coral, no Skyscanner/Google blue-metasearch, no GetYourGuide red.

### Core tokens

| Token | Value | Role |
|---|---|---|
| `--wp-ink` | `#12242B` | Primary text / deep horizon. |
| `--wp-ink-soft` | `#3A5059` | Secondary text. |
| `--wp-waypoint` | `#0E7C86` | **Signature teal** — brand, primary CTAs, active states, the "wayline". |
| `--wp-waypoint-deep` | `#0A5A62` | Hover/pressed for `waypoint`; darker link. |
| `--wp-waypoint-soft` | `#D9EEF0` | Tinted background / selected chips / info. |
| `--wp-amber` | `#B9770E` | Advisory / budget attention (not alarm red). |
| `--wp-amber-soft` | `#FBF1DD` | Advisory tinted background. |
| `--wp-verify` | `#2E7D4F` | Verified-guide / trust green. |
| `--wp-verify-soft` | `#DFEFE7` | Verified tint. |
| `--wp-surface` | `#FFFFFF` | Card / sheet surface. |
| `--wp-surface-2` | `#F5F7F8` | Subtle raised / alternate surface. |
| `--wp-canvas` | `#EAEEF0` | Page canvas (very light cool grey). |
| `--wp-line` | `#D7DEE1` | Divider / hairline borders. |
| `--wp-danger` | `#B3261E` | Destructive / error (sparingly). |
| `--wp-on-ink` | `#FFFFFF` | Text on dark surfaces. |

### Semantic usage
- **Primary CTA:** `--wp-waypoint` background, white text.
- **Secondary / tertiary:** tinted or outlined with `--wp-waypoint`.
- **Advisory (budget feasibility / recommendation):** `--wp-amber` accents; reserve red for destructive errors only.
- **Verified trust:** `--wp-verify` for guide-verified badges and trust marks.

### Accessibility (colour) rules
- Text on `--wp-ink`/`--wp-surface` meets **≥ 4.5:1**.
- `--wp-amber (#B9770E)` on white is ~4.6:1 — adequate for large text/icons; **do not use amber small body text on white**; use `--wp-ink-soft` for body and amber only for emphasis/accents.
- Use `--wp-verify` for icons/badges paired with visible labels (never colour alone).
- Provide a **high-contrast focus ring** (`--wp-ink` outline) and strong focus states.

## 3. Typography

The **typeface subsystem** supports the premium feel and accessibility. (Actual font files/assets are the concern of `asset-strategy.md`; here we define roles and metrics.)

- **Display / Headings:** a modern humanist sans with a touch of warmth (e.g., a variable sans). Used for brand moments, trip names, section titles. Large, letter-spaced slightly negative.
- **UI / Body:** a clean geometric/neo-grotesque sans, highly legible at small sizes. Primary for all body and controls.
- **Numeric / Tabular:** for prices, budgets, times, split amounts — use **tabular figures** so columns align. This matters for the shared-cost workspace.
- **Serif (opt-in, editorial):** reserved for long-form *local culture* editorial/narrative content (a "story" moment) — optional.

### Type scale (mobile-first, base 16px)

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `--tp-d1` | 32/1.2 | 700 | Hero / big moment (trip cover) |
| `--tp-d2` | 26/1.25 | 700 | Screen title |
| `--tp-h1` | 22/1.3 | 700 | Section / card title |
| `--tp-h2` | 18/1.35 | 600 | Sub-section, list title |
| `--tp-body` | 16/1.5 | 400 | Body (base) |
| `--tp-body-sm` | 14/1.5 | 400 | Secondary / meta text |
| `--tp-caption` | 12/1.4 | 500 | Captions, labels, timestamps |
| `--tp-btn` | 15/1.2 | 600 | Buttons & controls |

**Rules:**
- Base font-size 16px; nothing below 12px; avoid caps-for-all-caps in body (use sentence case).
- Tabular numbers for all money/time.
- Ample line-height (≥1.4) and letter-spacing appropriate to size.
- RTL-ready; set `direction` support and locale-aware line breaks.

## 4. Spacing, layout, & grid

- **8pt base scale:** 4, 8, 12, 16, 24, 32, 48, 64. Consistent rhythm.
- **Mobile** uses a **4-column** grid with long vertical scroll, generous 16px gutters.
- **Tablet** 8–12 columns; **desktop** 12-column grid with a max content width (~1200–1280px).
- **Vertical rhythm:** sections separated by 24/32px; cards with 16px internal padding; 8px between related controls.
- **Cards** use 12–16px radius, subtle hairline border, and a soft shadow (never heavy).
- **Focus order** follows visual order; logical, keyboard-navigable.

## 5. Components (pattern inventory, abstract)

These are **patterns to specify**, not implementation:

- **TripCard** — cover (real photo), trip name, dates, destinations, participants (avatar cluster), budget status. Primary entry into a trip.
- **ItineraryItem** — timeline card: time, type icon, title, location, optional cost chip, guide/verified badge, comment/vote count.
- **TravellerChip / AvatarCluster** — identity; shows per-person split share or status.
- **CostLine** — amount, payer, split-rule, per-person share, currency; inline edit triggers; settle-up status.
- **BudgetPanel** — plan budget vs estimated vs actual; status pill (Feasible / Tight / Over); the **recommendation** callout (amber advisory).
- **CompatibilityCard** — score ring + dimensional breakdown (interests, budget, pace, language, dates); "Request to join"/"Invite".
- **BudgetCollabMoment** — the signature pooling visual: two (or more) group "budget chips" (₹1,500 + ₹1,500) merge along a `Wayline` into a combined budget (₹3,000) with the shared accommodation/transport it unlocks. Explains *why* the group fits and what becomes affordable together. Calm, celebratory, not gimmicky.
- **GuideCard** — verified guide: real photo, credentials badge (`verified`), specialties, languages, location, reviews, availability "Book".
- **HiddenPlaceCard** — real photo, category, "hidden" tag, provenance/attribution, save-to-trip.
- **RouteWayline** — the signature decorative path/arc used in trip overview, multi-leg itinerary summaries, matching connections, settle-up, and 3D flow.
- **BottomTabBar** — Trips / Discover / Match / Budget / Profile (mobile spine).
- **PrimaryButton / SecondaryButton / TertiaryLink** — teal primary, tinted/outlined secondary, text link.
- **StatusPill** — feasible/tight/over, verified, pending, confirmed; colour + label + icon (never colour alone).
- **Field & Stepper** — for split rules, budgets, dates; accessible labels; tabular numeric inputs.
- **Skeleton / EmptyState / OfflineNote** — perceptual loading; friendly empty states; offline-aware states.
- **Toast / Snackbar** — non-blocking confirmations (e.g., "Cost added · ₹1,240 split equally").
- **StaticFallback (for 3D feature)** — a 2D map/list representation that preserves all info.

## 6. Motion

- **Purposeful, calm, reversible.** 150–250ms ease-out for most; respect `prefers-reduced-motion` (disable/replace with opacity).
- **The "wayline" animates** only as a short delight moment (trip creation, match success) — never in a way that hides state.
- No motion is required to understand the UI; gesture/parallax are optional enhancements.

## 7. Imagery & iconography

- **Real photography only** (see `asset-strategy.md`). Ratios: 3:2 for places, 1:1 for avatars/guides. Real, unedited-feel, human.
- **Iconography:** a consistent, thin-line geometric set matching `Wayline`; 24px grid; stroke weight consistent; every icon has a text label or `aria-label` (never icon-only for critical meaning).
- **Decorative vs meaningful:** decorative imagery uses empty `alt`; a photo that conveys info (e.g., "the plaza is narrow") gets meaningful alt.
- **Verified marks** use the trust green + visible "Verified" label.

## 8. Accessibility summary (WCAG 2.2 AA)

- Contrast ≥ 4.5:1 (text), ≥ 3:1 (large text & UI components).
- Focus states visible; focus order logical; full keyboard operability.
- Touch targets ≥ 44×44px.
- Text ≥ 12px; base 16px; tabular numbers.
- `prefers-reduced-motion`: disable non-essential motion.
- Colour alone never conveys meaning; always pair with label/icon/text.
- Screen-reader-friendly semantics; live regions for async updates (e.g., cost updates, match results).
- Forms: accessible labels, error messages linked to inputs, error not colour-only.

## 9. "Do NOT copy" guardrails (concrete)

- **No** Booking.com blue-dense layout, no dense promo grids.
- **No** Airbnb coral-pink palette or its "belonging pink" marketing motifs.
- **No** Skyscanner / Google Flights blue flight-metasearch styling.
- **No** GetYourGuide red activity-marketplace theme.
- **No** Wanderlog's exact map+list arrangement pixel-for-pixel (reuse pattern, not pixels).
- **No** Atlas Obscura's editorial-dark aesthetic borrowed wholesale (borrow mission + map-first idea).
- Default to the **`Wayline`** palette (teal + warm neutrals + amber advisory) for all new work.

## 10. Design-system governance

- **Tokens live in one place** (a design token source of truth; to be added in the implementation milestone). Names follow BEM-ish `--wp-*` convention.
- **Component spec** per pattern documented before/with implementation.
- **Accessibility** is a merge gate (automated axe + manual review in later milestones).
- **Do not introduce** a new color, spacing, or type token ad-hoc; extend the scale deliberately and document it.
- **Design-debt prevention:** all screens reference tokens, not raw values.
