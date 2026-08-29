/* ============================================================
   TripCollab — AI trip & guides data (Milestone 11)
   Per-destination "kits" used by the built-in AI planner, plus
   the community guides that power the Wanderlog-style hub.
   Real content + real photography only. No AI imagery, no secrets.
   ============================================================ */
(function () {
  "use strict";
  const IMG = "assets/img/";

  // ---- Per-destination planning kits (real content, credible costs) ----
  const cityKits = {
    "d-goa": {
      id: "d-goa", region: "Goa", name: "Goa", state: "Goa",
      inCity: "Goa", outCity: "Goa",
      stayName: "Little India Beach Cottages", staySub: "Palolem · 2 twin rooms · shared", stayPerNight: 1200, stayImg: IMG + "goa-stay.jpg",
      arrival: { operator: "Goa Airport → Palolem taxi", from: "Goa Airport", to: "Palolem", type: "cab", price: 900, img: IMG + "train-platform.jpg" },
      departure: { operator: "Goa → Jaipur return flight", from: "Goa", to: "Jaipur", type: "plane", price: 3600, img: IMG + "transport-plane.jpg" },
      experiences: [
        { title: "Hidden waterfall, Netravali", sub: "Tiered jungle waterfall + natural pools", type: "discover", cost: 0, img: IMG + "hidden-waterfall.jpg", category: "Hidden gem" },
        { title: "Verified local guide — waterfall trail", sub: "Local culture & geology stories", type: "guide", cost: 700, img: IMG + "guide-ravi.jpg", category: "Guide" },
        { title: "Shared jeep to Netravali", sub: "6 pax · return", type: "cab", cost: 400, img: IMG + "train-platform.jpg", category: "Transport" },
        { title: "Village Goan breakfast café", sub: "Family-run · off the tourist strip", type: "food", cost: 300, img: IMG + "jaipur-cafe.jpg", category: "Food" },
        { title: "Palolem beach & sunset", sub: "Hippie-calm beach at the southern tip", type: "discover", cost: 0, img: IMG + "goa-beach.jpg", category: "Hidden gem" },
        { title: "Hidden chapel & palm-grove walk", sub: "A spot most tourists never find", type: "discover", cost: 0, img: IMG + "blue-city-street.jpg", category: "Hidden gem" },
        { title: "Old Goa heritage mansions", sub: "Portuguese quarter + courtyards", type: "discover", cost: 200, img: IMG + "stay-heritage.jpg", category: "Culture" },
      ],
    },

    "d-kerala": {
      id: "d-kerala", region: "Kerala", name: "Kerala", state: "Kerala",
      inCity: "Kochi", outCity: "Kochi",
      stayName: "Traditional houseboat", staySub: "Alappuzha backwaters · per night", stayPerNight: 3200, stayImg: IMG + "dest-kerala.jpg",
      arrival: { operator: "Kochi → Alappuzha train", from: "Kochi", to: "Alappuzha", type: "train", price: 250, img: IMG + "transport-train.jpg" },
      departure: { operator: "Kochi → Mumbai return flight", from: "Kochi", to: "Mumbai", type: "plane", price: 3200, img: IMG + "transport-plane.jpg" },
      experiences: [
        { title: "Houseboat cruise on the backwaters", sub: "Palm-lined canals · sunset cruise", type: "discover", cost: 0, img: IMG + "dest-kerala.jpg", category: "Icon" },
        { title: "Fort Kochi & Chinese fishing nets", sub: "Colonial quarter + street art", type: "discover", cost: 100, img: IMG + "dest-kerala.jpg", category: "Culture" },
        { title: "Kathakali dance performance", sub: "Traditional Kerala theatre", type: "discover", cost: 500, img: IMG + "dest-kerala.jpg", category: "Culture" },
        { title: "Kerala sadya banana-leaf feast", sub: "Traditional vegetarian thali", type: "food", cost: 400, img: IMG + "jaipur-cafe.jpg", category: "Food" },
        { title: "Marari beach cycling", sub: "Quiet fishing villages · backwater trails", type: "discover", cost: 150, img: IMG + "goa-beach.jpg", category: "Hidden gem" },
        { title: "Spice & tea plantation walk", sub: "Cardamom hills · Munnar day trip", type: "discover", cost: 800, img: IMG + "dest-kerala.jpg", category: "Hidden gem" },
        { title: "Local kayak on a quiet canal", sub: "2 pax · guided paddle", type: "guide", cost: 600, img: IMG + "dest-kerala.jpg", category: "Guide" },
      ],
    },

    "d-varanasi": {
      id: "d-varanasi", region: "Uttar Pradesh", name: "Varanasi", state: "Uttar Pradesh",
      inCity: "Varanasi", outCity: "Varanasi",
      stayName: "Old-city ghat guesthouse", staySub: "Assi Ghat · shared twin", stayPerNight: 1000, stayImg: IMG + "dest-varanasi.jpg",
      arrival: { operator: "Jaipur → Varanasi Rajdhani", from: "Jaipur", to: "Varanasi", type: "train", price: 1650, img: IMG + "transport-train.jpg" },
      departure: { operator: "Varanasi → Delhi return train", from: "Varanasi", to: "Delhi", type: "train", price: 1450, img: IMG + "transport-train.jpg" },
      experiences: [
        { title: "Sunrise boat ride on the Ganga", sub: "Dawn aarti from the water", type: "discover", cost: 400, img: IMG + "dest-varanasi.jpg", category: "Icon" },
        { title: "Dashashwamedh Ghat evening aarti", sub: "The famous fire ceremony", type: "discover", cost: 0, img: IMG + "dest-varanasi.jpg", category: "Culture" },
        { title: "Sarnath Buddhist ruins", sub: "Where the Buddha first taught", type: "discover", cost: 150, img: IMG + "dest-varanasi.jpg", category: "Culture" },
        { title: "Old-city laneway food walk", sub: "Chaat, kachori & local sweets", type: "food", cost: 350, img: IMG + "jaipur-cafe.jpg", category: "Food" },
        { title: "Kachauri gali street chefs", sub: "Watch the old bazaar come alive", type: "discover", cost: 0, img: IMG + "blue-city-street.jpg", category: "Hidden gem" },
        { title: "Weaving & silk workshop", sub: "Banarasi sari ateliers", type: "discover", cost: 200, img: IMG + "jaipur-hawa-mahal.jpg", category: "Culture" },
        { title: "Local ghat heritage walk", sub: "80+ ghats · stories & legends", type: "guide", cost: 500, img: IMG + "dest-varanasi.jpg", category: "Guide" },
      ],
    },

    "d-ladakh": {
      id: "d-ladakh", region: "Ladakh", name: "Ladakh", state: "Ladakh",
      inCity: "Leh", outCity: "Leh",
      stayName: "Leh guesthouse", staySub: "Acclimatisation · shared twin", stayPerNight: 2500, stayImg: IMG + "dest-ladakh.jpg",
      arrival: { operator: "Delhi → Leh flight", from: "Delhi", to: "Leh", type: "plane", price: 4800, img: IMG + "transport-plane.jpg" },
      departure: { operator: "Leh → Delhi return flight", from: "Leh", to: "Delhi", type: "plane", price: 4800, img: IMG + "transport-plane.jpg" },
      experiences: [
        { title: "Pangong Lake day trip", sub: "The famous blue lake across the mountains", type: "discover", cost: 1800, img: IMG + "dest-ladakh.jpg", category: "Icon" },
        { title: "Nubra Valley + sand dunes", sub: "Camel safari & Diskit monastery", type: "discover", cost: 2200, img: IMG + "dest-ladakh.jpg", category: "Icon" },
        { title: "Thiksey & Hemis monasteries", sub: "Ladakh's grandest gompas", type: "discover", cost: 400, img: IMG + "dest-ladakh.jpg", category: "Culture" },
        { title: "Khospad / local Ladakhi kitchen", sub: "Momos & butter tea at a village home", type: "food", cost: 350, img: IMG + "jaipur-cafe.jpg", category: "Food" },
        { title: "Sham valley villages", sub: "Likir & Alchi hidden art", type: "discover", cost: 600, img: IMG + "dest-ladakh.jpg", category: "Hidden gem" },
        { title: "Magnetic hill & Sangam", sub: "Confluence of Zanskar & Indus", type: "discover", cost: 500, img: IMG + "dest-ladakh.jpg", category: "Hidden gem" },
        { title: "Local guided culture walk", sub: "Monastery etiquette & Ladakhi life", type: "guide", cost: 1200, img: IMG + "dest-ladakh.jpg", category: "Guide" },
      ],
    },

    "d-rishikesh": {
      id: "d-rishikesh", region: "Uttarakhand", name: "Rishikesh", state: "Uttarakhand",
      inCity: "Rishikesh", outCity: "Rishikesh",
      stayName: "Ganges-side yoga retreat", staySub: "Laxman Jhula · shared twin", stayPerNight: 900, stayImg: IMG + "dest-rishikesh.jpg",
      arrival: { operator: "Delhi → Rishikesh train", from: "Delhi", to: "Haridwar", type: "train", price: 550, img: IMG + "transport-train.jpg" },
      departure: { operator: "Rishikesh → Delhi return train", from: "Haridwar", to: "Delhi", type: "train", price: 550, img: IMG + "transport-train.jpg" },
      experiences: [
        { title: "Ganges river rafting", sub: "16 km rapids · guided", type: "discover", cost: 900, img: IMG + "dest-rishikesh.jpg", category: "Adventure" },
        { title: "Laxman Jhula & Tera Manzil temple", sub: "The iconic suspension bridge", type: "discover", cost: 0, img: IMG + "dest-rishikesh.jpg", category: "Icon" },
        { title: "Ganga aarti at Triveni Ghat", sub: "Evening fire ritual by the river", type: "discover", cost: 0, img: IMG + "dest-rishikesh.jpg", category: "Culture" },
        { title: "Sunrise yoga session", sub: "Beach yoga on the Ganges", type: "discover", cost: 300, img: IMG + "dest-rishikesh.jpg", category: "Wellness" },
        { title: "Himalayan viewpoint trek", sub: "Kunjapuri sunrise hike", type: "discover", cost: 450, img: IMG + "dest-rishikesh.jpg", category: "Hidden gem" },
        { title: "Café & local thali lunch", sub: "River-side café with local food", type: "food", cost: 350, img: IMG + "jaipur-cafe.jpg", category: "Food" },
        { title: "Local guide — hidden ghats", sub: "Beatles ashram & secret trails", type: "guide", cost: 600, img: IMG + "dest-rishikesh.jpg", category: "Guide" },
      ],
    },
  };

  // ---- Community guides (Wanderlog-style hub content) ----
  const communityGuides = [
    {
      id: "cg-goa-waterfall", destinationId: "d-goa",
      title: "Goa's Hidden Waterfalls & Beach-Huts",
      cover: IMG + "goa-beach.jpg",
      blurb: "Skip the tourist strip. Tiered waterfall, secret palms, and a verified local guide.",
      tag: "Hidden gems", days: 4,
      author: { name: "Asha", initials: "AS", color: "var(--wp-waypoint)", verified: true },
      likes: 212, views: 18720,
    },
    {
      id: "cg-kerala-backwaters", destinationId: "d-kerala",
      title: "Kerala Backwaters — Houseboats & Spice Hills",
      cover: IMG + "dest-kerala.jpg",
      blurb: "A palm-lined canal cruise, Kathakali, and a Munnar plantation day trip.",
      tag: "Culture", days: 5,
      author: { name: "Mei", initials: "ME", color: "var(--wp-verify)", verified: true },
      likes: 184, views: 15240,
    },
    {
      id: "cg-varanasi-ghats", destinationId: "d-varanasi",
      title: "Varanasi — Sunrise Ghats & Street Food",
      cover: IMG + "dest-varanasi.jpg",
      blurb: "Dawn boat rides, the famous aarti, Sarnath, and an old-city food walk.",
      tag: "Spiritual", days: 3,
      author: { name: "Ravi", initials: "RV", color: "var(--wp-amber)", verified: true },
      likes: 156, views: 12980,
    },
    {
      id: "cg-ladakh-pangong", destinationId: "d-ladakh",
      title: "Ladakh — Pangong, Nubra & High Passes",
      cover: IMG + "dest-ladakh.jpg",
      blurb: "The blue lakes, sand dunes, and the grandest monasteries at high altitude.",
      tag: "Adventure", days: 6,
      author: { name: "Zoey", initials: "ZO", color: "#7C5CBF", verified: true },
      likes: 289, views: 23010,
    },
    {
      id: "cg-rishikesh-raft", destinationId: "d-rishikesh",
      title: "Rishikesh — Rafting & Yoga on the Ganges",
      cover: IMG + "dest-rishikesh.jpg",
      blurb: "River rapids, sunrise yoga, and hidden Himalayan trails by the Ganga.",
      tag: "Adventure", days: 3,
      author: { name: "Kabir", initials: "KA", color: "#2E7D4F", verified: true },
      likes: 167, views: 14110,
    },
  ];

  window.TripCollabAIData = {
    cityKits: cityKits,
    communityGuides: communityGuides,
    IMG: IMG,
  };
})();
