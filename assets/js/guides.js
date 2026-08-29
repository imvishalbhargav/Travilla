/* ============================================================
   TripCollab — Guides hub (Milestone 11, Wanderlog-style)
   Renders the browse feed: destination filter chips + guide
   cards (cover, title, intro, author, likes/views). Merges the
   curated community guides with any the user has created.
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;
  const AID = window.TripCollabAIData;
  const store = window.TripCollabStore;

  const curate = AID ? AID.communityGuides : [];
  const IMG = "assets/img/";

  function fullGuides() {
    return (store ? store.readGuides() : []).concat(curate);
  }

  function guidePlan(guide) {
    // If it has an embedded plan (user-created), use it. Curated ones are
    // turned into a live plan on demand via the AI planner.
    if (guide.plan) return guide.plan;
    const kit = AID && AID.cityKits[guide.destinationId];
    if (kit) return null; // opened elsewhere; we only need card data here
    return null;
  }

  function allDestinations() {
    // destination chips from the guide catalogue + the all-India list.
    const seen = {};
    const out = [];
    curate.concat(store ? store.readGuides() : []).forEach(function (g) {
      if (g.destinationId && !seen[g.destinationId] && D.destinations) {
        const d = D.destinations.find(function (x) { return x.id === g.destinationId; });
        if (d) { seen[g.destinationId] = true; out.push(d); }
        else { seen[g.destinationId] = true; out.push({ id: g.destinationId, name: g.tag || g.destinationId }); }
      }
    });
    if (!out.length) out.push({ id: "", name: "All" });
    return out;
  }

  function renderFilters() {
    const nav = document.getElementById("dest-filter");
    if (!nav) return;
    // "All" + curated destination chips.
    const chips = [{ id: "", name: "All" }].concat(allDestinations());
    nav.innerHTML = chips
      .map(function (d, i) {
        return '<a href="#" data-dest="' + d.id + '" aria-selected="' + (i === 0 ? "true" : "false") + '">' +
               TC.icon("i-pin") + " " + d.name + "</a>";
      })
      .join("");
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        nav.querySelectorAll("a").forEach(function (x) { x.setAttribute("aria-selected", "false"); });
        a.setAttribute("aria-selected", "true");
        renderGrid(a.getAttribute("data-dest"));
      });
    });
  }

  function cardMetrics(g) {
    const likes = g.likes || 0;
    const views = g.views || 0;
    const liked = store ? store.liked(g.id) : false;
    return (
      '<div class="guide-card__foot">' +
        '<button class="btn btn--ghost guide-love" data-guide="' + g.id + '" aria-pressed="' + (liked ? "true" : "false") + '">' +
          TC.icon(liked ? "i-star" : "i-star") + " <span>" + likes + "</span>" +
        "</button>" +
        '<span class="chip">' + TC.icon("i-map") + " " + views + " views</span>" +
      "</div>"
    );
  }

  function renderGrid(filter) {
    const grid = document.getElementById("guide-grid");
    const count = document.getElementById("guide-count");
    if (!grid) return;
    const all = fullGuides().filter(function (g) {
      return !filter || g.destinationId === filter;
    });
    if (count) count.textContent = all.length + " guide" + (all.length !== 1 ? "s" : "");

    if (!all.length) {
      grid.innerHTML =
        '<div class="card"><div class="card__body"><p class="card__meta" style="margin:0">No guides here yet — be the first to create one.</p></div></div>';
      return;
    }

    grid.innerHTML = all
      .map(function (g) {
        const days = g.days || (g.plan ? g.plan.daysCount || g.plan.days.length : 3);
        const destName = (D.destinations.find(function (d) { return d.id === g.destinationId; }) || {}).name || g.tag;
        return (
          '<a class="card place-card guide-card-link" href="guide.html#' + g.id + '">' +
            '<div class="media">' +
              '<img src="' + g.cover + '" alt="' + g.title + '" loading="lazy" decoding="async" width="800" height="533" />' +
              '<span class="media__badge">' + TC.icon("i-pin") + " " + g.tag + "</span>" +
            "</div>" +
            '<div class="place-card__body">' +
              '<div class="place-card__tags">' +
                '<span class="pill pill--waypoint">' + (destName || g.tag) + "</span>" +
                '<span class="pill">' + days + " day" + (days !== 1 ? "s" : "") + "</span>" +
              "</div>" +
              '<h3 class="place-card__title">' + g.title + "</h3>" +
              '<p class="place-card__desc">' + g.blurb + "</p>" +
              '<div class="guide-card__author">' +
                '<span class="comment__avatar" style="background:' + g.author.color + '">' + g.author.initials + "</span>" +
                '<span class="guide-card__author-name">' + g.author.name + (g.author.verified ? ' <span class="badge-verify">' + TC.icon("i-verify", "icon") + "</span>" : "") + "</span>" +
              "</div>" +
              cardMetrics(g) +
            "</div>" +
          "</a>"
        );
      })
      .join("");

    bindLikes();
    TC.hydrateIcons(grid);
  }

  function bindLikes() {
    document.querySelectorAll(".guide-love").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!store) return;
        const id = btn.getAttribute("data-guide");
        const nowLiked = store.toggleLike(id);
        const span = btn.querySelector("span");
        const cur = parseInt(span.textContent, 10) || 0;
        span.textContent = nowLiked ? cur + 1 : Math.max(0, cur - 1);
        btn.setAttribute("aria-pressed", nowLiked ? "true" : "false");
        btn.classList.toggle("is-liked", nowLiked);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderFilters();
    renderGrid("");
  });
})();
