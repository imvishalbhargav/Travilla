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
  }

  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  // Hydrate immediately at parse time (data.js already ran), so pages
  // that snapshot seed data (e.g. budget.js grabs D.costs) see bookings.
  hydrate();

  return {
    addBooking: addBooking,
    addedCount: addedCount,
    hydrate: hydrate,
    clear: clear,
  };
})();
