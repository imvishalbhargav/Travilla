/* ============================================================
   TripCollab — Guide detail (Milestone 11)
   Opens a single guide (from the hub) and renders its full
   itinerary + budget-collab + AI notes. If the guide doesn't yet
   carry a plan (curated), it generates one live via the AI planner
   so "Use this plan" and "Push to my trip" always work.
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;
  const AID = window.TripCollabAIData;
  const AI = window.TripCollabAI;
  const store = window.TripCollabStore;

  const TYPE_ICON = { hotel: "i-hotel", train: "i-train", plane: "i-plane", cab: "i-cab", guide: "i-guide", food: "i-food", discover: "i-discover" };
  const TYPE_LABEL = { hotel: "Stay", train: "Train", plane: "Flight", cab: "Cab", guide: "Guide", food: "Food", discover: "Discover" };

  let current = null; // { g, plan }

  function findGuide(id) {
    const curated = AID ? AID.communityGuides : [];
    const user = store ? store.readGuides() : [];
    return curated.concat(user).find(function (g) { return g.id === id; }) || null;
  }

  function buildPlanFor(g) {
    if (g.plan) return g.plan;
    const kit = AID && AID.cityKits[g.destinationId];
    if (!kit) return null;
    // Generate a default plan from the guide's destination.
    return AI.planLocal({
      destinationId: g.destinationId,
      days: g.days || 3,
      groupSize: 4,
      budget: 3000,
      pace: "Balanced",
      interests: ["Hidden gems", "Local food"],
      name: g.title,
      theme: g.tag,
      route: kit.region,
    });
  }

  function toast(msg) {
    const el = document.getElementById("guide-toast");
    if (el) { el.textContent = msg; el.hidden = false; }
    setTimeout(function () { if (el) el.hidden = true; }, 2600);
  }

  function render() {
    const id = location.hash.replace("#", "");
    const el = document.getElementById("guide-detail");
    if (!el) return;
    const g = findGuide(id);
    if (!g) {
      el.innerHTML = '<div class="card"><div class="card__body"><h2 class="section__title">Guide not found</h2><p class="card__meta" style="margin:4px 0 12px">This guide may have been removed.</p><a class="btn btn--primary" href="guides.html">Browse guides</a></div></div>';
      return;
    }
    const plan = buildPlanFor(g) || {};
    current = { g: g, plan: plan };
    const days = plan.daysCount || g.days || 3;
    const dest = (D.destinations.find(function (d) { return d.id === g.destinationId; }) || {});
    const author = g.author || { name: "TripCollab", initials: "TC", color: "var(--wp-waypoint)", verified: true };

    el.innerHTML =
      '<section class="hero-cinema fade-up" style="margin-top:0">' +
        '<img src="' + g.cover + '" alt="' + g.title + '" fetchpriority="high" decoding="async" />' +
        '<div class="hero-cinema__scrim"></div>' +
        '<div class="hero-cinema__content">' +
          '<p class="hero-cinema__kicker">' + (dest.name || g.tag) + " guide</p>" +
          '<h1 class="hero-cinema__title">' + g.title + "</h1>" +
          '<p class="hero-cinema__sub">' + g.blurb + "</p>" +
          '<div class="hero-cinema__actions">' +
            '<button class="btn btn--glass" type="button" id="g-like">' + TC.icon("i-star") + " <span>" + (g.likes || 0) + "</span></button>" +
            '<button class="btn btn--primary" type="button" id="g-push"><svg data-icon="i-check" aria-hidden="true"></svg> Use this plan</button>' +
          "</div>" +
        "</div>" +
      "</section>" +

      '<div class="card" style="margin:16px 0"><div class="card__body">' +
        '<div class="guide-card__author">' +
          '<span class="comment__avatar" style="background:' + author.color + '">' + author.initials + "</span>" +
          '<div><div class="guide-card__author-name">' + author.name +
            (author.verified ? ' <span class="badge-verify">' + TC.icon("i-verify", "icon") + "</span>" : "") +
          "</div>" +
          '<div class="card__meta">' + (g.views || 0) + " views · " + days + " day trip</div></div>" +
        "</div>" +
      "</div></div>" +

      (plan.feasible !== undefined ? renderBudget(plan) : "") +
      (plan.days ? renderDays(plan) : "") +
      (plan.notes ? renderNotes(plan) : "");

    bindActions(g, plan);
    TC.hydrateIcons(el);
  }

  function renderBudget(plan) {
    return (
      '<div class="bc" style="margin-bottom:16px">' +
        '<h2 class="bc__title">Budget-Collab</h2>' +
        '<div class="bc__pools">' +
          '<span class="bc__pool"><strong>' + TC.inr(plan.budget) + "</strong><span>per person</span></span>" +
          '<span class="bc__plus" aria-hidden="true">×</span>' +
          '<span class="bc__pool"><strong>' + plan.groupSize + "</strong><span>travellers</span></span>" +
          '<span class="bc__eq" aria-hidden="true">=</span>' +
          '<span class="bc__total"><strong>' + TC.inr(plan.pooled) + "</strong><span>pooled</span></span>" +
        "</div>" +
        '<span class="pill ' + (plan.feasible ? "pill--verify" : "pill--amber") + '" style="margin-top:8px">' +
          TC.icon(plan.feasible ? "i-check" : "i-arrow", "icon") + " " +
          (plan.feasible ? "Fits budget · " + TC.inr(plan.totalPerPerson) + "/person" : "Over by " + TC.inr(plan.overBy) + "/person") +
        "</span>" +
      "</div>"
    );
  }

  function renderDays(plan) {
    return plan.days
      .map(function (day, di) {
        const items = day.items
          .map(function (it) {
            const icon = TYPE_ICON[it.type] || "i-pin";
            const label = TYPE_LABEL[it.type] || (it.cost > 0 ? "Cost" : "Free");
            const cost = it.cost > 0 ? TC.inr(it.cost) : "Free";
            const thumb = it.img
              ? '<img class="tl-item__thumb" src="' + it.img + '" alt="" loading="lazy" decoding="async" width="200" height="200" />'
              : '<span class="tl-item__icon">' + TC.icon(icon) + "</span>";
            return (
              '<article class="tl-item"><div class="card"><div class="card__body">' +
                thumb +
                '<div style="flex:1;min-width:0">' +
                  '<span class="tl-item__time">' + it.time + "</span>" +
                  '<div class="tl-item__title">' + it.title + "</div>" +
                  '<div class="tl-item__sub">' + it.sub + "</div>" +
                  '<div class="tl-item__foot">' +
                    '<span class="pill">' + label + "</span>" +
                    '<span class="pill ' + (it.cost > 0 ? "pill--amber" : "") + '">' + cost + "</span>" +
                    (it.type === "guide" ? '<span class="pill pill--verify">' + TC.icon("i-verify", "icon") + " Verified</span>" : "") +
                  "</div>" +
                "</div>" +
              "</div></div></article>"
            );
          })
          .join("");
        return (
          '<div class="tl-day">' +
            '<div class="tl-day__head"><span class="tl-day__num">Day ' + (di + 1) + "</span><span class=\"tl-day__label\">" + day.label + "</span></div>" +
            '<div class="tl">' + items + "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderNotes(plan) {
    return (
      '<div class="card" style="margin-top:16px"><div class="card__body">' +
        '<h3 class="card__title" style="margin-bottom:6px">AI notes</h3>' +
        '<ul class="bc__list">' + plan.notes.map(function (n) { return "<li>" + TC.icon("i-chat", "icon") + " " + n + "</li>"; }).join("") + "</ul>" +
      "</div></div>"
    );
  }

  function bindActions(g, plan) {
    const like = document.getElementById("g-like");
    if (like) {
      const liked = store ? store.liked(g.id) : false;
      if (liked) like.classList.add("is-liked");
      like.addEventListener("click", function () {
        if (!store) return;
        const nowLiked = store.toggleLike(g.id);
        const span = like.querySelector("span");
        const cur = parseInt(span.textContent, 10) || 0;
        span.textContent = nowLiked ? cur + 1 : Math.max(0, cur - 1);
        like.classList.toggle("is-liked", nowLiked);
      });
    }
    const push = document.getElementById("g-push");
    if (push && plan && plan.days) {
      push.addEventListener("click", function () {
        const payload = buildPlanPayload(plan);
        if (store) store.setActiveTrip(payload);
        toast("Plan copied to your workspace — see Budget & Trip.");
        setTimeout(function () { window.location.href = "trip.html"; }, 900);
      });
    }
  }

  function buildPlanPayload(plan) {
    const trip = {
      id: "t-" + Date.now(),
      name: plan.name,
      cover: plan.cover,
      dates: plan.dates,
      route: plan.route,
      currency: plan.currency,
      status: "Planning",
      days: plan.days,
    };
    return {
      trip: trip,
      costs: plan.costLines,
      budgetCollab: {
        title: "Budget-Collab — travel is possible together",
        pools: [{ label: "Pool", amount: plan.pooled }],
        combined: plan.pooled,
        unlocks: plan.notes.slice(0, 4),
      },
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    window.addEventListener("hashchange", render);
  });
})();
