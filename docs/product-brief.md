# TripCollab — Product Brief

> **Status:** Milestone 1 (Research & Design Foundation) · **Owner:** Product + Design
> **Note on naming:** The product brand is **TripCollab**. The working repository is currently identified as `Travilla` (a pre-existing, internal working name). All product-facing copy, this document set, and the design system use **TripCollab**. See the *Contradiction Review* at the end of this doc set for the rename decision we need from the owner.

---

## 1. One-line definition

**TripCollab is the premium, collaborative travel platform where a compatible group plans together, sees where every rupee/dollar/euro goes, verifies its local guides, and books everything — hosted, flights, trains, buses, cabs, and guides — in one place.**

## 2. The problem worth solving

Group travel is genuinely hard. Today it breaks in four predictable places:

1. **Deciding** — "Where, when, with whom, and what pace?" eats weeks of chaotic group-chat back-and-forth. People have mismatched budgets, paces, travel styles, and languages.
2. **Planning** — Everyone juggles 5–10 disjoint tools: a maps app, a spreadsheet, a note app, a screenshot of accommodation, a group chat. Nothing is shared as a single source of truth.
3. **Paying** — Money is the #1 source of group-trip tension. Costs are in different currencies, split unevenly ("I didn't drink the wine," "Sam's room is bigger"), and settle-up is awkward.
4. **Trusting** — Two trust gaps dominate: (a) **can I trust this "hidden gem" or this guide is real?** and (b) as a foreign traveller, **can I trust I'll be understood and looked after?** Most platforms fill gaps with stock or crowd-sourced noise, not verifiable, human-verified truth.

In parallel, the booking experience is fragmented. Flights live on metasearch, trains/buses on rail/bus apps, cabs/guides on activity marketplaces, and hotels on OTAs — none of them think about **the group**, only the **individual**.

## 3. Who this is for (personas)

| Persona | Snapshot | Primary pain |
|---|---|---|
| **The Group Lead ("Designated Planner")** | The friend who always ends up corralling everyone. Type-A, detail-oriented, time-poor. | Owning every decision and every tab. |
| **The Budget-Conscious Traveller** | Wants to enjoy the trip but is anxious about overspending or being the one to subsidise others. | No visibility into true cost; awkward money conversations. |
| **The Solo-Seeking-Group Traveller** | Wants to travel but has no matching group (or their friends can't align on dates/budget). | Finding *compatible* travel companions for a specific trip. |
| **The Culture & Hidden-Place Seeker** | Values authenticity, local culture, and the unexpected over the checklist. | Surfacing genuinely off-the-beaten-path places with confidence. |
| **The Foreign Traveller** | Travelling somewhere new, often in a different language/culture, and worried about being understood and safe. | Assistance, translation, and trustworthy local help. |
| **The Verified Local Guide** | A small local operator or independent expert who wants credible visibility and bookings. | Being verifiably distinguishable from unverified/noise listings. |

## 4. Value proposition (pillars)

TripCollab is differentiated by **six pillars** that combine to make it a group-first, trust-first, premium platform:

1. **Plan together, not apart.** Real-time collaborative itineraries as the single source of truth — the group's shared trip, not one person's spreadsheet.
2. **Match, don't just book.** **Compatible traveller-group matching**: find and group travellers by interest, budget band, pace, language, and travel style — so the group that forms can actually travel well together.
   - **Signature: Budget-Collab pooling.** When one group's budget alone can't afford a trip, we **pool two (or more) compatible groups** so their combined budget makes the trip feasible. *Example: two teams of ₹1,500 each can't afford Goa alone → we match them into one group with ₹3,000, splitting the hotel/PG/hostel, cab, and train so the trip becomes possible.* This is a headline differentiator no benchmark currently owns.
3. **See exactly where the money goes.** **Shared-cost calculation** with flexible split rules, multi-currency support, per-person ledgers, and clean settle-up.
4. **Let AI do the budget math.** **AI budget feasibility** (can this plan fit the group's budget?) with transparent **budget-increase recommendations** (what exactly to raise, by how much, and why) — with reasoning shown, not a black box.
5. **Real places, real people.** **Hidden places and local culture** — waterfalls, parks, hidden cafés, and culture you won't find on the tourist checklist — surfaced from **real photography** (never AI-generated imagery), plus **verified local guides** who are human, vetted, and photographed as they truly are and who take you there **within your budget**.
6. **The foreign traveller is not a second-class citizen.** **Foreign-traveller assistance**: language support, cultural context, safety/cultural notes, and a human path to local help — concretely, help **getting a local SIM** so they can call/data, **payment & currency help (UPI app, Indian currency, exchange)** , and **local price transparency** so nobody overcharges ("so no one can loot them").

These pillars become the basis for milestone scoping, information architecture, and the design system.

## 5. Scope & milestone roadmap

> **Milestone 1 (in progress, this milestone) is the research + design foundation** — this document set, no application code, no imagery, no API keys.

| Milestone | Focus | In scope |
|---|---|---|
| **M1 — Foundation (this milestone)** | Product/design/engineering foundation | Docs: product brief, competitor benchmark, IA, design system, performance budget, asset strategy, `AGENTS.md`. No app code. |
| **M2 — Trip & collaborative planning** | Core planning loop | Create/invite trip; collaborative itinerary; day-by-day plan; maps; place/POI detail; group chat-lite (comments). |
| **M3 — Compatibility & group matching** | Form the right group | Traveller profiles; compatibility scoring; matching against an existing trip (join) or assembling a new group for a route/dates; **Budget-Collab pooling** (combine groups whose individual budgets are too small — e.g., ₹1,500+₹1,500 → ₹3,000). |
| **M4 — Shared-cost workspace** | Money clarity | Cost lines, split rules, multi-currency, per-person ledger, settle-up, export. |
| **M5 — AI budget feasibility & recommendations** | Budget intelligence | Feasibility check against a budget; breakdown by category; **budget-increase recommendation** with rationale and sensitivity. |
| **M6+ — Booking verticals (later)** | Commerce | Hotels, flights, trains, buses, cabs, guides — each as a vertical added incrementally. |
| **M7 — Hidden places, local culture, verified guides** | Trust & discovery | Curated hidden places; local culture content; guide verification programme; guide profiles & booking. |
| **M8 — Foreign-traveller assistance** | Accessibility of travel | Translation, cultural notes, safety/social notes, human support escalation. |
| **M9 — Lightweight 3D experience** | Immersion (opt-in) | Lightweight, optional **premium animated** 3D view of routes/areas with **static 2D fallback**; never required for core function; target **"0 lag"** (see `performance-budget.md`). |

**Ordering rationale:** plan (M2) → match (M3) → money (M4) → AI budget (M5) → book (M6+) → trust/place (M7) → assist (M8) → 3D (M9). We deliberately put **money and trust features before booking**, because those are TripCollab's differentiators and the highest-value, lowest-supply-risk features.

## 6. Non-negotiable product principles

1. **Group-first, not individual-first.** Every primary flow is designed for 2+ people.
2. **Real photography only.** No AI-generated imagery anywhere in the product (see `asset-strategy.md`). This is a brand and trust commitment.
3. **Original UI, not a clone.** We do not imitate Booking.com's density, Airbnb's coral, Skyscanner's blue, or GetYourGuide's red. We have our own design language (`Wayline`, see `design-system.md`).
4. **Mobile-first and accessible.** Design for a mid-tier Android on 4G first; meet/exceed WCAG 2.2 AA.
5. **Progressive enhancement.** Features degrade gracefully. The signature "lightweight 3D" experience must be **optional** and **never block** core functionality (static fallback required).
6. **Costs are transparent and fair.** AI recommendations and split calculations must be explainable.
7. **No key capture.** Do not hold user credit-card/API keys in the client; do not embed secrets (see `AGENTS.md`).
8. **Trust over volume.** Verified humans and real photography beat unverified breadth.

## 7. What we are NOT (anti-scope)

- Not a *general* social network; it is travel-specific.
- Not an "AI photo generator" or editorial content farm; real photography only.
- Not a lowest-price-everything aggregator focused only on price; we optimise for **group fit + clarity + trust**, not merely the cheapest seat.
- Not a copy of any single competitor; we intentionally diverge (see `competitor-benchmark.md`).

## 8. Success metrics (directional targets for later milestones)

- **Activation:** % of created trips that reach ≥1 collaborator and ≥1 cost line within 7 days.
- **Collaboration depth:** mean collaborators per active trip; % of trips with ≥3 active contributors.
- **Money clarity:** % of booked trips where ≥90% of costs are recorded in the shared-cost workspace.
- **Matching quality:** % of matched groups that complete a trip together; compatibility score → completed-trip conversion.
- **Trust:** % of guide bookings made on *verified* guides; rebooking rate on verified guides.
- **Budget intelligence:** % of trips that used an AI budget-increase recommendation; measured plan-vs-actual deviation.
- **Performance:** meet the Core Web Vitals targets in `performance-budget.md`.
- **Accessibility:** automated (axe) + manual WCAG 2.2 AA conformance; zero blocking issues in CI.

## 9. Constraints & risks

- **Supply of real photography** is harder than sourcing stock/AI images; mitigations: vendor/partner imagery, community submissions, verified guide media, and editorial partnerships documented in `asset-strategy.md`.
- **Guide verification** requires a human process and liability care; keep verification a premium, deliberate programme.
- **Booking supply** for cabs/guides/trains/buses varies hugely by market; verticals launch incrementally and regionally. India (rail/bus) and Southeast Asia are priority launch regions given the benchmark set.
- **Multi-currency, multi-language** correctness is critical for the shared-cost and matching engines.
- **Regulatory** for cross-border payments, refunds, and any travel-assistance liability. Flagged for later milestones.

## 10. Open questions for the owner (blocking decisions)

1. **Product name:** rename the repo/package from `Travilla` → `tripcollab` now, or keep `Travilla` as an internal identifier? (Recommend renaming to match brand before Milestone 2.)
2. **Launch region priority:** confirm India + Southeast Asia first (given ixigo/redBus/MakeMyTrip benchmark context), or global-first?
3. **Monetisation:** (a) booking commission, (b) premium collaboration tier, or (c) verified-guide marketplace fee — which is primary? This affects IA and later milestones.
4. **Guide verification:** community-vetted vs. platform-vetted (paid identity/credential check)? Affects trust and cost.

*These are deliberately deferred to avoid designing against unconfirmed assumptions.*

---

## 11. Contradiction Review (Milestone 1)

I reviewed all seven documentation files against each other. Issues found and how they were resolved:

| # | Contradiction / tension | Where | Resolution |
|---|---|---|---|
| 1 | **Repo vs. brand naming (`Travilla` vs. `TripCollab`)** | `README.md`, `product-brief.md`, `information-architecture.md`, `AGENTS.md` | Kept `Travilla` as the internal repo identifier; product brand & all new work use **TripCollab**. Documented as a **pending owner decision** to rename before Milestone 2 (§10 Q1). Not silently hidden. |
| 2 | **Milestone numbering ("Milestone 0" vs "M1")** | `product-brief.md` | Standardised on **Milestone 1 = research + design foundation** (matches the original instruction). Removed the stray "Milestone 0" reference. |
| 3 | **"Plan" vs "trip" vs "itinerary" vocabulary** | `information-architecture.md` | Standardised: **trip** = the planned journey (container), **itinerary** = the structured day-by-day artefact, **plan** = intent (avoided as noun). Consistent across all docs. |
| 4 | **Currencies & symbol hygiene** | `product-brief.md`, `performance-budget.md` | ✕ removed a stray space inside the foreign-assistance parenthetical; kept ₹/USD/EUR/INR as illustrative. Budget-Collab example used consistently as ₹1,500+₹1,500 → ₹3,000. |
| 5 | **Booking verticals order vs. pillar emphasis** | `product-brief.md` → `competitor-benchmark.md` | Booking verticals are explicitly **later (M6+)** and add incrementally; this is intentional (money+trust first). No conflict — but flagged so nobody expects booking in M2. |
| 6 | **3D "lightweight" vs "0 lag"** | `product-brief.md`, `design-system.md`, `performance-budget.md` | Reconcile: the 3D experience is **lightweight, opt-in, animated, with a mandatory static 2D fallback**, and is subject to strict performance budgets. "0 lag" refers to the *whole product*, not a promise of heavy 3D. Consistent. |
| 7 | **AI imagery** | `product-brief.md`, `asset-strategy.md`, `design-system.md`, `AGENTS.md` | Uniformly **banned** everywhere. Only real photography for places/guides/gems/avatars; brand graphics (illustration/iconography) are allowed but distinct from AI *photoreal* imagery. No conflict. |
| 8 | **"Verified guides" vs "hidden places" sourcing authority** | `competitor-benchmark.md`, `asset-strategy.md` | Guides are platform-verified humans (credential + identity check); hidden places may be community/editorial but flagged. Documented so a "verified" badge is never applied to unverified content. |
| 9 | **Matching pillar scope** | `product-brief.md`, `information-architecture.md`, `design-system.md` | Compatibility matching now explicitly includes **Budget-Collab pooling** (combining groups to make a trip affordable). Added a matching `BudgetCollabMoment` UI pattern so design and product agree. |
| 10 | **Foreign-traveller assistance scope** | `product-brief.md`, `information-architecture.md` | Expanded from "language/safety" to concrete **SIM provisioning, UPI/currency help, and local-price transparency** — reflected in both docs consistently. |

**Residual open items (not contradictions, but flagged):** product rename, launch region, monetisation model, guide-verification depth (§10). These are deliberately left for the owner so we don't design against unconfirmed assumptions.
