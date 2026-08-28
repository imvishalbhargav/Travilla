/* ============================================================
   TripCollab — Budget / Shared-cost workspace (Milestone 4)
   - Split rules: equal, subset (with per-person ledger)
   - Multi-currency (demo rates -> display currency)
   - Settle-up (who owes whom, minimal number of payments)
   - Explainable AI budget feasibility + recommendation
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  let state = { currency: "INR", costs: D.costs.slice() };

  /* ---- helpers ---- */
  function member(id) { return D.group.find(function (m) { return m.id === id; }); }
  function toINR(amount, cur) { return Number(amount) * (D.currencies[cur].rate); }
  function fromINR(inr, cur) { return inr / (D.currencies[cur].rate); }
  function fmt(inrVal, cur) {
    cur = cur || state.currency;
    return TC.sym(cur) + Math.round(fromINR(inrVal, cur)).toLocaleString("en-IN");
  }
  function shareFor(cost, pid) {
    const parts = cost.split.participants;
    if (parts.indexOf(pid) === -1) return 0;
    if (cost.split.rule === "equal") return toINR(cost.amount, cost.currency) / parts.length;
    if (cost.split.rule === "subset") return toINR(cost.amount, cost.currency) / parts.length;
    if (cost.split.rule === "custom") return toINR(cost.amount, cost.currency); // refined later
    return 0;
  }

  /* ---- ledger computation ---- */
  function computeLedger() {
    const ledger = {};
    D.group.forEach(function (m) { ledger[m.id] = { name: m.name, initials: m.initials, color: m.color, consumed: 0, paid: 0 }; });
    state.costs.forEach(function (c) {
      const amt = toINR(c.amount, c.currency);
      // payer paid the full amount
      ledger[c.payer].paid += amt;
      // each participant consumes their share
      c.split.participants.forEach(function (pid) { ledger[pid].consumed += shareFor(c, pid); });
    });
    D.group.forEach(function (m) {
      const l = ledger[m.id];
      l.balance = l.paid - l.consumed; // + = owed back, - = owes
    });
    return ledger;
  }

  /* ---- settle-up (minimize transactions) ---- */
  function settle(ledger) {
    const creditors = [], debtors = [];
    D.group.forEach(function (m) {
      const b = Math.round(ledger[m.id].balance);
      if (b > 0) creditors.push({ id: m.id, name: m.name, amt: b });
      else if (b < 0) debtors.push({ id: m.id, name: m.name, amt: -b });
    });
    // Greedy: biggest creditor / biggest debtor paired.
    const moves = [];
    creditors.sort(function (a, b) { return b.amt - a.amt; });
    debtors.sort(function (a, b) { return b.amt - a.amt; });
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const d = debtors[i], c = creditors[j];
      const pay = Math.min(d.amt, c.amt);
      if (pay > 0) moves.push({ from: d.name, to: c.name, amt: pay });
      d.amt -= pay; c.amt -= pay;
      if (d.amt <= 0) i++;
      if (c.amt <= 0) j++;
    }
    return moves;
  }

  function totalConsumed() {
    return state.costs.reduce(function (s, c) { return s + toINR(c.amount, c.currency); }, 0);
  }

  /* ---- render: summary ---- */
  function renderSummary() {
    const el = document.getElementById("cost-summary");
    if (!el) return;
    const total = totalConsumed();
    const perPerson = total / D.group.length;
    const isINR = state.currency === "INR";
    const pooled = isINR ? 3000 : fromINR(3000, state.currency); // ₹3,000/person pooled capacity
    el.innerHTML =
      "<div><div class=\"cost-summary__val\">" + fmt(total) + "</div><div class=\"cost-summary__lab\">Plan total</div></div>" +
      "<div><div class=\"cost-summary__val\">" + fmt(perPerson) + "</div><div class=\"cost-summary__lab\">Per person</div></div>" +
      "<div><div class=\"cost-summary__val\">" + fmt(3000) + "</div><div class=\"cost-summary__lab\">Pooled budget/person</div></div>";
  }

  /* ---- render: per-person ledger ---- */
  function renderLedger() {
    const el = document.getElementById("ledger");
    if (!el) return;
    const ledger = computeLedger();
    const bal = document.getElementById("ledger-balance");
    // Sum absolute balances = amount still to settle.
    const unsettled = D.group.reduce(function (s, m) { return s + Math.abs(ledger[m.id].balance); }, 0);
    if (bal) bal.textContent = fmt(unsettled / 2) + " to settle";

    el.innerHTML = D.group
      .map(function (m) {
        const l = ledger[m.id];
        const cls = l.balance >= 0 ? "pill--verify" : "pill--amber";
        const label = l.balance >= 0 ? "Owed back" : "Owes";
        const pct = Math.max(6, Math.round((l.consumed / (totalConsumed() || 1)) * 100));
        return (
          '<div class="row">' +
            '<span class="comment__avatar" style="background:' + l.color + '">' + l.initials + "</span>" +
            "<div class=\"row__main\">" +
              '<div class="row__title">' + l.name + "</div>" +
              '<div class="row__sub">Paid ' + fmt(l.paid) + " · Consumed " + fmt(l.consumed) + "</div>" +
              '<div style="height:5px;background:var(--wp-surface-2);border-radius:5px;overflow:hidden;margin-top:6px">' +
                '<div style="width:' + pct + '%;height:100%;background:var(--wp-waypoint);border-radius:5px"></div>' +
              "</div>" +
            "</div>" +
            '<div class="row__trailing"><span class="pill ' + cls + '">' + label + " " + fmt(Math.abs(l.balance)) + "</span></div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---- render: cost lines ---- */
  function renderCostLines() {
    const el = document.getElementById("cost-lines");
    if (!el) return;
    // Each cost line shows payer, split rule, per-person share, currency.
    el.innerHTML = state.costs
      .map(function (c) {
        const payer = member(c.payer);
        const parts = c.split.participants;
        const perPerson = toINR(c.amount, c.currency) / parts.length;
        const ruleLabel = c.split.rule === "equal" ? "Equal · " + parts.length : "Subset · " + parts.length + " of " + D.group.length;
        return (
          '<details class="row-detail">' +
            '<summary class="row">' +
              '<span class="tl-item__icon">' + TC.icon(c.type === "sim" ? "i-sim" : (c.type === "hotel" ? "i-hotel" : c.type === "train" ? "i-train" : c.type === "plane" ? "i-plane" : c.type === "cab" ? "i-cab" : c.type === "guide" ? "i-guide" : c.type === "food" ? "i-food" : "i-budget")) + "</span>" +
              "<div class=\"row__main\">" +
                '<div class="row__title">' + c.label + "</div>" +
                '<div class="row__sub">' + payer.name + " paid · " + ruleLabel + "</div>" +
              "</div>" +
              '<div class="row__trailing">' +
                '<span class="pill pill--amber">' + fmt(toINR(c.amount, c.currency)) + "</span>" +
                '<div class="card__meta">' + TC.sym(c.currency) + c.amount + "</div>" +
              "</div>" +
            "</summary>" +
            '<div class="row-detail__body">' +
              '<div class="card__meta" style="margin-bottom:8px">Split among: ' + parts.map(function (pid) { return member(pid).name; }).join(", ") + "</div>" +
              '<div class="row-detail__shared">' +
                '<span class="chip">' + TC.icon("i-budget") + " " + fmt(perPerson) + "/person</span>" +
                '<span class="chip">' + TC.icon("i-chat") + " " + ruleLabel + "</span>" +
              "</div>" +
            "</div>" +
          "</details>"
        );
      })
      .join("");
  }

  /* ---- render: settle-up ---- */
  function renderSettle() {
    const el = document.getElementById("settle");
    if (!el) return;
    const ledger = computeLedger();
    const moves = settle(ledger);
    if (!moves.length) {
      el.innerHTML = '<div class="empty" style="padding:var(--sp-4)"><div class="card__meta">Everyone is settled up. No payments needed.</div></div>';
      return;
    }
    el.innerHTML =
      '<div class="settle-list">' +
        moves.map(function (m, i) {
          return (
            '<div class="row">' +
              '<span class="tl-item__icon">' + TC.icon("i-rupee") + "</span>" +
              "<div class=\"row__main\">" +
                '<div class="row__title">' + m.from + " pays " + m.to + "</div>" +
                '<div class="row__sub">Settle-up #' + (i + 1) + "</div>" +
              "</div>" +
              '<div class="row__trailing"><span class="pill pill--verify">' + fmt(m.amt) + "</span></div>" +
            "</div>"
          );
        }).join("") +
      "</div>" +
      '<div class="section__head" style="margin:16px 0 8px"><span class="pill pill--waypoint">' + moves.length + ' payment(s) settle everyone</span></div>' +
      '<button class="btn btn--primary btn--block" type="button" id="mark-settled"><svg data-icon="i-check" aria-hidden="true"></svg> Mark as settled</button>';
    const btn = document.getElementById("mark-settled");
    if (btn) btn.addEventListener("click", function () { btn.innerHTML = TC.icon("i-check", "icon") + " All settled"; btn.disabled = true; btn.classList.add("btn--secondary"); });
  }

  /* ---- render: AI budget advisement (explainable) ---- */
  function renderAi() {
    const el = document.getElementById("ai-budget");
    if (!el) return;
    const total = totalConsumed();
    const perPerson = total / D.group.length;
    const budget = 3000; // ₹/person pooled capacity
    const short = Math.max(0, perPerson - budget);
    const feasibility = perPerson <= budget ? "Feasible" : "Over";
    const pill = feasibility === "Feasible"
      ? '<span class="pill pill--verify">' + TC.icon("i-check", "icon") + " Feasible</span>"
      : '<span class="pill pill--amber">Over budget</span>';

    // Find the largest single cost to suggest a concrete cut.
    let biggest = null;
    state.costs.forEach(function (c) {
      const amt = toINR(c.amount, c.currency);
      if (!biggest || amt > biggest.amt) biggest = { label: c.label, amt: amt };
    });
    const rec = feasibility === "Over"
      ? "Raise per-person budget by " + fmt(short) + " (to " + fmt(perPerson) + "), OR drop the largest line (" + fmt(biggest.amt) + " for " + biggest.label + ")."
      : "You're within budget with " + fmt(budget - perPerson) + "/person of room to add a cultural experience or a better stay.";

    el.innerHTML =
      '<div class="section__head"><h2 class="section__title">AI budget check</h2>' + pill + "</div>" +
      '<div class="card" style="border-color:var(--wp-waypoint)">' +
        '<div class="card__body">' +
          '<p class="card__meta">Plan: ' + fmt(perPerson) + '/person · Pooled budget: ' + fmt(budget) + '/person</p>' +
          '<div style="font-family:var(--font-numeric);font-size:1.25rem;font-weight:700;margin:8px 0 4px">' + feasibility + " — " + (feasibility === "Over" ? fmt(short) + " over per person" : "on track") + "</div>" +
          '<div style="height:8px;background:var(--wp-surface-2);border-radius:8px;overflow:hidden;margin:12px 0">' +
            '<div style="width:' + Math.min(100, Math.round((perPerson / budget) * 100)) + '%;height:100%;background:' + (feasibility === "Over" ? "var(--wp-amber)" : "var(--wp-verify)") + ';border-radius:8px"></div>' +
          "</div>" +
          '<div class="card" style="margin-top:16px;background:var(--wp-amber-soft);border-color:transparent">' +
            '<div class="card__body"><b>Recommendation</b><p style="margin:6px 0 0;color:var(--wp-ink)">' + rec + "</p></div>" +
          "</div>" +
        "</div>" +
      "</div>";
  }

  /* ---- add cost form ---- */
  function renderAddPayer() {
    const sel = document.getElementById("add-payer");
    if (!sel) return;
    sel.innerHTML = D.group.map(function (m) { return '<option value="' + m.id + '">' + m.name + "</option>"; }).join("");
  }
  function renderSubsetPicker() {
    const wrap = document.getElementById("add-subset");
    if (!wrap) return;
    wrap.innerHTML = D.group.map(function (m) {
      return '<label class="sub-option"><input type="checkbox" value="' + m.id + '" checked /> ' + m.name + "</label>";
    }).join("");
  }
  function toggleSubset(show) {
    const wrap = document.getElementById("add-subset-wrap");
    if (wrap) wrap.hidden = !show;
  }

  function saveCost() {
    const label = document.getElementById("add-label").value.trim();
    const amount = Number(document.getElementById("add-amount").value);
    const currency = document.getElementById("add-currency").value;
    const payer = document.getElementById("add-payer").value;
    const rule = document.getElementById("add-rule").value;
    let participants;
    if (rule === "subset") {
      participants = Array.from(document.querySelectorAll("#add-subset input:checked")).map(function (c) { return c.value; });
      if (!participants.length) { alert("Pick at least one person for this cost."); return; }
    } else {
      participants = D.group.map(function (m) { return m.id; });
    }
    if (!label || !amount || amount <= 0) { alert("Add a label and a positive amount."); return; }

    state.costs.push({ id: "lc" + Date.now(), label: label, type: "food", amount: amount, currency: currency, payer: payer, split: { rule: rule, participants: participants } });
    renderAll();
    resetForm();
  }

  function resetForm() {
    document.getElementById("add-label").value = "";
    document.getElementById("add-amount").value = "";
    document.getElementById("add-currency").value = "INR";
    document.getElementById("add-rule").value = "equal";
    toggleSubset(false);
    renderSubsetPicker();
    document.getElementById("add-cost-section").hidden = true;
  }

  /* ---- bind ---- */
  function renderAll() { renderSummary(); renderLedger(); renderCostLines(); renderSettle(); renderAi(); }

  document.addEventListener("DOMContentLoaded", function () {
    renderAddPayer();
    renderSubsetPicker();
    renderAll();

    const cur = document.getElementById("currency");
    if (cur) cur.addEventListener("change", function () { state.currency = cur.value; renderAll(); });

    const addBtn = document.getElementById("add-cost-btn");
    const sec = document.getElementById("add-cost-section");
    if (addBtn) addBtn.addEventListener("click", function () { sec.hidden = false; document.getElementById("add-label").focus(); });
    const cancel = document.getElementById("cancel-cost");
    if (cancel) cancel.addEventListener("click", resetForm);
    const rule = document.getElementById("add-rule");
    if (rule) rule.addEventListener("change", function () { toggleSubset(rule.value === "subset"); });
    const save = document.getElementById("save-cost");
    if (save) save.addEventListener("click", saveCost);
    const close = document.getElementById("add-cost-btn");
  });

  // expose for tests
  window.__budgetState = { computeLedger: computeLedger, settle: settle, totalConsumed: totalConsumed };
})();
