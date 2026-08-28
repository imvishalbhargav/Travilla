# TripCollab — Performance Budget

> **Purpose:** TripCollab must feel **premium and instant ("0 lag")**. This document sets the hard numbers that prevent bloat before it happens. Every Milestone 2+ deliverable is measured against these budgets. Values are informative targets; the **Core Web Vitals** thresholds are the contractual ones.

## 1. Guiding principles

1. **Mobile-first, 4G-first.** Most users arrive on a mid-tier Android over 4G. If it's fast there, it's fast everywhere.
2. **"0 lag" = frame-rate + first-interaction + scroll.** Perceived lag comes from: (a) slow first paint, (b) janky animations/scroll, (c) blocking main thread, (d) heavy 3D. We budget for all four.
3. **Premiums through polish, not payload.** Luxury feeling comes from crisp motion and clear hierarchy, not from shipping 8 MB of JS.
4. **The 3D feature is opt-in and never blocks core function.** There's a hard "static/2D fallback" path that must meet the *same* budgets.
5. **Measurable and CI-gated.** Performance budgets are enforced in CI (to be set up in a later milestone), so a regression fails the build.

## 2. Core Web Vitals — contractual thresholds

| Metric | Threshold (good) | Must-not-regress past |
|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ **2.5 s** | 4.0 s |
| **INP** (Interaction to Next Paint) | ≤ **200 ms** | 500 ms |
| **CLS** (Cumulative Layout Shift) | ≤ **0.1** | 0.25 |
| **TBT** (Total Blocking Time) | ≤ **200 ms** | — |
| **TTFB** | ≤ **0.8 s** | — |

Additional mobile targets:
- **FCP** ≤ 1.8 s; **Speed Index** ≤ 3.4 s; **Time to Interactive** ≤ 3.5 s on a mid-tier device (e.g., ~3.5× CPU throttle, 4G).

## 3. Payload budgets (per page/screen)

These are per-navigation-session ceilings on an **initial critical render**, before lazy-loading of offscreen/exploratory content.

| Asset class | Budget (initial render) |
|---|---|
| **HTML (critical route)** | ≤ **200 KB** (uncompressed) |
| **CSS (critical, render-blocking)** | ≤ **50 KB** |
| **JS (critical, first interaction)** | ≤ **180 KB** gzip (we favour a **no-framework-JS, static-first** approach for landing/read screens; framework JS reserved for app-like interactive screens) |
| **Total JS (full app screen, lazy)** | ≤ **500 KB** gzip (budgeted, not all initial) |
| **Images (LCP + critical)** | ≤ **200 KB** |
| **Fonts** | ≤ **150 KB** (subset + variable; ≤ 2 families) |
| **Third-party / analytics** | ≤ **50 KB** gzip; lazy-load; no render-blocking |
| **Total transfer (first load)** | ≤ **1.0 MB** on a core route |

## 4. Image budget

Real photography is central, so image handling is where we must be disciplined.

- **Serve correct sizes & formats:** AVIF/WebP with JPEG fallback; `srcset`/`sizes`; responsive.
- **LCP image** must be **preloaded** and ≤ 200 KB.
- **Thumbnails** ≤ 30–50 KB (e.g., 320–480px wide, ~80% quality).
- **Card images** ≤ 80–120 KB (e.g., 800px wide).
- **Hero/cover images** ≤ 200 KB, `fetchpriority="high"` only for the actual LCP element.
- **Lazy-load** everything below the fold (`loading="lazy"`, `decoding="async"`).
- **Blur-up / placeholder:** tiny blur placeholder or solid `background-color` to avoid CLS; reserve explicit `width/height`/`aspect-ratio` on every image container (CLS).
- **Real-photo policy:** never trade authenticity for compression that ruins it. Preserve reasonable quality; use adaptive per-route sizing rather than a single huge asset.
- **No AI-generated images** (see `asset-strategy.md`) — does not change the budget, but reaffirms sourcing discipline.

## 5. The 3D experience — performance contract

The "lightweight 3D" signature feature has the strictest latency math because it's the most sensor-driven. Contract:

- **Opt-in only.** User explicitly enables 3D (or it appears only when device/context supports it). Core function works identically with 3D off.
- **Static/2D fallback is mandatory.** If 3D isn't available (reduced hardware, `prefers-reduced-motion`, no WebGL), render the **same information** as a 2D map/list at full function. Fallback must pass the budgets above.
- **Frame budget:** **target 60 fps, never below 30 fps** during interaction. Use passive listeners, `requestAnimationFrame`, avoid layout thrash (batch DOM reads/writes), avoid forcing reflow.
- **3D asset budget (per scene):**
  - Scene bundle (geometry/textures/glab/GLTF-or-eq): **≤ 1.2 MB** gzip for a typical destination scene.
  - Textures: ≤ 512×512 or ≤ 1024×1024, compressed (KTX2/WebP/basis); no unbounded 4K textures.
  - Draw calls: **≤ 100** per scene; LOD + instance where possible.
  - Geometry: prefer primitives/LOD; total triangles ≤ ~200k per scene (soft).
  - **No per-frame allocations** (GC pauses cause jank); reuse buffers; use object pools.
  - **Adaptive quality:** degrade (resolution scale, draw distance, shadow) based on device; never block.
  - **3D loads only on demand** (`IntersectionObserver`/intent), never in the critical path.
  - **`prefers-reduced-motion`:** skip 3D entirely → fallback; and disable auto-rotation/parallax animation.
  - **Size of 3D JS library ≤ 150 KB gzip** (choose a minimal renderer; avoid a huge engine for a decorative feature).
- **"0 lag" acceptance test:** 3D interact runs ≥ 45 fps sustained on a mid-range (~3.5× throttle) device with ≤ 1.2 MB network; 2D fallback meets Core Web Vitals.

## 6. Animation & motion budget

- Prefer **CSS transforms / opacity** (GPU-held) for animations — never animate `top/left/width/height/margin` (causes reflow/jank).
- Keep animations **≤ 150–250 ms**; avoid long-running loops that spike CPU/GPU.
- **`content-visibility` / `contain`** to skip offscreen work.
- Respect `prefers-reduced-motion` (disable non-essential motion, replace with opacity/crossfade).

## 7. Data & network strategy (shared-cost & bookings are data-heavy)

- **Server-side pagination & cursor-based lists;** never load the whole trip's history at once.
- **Real-time collaboration (itinerary/comments/votes):** use efficient sync (e.g., websocket/SSE with batching), not polling; coalesce events; don't re-render whole lists on one keystroke.
- **Debounce/throttle** searches and inputs.
- **Cache aggressive** (HTTP caching, ETag, SW caching for read-only content, offline fallback for itineraries).
- **Offline-aware:** itinerary and shared-cost workspace should be readable offline with a clear offline state; **never** show a dead blank screen.
- **Currency/price formatting & re-renders** must not cause layout shift.

## 8. Accessibility ↔ performance

Accessibility and performance reinforce each other:
- No jank during screen-reader/focus navigation.
- `aria-live` regions for async updates (cost added, match found) without heavy re-render.
- Reduced-motion users get the fallback path (which is also the performance-cheapest path).
- Maintain cacheability & reduced reflows, which help low-vision/slow-device users too.

## 9. Budget enforcement (Milestone 2+)

- **Lighthouse CI** in CI on mobile (4G, mid CPU/device).
- **Core Web Vitals** tracked over synthetic + real user monitoring (RUM) via field data later.
- **Per-budgets table** gate: if a route exceeds any budget, the **build fails** (configurable warning vs. blocking; blocking for the 4 critical CWV + payload).
- **Image pipeline** auto-generates responsive variants and never ships a >200 KB image unless explicitly needed for the LCP hero.

## 10. Summary table

| Area | Budget must-haves |
|---|---|
| CWV | LCP ≤2.5s · INP ≤200ms · CLS ≤0.1 · TBT ≤200ms |
| JS | ≤180 KB gzip critical (static-first landing) |
| CSS | ≤50 KB |
| Images | ≤200 KB LCP; responsive + AVIF/WebP; lazy below fold |
| Fonts | ≤150 KB; ≤2 families |
| 3D | ≤1.2 MB scene; ≥45–60 fps; mandatory 2D fallback; opt-in |
| Network | paginated, cached, offline-aware, coalesced real-time |
| Motion | transform/opacity only; ≤250ms; reduced-motion fallback |

*These figures are the guardrails; refine exact values with real device/field measurement during Milestone 2.*
