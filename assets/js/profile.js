/* ============================================================
   TripCollab — Profile
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  document.addEventListener("DOMContentLoaded", function () {
    renderHead();
    renderAssistance();
  });

  function renderHead() {
    const el = document.getElementById("profile-head");
    if (!el) return;
    const me = { name: "Asha V.", initials: "AS", color: "var(--wp-waypoint)", tag: "Group Lead · Budget check · Culture seeker" };
    el.innerHTML =
      '<div style="display:flex;align-items:center;gap:1rem">' +
        '<span style="width:4rem;height:4rem;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.25rem;background:' + me.color + '">' + me.initials + "</span>" +
        "<div>" +
          '<div style="font-weight:700;font-size:1.125rem">' + me.name + "</div>" +
          '<div class="card__meta">' + me.tag + "</div>" +
          '<div style="display:flex;gap:0.5rem;margin-top:6px;flex-wrap:wrap">' +
            '<span class="pill pill--verify">' + TC.icon("i-verify", "icon") + " Traveller</span>" +
            '<span class="pill">' + TC.icon("i-budget") + " ₹1,500 budget</span>" +
          "</div>" +
        "</div>" +
      "</div>";
  }

  function renderAssistance() {
    const el = document.getElementById("assistance");
    if (!el) return;
    el.innerHTML =
      '<div class="section__head" style="margin-bottom:8px"><h2 class="section__title">Foreign-traveller assistance</h2></div>' +
      D.assistance
        .map(function (a) {
          return (
            '<div class="row">' +
              '<span class="tl-item__icon">' + TC.icon(a.icon) + "</span>" +
              "<div class=\"row__main\">" +
                '<div class="row__title">' + a.title + "</div>" +
                '<div class="row__sub">' + a.text + "</div>" +
              "</div>" +
            "</div>"
          );
        })
        .join("");
  }
})();
