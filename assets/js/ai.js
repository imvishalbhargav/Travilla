/* ============================================================
   TripCollab — AI Trip Planner (Milestone 11)
   A built-in, offline "AI copilot" that builds a day-by-day
   itinerary + shared-cost plan from your inputs. It is rule-based
   and deterministic (works with no key, no network), and it is
   structured so you can swap in a real LLM later.

   HOW TO CONNECT A REAL LLM LATER
   -------------------------------
   window.TripCollabAI.useRemote = async function (input) { ... }
   Replace this with a call to YOUR serverless endpoint (which holds
   the API key). The endpoint should return a plain TripCollab plan
   object shaped like the output of planLocal() below. Keep the key
   on the server — never in client code. Until you do, the app uses
   the built-in planner automatically.

   Output plan shape (consumed by guides/guide/create + trip/budget):
   {
     name, cover, route, dates, currency, days, costLines, groupSize,
     totalPerPerson, pooled, feasible, overBy, notes[]
   }
   ============================================================ */
(function () {
  "use strict";
  const AID = window.TripCollabAIData;
  const IMG = (AID && AID.IMG) || "assets/img/";

  // ---- Interest -> preferred experience categories ----
  const INTEREST_CATEGORY = {
    "Hidden gems": "Hidden gem",
    "Local food": "Food",
    "Culture & history": "Culture",
    "Beaches": "Hidden gem",
    "Adventure": "Adventure",
    "Wellness": "Wellness",
    "Hiking": "Adventure",
  };

  const ROUTES = {
    "d-goa": "Delhi → Goa",
    "d-kerala": "Kochi → Alappuzha",
    "d-varanasi": "Jaipur → Varanasi",
    "d-ladakh": "Delhi → Leh",
    "d-rishikesh": "Delhi → Rishikesh",
  };

  function pick(seed, arr) { return arr[seed % arr.length]; }

  // Build a realistic date string like "10–14 Dec".
  function buildDates(days) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const startMonth = (new Date().getMonth() + 2) % 12;
    const startDay = 10;
    const endDay = Math.min(28, startDay + days - 1);
    return startDay + "\u2013" + endDay + " " + months[startMonth];
  }

  // ---- The built-in deterministic planner ----
  function planLocal(input) {
    const kit = (AID && AID.cityKits && AID.cityKits[input.destinationId]) || (AID && AID.cityKits["d-goa"]);
    const days = Math.max(1, Math.min(7, Number(input.days) || 3));
    const groupSize = Math.max(1, Number(input.groupSize) || 4);
    const budget = Math.max(100, Number(input.budget) || 3000); // per person (INR)
    const interests = (input.interests && input.interests.length ? input.interests : ["Hidden gems", "Local food"]);
    const pace = input.pace || "Balanced";

    // Separate experiences by category interest.
    const pool = kit.experiences.slice();
    const perDay = pace === "Packed itinerary" ? 3 : pace === "Slow & relaxed" ? 2 : 2;

    // Build days.
    const daysArr = [];
    const used = {};
    const experiencesPerDay = Math.min(perDay, Math.max(2, Math.floor(pool.length / Math.max(1, days))));

    // Day 1: arrival + first experiences
    const dayLabels = ["Arrive & settle in", "Hidden gems & local rhythm", "Culture & community", "Iconic sights", "Slow morning & adventure", "Free exploration", "Departure day"];

    for (let d = 0; d < days; d++) {
      const items = [];
      // Arrival transport on day 0 (or departure on the last day handled below).
      if (d === 0) {
        items.push({
          id: "gen-arr" + d, type: kit.arrival.type, time: "08:00",
          title: kit.arrival.operator, sub: kit.arrival.from + " → " + kit.arrival.to,
          cost: kit.arrival.price, img: kit.arrival.img,
        });
      }
      if (d === days - 1 && days > 1) {
        items.push({
          id: "gen-dep" + d, type: kit.departure.type, time: "19:00",
          title: kit.departure.operator, sub: kit.departure.from + " → " + kit.departure.to,
          cost: kit.departure.price, img: kit.departure.img,
        });
      }

      // Home stay check-in on day 0 (or first day) if applicable.
      if (d === 0) {
        items.push({
          id: "gen-stay" + d, type: "hotel", time: "13:00",
          title: "Check-in — " + kit.stayName, sub: kit.staySub + " · " + Math.max(1, days) + " night" + (days > 1 ? "s" : ""),
          cost: kit.stayPerNight, img: kit.stayImg,
        });
      }

      // Fill with experiences matching interests first, then the rest.
      const chosen = [];
      // Preferred category ordering.
      const prefs = interests.map(function (i) { return INTEREST_CATEGORY[i]; }).filter(Boolean);
      const ranked = pool.slice().sort(function (a, b) {
        const ap = prefs.indexOf(a.category);
        const bp = prefs.indexOf(b.category);
        const ascore = ap === -1 ? 99 : ap;
        const bscore = bp === -1 ? 99 : bp;
        // spread so we don't repeat the same one on every day
        if (ascore === bscore) return 0;
        return ascore - bscore;
      });

      // Pick experiences for this day, rotating to avoid repetition.
      let cursor = d;
      let pickedCount = 0;
      while (chosen.length < experiencesPerDay && pickedCount < ranked.length) {
        const exp = ranked[(cursor + pickedCount * days) % ranked.length];
        if (!used[exp.title]) { chosen.push(exp); used[exp.title] = true; pickedCount++; }
        else { pickedCount++; }
        if (pickedCount > ranked.length * 2) break;
      }
      // If we ran out of unique ones, fill with any.
      if (chosen.length < experiencesPerDay) {
        pool.forEach(function (exp) { if (chosen.length < experiencesPerDay && !used[exp.title]) { chosen.push(exp); used[exp.title] = true; } });
      }

      chosen.forEach(function (exp, i) {
        items.push({
          id: "gen-x" + d + "-" + i, type: exp.type, time: (10 + i * 3) + ":00",
          title: exp.title, sub: exp.sub, cost: exp.cost, img: exp.img,
        });
      });

      // One local food stop on a middle day.
      if (d === 1 || (days === 1 && d === 0)) {
        const food = pool.filter(function (e) { return e.category === "Food"; })[0];
        if (food && !used["food-" + d]) { items.push({ id: "gen-food" + d, type: "food", time: "13:30", title: food.title, sub: food.sub, cost: food.cost, img: food.img }); used["food-" + d] = true; }
      }

      daysArr.push({ label: dayLabels[Math.min(dayLabels.length - 1, d)], items: items });
    }

    // ---- Cost lines (shared-cost workspace shape) ----
    const members = [];
    const memberIds = [];
    for (let i = 0; i < Math.min(groupSize, 4); i++) {
      const id = "gm" + (i + 1);
      memberIds.push(id);
      members.push({ id: id });
    }
    const allIds = memberIds.slice();
    const subset = memberIds.slice(0, Math.max(2, memberIds.length - (memberIds.length > 2 ? 1 : 0)));

    const costLines = [];
    const seen = {};
    daysArr.forEach(function (day, di) {
      day.items.forEach(function (item) {
        if (seen[item.title]) return;
        seen[item.title] = true;
        const type = item.type;
        let splitMembers = allIds;
        // Transport to/from the destination is usually shared across everyone.
        if (type === "guide" || type === "discover" || type === "cab") splitMembers = subset;
        costLines.push({
          id: "glc" + di + "-" + item.id,
          label: item.title,
          type: type,
          amount: Number(item.cost) || 0,
          currency: "INR",
          payer: allIds[0],
          split: { rule: splitMembers.length === allIds.length ? "equal" : "subset", participants: splitMembers },
        });
      });
    });

    // ---- Budget / feasibility ----
    const total = costLines.reduce(function (s, c) { return s + c.amount; }, 0);
    const totalPerPerson = Math.round(total / groupSize);
    const pooled = budget * groupSize; // pooled capacity
    const feasible = totalPerPerson <= budget;
    const overBy = feasible ? 0 : totalPerPerson - budget;

    const notes = [];
    notes.push("Budget-Collab: " + groupSize + " travellers pooling " + fmt(budget) + " each = " + fmt(pooled) + " combined.");
    if (feasible) {
      notes.push("This plan fits the pooled budget — " + fmt(totalPerPerson) + "/person vs " + fmt(budget) + " budget.");
    } else {
      notes.push("Over by " + fmt(overBy) + "/person. Swap a flight for the train or trim a paid experience below.");
    }
    notes.push("Row " + kit.name + " uses real, locally-verified stays and our verified-guide / fair-rate privacy promise.");

    function fmt(n) { return "\u20B9" + Number(n || 0).toLocaleString("en-IN"); }

    return {
      name: input.name || (kit.name + " — " + (input.theme || "A curated " + days + " day trip")),
      cover: kit.stayImg,
      route: input.route || ROUTES[kit.id] || kit.name,
      dates: buildDates(days),
      currency: "INR",
      days: daysArr,
      costLines: costLines,
      groupSize: groupSize,
      total: total,
      totalPerPerson: totalPerPerson,
      pooled: pooled,
      budget: budget,
      feasible: feasible,
      overBy: overBy,
      notes: notes,
      daysCount: days,
    };
  }

  // ---- Public API ----
  // Override this with your own remote LLM endpoint (server holds the key).
  async function useRemote(input) {
    // Placeholder: returns null so the caller falls back to the built-in plan.
    return null;
  }

  async function generate(input) {
    const remote = await useRemote(input);
    if (remote && remote.days && remote.costLines) return remote;
    return planLocal(input);
  }

  window.TripCollabAI = {
    planLocal: planLocal,
    generate: generate,
    useRemote: useRemote,
    buildDates: buildDates,
  };
})();
