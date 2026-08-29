/* ============================================================
   TripCollab — Create trip with AI (Milestone 11)
   Collects inputs, calls the AI planner (built-in or your remote
   hook), previews the generated itinerary + shared-cost plan, and
   lets the user save it as a community guide or push it into the
   active Trip/Budget workspace.
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;
  const AID = window.TripCollabAIData;
  const AI = window.TripCollabAI;
  const store = window.TripCollabStore;

  const INTERESTS = ["Hidden gems", "Local food", "Culture & history", "Adventure", "Beaches", "Wellness"];

  let currentInput = null;
  let currentPlan = null;

  function selectedInterests() {
    return Array.prototype.slice
      .call(document.querySelectorAll("#cr-interests .chip-toggle.is-on"))
      .map(function (c) { return c.getAttribute("data-interest"); });
  }

  function buildDestOptions() {
    const sel = document.getElementById("cr-dest");
    if (!sel) return;
    const fromCurate = (AID ? Object.keys(AID.cityKits) : []).map(function (id) {
      const d = D.destinations && D.destinations.find(function (x) { return x.id === id; });
      return (d && d.name) || id;
    });
    // Build from cityKits so a guide always exists for the chosen destination.
    const opts = Object.keys(AID.cityKits).map(function (id) {
      const d = D.destinations && D.destinations.find(function (x) { return x.id === id; });
      return { id: id, name: (d && d.name) || id };
    });
    sel.innerHTML = opts
      .map(function (o, i) { return '<option value="' + o.id + '"' + (i === 0 ? " selected" : "") + ">" + o.name + "</option>"; })
      .join("");
  }

  function buildInterestChips() {
    const wrap = document.getElementById("cr-interests");
    if (!wrap) return;
    wrap.innerHTML = INTERESTS
      .map(function (k, i) {
        return '<button type="button" class="chip-toggle' + (i < 2 ? " is-on" : "") + '" data-interest="' + k + '">' + k + "</button>";
      })
      .join("");
    wrap.querySelectorAll(".chip-toggle").forEach(function (b) {
      b.addEventListener("click", function () {
        b.classList.toggle("is-on");
      });
    });
  }

  function toast(msg) {
    const el = document.getElementById("create-toast");
    if (el) { el.textContent = msg; el.hidden = false; }
    setTimeout(function () { if (el) el.hidden = true; }, 2600);
  }

  async function generate() {
    const btn = document.getElementById("cr-generate");
    const name = document.getElementById("cr-name").value.trim();
    const dest = document.getElementById("cr-dest").value;
    const days = parseInt(document.getElementById("cr-days").value, 10) || 4;
    const group = parseInt(document.getElementById("cr-group").value, 10) || 4;
    const budget = parseInt(document.getElementById("cr-budget").value, 10) || 3000;
    const pace = document.getElementById("cr-pace").value;
    const interests = selectedInterests();

    currentInput = {
      name: name,
      destinationId: dest,
      days: days,
      groupSize: group,
      budget: budget,
      pace: pace,
      interests: interests,
    };

    // Brief "thinking" state for the AI feel.
    btn.disabled = true;
    btn.innerHTML = TC.icon("i-clock", "icon") + " Building your trip…";
    await new Promise(function (r) { setTimeout(r, 650); });

    currentPlan = await AI.generate(currentInput);

    renderPlan(currentPlan);
    document.getElementById("cr-result").hidden = false;

    btn.disabled = false;
    btn.innerHTML = '<svg data-icon="i-arrow" aria-hidden="true"></svg> Generate trip';
    TC.hydrateIcons(document);
  }

  function renderPlan(plan) {
    const el = document.getElementById("cr-plan");
    if (!el) return;
    const TYPE_ICON = { hotel: "i-hotel", train: "i-train", plane: "i-plane", cab: "i-cab", guide: "i-guide", food: "i-food", discover: "i-discover" };
    const TYPE_LABEL = { hotel: "Stay", train: "Train", plane: "Flight", cab: "Cab", guide: "Guide", food: "Food", discover: "Discover" };

    // Budget-Collab strip
    const bc =
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
      "</div>";

    // Day-by-day
    const daysHTML = plan.days
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
              '<article class="tl-item">' +
                '<div class="card"><div class="card__body">' +
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
                "</div></div>" +
              "</article>"
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

    // AI notes + cost summary
    const notes = plan.notes
      .map(function (n) { return "<li>" + TC.icon("i-chat", "icon") + " " + n + "</li>"; })
      .join("");

    el.innerHTML =
      '<div class="card" style="margin-bottom:16px"><div class="card__body">' +
        '<div class="row__title" style="font-size:var(--tp-d2)">' + plan.name + "</div>" +
        '<div class="card__meta" style="margin-top:4px">' + plan.route + " · " + plan.dates + " · " + plan.daysCount + " day" + (plan.daysCount !== 1 ? "s" : "") + "</div>" +
        '<div class="review-stars" style="margin-top:6px">' +
          '<span class="pill pill--waypoint">' + TC.icon("i-map") + " " + plan.groupSize + " travellers</span>" +
          '<span class="pill">' + TC.icon("i-budget") + " total " + TC.inr(plan.total) + "</span>" +
          '<span class="pill">' + TC.icon("i-budget") + " " + TC.inr(plan.totalPerPerson) + "/person</span>" +
        "</div>" +
      "</div></div>" +
      bc +
      daysHTML +
      '<div class="card" style="margin-top:16px"><div class="card__body"><h3 class="card__title" style="margin-bottom:6px">AI notes</h3><ul class="bc__list">' + notes + "</ul></div></div>";
  }

  function currentGroup() {
    return D.group.slice(0, currentPlan.groupSize);
  }

  function buildPlanPayload(plan) {
    // Convert the AI plan into a trip object + cost lines that Trip/Budget
    // understand, plus the Budget-Collab story.
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
    // Add a budget-collab story tailored to the numbers.
    const budgetCollab = {
      title: "Budget-Collab — travel is possible together",
      pools: [{ label: "Pool", amount: plan.pooled }],
      combined: plan.pooled,
      unlocks: plan.notes.slice(0, 4),
    };
    return {
      trip: trip,
      costs: plan.costLines,
      budgetCollab: budgetCollab,
    };
  }

  function pushToTrip() {
    if (!currentPlan) return;
    const payload = buildPlanPayload(currentPlan);
    if (store) store.setActiveTrip(payload);
    toast("Trip pushed to your workspace — see Budget & Trip.");
    setTimeout(function () { window.location.href = "trip.html"; }, 900);
  }

  function saveAsGuide() {
    if (!currentPlan || !currentInput) return;
    const dest = (D.destinations.find(function (d) { return d.id === currentInput.destinationId; }) || {});
    const me = D.group[0];
    const guide = {
      id: "ug-" + Date.now(),
      destinationId: currentInput.destinationId,
      title: currentPlan.name,
      cover: currentPlan.cover,
      blurb: currentPlan.route + " · " + currentPlan.daysCount + " day trip built with TripCollab AI.",
      tag: dest.name || "AI trip",
      days: currentPlan.daysCount,
      author: { name: me.name, initials: me.initials, color: me.color, verified: true },
      likes: 0, views: 1,
      plan: currentPlan,
    };
    if (store) store.saveGuide(guide);
    toast("Guide saved — find it in the Guides hub.");
    setTimeout(function () { window.location.href = "guides.html"; }, 900);
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildDestOptions();
    buildInterestChips();
    document.getElementById("cr-generate").addEventListener("click", generate);
    document.getElementById("cr-save-guide").addEventListener("click", saveAsGuide);
    document.getElementById("cr-push-trip").addEventListener("click", pushToTrip);
    TC.hydrateIcons(document);
  });
})();
