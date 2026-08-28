/* ============================================================
   TripCollab — Match
   Compatible-group matching + the Budget-Collab signature.
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  document.addEventListener("DOMContentLoaded", function () {
    renderCollab();
    renderCompat();
    renderGroup();

    const cta = document.getElementById("match-cta");
    if (cta) {
      cta.addEventListener("click", function () {
        const original = cta.innerHTML;
        cta.innerHTML = TC.icon("i-check", "icon") + " 3 compatible travellers found";
        cta.classList.add("btn--secondary");
        cta.disabled = true;
        setTimeout(function () {
          cta.innerHTML = original;
          cta.classList.remove("btn--secondary");
          cta.disabled = false;
        }, 1800);
      });
    }
  });

  function renderCollab() {
    const el = document.getElementById("match-collab");
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
        '<p class="card__meta">Two groups, each too small alone, become one trip together.</p>' +
        '<div class="bc__pools">' + pools +
          '<span class="bc__eq" aria-hidden="true">=</span>' +
          '<span class="bc__total"><strong>' + TC.inr(bc.combined) + "</strong><span>combined</span></span>" +
        "</div>" +
        '<ul class="bc__list">' + unlocks + "</ul>" +
      "</div>";
  }

  function renderCompat() {
    const el = document.getElementById("compat");
    if (!el) return;
    const dims = [
      { label: "Budget", value: "94%", pct: 94 },
      { label: "Travel pace", value: "88%", pct: 88 },
      { label: "Interests", value: "91%", pct: 91 },
      { label: "Language", value: "85%", pct: 85 },
    ];
    const rows = dims
      .map(function (d) {
        return (
          '<div style="margin-bottom:12px">' +
            '<div style="display:flex;justify-content:space-between;font-size:var(--tp-body-sm);font-weight:600">' +
              "<span>" + d.label + "</span><span>" + d.value + "</span>" +
            "</div>" +
            '<div style="height:6px;background:var(--wp-surface-2);border-radius:6px;margin-top:6px;overflow:hidden">' +
              '<div style="width:' + d.pct + '%;height:100%;background:var(--wp-waypoint);border-radius:6px"></div>' +
            "</div>" +
          "</div>"
        );
      })
      .join("");
    el.innerHTML =
      '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:16px">' +
        '<div style="font-family:var(--font-display);font-size:2.5rem;font-weight:700;color:var(--wp-waypoint)">91%</div>' +
        '<div><div style="font-weight:700">Overall compatibility</div>' +
        '<div class="card__meta">Based on budget, pace, interests & language.</div></div>' +
      "</div>" + rows;
  }

  function renderGroup() {
    const el = document.getElementById("match-group");
    if (!el) return;
    // A suggested pooled group: two teams of 1500 -> 3000 (Budget-Collab).
    const people = [
      { name: "Team 1 · Asha + Rahul", tag: "Budget ₹1500 each", color: "var(--wp-waypoint)" },
      { name: "Team 2 · Mei + Zoey", tag: "Budget ₹1500 each", color: "var(--wp-amber)" },
    ];
    el.innerHTML =
      people
        .map(function (p) {
          return (
            '<div class="row">' +
              '<span class="avatar" style="width:2.5rem;height:2.5rem;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;background:' + p.color + '">' + (p.name.split(" ")[1][0]) + "</span>" +
              "<div class=\"row__main\">" +
                '<div class="row__title">' + p.name + "</div>" +
                '<div class="row__sub">' + p.tag + "</div>" +
              "</div>" +
              '<button class="pill pill--waypoint" type="button">Pool</button>' +
            "</div>"
          );
        })
        .join("") +
      '<div class="card" style="margin-top:12px;background:var(--wp-amber-soft);border-color:transparent">' +
        '<div class="card__body" style="display:flex;align-items:center;gap:0.75rem">' +
          TC.icon("i-check", "icon") +
          "<span style=\"font-size:var(--tp-body-sm);font-weight:600\">Combined budget <b>" +
          TC.inr(3000) + "</b> — the Goa trip becomes feasible together.</span>" +
        "</div>" +
      "</div>";
  }
})();
