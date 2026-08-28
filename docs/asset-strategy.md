# TripCollab — Asset Strategy

> **Purpose:** Define where every piece of media, imagery, and brand asset comes from, and enforce the **"real photography, never AI-generated"** pledge. This is the sourcing & licensing plan for Milestone 2+; **we do not download assets during this documentation milestone.**

## 1. The non-negotiable pledge

1. **No AI-generated imagery anywhere in the product** — no generative images for places, trips, guides, avatars, covers, or marketing. This is a brand and *trust* commitment.
2. **Real photography is a trust signal.** A place's photo must plausibly be *the* place; a guide's photo must be *the* human. Misleading imagery breaks the entire "verified / hidden gems / foreign-traveller assistance" promise.
3. **Decorativeness is limited.** Any decorative imagery must be real too, or explicitly flagged as a non-photographic brand graphic (illustration/iconography), which is allowed and distinct from "AI-generated photorealistic imagery."
4. **Attribution & licensing hygiene.** Every real asset has a documented origin, license, and credit where required. No hotlinked assets from competitors.

## 2. Asset categories

| Category | Source | Notes / license |
|---|---|---|
| **Place / destination photography** | Curated real photographers, tourism boards & destination marketing organisations (DMOs), local partners, community contributors, licensed stock (editorial/royalty-free). | Rights-managed or clear CC/commercial license. Never AI. |
| **Hidden gems / local culture** | Editorial shoots, local contributors, partner operators, community submissions (verified where possible). | Editorial value; track attribution. |
| **Verified local guide media** | Self-submitted + platform-verified (identity/credential). Must show the actual guide. | On the guide profile; real-time/current-ish. |
| **Traveller avatars** | User-uploaded real photos (with a "no AI/face-filter" policy), or avatar initials fallback. | Do not use AI face generation. |
| **Trip covers** | User supply or licensed real imagery; or the destination's real hero photo. | If user has none, use a licensed real destination image. |
| **Illustration / iconography / brand graphics** | In-house original vector/illustration; **not photorealistic AI**. | These are brand graphics, permitted, and distinct from the no-AI-photo pledge. |
| **Wayline 3D scene textures** | Real material/geographic textures or procedural **geometry** (not photorealistic content imagery of places). | Procedural/geometric is fine; photoreal place depictions must remain real photos on the 2D cards. |

## 3. Sourcing hierarchy (preferred → fallback)

When a destination/place needs an image, use in this order:

1. **First-party real photography** from our own shoots / verified partner operators (best authenticity).
2. **DMO / tourism board / official provider** imagery (authoritative, licensed).
3. **Verified local contributors / community** (with attribution + moderation).
4. **Licensed stock media** (editorial/royalty-free with clear license) — only where authenticity is acceptable; prefer authentic over generic-stock look.
5. **User-supplied real photos** (for trips/avatars/guides).
6. **Never:** AI-generated photoreal imagery, competitor imagery, unlicensed scrapes.

## 4. Asset processing & quality pipeline (Milestone 2+)

- **Responsive variants** — generate AVIF/WebP/JPEG at multiple widths; `srcset`/`sizes`.
- **Image budgets** per `performance-budget.md` (thumb ≤30–50 KB, card ≤80–120 KB, hero ≤200 KB, LCP preloaded).
- **Explicit dimensions / aspect-ratio** on every container to prevent CLS.
- **Blur-up / placeholder** lightweight, or solid bg + LQIP.
- **Orientation rules:** places 3:2, avatars/guides 1:1, covers 16:9 or 3:2. Never force-crop to the point of misleading a place.
- **Curation:** an editorial/community moderation note on whether a photo is genuine and current; stale/incorrect place photos get flagged.
- **Alt text policy:** meaningful alt where the image carries info; empty alt for purely decorative.

## 5. Real-photo sourcing for hidden gems & guides

- **Hidden gems** need *specific* photography (waterfalls, parks, cafés, culture) taken at the actual site. Rely on local contributors/partner operators for places without good stock coverage.
- **Verified guides** must have a current, recognizable photo; verification pipeline confirms identity. Reviews attach to the real guide, not a generic agency shot.
- **Anti-deception:** no "representative" photos presented as a specific hidden gem or a specific guide if they are not. Flag and disclose when a photo is illustrative/editorial (with a clear caption), never silently.

## 6. Storage & CDN (Milestone 2+)

- **Object storage + CDN** for images (e.g., cloud object storage + global CDN). No serving large binaries from the app server.
- **Versioned, content-hashed** asset URLs for cache busting.
- **Client never holds API keys**; media loading uses signed, short-lived URLs.
- **Licensing metadata** stored alongside assets (source, license, credit, expiry if any) for audit.

## 7. No-API-key / no-secret rule

- No API keys, tokens, or secrets in client code, commits, or docs. Any third-party media/photo provider is accessed server-side; the browser only gets signed URLs.
- Enforce via `AGENTS.md` secrets rules + `.gitignore`/CI secret scanning.

## 8. What we will NOT do

- **No AI-generated images** (places, trips, guides, avatars, covers, marketing).
- **No scraping competitor images** (Booking.com, Airbnb, Google, Atlas Obscura, etc.).
- **No unlicensed stock** without documenting the license.
- **No hotlinking** from third-party sites.
- **No "stock-looking" generic** imagery pretending to be a verified guide or specific hidden gem.

## 9. Milestone gating

- **Milestone 1 (this):** no assets downloaded. This doc defines the policy.
- **Milestone 2:** begin sourcing **real photography** for the showcase (destinations, a hidden gem, a guide) through the preferred hierarchy, with licensing metadata and responsive pipeline. No AI imagery, ever.

## 10. Asset strategy summary

| Rule | Policy |
|---|---|
| AI-generated imagery | **Banned** everywhere |
| Real photography | **Required** for places, guides, gems, avatars |
| Preferred source | First-party / DMO / verified contributors → licensed stock as fallback |
| Licensing/attribution | Documented for every asset |
| Deception | No representative photo presented as a specific place/guide |
| Processing | Responsive AVIF/WebP, budgeted sizes, aspect-ratio (CLS), blur-up |
| Storage | CDN + object storage, content-hashed, signed URLs, no secrets in client |
