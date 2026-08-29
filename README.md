# TripCollab

**Premium, collaborative travel platform.**

Plan together with a compatible group, see exactly where the money goes, get AI budget advisement, and book hotels, flights, trains, buses, cabs and verified local guides — all in one place. Hidden places, local culture, and foreign-traveller assistance included. Real photography only (never AI-generated imagery). Original UI, mobile-first, accessible.

> **Working identifier:** the repository is internally named `Travilla`; the product brand is **TripCollab**. Renaming the repo/package to match the brand is an open decision flagged in `docs/product-brief.md`.

## Current status

**Milestones 1–11 complete.** The app is a fully working, dependency-free, static-first TripCollab with:

- **Destinations & explore** — all-India destinations (Goa, Kerala, Varanasi, Hampi, Rishikesh, Ladakh) with real photography.
- **Travel Guides hub** — a Wanderlog-style browse feed of curated community guides (cover, author, likes/views, destination filters) at `guides.html`.
- **AI trip planner** (`create.html`) — a built-in, offline copilot that turns destination + days + budget + interests into a day-by-day itinerary and shared-cost plan. Ships with a documented hook (`window.TripCollabAI.useRemote`) so a real LLM/serverless endpoint can be added later without exposing a key in client code.
- **Trip creation that flows into the workspace** — generate a trip on `create.html`, then **Save as guide** (publishes to the hub, `guides.html`) or **Push to my trip** (rewrites the active Trip/Budget workspace via `localStorage`). Guide detail at `guide.html#<id>`.
- **Budget-Collab** — the signature differentiator: compatible groups pooling budgets to afford a trip, with a shared-cost workspace, settle-up ledger, and AI budget advisement.
- **Bookings** — hotels, flights, trains, buses and cabs (transport booking page) plus verified local guides, all flowing into the shared cost + itinerary.
- **Reviews & photo upload** — Amazon-style aggregate rating, star breakdown, "helpful" votes, and real photo upload (compressed, stored client-side).
- **Foreign-traveller assistance** — SIM provisioning, UPI/currency help, price transparency, verified human help.
- **3D journey** — a lightweight dependency-free globe in the trip view with a static 2D fallback.

All client-side, no backend, no API keys, no AI-generated imagery (real, licensed photography only), mobile-first and accessible.

## Documentation set (Milestone 1)

- `docs/product-brief.md` — product definition, pillars, personas, milestones.
- `docs/competitor-benchmark.md` — positioning across 12 named benchmarks.
- `docs/information-architecture.md` — content model, navigation, flows.
- `docs/design-system.md` — the "Wayline" design language (original UI, not a clone).
- `docs/performance-budget.md` — Core Web Vitals + "0-lag" 3D performance budget.
- `docs/asset-strategy.md` — real-photography-first sourcing & no-AI-image pledge.
- `AGENTS.md` — engineering & contribution rules.
