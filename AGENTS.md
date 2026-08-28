# AGENTS.md — TripCollab Engineering & Contribution Guide

> This file tells any agent or contributor (human or AI) how to work on this repository. **Read it before writing code.**
>
> **Product name:** TripCollab (working repo identifier: `Travilla`). See the contradiction note at the end — we intend to rename the repo/package to match the brand before a broad code milestone.

## 1. Current milestone state

- **Milestone 1 — Research & Design Foundation** is the *active* milestone.
- **We are documentation-only right now.** Existing deliverables live in `docs/` and this file. **No application code has been written yet by design.**
- **Do NOT:** write application code, download images/assets, or add API keys during Milestone 1. These are explicitly deferred by the product owner until Milestone 2 approval.

## 2. Milestone discipline & boundaries

- **Build incrementally.** Never build "the entire application at once." Work milestone by milestone, screen by screen, feature by feature.
- **Milestone 2 (pending approval):** begins the actual codebase. Scope at that point = the **Trip & collaborative planning** core (create/invite trip, collaborative itinerary, day-by-day plan, maps, place/POI detail, comments) as scoped in `docs/product-brief.md`.
- **Later milestones** add compatibility matching, shared cost, AI budget advisement, booking verticals, guides/hidden gems, foreign-tourist assistance, and the lightweight 3D experience. Defer those until their milestone.
- **Ask/flag before scope creep.** If a change belongs to a later milestone, do not implement it early unless the owner explicitly approves.

## 3. The six product pillars (always design against these)

1. **Plan together, not apart** — collaborative itineraries as the single source of truth.
2. **Match, don't just book** — *compatible traveller-group matching*, including the signature **Budget-Collab** feature: pool two or more groups whose individual budgets are too small, combining their budgets so the trip becomes feasible (e.g., two teams of ₹1500 → ₹3000, then split hotel/PG/hostel, cab, train).
3. **See exactly where the money goes** — shared-cost calculation, split rules, multi-currency, per-person ledger, settle-up.
4. **Let AI do the budget math** — budget feasibility + transparent budget-increase recommendation (what to raise, by how much, and why).
5. **Real places, real people** — hidden gems (waterfalls/parks/cafés/culture), verified local guides, and a **real photography, no-AI-imagery** pledge.
6. **The foreign traveller is not second-class** — in-context assistance: SIM provisioning, UPI/Indian-currency guidance, and local-price transparency so travellers are never overcharged.

## 4. Non-negotiables

- **No AI-generated images** anywhere in the product (places, trips, guides, avatars, covers, marketing). Real photography only (see `docs/asset-strategy.md`).
- **Original UI** — do **not** copy competitor visual language (see `docs/design-system.md`, "Wayline"). No Booking.com/Airbnb/Skyscanner/Google/GetYourGuide/Atlas Obscura clones.
- **Mobile-first and accessible** — WCAG 2.2 AA; mobile-first; thumb-friendly; `prefers-reduced-motion` support.
- **Progressive enhancement** — features degrade gracefully; the "lightweight 3D" experience is **opt-in** and **must** have a static/2D fallback that never blocks core function.
- **Handle secrets correctly** — **no API keys/tokens/secrets** in client code, docs, or commits. Server-side only; browser gets signed URLs.
- **Performance** — meet `docs/performance-budget.md`; the product must feel "0 lag."

## 5. Do NOT — hard rules

- Do not write application code during Milestone 1.
- Do not download images/assets during Milestone 1.
- Do not add API keys.
- Do not clone competitor UI/UX or imagery.
- Do not introduce AI-generated imagery.
- Do not skip the milestone gate (wait for owner approval before Milestone 2).
- Do not commit secrets, `.env` with real keys, or credentials.

## 6. Working agreements

- **One source of truth for tokens/specs** comes from `docs/design-system.md`; reference tokens (`--wp-*`) rather than raw values.
- **Accessibility is a merge gate.** Add `aria`/semantics; meet contrast; keep focus order; add live regions for async updates.
- **Performance is a merge gate.** Reference `docs/performance-budget.md`; add image sizes/`srcset`/`aspect-ratio`; lazy-load.
- **Real photography** must be sourced through the hierarchy in `docs/asset-strategy.md` (first-party → DMO/partner → verified contributors → licensed stock; never AI).
- **Write clear, minimal,** and **well-named** code; keep files small and responsibilities single (this is the "separate files" convention the owner wants).
- **No build artifacts / large assets in git** unless required; follow repo conventions; keep generated output out of Git.
- **Branch discipline:** work only on the session branch (`arena/01a049ba-travilla`). Do not create/switch to other branches.

## 7. Recommended structure for Milestone 2+ (informative)

This is a *target* structure to evolve toward — **not yet created**. Keep pages/sections as separate files (owner requirement: "sabki alag alag file").

```
tripcollab/
├── index.html            # landing / product surface (static-first)
├── assets/
│   ├── css/              # design-system tokens + component styles
│   ├── js/               # framework-light modules, separate per concern
│   ├── img/              # REAL photography (no AI), audited license
│   └── icons/            # original Wayline icon set
├── docs/                 # this documentation set
├── AGENTS.md
└── README.md
```

> We will finalise the exact stack and structure in Milestone 2 after owner approval. **Do not scaffold this yet.**

## 8. Definition of done (per feature, later)

A feature is "done" only when:
1. It implements the product requirement from `docs/product-brief.md` for that milestone.
2. It meets `docs/performance-budget.md` (no regression).
3. It meets `docs/design-system.md` + WCAG 2.2 AA.
4. It uses **real** media per `docs/asset-strategy.md` (never AI).
5. It has no secrets/API keys in the client.
6. It has accessible labels, keyboard/focus support, and reduced-motion handling.
7. It has a static fallback for any 3D/immersive element.

---

## Contradiction / naming note

The repository and README refer to the project as **`Travilla`**, while the product brand is **TripCollab**. This is a deliberate, temporary inconsistency we must resolve before broad code milestones. **Open decision:** rename repo/package to `tripcollab` for consistency. Flagged in `docs/product-brief.md` §10.
