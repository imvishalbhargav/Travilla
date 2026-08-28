/* ============================================================
   TripCollab — Data (Milestone 2 demo content)
   Real photography is referenced from assets/img (never AI-imagery).
   No application secrets or API keys live here.
   ============================================================ */

window.TripCollabData = (function () {
  "use strict";

  const IMG = "assets/img/";

  // Travellers (group members) — avatars are initials (no AI faces).
  const group = [
    { id: "m1", name: "Asha", initials: "AS", color: "var(--wp-waypoint)", role: "Group Lead", budget: 1500 },
    { id: "m2", name: "Rahul", initials: "RA", color: "var(--wp-amber)", role: "Budget Check", budget: 1500 },
    { id: "m3", name: "Mei", initials: "ME", color: "var(--wp-verify)", role: "Foreign traveller", budget: 4000 },
    { id: "m4", name: "Zoey", initials: "ZO", color: "#7C5CBF", role: "Culture seeker", budget: 2000 },
  ];

  // A single active trip (Goa) — showcases the Budget-Collab story.
  const trip = {
    id: "t1",
    name: "Goa — Hidden Beaches & Local Culture",
    cover: IMG + "goa-beach.jpg",
    dates: "14–18 Dec",
    route: "Jaipur → Goa",
    currency: "INR",
    status: "Planning",
    days: [
      {
        label: "Arrive · Beach & Sunset",
        items: [
          { id: "i1", type: "train", time: "06:10", title: "Jaipur → Madgaon train (3AC)", sub: "Aravalli Express · 26h · Night 1", cost: 1450, img: IMG + "train-platform.jpg" },
        ],
      },
      {
        label: "South Goa · Hidden Gems",
        items: [
          { id: "i2", type: "hotel", time: "12:00", title: "Check-in — Little India Beach Cottages", sub: "Palolem · 2 twin rooms · shared", cost: 2400, img: IMG + "goa-stay.jpg" },
          { id: "i3", type: "cab", time: "15:30", title: "Taxi to hidden waterfall (netarvali)", sub: "Shared jeep · 6 pax · return", cost: 900 },
          { id: "i4", type: "guide", time: "16:00", title: "Verified local guide — waterfall trail", sub: "Local culture & geology stories", cost: 700 },
        ],
      },
      {
        label: "Local Culture & Beach",
        items: [
          { id: "i5", type: "food", time: "09:00", title: "Breakfast at a village goan café", sub: "Local family-run · off the tourist strip", cost: 300 },
          { id: "i6", type: "discover", time: "11:00", title: "Hidden chapel & palm-grove walk", sub: "A spot most tourists never find", cost: 0 },
          { id: "i7", type: "plane", time: "21:40", title: "Goa → Jaipur return flight", sub: "Budget carrier · check-in baggage", cost: 3600 },
        ],
      },
    ],
  };

  // Budget-Collab story: two groups of 1500 pool to 3000.
  const budgetCollab = {
    title: "Budget-Collab — travel is possible together",
    pools: [
      { label: "Team 1", amount: 1500 },
      { label: "Team 2", amount: 1500 },
    ],
    combined: 3000,
    unlocks: [
      "Twin-sharing beach cottage (pooled)",
      "Shared jeep + verified local guide",
      "Train (3AC) leg — split equally",
      "Village café & culture experiences",
    ],
  };

  // Discover / hidden places & culture (real photography).
  const places = [
    {
      id: "p1",
      title: "Hidden waterfall, Netravali",
      category: "Hidden gem",
      location: "South Goa",
      img: IMG + "hidden-waterfall.jpg",
      badge: "Hidden gem",
      desc: "A tiered jungle waterfall most visitors miss — reach it with a verified local guide.",
    },
    {
      id: "p2",
      title: "Hawa Mahal, Jaipur",
      category: "Icon",
      location: "Jaipur",
      img: IMG + "jaipur-hawa-mahal.jpg",
      badge: "Culture",
      desc: "The 'Palace of Winds' — 953 windows built so royal women could watch street life unseen.",
    },
    {
      id: "p3",
      title: "Blue city lane, Jodhpur",
      category: "Local culture",
      location: "Jodhpur",
      img: IMG + "blue-city-street.jpg",
      badge: "Culture",
      desc: "Wander the indigo lanes of the old city — a living, breathing heritage neighbourhood.",
    },
    {
      id: "p4",
      title: "Rooftop courtyard café",
      category: "Hidden gem",
      location: "Jaipur",
      img: IMG + "jaipur-cafe.jpg",
      badge: "Hidden gem",
      desc: "A heritage courtyard café away from the tourist strip — local food, local art.",
    },
  ];

  // Verified local guides (Milestone 7). Real photography only — no fake faces.
  const guides = [
    {
      id: "g1",
      name: "Ravindra 'Ravi' S.",
      img: IMG + "guide-ravi.jpg",
      role: "Verified local guide · Goa & South India",
      location: "South Goa",
      languages: "English · Hindi · Konkani",
      rating: "4.9",
      trips: 132,
      verified: true,
      specialities: ["Hidden waterfalls", "Local food", "Heritage villages"],
      pricePerDay: 700, // INR
      available: true,
    },
  ];

  // Candidate pool for compatible-group matching (Milestone 3).
  // Each has preferences used by the scoring engine. Avatars are initials (no AI faces).
  const candidates = [
    {
      id: "c1", name: "Arjun", initials: "AR", color: "#1E7F8C", city: "Delhi",
      tagline: "Off-beat trail & street-food hunter", verified: true, language: ["English", "Hindi"],
      prefs: { budget: 1500, pace: "Balanced", interests: ["Hidden gems", "Local food", "Hiking"], style: "Adventure", dateFlex: "Flexible", accessibility: "None" },
    },
    {
      id: "c2", name: "Lena", initials: "LE", color: "#B9770E", city: "Berlin",
      tagline: "First time in India — wants authentic, safe", verified: true, language: ["English", "German"],
      prefs: { budget: 1600, pace: "Balanced", interests: ["Culture & history", "Hidden gems"], style: "Culture", dateFlex: "Somewhat", accessibility: "Step-free preferred" },
    },
    {
      id: "c3", name: "Kabir", initials: "KA", color: "#2E7D4F", city: "Jaipur",
      tagline: "Local who knows the quiet places", verified: true, language: ["Hindi", "English"],
      prefs: { budget: 1500, pace: "Slow & relaxed", interests: ["Hidden gems", "Local food"], style: "Relaxed", dateFlex: "Flexible", accessibility: "None" },
    },
    {
      id: "c4", name: "Mira", initials: "MI", color: "#7C5CBF", city: "Mumbai",
      tagline: "Budget-savvy, loves waterfalls & treks", verified: true, language: ["English", "Hindi", "Marathi"],
      prefs: { budget: 1400, pace: "Packed itinerary", interests: ["Hiking", "Hidden gems", "Beaches"], style: "Adventure", dateFlex: "Flexible", accessibility: "None" },
    },
    {
      id: "c5", name: "Tom", initials: "TO", color: "#3A5059", city: "London",
      tagline: "Culture + photography, slow travel", verified: false, language: ["English"],
      prefs: { budget: 2000, pace: "Slow & relaxed", interests: ["Culture & history", "Local food"], style: "Culture", dateFlex: "Somewhat", accessibility: "None" },
    },
    {
      id: "c6", name: "Sara", initials: "SA", color: "#8A5A2B", city: "Bengaluru",
      tagline: "Weekend explorer, budget-first", verified: true, language: ["English", "Kannada", "Hindi"],
      prefs: { budget: 1500, pace: "Packed itinerary", interests: ["Beaches", "Local food", "Hidden gems"], style: "Friends", dateFlex: "Fixed", accessibility: "None" },
    },
  ];

  // Compatibility dimension weights (sum to 1). Used by the scoring engine.
  const matchWeights = {
    budget: 0.28,   // does the budget align?
    pace: 0.18,
    interests: 0.26,
    language: 0.14,
    style: 0.09,
    dateFlex: 0.05,
  };

  // Total cost of the active Goa trip (for feasibility checks).
  function tripTotal() {
    let sum = 0;
    trip.days.forEach(function (day) {
      day.items.forEach(function (it) { sum += Number(it.cost) || 0; });
    });
    return sum;
  }

  // Currency support (demo rates to INR base). No live API — illustrative.
  const currencies = {
    INR: { symbol: "₹", rate: 1 },
    EUR: { symbol: "€", rate: 92 },
    USD: { symbol: "$", rate: 83 },
  };

  // Shared-cost workspace (Milestone 4): one cost line per expense.
  // split.rule: 'equal' | 'subset' | 'custom'. participants = member ids.
  const costs = [
    { id: "lc1", label: "Train · Jaipur → Madgaon (3AC)", type: "train", amount: 1450, currency: "INR", payer: "m1", split: { rule: "equal", participants: ["m1", "m2", "m3", "m4"] } },
    { id: "lc2", label: "Stay · Little India Beach Cottages (2 nts)", type: "hotel", amount: 2400, currency: "INR", payer: "m2", split: { rule: "equal", participants: ["m1", "m2", "m3", "m4"] } },
    { id: "lc3", label: "Shared jeep to hidden waterfall", type: "cab", amount: 900, currency: "INR", payer: "m3", split: { rule: "subset", participants: ["m1", "m3", "m4"] } },
    { id: "lc4", label: "Verified local guide · waterfall trail", type: "guide", amount: 700, currency: "INR", payer: "m4", split: { rule: "subset", participants: ["m1", "m3", "m4"] } },
    { id: "lc5", label: "Village Goan breakfast", type: "food", amount: 300, currency: "INR", payer: "m1", split: { rule: "equal", participants: ["m1", "m2", "m3", "m4"] } },
    { id: "lc6", label: "Return flight · Goa → Jaipur", type: "plane", amount: 3600, currency: "INR", payer: "m3", split: { rule: "subset", participants: ["m3", "m4"] } },
    { id: "lc7", label: "Local SIM + data (foreign travellers)", type: "sim", amount: 25, currency: "EUR", payer: "m3", split: { rule: "subset", participants: ["m3", "m4"] } },
  ];

  // Budget intelligence config (Milestone 5). Budget is INR/person pooled
  // capacity. Categories weight the plan-level budget so the AI can say
  // which area is over/under and what to trim first. All illustrative; no live data.
  const budgetConfig = {
    perPerson: 3000, // pooled capacity per person (INR)
    categories: {
      "Stay": { weight: 0.25, icon: "i-hotel" },
      "Transport": { weight: 0.45, icon: "i-train" },
      "Food": { weight: 0.12, icon: "i-food" },
      "Guides & experiences": { weight: 0.12, icon: "i-guide" },
      "Connectivity & misc": { weight: 0.06, icon: "i-sim" },
    },
  };

  // Map a cost type -> budget category (for the AI analyser).
  const typeCategory = {
    hotel: "Stay",
    train: "Transport", plane: "Transport", cab: "Transport",
    food: "Food",
    guide: "Guides & experiences", discover: "Guides & experiences",
    sim: "Connectivity & misc",
  };

  // Hotel inventory (Milestone 6 — first booking vertical). Real photography.
  const hotels = [
    {
      id: "h1",
      name: "Little India Beach Cottages",
      place: "Palolem, South Goa",
      img: IMG + "goa-stay.jpg",
      rating: "4.8", reviews: 212,
      perNight: 1200, rooms: 2, type: "Beach cottage",
      tags: ["Beachfront", "Free breakfast"],
      desc: "Twin-sharing thatched cottages a step from the sand. The group's pick for hidden-beach access.",
    },
    {
      id: "h2",
      name: "Casa Beach Hut Resort",
      place: "Agonda, South Goa",
      img: IMG + "stay-beach-hut.jpg",
      rating: "4.7", reviews: 168,
      perNight: 950, rooms: 2, type: "Beach hut resort",
      tags: ["Seafront", "Quiet", "Family-run"],
      desc: "Wooden beach huts under palms, quieter than Palolem. Great value for the pooled budget.",
    },
    {
      id: "h3",
      name: "Mansão — Heritage Portuguese House",
      place: "Old Goa",
      img: IMG + "stay-heritage.jpg",
      rating: "4.9", reviews: 96,
      perNight: 2000, rooms: 2, type: "Heritage guesthouse",
      tags: ["Heritage", "Courtyard dining", "Cultural"],
      desc: "A 236-year-old Portuguese mansion courtyard. A premium culture-first stay for the group.",
    },
  ];

  // Foreign-traveller assistance (Milestone 8). Concrete, actionable steps.
  const assistance = [
    {
      icon: "i-sim",
      title: "Local SIM made easy",
      text: "Get a working Indian SIM for calls & data — arranged before you land.",
      steps: ["Verify your passport & visa", "Pick a plan (data + calls)", "SIM activation at arrival desk"],
      meta: "≈ ₹300 · 28 days",
    },
    {
      icon: "i-rupee",
      title: "UPI & Indian currency",
      text: "Set up UPI, see fair exchange, and pay like a local — no gouging.",
      steps: ["Link a UPI wallet (no card needed)", "See fair ₹/$/€ exchange rates", "Pay by QR at cafés & markets"],
      meta: "0 hidden fees · shown upfront",
    },
    {
      icon: "i-lock",
      title: "Local price transparency",
      text: "Fair, pre-agreed rates for cabs, guides & stays. No surprises.",
      steps: ["Compare local vs tourist pricing", "Pre-agree cab & guide rates", "Flag anything that feels off"],
      meta: "Fair-rate pledge",
    },
    {
      icon: "i-verify",
      title: "Verified human help",
      text: "A real, verified local person to help if anything goes wrong.",
      steps: ["24/7 in-app chat", "Language-matched help", "Escalate to a verified local"],
      meta: "Always-on",
    },
  ];

  return { group, trip, budgetCollab, places, guides, assistance, candidates, matchWeights, tripTotal, costs, currencies, budgetConfig, typeCategory, hotels, IMG };
})();
