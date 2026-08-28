/* ============================================================
   TripCollab — Hotels (Milestone 6, first booking vertical)
   Browse properties, pick rooms/travellers, and book. Booking
   adds a cost line (shared-cost workspace) and an itinerary item
   on the trip, via the client store (no backend / no keys).
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  let nights = 4;
  let guests = 4;

  document.addEventListener("DOMContentLoaded", function () {
    renderHotels();

    const guestsSel = document.getElementById("guests");
    if (guestsSel) guestsSel.addEventListener("change", function () { guests = Number(guestsSel.value); renderHotels(); });
  });

  function totalCost(h) {
    const rooms = h.rooms === 2 ? (guests === 2 ? 1 : 2) : 2;
    return h.perNight * rooms * nights;
  }

  function renderHotels() {
    const el = document.getElementById("hotel-list");
    if (!el) return;
    const count = document.getElementById("stay-count");
    if (count) count.textContent = D.hotels.length + " stays";

    el.innerHTML = D.hotels
      .map(function (h, i) {
        const cost = totalCost(h);
        const perPerson = Math.round(cost / guests);
        return (
          '<article class="card hotel-card fade-up" style="margin-bottom:16px">' +
            '<div class="media media--wide">' +
              '<img src="' + h.img + '" alt="' + h.name + ' — ' + h.place + '" loading="lazy" decoding="async" width="800" height="400" />' +
              '<span class="media__badge">' + TC.icon("i-star") + " " + h.rating + " (" + h.reviews + ")</span>" +
            "</div>" +
            '<div class="hotel-card__body">' +
              '<div class="place-card__tags">' +
                '<span class="pill pill--waypoint">' + h.type + "</span>" +
                h.tags.map(function (t) { return '<span class="pill">' + t + "</span>"; }).join("") +
              "</div>" +
              '<h3 class="place-card__title">' + h.name + "</h3>" +
              '<p class="card__meta">' + TC.icon("i-pin") + " " + h.place + "</p>" +
              '<p class="place-card__desc">' + h.desc + "</p>" +
              '<div class="hotel-card__foot">' +
                '<div>' +
                  '<span class="hotel-card__price">' + TC.inr(cost) + "</span>" +
                  '<span class="hotel-card__per"> · ' + nights + " nights · " + roomsLabel() + "</span>" +
                "</div>" +
                '<span class="chip">' + TC.icon("i-budget") + " " + TC.inr(perPerson) + "/person</span>" +
              "</div>" +
              '<button class="btn btn--primary btn--block" style="margin-top:12px" data-book="' + h.id + '">' +
                TC.icon("i-hotel") + " Book this stay" +
              "</button>" +
            "</div>" +
          "</article>"
        );
      })
      .join("");

    bindBook();
  }

  function roomsLabel() {
    const rooms = guests === 2 ? 1 : 2;
    return rooms + (rooms === 1 ? " room" : " rooms");
  }

  function bindBook() {
    document.querySelectorAll("[data-book]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const h = D.hotels.find(function (x) { return x.id === btn.getAttribute("data-book"); });
        if (!h) return;
        const cost = totalCost(h);
        const payer = D.group[0].id;
        const travellers = D.group.slice(0, guests).map(function (m) { return m.id; });
        const booking = {
          label: "Stay · " + h.name + " (" + nights + " nts)",
          type: "hotel",
          amount: cost,
          currency: "INR",
          payer: payer,
          travellers: travellers,
          title: "Stay — " + h.name,
          sub: h.place + " · " + nights + " nights · " + roomsLabel(),
          dayIdx: 1,
          img: h.img,
          time: "12:00",
        };
        window.TripCollabStore.addBooking(booking);
        confirmBook(btn, h, cost);
      });
    });
  }

  function confirmBook(btn, h, cost) {
    const original = btn.innerHTML;
    btn.innerHTML = TC.icon("i-check", "icon") + " Booked — added to trip & shared cost";
    btn.disabled = true;
    btn.classList.add("btn--secondary");
    const toast = document.getElementById("stay-toast");
    if (toast) {
      toast.textContent = "Added " + TC.inr(cost) + " to the Goa shared cost · see Budget & Trip.";
      toast.hidden = false;
    }
    setTimeout(function () {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.classList.remove("btn--secondary");
    }, 2200);
  }
})();
