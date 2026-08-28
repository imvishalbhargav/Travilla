/* ============================================================
   TripCollab — Trips list (home)
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("trip-list");
    const empty = document.getElementById("trip-empty");
    if (!list) return;

    const trip = D.trip;
    const group = D.group;

    // Real photography cover + group avatar cluster + cost status.
    list.innerHTML =
      '<a class="trip-card card fade-up" href="trip.html">' +
        '<div class="media media--wide">' +
          '<img src="' + trip.cover + '" alt="' + trip.name + '" loading="eager" fetchpriority="high" width="640" height="360" />' +
          '<span class="media__badge">' + TC.icon("i-pin") + " " + trip.route + "</span>" +
        "</div>" +
        '<div class="trip-card__body">' +
          "<div>" +
            '<h2 class="trip-card__title">' + trip.name + "</h2>" +
            '<div class="trip-card__meta">' +
              "<span>" + TC.icon("i-clock") + " " + trip.dates + "</span>" +
              "<span>" + TC.icon("i-train") + " " + trip.route + "</span>" +
            "</div>" +
            '<div class="trip-card__meta" style="margin-top:8px">' +
              TC.avatarCluster(group) +
              " <span>" + group.length + " travellers</span>" +
            "</div>" +
          "</div>" +
          '<span class="pill pill--waypoint trip-card__status">' + trip.status + "</span>" +
        "</div>" +
      "</a>";

    if (trip) empty.hidden = true;

    // Helpers used by TC are already loaded.
    TC.hydrateIcons(list);
  });
})();
