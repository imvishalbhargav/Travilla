/* ============================================================
   TripCollab — Transport booking (Milestone 10)
   Bus / flight / train / cab. Book via the store -> shared cost
   + itinerary on the trip. Real photography, no AI, no secrets.
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  const LABELS = { flight: "Flights", train: "Trains", bus: "Buses", cab: "Cabs" };
  const ICONS = { flight: "i-plane", train: "i-train", bus: "i-cab", cab: "i-cab" };
  const TYPE = { flight: "plane", train: "train", bus: "cab", cab: "cab" };
  const DAY = { flight: 2, train: 0, bus: 0, cab: 1 };
  // data key for each mode (transport inventory uses these)
  const MODE_KEY = { flight: "plane", train: "train", bus: "bus", cab: "cab" };

  let mode = "train";

  document.addEventListener("DOMContentLoaded", function () {
    render();
    document.querySelectorAll("#mode-tabs a").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); setMode(a.getAttribute("data-mode")); });
    });
  });

  function setMode(next) {
    mode = next;
    document.querySelectorAll("#mode-tabs a").forEach(function (a) {
      a.setAttribute("aria-selected", a.getAttribute("data-mode") === next ? "true" : "false");
    });
    render();
  }

  function render() {
    const title = document.getElementById("mode-title");
    const count = document.getElementById("mode-count");
    const list = document.getElementById("transport-list");
    if (!list) return;
    const key = MODE_KEY[mode];
    if (title) title.textContent = LABELS[mode];
    if (count) count.textContent = (D.transport[key] || []).length + " options";

    list.innerHTML = (D.transport[key] || [])
      .map(function (o, i) {
        const perPerson = Math.round(o.price);
        return (
          '<article class="card transport-card fade-up" style="margin-bottom:16px">' +
            '<div class="transport-card__row">' +
              '<span class="tl-item__icon">' + TC.icon(ICONS[mode]) + "</span>" +
              "<div style=\"flex:1;min-width:0\">" +
                '<div class="row__title">' + o.operator + "</div>" +
                '<div class="row__sub">' + TC.icon("i-pin") + " " + o.from + " → " + o.to + "</div>" +
              "</div>" +
              '<div class="row__trailing"><span class="transport-card__price">' + TC.inr(perPerson) + "</span>" +
                '<div class="card__meta">per person</div></div>' +
            "</div>" +
            '<div class="transport-card__meta">' +
              '<span class="chip">' + TC.icon("i-clock") + " " + o.departure + "</span>" +
              '<span class="chip">' + TC.icon("i-clock") + " " + o.duration + "</span>" +
            "</div>" +
            '<button class="btn btn--primary btn--block" style="margin-top:12px" data-book-transport="' + o.id + '">' +
              TC.icon(ICONS[mode]) + " Book · " + TC.inr(perPerson) +
            "</button>" +
          "</article>"
        );
      })
      .join("");
    bindBook();
  }

  function bindBook() {
    document.querySelectorAll("[data-book-transport]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const key = MODE_KEY[mode];
        const o = (D.transport[key] || []).find(function (x) { return x.id === btn.getAttribute("data-book-transport"); });
        if (!o) return;
        const travellers = D.group.map(function (m) { return m.id; });
        const booking = {
          label: (LABELS[mode] + " · " + o.operator + " (" + o.from + "→" + o.to + ")"),
          type: TYPE[mode],
          amount: o.price,
          currency: "INR",
          payer: D.group[0].id,
          travellers: travellers,
          title: LABELS[mode] + " — " + o.operator,
          sub: o.from + " → " + o.to + " · " + o.departure + " · " + o.duration,
          dayIdx: DAY[mode],
          img: o.img,
          time: (o.departure.split(" ")[0] || "12:00"),
        };
        if (window.TripCollabStore) window.TripCollabStore.addBooking(booking);
        confirm(btn, o);
      });
    });
  }

  function confirm(btn, o) {
    const orig = btn.innerHTML;
    btn.innerHTML = TC.icon("i-check", "icon") + " Booked — added to trip & shared cost";
    btn.disabled = true;
    btn.classList.add("btn--secondary");
    const toast = document.getElementById("transport-toast");
    if (toast) { toast.textContent = "Added " + o.operator + " to the shared cost · see Budget & Trip."; toast.hidden = false; }
    setTimeout(function () { btn.innerHTML = orig; btn.classList.remove("btn--secondary"); btn.disabled = false; }, 2200);
  }
})();
