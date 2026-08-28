/* ============================================================
   TripCollab — Discover (Milestones 7 & 8)
   Hidden places, local culture, verified guides (bookable),
   and foreign-traveller assistance (step-by-step flows).
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  document.addEventListener("DOMContentLoaded", function () {
    renderDestinations();
    renderPlaces();
    renderGuides();
    renderAssist();
  });

  function renderDestinations() {
    const grid = document.getElementById("destination-grid");
    if (!grid) return;
    grid.innerHTML = D.destinations
      .map(function (d) {
        return (
          '<a class="card place-card" href="transport.html">' +
            '<div class="media">' +
              '<img src="' + d.img + '" alt="' + d.name + " — " + d.state + '" loading="lazy" decoding="async" width="800" height="533" />' +
              '<span class="media__badge">' + TC.icon("i-pin") + " " + d.tag + "</span>" +
            "</div>" +
            '<div class="place-card__body">' +
              '<h3 class="place-card__title">' + d.name + ' <span class="card__meta">· ' + d.state + "</span></h3>" +
              '<p class="place-card__desc">' + d.desc + "</p>" +
              '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:8px">' +
                '<span class="chip">' + TC.icon("i-star") + " " + d.rating + "</span>" +
                '<span class="chip">' + TC.icon("i-budget") + " from " + TC.inr(d.from) + "</span>" +
                (d.popular ? '<span class="pill pill--amber">Popular</span>' : "") +
              "</div>" +
            "</div>" +
          "</a>"
        );
      })
      .join("");
    TC.hydrateIcons(grid);
  }

  function renderPlaces() {
    const grid = document.getElementById("places-grid");
    if (!grid) return;
    grid.innerHTML = D.places
      .map(function (p) {
        return (
          '<article class="card place-card">' +
            '<div class="media">' +
              '<img src="' + p.img + '" alt="' + p.title + ' — ' + p.location + '" loading="lazy" decoding="async" width="800" height="533" />' +
              '<span class="media__badge">' + TC.icon("i-pin") + " " + p.badge + "</span>" +
            "</div>" +
            '<div class="place-card__body">' +
              '<div class="place-card__tags">' +
                '<span class="pill pill--waypoint">' + p.category + "</span>" +
                '<span class="pill">' + p.location + "</span>" +
              "</div>" +
              '<h3 class="place-card__title">' + p.title + "</h3>" +
              '<p class="place-card__desc">' + p.desc + "</p>" +
              '<button class="btn btn--secondary" style="margin-top:12px" data-save-place="' + p.id + '">' +
                TC.icon("i-plus") + " Save to trip" +
              "</button>" +
            "</div>" +
          "</article>"
        );
      })
      .join("");
    bindSavePlaces();
  }

  function bindSavePlaces() {
    document.querySelectorAll("[data-save-place]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const p = D.places.find(function (x) { return x.id === btn.getAttribute("data-save-place"); });
        if (!p) return;
        const orig = btn.innerHTML;
        btn.innerHTML = TC.icon("i-check", "icon") + " Saved — " + p.title.split(",")[0];
        btn.classList.add("btn--secondary");
        btn.disabled = true;
        setTimeout(function () { btn.innerHTML = orig; btn.classList.remove("btn--secondary"); btn.disabled = false; }, 1800);
      });
    });
  }

  function renderGuides() {
    const list = document.getElementById("guide-list");
    if (!list) return;
    list.innerHTML = D.guides
      .map(function (g) {
        return (
          '<div class="guide-card">' +
            '<img class="guide-card__photo" src="' + g.img + '" alt="' + g.name + '" loading="lazy" decoding="async" width="112" height="112" />' +
            "<div style=\"flex:1;min-width:0\">" +
              '<div class="guide-card__name">' + g.name +
                '<span class="pill pill--solid-verify" title="Verified local guide">' + TC.icon("i-verify", "icon") + " Verified</span>" +
              "</div>" +
              '<div class="guide-card__role">' + g.role + "</div>" +
              '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:6px">' +
                '<span class="pill">' + TC.icon("i-pin") + " " + g.location + "</span>" +
                '<span class="pill">' + TC.icon("i-chat") + " " + g.languages + "</span>" +
                '<span class="pill">' + TC.icon("i-star") + " " + g.rating + " (" + g.trips + " trips)</span>" +
                '<span class="pill">' + TC.icon("i-budget") + " " + TC.inr(g.pricePerDay) + "/day</span>" +
              "</div>" +
              '<div style="display:flex;flex-wrap:wrap;gap:0.375rem;margin-top:6px">' +
                g.specialities.map(function (s) { return '<span class="chip">' + s + "</span>"; }).join("") +
              "</div>" +
              '<button class="btn btn--primary" style="margin-top:14px" data-book-guide="' + g.id + '">' +
                TC.icon("i-guide") + " Book this guide" +
              "</button>" +
            "</div>" +
          "</div>"
        );
      })
      .join("");
    bindBookGuides();
  }

  function bindBookGuides() {
    document.querySelectorAll("[data-book-guide]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const g = D.guides.find(function (x) { return x.id === btn.getAttribute("data-book-guide"); });
        if (!g) return;
        const travellers = D.group.map(function (m) { return m.id; });
        const booking = {
          label: "Verified guide · " + g.name + " (1 day)",
          type: "guide",
          amount: g.pricePerDay,
          currency: "INR",
          payer: D.group[0].id,
          travellers: travellers,
          title: "Verified guide — " + g.name,
          sub: g.location + " · hidden gems & local culture · " + g.specialities[0],
          dayIdx: 1,
          img: g.img,
          time: "09:00",
        };
        if (window.TripCollabStore) window.TripCollabStore.addBooking(booking);
        confirmBook(btn, g);
      });
    });
  }

  function confirmBook(btn, g) {
    const orig = btn.innerHTML;
    btn.innerHTML = TC.icon("i-check", "icon") + " Guide booked — added to trip & shared cost";
    btn.disabled = true;
    btn.classList.add("btn--secondary");
    const toast = document.getElementById("discover-toast");
    if (toast) { toast.textContent = "Added " + g.name + " to the Goa shared cost · see Budget & Trip."; toast.hidden = false; }
    setTimeout(function () { btn.innerHTML = orig; btn.classList.remove("btn--secondary"); btn.disabled = false; }, 2200);
  }

  function renderAssist() {
    const grid = document.getElementById("assist-grid");
    if (!grid) return;
    grid.innerHTML = D.assistance
      .map(function (a, i) {
        const steps = a.steps
          .map(function (s, j) {
            return (
              '<li style="display:flex;gap:0.5rem;align-items:flex-start;font-size:var(--tp-body-sm)">' +
                '<span class="assist-step">' + (j + 1) + "</span><span>" + s + "</span>" +
              "</li>"
            );
          })
          .join("");
        return (
          '<article class="card assist-card">' +
            '<div class="card__body">' +
              '<span class="tl-item__icon" style="margin-bottom:10px">' + TC.icon(a.icon) + "</span>" +
              '<h3 class="card__title">' + a.title + "</h3>" +
              '<p class="card__meta" style="margin-top:4px">' + a.text + "</p>" +
              '<div class="assist-meta"><span class="chip">' + a.meta + "</span></div>" +
              '<div class="assist-steps">' + steps + "</div>" +
            "</div>" +
          "</article>"
        );
      })
      .join("");
  }
})();
