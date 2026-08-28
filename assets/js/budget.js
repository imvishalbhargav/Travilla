/* ============================================================
   TripCollab — Budget
   Shared-cost calculation, feasibility, AI budget advice.
   The budget-increase recommendation shows its reasoning
   explicitly (never a black box).
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  document.addEventListener("DOMContentLoaded", function () {
    renderSummary();
    renderCostLines();
    renderAi();
  });

  // Sum all itinerary item costs (the plan total, per group split).
  function planTotal() {
    let sum = 0;
    D.trip.days.forEach(function (day) {
      day.items.forEach(function (it) { sum += Number(it.cost) || 0; });
    });
    return sum;
  }

  function renderSummary() {
    const el = document.getElementById("cost-summary");
    if (!el) return;
    const people = D.group.length;
    const total = planTotal();
    const pooledPerPerson = 3000; // combined group budget after pooling
    const perPerson = Math.round(total / people);
    el.innerHTML =
      "<div><div class=\"cost-summary__val\">" + TC.inr(total) + "</div><div class=\"cost-summary__lab\">Plan total</div></div>" +
      "<div><div class=\"cost-summary__val\">" + TC.inr(perPerson) + "</div><div class=\"cost-summary__lab\">Per person</div></div>" +
      "<div><div class=\"cost-summary__val\">" + TC.inr(pooledPerPerson) + "</div><div class=\"cost-summary__lab\">Pooled budget</div></div>";
  }

  function renderCostLines() {
    const el = document.getElementById("cost-lines");
    if (!el) return;
    const rows = [];
    D.trip.days.forEach(function (day) {
      day.items.forEach(function (it) {
        rows.push({
          label: it.title,
          sub: it.sub,
          cost: Number(it.cost) || 0,
        });
      });
    });
    // Free / zero-cost items still shown for transparency.
    el.innerHTML = rows
      .map(function (r) {
        const costTxt = r.cost > 0 ? TC.inr(r.cost) : "Free";
        return (
          '<div class="row">' +
            "<div class=\"row__main\">" +
              '<div class="row__title">' + r.label + "</div>" +
              '<div class="row__sub">' + r.sub + "</div>" +
            "</div>" +
            '<div class="row__trailing"><span class="pill pill--amber">' + costTxt + "</span></div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderAi() {
    const el = document.getElementById("ai-budget");
    if (!el) return;
    const people = D.group.length;
    const total = planTotal();
    const perPerson = Math.round(total / people);
    const budget = 3000;   // combined budget per-person after pooling
    const short = Math.max(0, perPerson - budget);
    const feasibility = perPerson <= budget ? "Feasible" : "Over";
    const pill =
      feasibility === "Feasible"
        ? '<span class="pill pill--verify">' + TC.icon("i-check", "icon") + " Feasible</span>"
        : '<span class="pill pill--amber">Over budget</span>';

    // Explainable recommendation: if over, suggest the smallest concrete increase.
    const rec =
      feasibility === "Over"
        ? "Increase per-person budget by " + TC.inr(short) +
          " (to " + TC.inr(perPerson) + ") OR drop the return flight and take the train again (" +
          TC.inr(total - 3600) + " total)."
        : "You're within budget with room to add a cultural experience.";

    el.innerHTML =
      '<div class="section__head"><h2 class="section__title">AI budget check</h2>' + pill + "</div>" +
      '<div class="card" style="border-color:var(--wp-waypoint)">' +
        '<div class="card__body">' +
          "<p class=\"card__meta\">Plan: " + TC.inr(perPerson) + "/person · Budget: " + TC.inr(budget) + "/person (pooled)</p>" +
          '<div style="font-family:var(--font-numeric);font-size:1.25rem;font-weight:700;margin:8px 0 4px">' +
            feasibility + " — " + (feasibility === "Over" ? TC.inr(short) + " over per person" : "on track") +
          "</div>" +
          '<div style="height:8px;background:var(--wp-surface-2);border-radius:8px;overflow:hidden;margin:12px 0">' +
            '<div style="width:' + Math.min(100, Math.round((perPerson / budget) * 100)) + '%;height:100%;background:' + (feasibility === "Over" ? "var(--wp-amber)" : "var(--wp-verify)") + ';border-radius:8px"></div>' +
          "</div>" +
          '<div class="card" style="margin-top:16px;background:var(--wp-amber-soft);border-color:transparent">' +
            '<div class="card__body">' +
              "<b>Recommendation</b>" +
              '<p style="margin:6px 0 0;color:var(--wp-ink)">' + rec + "</p>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>";
  }
})();
