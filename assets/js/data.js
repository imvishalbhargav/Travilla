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

  // Verified local guide.
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

  // Foreign-traveller assistance cards.
  const assistance = [
    { icon: "i-sim", title: "Local SIM made easy", text: "Get a working Indian SIM for calls & data — arranged before you land." },
    { icon: "i-rupee", title: "UPI & Indian currency", text: "Set up UPI, see fair exchange, and pay like a local — no gouging." },
    { icon: "i-lock", title: "Local price transparency", text: "Fair, pre-agreed rates for cabs, guides & stays. No surprises." },
    { icon: "i-verify", title: "Verified human help", text: "A real, verified local person to help if anything goes wrong." },
  ];

  return { group, trip, budgetCollab, places, guides, assistance, candidates, matchWeights, tripTotal, IMG };
})();
