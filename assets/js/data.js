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

  // Foreign-traveller assistance cards.
  const assistance = [
    { icon: "i-sim", title: "Local SIM made easy", text: "Get a working Indian SIM for calls & data — arranged before you land." },
    { icon: "i-rupee", title: "UPI & Indian currency", text: "Set up UPI, see fair exchange, and pay like a local — no gouging." },
    { icon: "i-lock", title: "Local price transparency", text: "Fair, pre-agreed rates for cabs, guides & stays. No surprises." },
    { icon: "i-verify", title: "Verified human help", text: "A real, verified local person to help if anything goes wrong." },
  ];

  return { group, trip, budgetCollab, places, guides, assistance, IMG };
})();
