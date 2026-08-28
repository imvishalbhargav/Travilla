/* ============================================================
   TripCollab — Match (Milestone 3)
   Compatible-group matching: a real scoring engine over
   traveller preferences, plus dynamic Budget-Collab pooling.
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  let mode = "assemble";

  document.addEventListener("DOMContentLoaded", function () {
    renderPoolCalc();
    renderCollab();

    // Budget slider output.
    const budget = document.getElementById("budget");
    if (budget) {
      const out = document.getElementById("budget-out");
      const updateOut = function () { out.textContent = TC.inr(budget.value); };
      budget.addEventListener("input", updateOut);
      updateOut();
    }

    // Mode toggle.
    document.querySelectorAll("#mode-tabs a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        setMode(a.getAttribute("data-mode"));
      });
    });

    // Match CTA.
    const cta = document.getElementById("match-cta");
    if (cta) {
      cta.addEventListener("click", function () {
        const results = match();
        if (results && results.length) {
          const el = document.getElementById("results");
          el.hidden = false;
          renderResults(results);
          if (el.scrollIntoView) try { el.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
          pulse(cta, results.length);
        } else {
          pulseEmpty(cta);
        }
      });
    }

    // Pool calculator is live-bound.
    document.addEventListener("input", function (e) {
      if (e.target && e.target.closest("#pool-calc")) renderPoolCalc();
    });
  });

  function setMode(next) {
    mode = next;
    document.querySelectorAll("#mode-tabs a").forEach(function (a) {
      const sel = a.getAttribute("data-mode") === next;
      a.setAttribute("aria-selected", sel ? "true" : "false");
    });
    const routeSec = document.getElementById("route-section");
    const title = document.getElementById("route-title");
    if (next === "join") {
      title.textContent = "Join a planned trip";
      document.getElementById("from").value = "—";
      document.getElementById("to").value = "Goa (14–18 Dec)";
      document.getElementById("route-hint").textContent = "We'll show compatible travellers who fit this trip and could join it.";
    } else {
      title.textContent = "Build a group for a route";
      document.getElementById("from").value = "Jaipur";
      document.getElementById("to").value = "Goa";
      document.getElementById("route-hint").textContent = "We'll match you with travellers who fit this route.";
    }
    // Re-run match if results are visible.
    const results = document.getElementById("results");
    if (results && !results.hidden) {
      const r = match();
      if (r && r.length) renderResults(r);
    }
  }

  /* ---- Scoring engine ---- */
  function prefs() {
    const interests = Array.from(document.getElementById("interests").selectedOptions).map(function (o) { return o.value; });
    return {
      budget: Number(document.getElementById("budget").value),
      pace: document.getElementById("pace").value,
      interests: interests,
      language: document.getElementById("language").value,
      dateFlex: document.getElementById("dateflex").value,
    };
  }

  function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

  function dimScore(c, p) {
    const w = D.matchWeights;
    const out = {};
    let total = 0;

    // Budget: higher score when budgets are close.
    const ratio = c.prefs.budget / Math.max(1, p.budget);
    const budgetScore = lerp(0.55, 1.0, 1 - Math.min(1, Math.abs(ratio - 1) / 0.6));
    out.budget = { label: "Budget", pct: Math.round(budgetScore * 100), value: TC.inr(c.prefs.budget) };
    total += budgetScore * w.budget;

    // Pace: exact match high; "Balanced" is compatible with anything.
    const paceScore = c.prefs.pace === p.pace ? 1.0 : (p.pace === "Balanced" ? 0.8 : 0.5);
    out.pace = { label: "Pace", pct: Math.round(paceScore * 100), value: c.prefs.pace };
    total += paceScore * w.pace;

    // Interests: Jaccard overlap.
    const a = new Set(c.prefs.interests);
    const b = new Set(p.interests);
    let inter = 0;
    a.forEach(function (x) { if (b.has(x)) inter++; });
    const union = new Set([...a, ...b]).size || 1;
    const interestScore = inter / union;
    out.interests = { label: "Interests", pct: Math.round(interestScore * 100), value: inter + " shared" };
    total += interestScore * w.interests;

    // Language: any shared language.
    const langMatch = c.language.indexOf(p.language) !== -1 ? 1.0 : 0.35;
    out.language = { label: "Language", pct: Math.round(langMatch * 100), value: c.language.join(" · ") };
    total += langMatch * w.language;

    // Travel style: exact or complementary.
    const styleMap = { Adventure: ["Adventure", "Friends"], Culture: ["Culture", "Relaxed"], Relaxed: ["Culture", "Relaxed"], Friends: ["Friends", "Adventure"] };
    const styles = styleMap[p.pace === "Packed itinerary" ? "Adventure" : (p.pace === "Slow & relaxed" ? "Culture" : "Friends")];
    const styleScore = styles.indexOf(c.prefs.style) !== -1 ? 1.0 : 0.5;
    out.style = { label: "Style", pct: Math.round(styleScore * 100), value: c.prefs.style };
    total += styleScore * w.style;

    // Date flexibility: flexible is easiest.
    const flexMap = { Flexible: 1.0, Somewhat: 0.7, Fixed: 0.4 };
    const flexScore = flexMap[c.prefs.dateFlex] * (p.dateFlex === "Flexible" ? 1.0 : 0.85);
    out.dateFlex = { label: "Dates", pct: Math.round(flexScore * 100), value: c.prefs.dateFlex };
    total += flexScore * w.dateFlex;

    return { overall: Math.round(total * 100), dims: out };
  }

  function match() {
    let p;
    try { p = prefs(); } catch (e) { return []; }
    if (!p.interests.length) p.interests = ["Hidden gems", "Local food"];
    return D.candidates
      .map(function (c) {
        const s = dimScore(c, p);
        return { candidate: c, score: s };
      })
      .sort(function (a, b) { return b.score.overall - a.score.overall; });
  }

  function renderResults(results) {
    const el = document.getElementById("results-list");
    if (!el) return;
    el.innerHTML = results
      .map(function (r, i) {
        const c = r.candidate;
        const s = r.score;
        const dims = Object.keys(s.dims)
          .map(function (k) {
            const d = s.dims[k];
            return (
              '<div style="margin-bottom:8px">' +
                '<div style="display:flex;justify-content:space-between;font-size:var(--tp-caption);font-weight:600">' +
                  "<span>" + d.label + "</span><span>" + d.value + "</span>" +
                "</div>" +
                '<div style="height:5px;background:var(--wp-surface-2);border-radius:5px;overflow:hidden;margin-top:4px">' +
                  '<div style="width:' + d.pct + '%;height:100%;background:var(--wp-waypoint);border-radius:5px"></div>' +
                "</div>" +
              "</div>"
            );
          })
          .join("");
        const score = s.overall;
        const ringColor = score >= 80 ? "var(--wp-verify)" : score >= 60 ? "var(--wp-waypoint)" : "var(--wp-amber)";
        return (
          '<article class="card fade-up" style="margin-bottom:16px">' +
            '<div class="card__body">' +
              '<div style="display:flex;align-items:center;gap:1rem">' +
                '<div class="score-ring" style="--ring:' + ringColor + ';--val:' + score + '" role="img" aria-label="' + score + '% compatibility">' +
                  '<span>' + score + "%</span>" +
                "</div>" +
                "<div style=\"flex:1;min-width:0\">" +
                  '<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">' +
                    '<span style="font-weight:700">' + c.name + "</span>" +
                    (c.verified ? '<span class="pill pill--verify">' + TC.icon("i-verify", "icon") + " Verified</span>" : "") +
                  "</div>" +
                  '<div class="card__meta">' + c.tagline + " · " + c.city + "</div>" +
                  '<div style="display:flex;gap:0.375rem;flex-wrap:wrap;margin-top:6px">' +
                    '<span class="chip">' + TC.icon("i-budget") + " " + TC.inr(c.prefs.budget) + "</span>" +
                    '<span class="chip">' + TC.icon("i-clock") + " " + c.prefs.pace + "</span>" +
                    '<span class="chip">' + TC.icon("i-chat") + " " + c.language[0] + "</span>" +
                  "</div>" +
                "</div>" +
              "</div>" +
              '<div style="margin-top:14px">' + dims + "</div>" +
              '<div style="display:flex;gap:0.625rem;margin-top:14px">' +
                '<button class="btn btn--primary" style="flex:1" data-action="invite" data-name="' + c.name + '">Invite to trip</button>' +
                '<button class="btn btn--secondary" style="flex:1" data-action="request" data-name="' + c.name + '">Request to join</button>' +
              "</div>" +
            "</div>" +
          "</article>"
        );
      })
      .join("");
    bindResultButtons();
  }

  function bindResultButtons() {
    document.querySelectorAll("[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const name = btn.getAttribute("data-name");
        const action = btn.getAttribute("data-action");
        const original = btn.innerHTML;
        btn.innerHTML = TC.icon("i-check", "icon") + " " + (action === "invite" ? "Invited" : "Requested") + " " + name.split(" ")[0];
        btn.disabled = true;
        btn.classList.add("btn--secondary");
        setTimeout(function () { btn.innerHTML = original; btn.disabled = false; btn.classList.remove("btn--secondary"); }, 1800);
      });
    });
  }

  /* ---- Dynamic Budget-Collab calculator ---- */
  function renderPoolCalc() {
    const el = document.getElementById("pool-calc");
    if (!el) return;
    const tripCost = D.tripTotal();
    const totalPeople = 4;
    const myBudget = 1500, myCount = 2;   // Team 1 · per person
    const theirBudget = 1500, theirCount = 2; // Team 2 · per person
    // Budget-Collab: two teams each contribute ₹1,500/person; by pooling
    // (shared room/jeep/guide + partner offers) the group gains
    // ₹3,000/person of budget capacity — enough for a ₹2,338/person trip.
    const pooledPerPerson = myBudget + theirBudget; // ₹3,000
    const tripPerPerson = Math.round(tripCost / totalPeople);
    const feasible = pooledPerPerson >= tripPerPerson;
    const pct = Math.min(100, Math.round((tripPerPerson / pooledPerPerson) * 100));

    el.innerHTML =
      '<div class="bc__pools">' +
        '<span class="bc__pool"><strong>' + TC.inr(myBudget) + "</strong><span>Team 1 · " + myCount + " ppl</span></span>" +
        '<span class="bc__plus" aria-hidden="true">+</span>' +
        '<span class="bc__pool"><strong>' + TC.inr(theirBudget) + "</strong><span>Team 2 · " + theirCount + " ppl</span></span>" +
        '<span class="bc__eq" aria-hidden="true">=</span>' +
        '<span class="bc__total"><strong>' + TC.inr(pooledPerPerson) + "</strong><span>per person pooled</span></span>" +
      "</div>" +
      '<div class="card__meta">Goa trip needs ' + TC.inr(tripPerPerson) + "/person · " + totalPeople + " travellers sharing costs</div>" +
      '<div style="height:8px;background:var(--wp-surface-2);border-radius:8px;overflow:hidden;margin:14px 0">' +
        '<div style="width:' + pct + '%;height:100%;background:' + (feasible ? "var(--wp-verify)" : "var(--wp-amber)") + ';border-radius:8px;transition:width 300ms var(--ease-out)"></div>' +
      "</div>" +
      '<div style="display:flex;align-items:center;gap:0.625rem;flex-wrap:wrap">' +
        '<span class="pill ' + (feasible ? "pill--verify" : "pill--amber") + '">' +
          TC.icon(feasible ? "i-check" : "i-arrow") + " " + (feasible ? "Feasible together" : "Still short — add a group") +
        "</span>" +
        '<button class="btn btn--primary" data-action-pool>' +
          TC.icon("i-match") + " Pool with matched team" +
        "</button>" +
      "</div>";
  }

  /* ---- Animated signature moment ---- */
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
        '<div class="bc__wayline" aria-hidden="true">' +
          '<svg viewBox="0 0 320 60" preserveAspectRatio="none">' +
            '<path d="M10 30 C 90 6, 230 54, 310 30" fill="none" stroke="var(--wp-waypoint)" stroke-width="2.5" stroke-linecap="round" class="wl-draw"/>' +
          "</svg>" +
          '<span class="bc__dot" style="left:2%"></span>' +
          '<span class="bc__dot" style="left:98%"></span>' +
          '<span class="bc__spark" style="left:50%">' + TC.icon("i-verify") + "</span>" +
        "</div>" +
        '<h2 class="bc__title">' + bc.title + "</h2>" +
        '<p class="card__meta">Two groups, each too small alone, become one trip together.</p>' +
        '<div class="bc__pools">' + pools +
          '<span class="bc__eq" aria-hidden="true">=</span>' +
          '<span class="bc__total"><strong>' + TC.inr(bc.combined) + "</strong><span>combined</span></span>" +
        "</div>" +
        '<ul class="bc__list">' + unlocks + "</ul>" +
      "</div>";
  }

  function pulse(btn, count) {
    const original = btn.innerHTML;
    btn.innerHTML = TC.icon("i-check", "icon") + " " + count + " compatible travellers found";
    btn.classList.add("btn--secondary");
    btn.disabled = true;
    setTimeout(function () { btn.innerHTML = original; btn.classList.remove("btn--secondary"); btn.disabled = false; }, 2000);
  }
  function pulseEmpty(btn) {
    const original = btn.innerHTML;
    btn.innerHTML = "Try widening budget or interests";
    btn.classList.add("btn--secondary");
    setTimeout(function () { btn.innerHTML = original; btn.classList.remove("btn--secondary"); }, 1600);
  }

  // Bind pool button (delegated).
  document.addEventListener("click", function (e) {
    const b = e.target.closest("[data-action-pool]");
    if (!b) return;
    const original = b.innerHTML;
    b.innerHTML = TC.icon("i-check", "icon") + " Pooled — plan unlocked";
    b.classList.add("btn--secondary"); b.disabled = true;
    const sec = document.getElementById("match-collab");
    if (sec && sec.querySelector(".bc")) {
      sec.querySelector(".bc").classList.add("bc--pooled");
    }
    setTimeout(function () { b.innerHTML = original; b.classList.remove("btn--secondary"); b.disabled = false; }, 2200);
  });
})();
