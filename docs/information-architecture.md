# TripCollab — Information Architecture

> **Purpose:** Define the content model, primary navigation, and key user flows for TripCollab. This is the structural blueprint that `design-system.md`, `performance-budget.md`, and later engineering milestones build against. It is **mobile-first** (one primary action per screen; thumb-friendly; progressive disclosure).

## 1. Conceptual model

TripCollab is built around three stable core concepts and a layered set of supporting concepts:

```
TRAVELLER (person, with profile & preferences)
    │
    └── builds / joins ──► TRIP (a planned journey)              ──► ITINERARY (day-by-day plan)
                              │                                     │
                              │                                     ├── ITINERARY ITEM (place / activity / transport leg / stay)
                              │                                     ├── COST LINE
                              │                                     └── NOTE / COMMENT / VOTE
                              ├── COMPATIBLE GROUP (matched travellers)
                              ├── BUDGET (plan-level budget + feasibility)
                              ├── BOOKING (hotel / flight / train / bus / cab / guide)
                              └── GUIDE (verified local human)
```

The **Trip** is the central object. Everything hangs off it:

- **Participants** (the group) — from `Traveller`s.
- **Itinerary** — the plan.
- **Cost / shared-cost workspace** — money.
- **Budget intelligence** — feasibility & recommendations.
- **Bookings** — the actual commerce (added in later milestones).
- **Trust layer** — hidden places, local culture, verified guides, foreign-traveller assistance.

## 2. Primary navigation (mobile-first)

A persistent **bottom tab bar** with 5 items is the mobile spine. Desktop collapses to a top nav with the same top-level concepts.

| # | Tab | Scope | Primary content |
|---|---|---|---|
| 1 | **Trips** | Current/future trips | Trip cards → trip home → itinerary. This is the default landing ("My Trips"). |
| 2 | **Discover** | Inspiration & trust content | Hidden places, local culture, curated by destination; open-ended discovery; saved places. |
| 3 | **Match** | Compatible traveller-group matching | Profile/set cards, compatibility score, join/assemble a group. |
| 4 | **Budget** | Money across the trip | Plan budget, per-person ledger, budget feasibility & advisory. |
| 5 | **Profile** | Account & preferences | Traveller profile, preferences, verified status, saved, settings, support. |

**Navigation rules:**
- The **Trip** object in the "Trips" tab owns the deeper flows (itinerary, bookings, guides, cost, budget). These are **secondary** screens reached from Trip Home, not new tabs — because the traveler's mental model is "I'm inside this trip."
- **Discover / Match / Budget / Profile** are top-level lenses; the trip-specific versions of these lenses (e.g., a trip's own budget) live inside the Trip.
- A **global "Create" (＋)** action is always reachable from the Trip tab (and contextually from Explore) to start a new trip or a new group.

## 3. Content model (objects & key fields)

### Traveller
- identity: name, avatar (real photo), language(s), home region
- preferences: travel pace, budget band, interests/tags, travel style (solo/family/friends/couple), accessibility needs, dietary, cultural/language of preference
- verified status: `verified_guide` (for guides), `verified_traveller` (optional), photo-verification flag
- relationships: memberships, friends, followers

### Trip
- identity: name, start/end dates, origin, destination(s), cover (real photo)
- settings: visibility (private/group/invite), currency preference, default split rule
- status: planning / awaiting-members / booked / completed

### Itinerary & Itinerary Item
- day-based grouping; items are typed: `place`, `activity`, `transport_leg`, `stay`, `meal`, `note`
- fields: time, title, location, tags, notes, related cost line, related booking, media (real photos)
- ordering: timeline (drag), and map-only view

### Compatible Group / Match
- origin of group: `join_trip` (I want to join a trip) or `assemble` (build a group for route/dates)
- matching inputs: interests, budget band, pace, language, dates, accessibility, travel style
- output: **compatibility score** + per-dimension breakdown + recommended group
- group state: proposed / confirmed / departed

### Cost Line (shared-cost workspace)
- amount, currency, category (stay/transport/food/activity/etc.), payer, split rule, participants
- split rules: `equal`, `custom`, `per_adult_child`, `by_usage` (e.g., a subset), `fixed_share`
- ledger: per-participant balance; settle-up actions

### Budget & Budget Intelligence
- plan budget (by category), per-person target
- `feasibility` status: feasible / tight / over
- breakdown: estimated vs. actual vs. budget by category
- `recommendation`: budget-increase advice (what, why, by how much, sensitivity, alternatives)

### Booking (later milestones)
- typed: `hotel` / `flight` / `train` / `bus` / `cab` / `guide`
- status: draft / requested / confirmed / cancelled
- fields: provider, reference, price, currency, travellers, dates, confirmation
- links: → cost line, → itinerary item, → travellers

### Verified Local Guide
- identity & credentials (verified), location(s), specialties, languages, availability
- real photo set; reviews from actual travellers; booking availability; price
- linkage: → booking, → itinerary item

### Place / Hidden Place & Local Culture Content
- place: geo, category, description, real photos, source/attribution
- `hidden` flag; editorial/community origin; `verified` status
- local-culture content: stories, customs, safety/cultural notes, local tips

## 4. Key user flows (concise)

### F0 — First run / onboarding
Set language → create/link traveller profile → set preferences (pace, budget band, interests, accessibility, language) → see a value preview (one trip, one match, one budget) → land on **Trips**.

### F1 — Create a trip
＋ → name trip, dates, destination → set visibility & currency → invite travellers (link) → land on **Trip Home**.

### F2 — Plan the itinerary
Trip Home → Itinerary → add item (place/activity/transport/stay) → set time/location → add note → associate cost/booking → see day-by-day list or map.

### F3 — Collaborate
Invite travellers → each edits in real time → comments on items → **vote** on ambiguous items (polls) → agree.

### F4 — Compatible group matching
Match tab → state intent (join a trip OR assemble a group) → enter preferences/routes/dates → see **compatibility scores** → request to join / invite compatible travellers → group forms.

### F5 — Shared cost
Budget/cost → add cost line → assign payer & split rule → ledger updates → settle-up → export.

### F6 — AI budget feasibility & recommendation
Budget → run feasibility on current plan vs. target → see status, breakdown, and **budget-increase recommendation** (with rationale + sensitivity) → apply or adjust.

### F7 — Book (later)
Trip Home → bookings → select vertical → select options → assign travellers → confirm → auto-create cost line + itinerary item.

### F8 — Discover hidden places / culture / guides
Discover → filter by destination → explore hidden places & local culture → save to a trip → book a verified guide.

### F9 — Foreign-traveller assistance
In-context (on any place, itinerary item, or area) → language support, cultural/safety notes, or escalate to human help.

## 5. Navigation map (sitemap sketch)

```
App
├── Trips (Home)
│   ├── Trip Home
│   │   ├── Itinerary
│   │   │   ├── Itinerary Item detail
│   │   │   └── Map view
│   │   ├── Participants / Group
│   │   ├── Cost / Shared-cost workspace
│   │   │   └── Budget intelligence (feasibility + recommendation)
│   │   ├── Bookings (hotel/flight/train/bus/cab/guide)
│   │   └── Guide(s) & trust
│   └── Create Trip (＋)
├── Discover
│   ├── Destination
│   │   ├── Hidden places
│   │   └── Local culture
│   ├── Saved places
│   └── Verified guides
├── Match
│   ├── Join a trip
│   └── Assemble a group
├── Budget (global lens; trip-level version inside Trip)
└── Profile
    ├── Traveller profile & preferences
    ├── Verified status
    ├── Saved
    ├── Settings
    └── Support / assistance
```

## 6. Mobile-first & accessibility rules (structural)

- **Single primary action** per screen (plus always-on secondary affordances).
- **Thumb-reachable primary actions** (bottom tab bar; primary CTA near the bottom on mobile).
- **Progressive disclosure:** depth is revealed on demand; no giant forms upfront.
- **Type/text ≥ 16px** mobile base; **contrast ≥ 4.5:1**; **targets ≥ 44×44px**.
- **Touch vs mouse:** gestures are enhancements only; every action has a non-gesture alternative.
- **Reduced motion:** animations are exempt/disabled when `prefers-reduced-motion` is set.
- **Static fallback:** any 3D/immersive view must degrade to a 2D map/list without losing function.
- **Text, not images, carries meaning:** real photos support content but must never be the only source of critical info (decorative alt; meaningful alt only where a photo conveys info).
- **Language accessibility:** full internationalisation (i18n) from the start; RTL support; locale-aware date/currency.

## 7. Naming & vocabulary (IA consistency)

Avoid jargon; use plain, warm, premium language. Shared vocabulary (single source of truth for copywriters & designers):

- A **"trip"** is a planned journey. A **"group"** (or **"travellers"**) is the set of people. A **"compatibility score"** describes how well travellers fit.
- **"Cost line"** (not "expense") for a single cost; **"shared-cost workspace"** for the whole; **"settle-up"** for clearing balances.
- **"Budget feasibility"** = will the plan fit the budget; **"budget-increase recommendation"** = the advisory telling you what to raise and why.
- **"Verified local guide"** = human, credentials-checked, real photos. **"Hidden place"** = off-the-beaten-path, authentic, curated. **"Local culture"** = customs/stories/tips.
- **"Foreign-traveller assistance"** = in-context language/cultural/safety help + human escalation.

*Contradiction note:* earlier draft used "trip planner" and "plan" interchangeably; we standardise on **"trip"** and **"itinerary"** (plan = the intent; itinerary = the structured day-by-day artefact). And the internal repo name `Travilla` differs from the brand **TripCollab** — see contradiction review.
