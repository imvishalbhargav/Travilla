/* ============================================================
   TripCollab — Home (Milestone 10)
   Cinematic hero, active trip, All-India destination explorer,
   and quick actions (transport / reviews / groups).
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  document.addEventListener("DOMContentLoaded", function () {
    renderTrip();
    renderDestinations();
    renderQuick();
  });

  function renderTrip() {
    const list = document.getElementById("trip-list");
    if (!list) return;
    const trip = D.trip, group = D.group;
    list.innerHTML =
      '<a class="trip-card card fade-up" href="trip.html">' +
        '<div class="media media--wide">' +
          '<img src="' + trip.cover + '" alt="' + trip.name + '" loading="lazy" decoding="async" width="640" height="360" />' +
          '<span class="media__badge">' + TC.icon("i-pin") + " " + trip.route + "</span>" +
        "</div>" +
        '<div class="trip-card__body">' +
          "<div>" +
            '<h2 class="trip-card__title">' + trip.name + "</h2>" +
            '<div class="trip-card__meta">' +
              "<span>" + TC.icon("i-clock") + " " + trip.dates + "</span>" +
              "<span>" + TC.icon("i-train") + " " + trip.route + "</span>" +
            "</div>" +
            '<div class="trip-card__meta" style="margin-top:8px">' + TC.avatarCluster(group) + " <span>" + group.length + " travellers</span></div>" +
          "</div>" +
          '<span class="pill pill--waypoint trip-card__status">' + trip.status + "</span>" +
        "</div>" +
      "</a>";
    TC.hydrateIcons(list);
  }

  function renderDestinations() {
    const grid = document.getElementById("destination-grid");
    if (!grid) return;
    grid.innerHTML = D.destinations
      .map(function (d) {
        return (
          '<a class="card place-card" href="discover.html">' +
            '<div class="media">' +
              '<img src="' + d.img + '" alt="' + d.name + ' — ' + d.state + '" loading="lazy" decoding="async" width="800" height="533" />' +
              '<span class="media__badge">' + TC.icon("i-pin") + " " + d.tag + "</span>" +
            "</div>" +
            '<div class="place-card__body">' +
              '<h3 class="place-card__title">' + d.name + " <span class=\"card__meta\">· " + d.state + "</span></h3>" +
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

  function renderQuick() {
    const grid = document.getElementById("quick-grid");
    if (!grid) return;
    const items = [
      { icon: "i-map", title: "Travel guides", sub: "Browse curated itineraries", href: "guides.html", cta: "Explore" },
      { icon: "i-plus", title: "Create with AI", sub: "Generate a trip in seconds", href: "create.html", cta: "Start" },
      { icon: "i-train", title: "Book transport", sub: "Flights, trains, buses & cabs", href: "transport.html", cta: "Book" },
      { icon: "i-hotel", title: "Book a stay", sub: "Real, reviewed properties", href: "hotels.html", cta: "Book" },
      { icon: "i-guide", title: "Verified local guides", sub: "Hidden gems, real people", href: "discover.html", cta: "Find" },
      { icon: "i-match", title: "Find your group", sub: "Compatibility + budget pooling", href: "match.html", cta: "Match" },
      { icon: "i-budget", title: "Shared cost", sub: "Settle-up & AI budget advice", href: "budget.html", cta: "Manage" },
      { icon: "i-star", title: "Reviews & photos", sub: "Real traveller feedback", href: "trip.html", cta: "Read" },
    ];
    grid.innerHTML = items
      .map(function (it) {
        return (
          '<a class="card quick-card" href="' + it.href + '">' +
            '<div class="card__body">' +
              '<span class="tl-item__icon" style="margin-bottom:10px">' + TC.icon(it.icon) + "</span>" +
              '<h3 class="card__title">' + it.title + "</h3>" +
              '<p class="card__meta" style="margin-top:4px">' + it.sub + "</p>" +
              '<span class="card__meta" style="color:var(--wp-waypoint);font-weight:600;margin-top:10px">' + it.cta + " →</span>" +
            "</div>" +
          "</a>"
        );
      })
      .join("");
    TC.hydrateIcons(grid);
  }
})();
