/* ============================================================
   TripCollab — Trip home (collaborative planning)
   Renders hero, Budget-Collab moment, itinerary, comments.
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  const TYPE_ICON = {
    hotel: "i-hotel",
    train: "i-train",
    plane: "i-plane",
    cab: "i-cab",
    guide: "i-guide",
    food: "i-food",
    discover: "i-discover",
  };
  const TYPE_LABEL = {
    hotel: "Stay",
    train: "Train",
    plane: "Flight",
    cab: "Cab",
    guide: "Guide",
    food: "Food",
    discover: "Discover",
  };

  function renderHero() {
    const el = document.getElementById("trip-hero");
    if (!el) return;
    const t = D.trip;
    el.innerHTML =
      '<div class="hero">' +
        '<img src="' + t.cover + '" alt="' + t.name + '" loading="eager" fetchpriority="high" width="640" height="360" />' +
        '<div class="hero__scrim"></div>' +
        '<div class="hero__content">' +
          '<h1 class="hero__title">' + t.name + "</h1>" +
          '<div class="hero__meta">' +
            '<span class="pill">' + TC.icon("i-clock") + " " + t.dates + "</span>" +
            '<span class="pill">' + TC.icon("i-pin") + " " + t.route + "</span>" +
            '<span class="pill">' + TC.avatarCluster(D.group) + " " + D.group.length + "</span>" +
          "</div>" +
        "</div>" +
      "</div>";
  }

  function renderBudgetCollab() {
    const el = document.getElementById("budget-collab");
    if (!el) return;
    const bc = D.budgetCollab;
    const pools = bc.pools
      .map(function (p) {
        return '<span class="bc__pool"><strong>' + TC.inr(p.amount) + "</strong><span>" + p.label + "</span></span>";
      })
      .join('<span class="bc__plus" aria-hidden="true">+</span>');
    const unlocks = bc.unlocks
      .map(function (u) { return "<li>" + TC.icon("i-check", "icon") + " " + u + "</li>"; })
      .join("");

    el.innerHTML =
      '<div class="bc">' +
        '<h2 class="bc__title">' + bc.title + "</h2>" +
        '<div class="bc__pools">' + pools +
          '<span class="bc__eq" aria-hidden="true">=</span>' +
          '<span class="bc__total"><strong>' + TC.inr(bc.combined) + "</strong><span>combined</span></span>" +
        "</div>" +
        '<ul class="bc__list">' + unlocks + "</ul>" +
      "</div>";
  }

  function renderItinerary() {
    const el = document.getElementById("itinerary");
    if (!el) return;
    const t = D.trip;
    const dayHTML = t.days
      .map(function (day, di) {
        const items = day.items
          .map(function (item) {
            const icon = TYPE_ICON[item.type] || "i-pin";
            const label = TYPE_LABEL[item.type] || "Item";
            const cost = item.cost > 0 ? TC.inr(item.cost) : "Free";
            const thumb = item.img
              ? '<img class="tl-item__thumb" src="' + item.img + '" alt="" loading="lazy" decoding="async" width="200" height="200" />'
              : '<span class="tl-item__icon">' + TC.icon(icon) + "</span>";
            return (
              '<article class="tl-item">' +
                '<div class="card">' +
                  '<div class="card__body">' +
                    thumb +
                    "<div style=\"flex:1;min-width:0\">" +
                      '<span class="tl-item__time">' + day.label.split("·")[0].trim() + " · " + item.time + "</span>" +
                      '<div class="tl-item__title">' + item.title + "</div>" +
                      '<div class="tl-item__sub">' + item.sub + "</div>" +
                      '<div class="tl-item__foot">' +
                        '<span class="pill">' + label + "</span>" +
                        '<span class="pill pill--amber">' + cost + " · split</span>" +
                        (item.type === "guide"
                          ? '<span class="pill pill--verify">' + TC.icon("i-verify", "icon") + " Verified</span>"
                          : "") +
                      "</div>" +
                    "</div>" +
                  "</div>" +
                "</div>" +
              "</article>"
            );
          })
          .join("");
        return (
          '<div class="tl-day">' +
            '<div class="tl-day__head">' +
              '<span class="tl-day__num">Day ' + (di + 1) + "</span>" +
              '<span class="tl-day__label">' + day.label + "</span>" +
            "</div>" +
            '<div class="tl">' + items + "</div>" +
          "</div>"
        );
      })
      .join("");
    el.innerHTML = dayHTML;
  }

  function renderComments() {
    const el = document.getElementById("comments-section");
    if (!el) return;
    const comments = [
      { name: "Asha", initials: "AS", color: "var(--wp-waypoint)", text: "The hidden waterfall needs an early start — I've set the guide for 4pm so we finish before sunset." },
      { name: "Mei", initials: "ME", color: "var(--wp-verify)", text: "Can you add the SIM / UPI steps for me? First time in India 🙂" },
      { name: "Rahul", initials: "RA", color: "var(--wp-amber)", text: "Prices look within our pooled ₹3000 budget. Verified the jeep — good rate." },
    ];
    const html = comments
      .map(function (c) {
        return (
          '<div class="comment">' +
            '<span class="comment__avatar" style="background:' + c.color + '" title="' + c.name + '">' + c.initials + "</span>" +
            '<div class="comment__bubble">' +
              '<div class="comment__name">' + c.name + "</div>" +
              '<p class="comment__text">' + c.text + "</p>" +
            "</div>" +
          "</div>"
        );
      })
      .join("");
    el.innerHTML = '<div class="section__head"><h2 class="section__title">Discussion</h2></div>' + html;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.TripCollabStore) window.TripCollabStore.hydrate();
    renderHero();
    renderBudgetCollab();
    renderItinerary();
    renderComments();

    const copyBtn = document.getElementById("copy-link");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        const text = "Join my TripCollab trip: https://tripcollab.example/t/t1";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { flash(copyBtn); }, function () { fallbackCopy(text, copyBtn); });
        } else {
          fallbackCopy(text, copyBtn);
        }
      });
    }
  });

  function flash(btn) {
    const old = btn.innerHTML;
    btn.innerHTML = TC.icon("i-check", "icon") + " Link copied";
    btn.classList.add("btn--secondary");
    setTimeout(function () { btn.innerHTML = old; btn.classList.remove("btn--secondary"); }, 1600);
  }
  function fallbackCopy(text, btn) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); flash(btn); } catch (e) { btn.textContent = "Copy failed"; }
    document.body.removeChild(ta);
  }
})();
