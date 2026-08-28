# TripCollab — Competitor Benchmark

> **Purpose:** Understand the 12 named benchmarks, extract the patterns worth *respecting*, and the gaps worth *exploiting*. This is a positioning document, not a clone plan. **We do not copy competitor UI or imagery.** Distances and estimates are directional, based on public information as of the research date (2026-08-28).

## 1. The benchmark set, classified

The named benchmarks span four distinct product types. Understanding the category is the first lesson: **no single benchmark covers all of TripCollab's six pillars.** The opportunity is the empty centre.

| Category | Benchmarks | In common |
|---|---|---|
| **OTAs / Aggregators (individual-centric)** | Booking.com, Expedia, MakeMyTrip, Skyscanner, Google Flights, ixigo, redBus | Optimise price, inventory, and booking for **one traveller**. |
| **Multimodal route planners** | Rome2Rio | Best-in-class at *how to get between A and B* — but not group-aware, not social, no money split. |
| **Collaborative trip planners** | Wanderlog | The closest analogue to our collaborative core — but oriented to *individual itineraries that a group edits*, not *group compatibility + group money + trust*. |
| **Discovery / experiences / guides** | Atlas Obscura, GetYourGuide | Content/experience supply and "hidden places" discovery — but no booking-first collaborative group core, and GetYourGuide is activity-marketplace-heavy. |
| **Rideshare / ground (adjacent)** | redBus, cabs in MakeMyTrip/ixigo | Ground transport is under-served by the "premium" collaborative category. |
| **Fare metasearch** | Skyscanner, Google Flights | Open-ended discovery + price-to-destination — inspiration-first. |

## 2. Per-product snapshot

### Booking.com
- **Type:** Global OTA; accommodation-first with extensive inventory.
- **Strengths:** Unmatched accommodation supply, pricing/availability depth, mature review corpus, strong localisation.
- **Weak spots (for our positioning):** Hyper-dense UI optimised for conversion; very individual-centric; reviews are broad but not "verified local guide" trust; no group planning, no group money, no compatibility matching.
- **What to respect:** transactional clarity, review corpus size, localisation breadth.
- **What to exploit:** it doesn't think about a **group** at all.

### Airbnb
- **Type:** Marketplace for stays & experiences; community/vibe-driven.
- **Strengths:** Brand warmth; host profiles; a sense of belonging; strong "place + person" storytelling.
- **Weak spots:** Accommodation-led, not journey-led; no group-compatibility matching across multi-leg trips; no real collaborative trip workspace; experiences are secondary.
- **What to respect:** host/guide identity as a trust signal (a direct influence on our **verified local guides**).
- **What to exploit:** the "belonging" signal is social but not structured around a **planned group trip with shared money**.

### Skyscanner
- **Type:** Metasearch / flight & travel search.
- **Strengths:** The **"Everywhere"** search (open-ended destination-by-price); breadth of OTAs/carriers; invented the flexible-discovery pattern.
- **Weak spots:** Discovery-only; no planning, no collaboration, no group money; prices from less-reputable OTAs; slower results vs Google Flights.
- **What to respect:** flexible/open-ended discovery (an inspiration affordance we should reuse in our own distinct visual language).
- **What to exploit:** price-only, no group context, no "will this fit our combined budget?"

### Expedia
- **Type:** Full-service OTA (flight + hotel + car + package).
- **Strengths:** Bundled packaging; breadth; strong search UI.
- **Weak spots:** Package-centric and individual-centric; generic "big OTA" branding; no group collaboration or trust-persona features.
- **What to exploit:** bundling *stays + transport* for a *group* is a whitespace; Expedia bundles for the individual.

### Google Flights
- **Type:** Metasearch, direct-airline GDS price data.
- **Strengths:** Near-instant results; excellent price-history/price-track; clean, fast, trustworthy interface; strong calendar/date flexibility.
- **Weak spots:** Narrower carrier/OTA coverage; no "everywhere" open-ended search the way Skyscanner does; individual only; no collaboration.
- **What to respect:** speed, price transparency (history), and interface clarity — these inform the **Core Web Vitals** and **"explainable"** design decisions.
- **What to exploit:** Google does not do group planning or money, by design.

### Wanderlog
- **Type:** Collaborative trip/planning app; the closest analogue.
- **Strengths:** Real-time co-editing (Google-Docs-for-trips); map-centric visual planning; email/booking import; expense splitting; genuinely decent free tier.
- **Weak spots:** Itineraries are still essentially **one shared planner for a trip**, not a **compatibility-matching** engine (you already know your group); AI features basic; no hidden-place/local-culture "trust" mission; no verified local guides; no foreign-traveller assistance; no AI budget-feasibility + budget-increase loop.
- **What to respect:** real-time collaboration, map-centric planning, drag-and-drop itinerary building, expense splitting.
- **What to exploit (our biggest whitespace):** **compatible traveller-group matching** (Wanderlog assumes you already have your group), **AI budget feasibility with explicit budget-increase recommendations** (Wanderlog tracks costs but doesn't advise), **verified local guides + real photography + foreign-traveller assistance** (Wanderlog has no trust/assistance mission).

### Atlas Obscura
- **Type:** Media + discovery platform for hidden/offbeat places; user-generated; editorial.
- **Strengths:** Superb editorial voice; the "hidden wonders" mood; UGC corpus; map-based discovery; strong community.
- **Weak spots:** Discovery/media-first, not booking-first; no group planning, no money, no verified guides as a bookable supply; places often are not practical to book as an integrated trip.
- **What to respect:** the storytelling + authenticity mission; map-centric discovery; the editorial curation bar.
- **What to exploit:** Atlas Obscura is *inspiration*; TripCollab turns that inspiration into a **bookable, group-planned, budgeted trip with verified guides**.

### GetYourGuide
- **Type:** Experiences/tours/activities marketplace.
- **Strengths:** Scale of bookable experiences; strong conversion; good supply; vouchers/mobile tickets.
- **Weak spots:** Activity-led, not trip-led; no collaborative group planning core; guides/tours are SKU-level, not *verified human guides with profile trust*; no shared-cost workspace; no compatible matching.
- **What to respect:** marketplaces can monetise verified supply; mobile ticket/voucher UX.
- **What to exploit:** a **verified local guide** trusted by the group is a different, higher-trust unit than a faceless activity SKU.

### MakeMyTrip
- **Type:** India's largest OTA (flights, hotels, holidays, buses (via redBus), trains, cabs).
- **Strengths:** Broad multi-vertical coverage in India; strong brand; holiday/packaging; strong train/bus coverage.
- **Weak spots:** Individual-centric; heavy promo/upsell density; no group-compatibility, no collaborative trip workspace, no AI budget feasibility.
- **What to respect:** multi-modal coverage in a rail/bus-heavy market; strong localisation.
- **What to exploit:** verticals are offered individually; no one bundles them for a *group with a shared budget and a verified local guide*.

### ixigo
- **Type:** India's #2 OTA; rail/bus/flight/hotel; owns ConfirmTkt (rail) & AbhiBus (bus).
- **Strengths:** Best-in-class rail and bus UX (~51% rail booking share); strong tier-2/3 penetration; great cross-sell (train waitlist → bus/flight nudge); AI trip planner; free.
- **Weak spots:** Mass-market, value-first; ads in-app; individual-centric; monetisation from convenience fees/commissions; not premium or group-collaborative; no verified local guides or foreign-traveller assistance.
- **What to respect:** integrated multi-modal cross-sell and intelligent nudge ("ticket not confirmed → here's a bus/flight"); understanding Indian rail/bus booking realities.
- **What to exploit:** the *value-added* nudge pattern (waitlist → alternative) is a great analogy for our **AI budget-increase recommendation** *("this plan doesn't fit your budget → here's what to drop or where to add")*.

### redBus
- **Type:** Ground transport (bus) marketplace, India & international.
- **Strengths:** Dominant bus inventory/UX; well-localised; strong mobile; reliable for mass-market bus travel.
- **Weak spots:** Single-mode (bus); individual-centric; no group compatibility; no budget feasibility; not collaborative.
- **What to respect:** reliability in a hard vertical; mobile-first booking; integrations (part of MakeMyTrip).
- **What to exploit:** ground transport for groups is under-served; cabs + buses + trains as legs in a **group trip** with shared cost is a whitespace.

### Rome2Rio
- **Type:** Multimodal route planner (flights, trains, buses, ferries, car, rideshare); free; affiliate.
- **Strengths:** Best "anywhere-to-anywhere" multimodal discovery; route comparison by time/price; flexible (no dates required to explore); map + step-by-step legs; parented by Omio.
- **Weak spots:** Planning/discovery primary — booking redirects to partners (no unified group checkout); no collaboration; no group money; no verified guides; no foreign-traveller assistance.
- **What to respect:** the **multimodal, multi-leg, door-to-door thinking** with mode comparison by time/price; "explore without dates first" pattern.
- **What to exploit:** Rome2Rio plots legs but **can't (and doesn't) plan a group trip, split the cost, or book the whole thing with trusted guides**. That's TripCollab's core.

## 3. Adjacent / emerging competitors worth watching

Searched (public info, 2026-08-28) group-trip-planning tools beyond the named set: WePlanify, Stippl, Jourma, TripLinq, Tripsil, SearchSpot, Mindtrip, Pilot, Hoku, Troupe, Nxvoy, TripStone, Splitwise. Observations that inform design:

- **The "group planner" category is crowded but shallow:** most tools (WePlanify, Stippl, Jourma, TripLinq, Tripsil) do itinerary + polling + expense splits. The overlap is high and differentiation is low; the ones with *matching* (compatibility) are rare.
- **AI is now table stakes and mostly "generate an itinerary":** (Mindtrip, Hoku, TripStone, Nxvoy). Almost none do **budget feasibility + explicit budget-increase recommendation** with *visible reasoning* — that is a defensible differentiator.
- **Expense splitting is commoditised** (Splitwise, Stippl, Wanderlog). We must go one step further: **budget feasibility for the whole plan**, not just receipts.
- **Trust/verification is largely absent:** very few group planners surface *verified local guides* or insist on *real photography* or *foreign-traveller assistance*. This is a genuine whitespace.
- **Takeaway for design:** we should not try to "out-feature" the crowded group-planner category on itinerary+Gantt+budget basics. We win on **compatibility matching, explainable AI budget advisement, verified-local-guide trust, and foreign-traveller assistance** — delivered in a distinctive premium UI.

## 4. Positioning matrix

**Axes we care about:** X = individual-centric → group-centric; Y = transaction/price → trust/experience/meaning.

| | Individual-centric | Group-centric |
|---|---|---|
| **Price/transaction** | Booking.com, Expedia, MakeMyTrip, ixigo, redBus, Skyscanner, Google Flights | (mostly empty) |
| **Trust/experience/meaning** | GetYourGuide, Atlas Obscura | **TripCollab ← here** (Wanderlog is group-centric but price/experience-neutral, missing matching + verified guides + AI budget advisement) |

TripCollab's target quadrant — **group-centric × trust/experience/meaning** — is sparsely occupied. Wanderlog is the closest occupant but lacks the **compatibility-matching**, **verified-guide-trust**, **AI budget-feasibility-and-budget-increase**, **real-holiday-photography**, and **foreign-traveller-assistance** pillars.

## 5. Feature gap analysis (→ what we build)

| Pillar | Best current owner | Standard practice | **TripCollab opportunity** |
|---|---|---|---|
| Collaborative itinerary | Wanderlog (real-time co-edit) | Google-Docs-for-trips | Match-quality + money-awareness built into the same canvas; not just edits. |
| Compatible traveller-group matching | Mostly absent | None strong | **Differentiator:** score by budget band, pace, interests, language, travel style. |
| Shared-cost calculation | Splitwise/Wanderlog/Stippl | Expense splitting, per-person ledger, settle-up | **Go further:** per-plan budget feasibility + multi-currency correctness + role-based splits. |
| AI budget feasibility | Mostly absent | AI "generate itinerary" | **Differentiator:** does the plan fit the combined group budget? Show breakdown. |
| AI budget-increase recommendation | Mostly absent | Static advisories | **Differentiator:** *exactly what to raise and why*, with sensitivity and alternatives. |
| Hidden places & local culture | Atlas Obscura, Wanderlog (save places) | Editorial + UGC | Fold hidden places into **plannable, bookable, budgeted** trip; not just a reading list. |
| Verified local guides | GetYourGuide (SKU), Airbnb (host profile) | Marketplace SKU / host profile | **Differentiator:** verified identity + credentials + real photos + bookable by the group. |
| Foreign-traveller assistance | Mostly absent | Support/FAQ | **Differentiator:** in-context language + cultural/safety notes + human escalation. |
| Real photography | Airbnb/Atlas Obscura (editorial) | Stock + AI | **Differentiator:** brand pledge — no AI imagery. See `asset-strategy.md`. |
| Original UI | — | Cloned motifs | **Our own language** `Wayline` (see `design-system.md`). |

## 6. Benchmark decisions we are explicitly NOT copying

To honour "original UI; do not copy competitors" and our differentiation, we will **not**:

- Copy Booking.com's dense, list-grid, hyper-conversion layout.
- Copy Airbnb's coral-pink "belonging" palette or its card-grid marketplace.
- Copy Skyscanner's / Google Flights' blue flight-metasearch density.
- Copy GetYourGuide's red activity-marketplace look.
- Copy Wanderlog's specific map+list layout verbatim (we reuse the *pattern*, not the pixels).
- Reuse Atlas Obscura's editorial-dark style verbatim (we borrow the *mission* and *map-first* idea).

We **borrow patterns** (multimodal leg comparison, expense splitting, open-ended discovery, real-time co-edit, map-first) but express them in **`Wayline`**.

## 7. Sources & caveats

- Directional facts (market share, rankings, pricing, feature presence) are drawn from public web search results dated around 2026-08-28. They are **estimates** for positioning purposes, not audited figures.
- Competitor feature claims may change; re-verify in later milestones.
- No competitor content/imagery is reproduced; only patterns and positioning are referenced.

## 8. Summary for design direction

1. **Don't fight on individual OTA price** — that's a losing battle (Booking.com, Google Flights, ixigo own it).
2. **Own the group-centric × trust quadrant** that is nearly empty.
3. **Lead with differentiators:** compatibility matching → explainable AI budget advisement → verified local guides → real photography pledge → foreign-traveller assistance.
4. **Ship the collaborative core that already works** (itinerary + cost) so the differentiators have a home.
5. **Reuse proven interaction patterns** but never clone the competitor's visual language.
