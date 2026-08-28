/* ============================================================
   TripCollab — Discover
   Hidden places, local culture, verified guides, assistance.
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  document.addEventListener("DOMContentLoaded", function () {
    renderPlaces();
    renderGuides();
    renderAssist();
  });

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
            "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderGuides() {
    const list = document.getElementById("guide-list");
    if (!list) return;
    list.innerHTML = D.guides
      .map(function (g) {
        return (
          '<div class="guide-card">' +
            '<img class="guide-card__photo" src="' + g.img + '" alt="' + g.name + '" loading="lazy" decoding="async" width="112" height="112" />' +
            "<div>" +
              '<div class="guide-card__name">' + g.name +
                '<span class="pill pill--solid-verify" title="Verified local guide">' + TC.icon("i-verify", "icon") + " Verified</span>" +
              "</div>" +
              '<div class="guide-card__role">' + g.role + "</div>" +
              '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:6px">' +
                '<span class="pill">' + TC.icon("i-pin") + " " + g.location + "</span>" +
                '<span class="pill">' + TC.icon("i-chat") + " " + g.languages + "</span>" +
                '<span class="pill">' + TC.icon("i-star") + " " + g.rating + " (" + g.trips + " trips)</span>" +
              "</div>" +
            "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderAssist() {
    const grid = document.getElementById("assist-grid");
    if (!grid) return;
    grid.innerHTML = D.assistance
      .map(function (a) {
        return (
          '<article class="card" style="padding:var(--sp-4)">' +
            '<span class="tl-item__icon" style="margin-bottom:10px">' + TC.icon(a.icon) + "</span>" +
            '<h3 class="card__title">' + a.title + "</h3>" +
            '<p class="card__meta" style="margin-top:4px">' + a.text + "</p>" +
          "</article>"
        );
      })
      .join("");
  }
})();
