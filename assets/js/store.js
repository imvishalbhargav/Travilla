/* ============================================================
   TripCollab — Client store (Milestone 6)
   Persists bookings made on any page so they survive navigation
   and flow into the trip itinerary and shared-cost workspace.
   Uses localStorage (client-side only — no backend, no API keys,
   no secrets). Demo data only; cleared on demand.
   ============================================================ */

window.TripCollabStore = (function () {
  "use strict";

  const KEY = "tripcollab.bookings.v1";
  const ACTIVE_TRIP_KEY = "tripcollab.activeTrip.v1";
  const GUIDES_KEY = "tripcollab.guides.v1";
  const LIKES_KEY = "tripcollab.likes.v1";

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore malformed/blocked storage */ }
    return { addedCosts: [], addedItinerary: [] };
  }

  function write(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* quota/blocked */ }
  }

  function addBooking(booking) {
    const data = read();
    const type = booking.type || "hotel";
    const cost = {
      id: "bk" + Date.now(),
      label: booking.label,
      type: type,
      amount: booking.amount,
      currency: booking.currency,
      payer: booking.payer,
      split: { rule: "equal", participants: booking.travellers },
    };
    data.addedCosts.push(cost);

    const item = {
      id: "bi" + Date.now(),
      type: type,
      time: booking.time || "12:00",
      title: booking.title,
      sub: booking.sub || "Booked on TripCollab",
      cost: booking.amount,
      img: booking.img || window.TripCollabData.IMG + "goa-stay.jpg",
    };
    data.addedItinerary.push({ dayIdx: booking.dayIdx || 0, item: item });
    write(data);
    return cost;
  }

  function addedCount() { return read().addedCosts.length; }

  function hydrate() {
    // Merge persisted bookings into the (fresh-each-navigation) seed data so
    // Budget & Trip pages render them. We do NOT drain: every page load
    // rebuilds the seed from data.js, so merging the same bookings again is
    // idempotent. clear() resets everything.
    const data = read();
    const D = window.TripCollabData;
    data.addedCosts.forEach(function (c) { D.costs.push(c); });
    data.addedItinerary.forEach(function (b) {
      const day = D.trip.days[b.dayIdx];
      if (day) day.items.push(b.item);
    });

    // If the user generated a trip and pushed it into the workspace, apply it
    // so Trip & Budget show the active plan instead of the demo Goa seed.
    const active = getActiveTrip();
    if (active && active.plan) {
      try {
        D.trip = active.plan.trip;
        D.costs = active.plan.costs;
        D.budgetCollab = active.plan.budgetCollab;
      } catch (e) { /* ignore */ }
    }
  }

  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  // ---- Active trip (AI-generated trip pushed into the workspace) ----
  function setActiveTrip(plan) {
    try { localStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify({ plan: plan, at: Date.now() })); } catch (e) {}
  }
  function getActiveTrip() {
    try { const raw = localStorage.getItem(ACTIVE_TRIP_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return null;
  }
  function clearActiveTrip() { try { localStorage.removeItem(ACTIVE_TRIP_KEY); } catch (e) {} }

  // ---- User-generated community guides (browse + created) ----
  function readGuides() {
    try { const raw = localStorage.getItem(GUIDES_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return [];
  }
  function saveGuide(guide) {
    const gs = readGuides();
    // Ignore duplicates by id.
    if (!gs.some(function (g) { return g.id === guide.id; })) gs.unshift(guide);
    try { localStorage.setItem(GUIDES_KEY, JSON.stringify(gs)); } catch (e) {}
    return gs.length;
  }
  function guidesCount() { return readGuides().length; }

  // ---- Likes (per-guide, client-side only) ----
  function liked(id) {
    try { const raw = localStorage.getItem(LIKES_KEY); if (raw) return JSON.parse(raw).indexOf(id) > -1; } catch (e) {}
    return false;
  }
  function toggleLike(id) {
    let list = [];
    try { const raw = localStorage.getItem(LIKES_KEY); if (raw) list = JSON.parse(raw); } catch (e) {}
    const i = list.indexOf(id);
    if (i > -1) list.splice(i, 1); else list.push(id);
    try { localStorage.setItem(LIKES_KEY, JSON.stringify(list)); } catch (e) {}
    return i === -1; // true if now liked
  }

  // Hydrate immediately at parse time (data.js already ran), so pages
  // that snapshot seed data (e.g. budget.js grabs D.costs) see bookings.
  hydrate();

  return {
    addBooking: addBooking,
    addedCount: addedCount,
    hydrate: hydrate,
    clear: clear,
    setActiveTrip: setActiveTrip,
    getActiveTrip: getActiveTrip,
    clearActiveTrip: clearActiveTrip,
    readGuides: readGuides,
    saveGuide: saveGuide,
    guidesCount: guidesCount,
    liked: liked,
    toggleLike: toggleLike,
  };
})();
