/* ============================================================
   TripCollab — Shared UI helpers
   Icon reference, current-page marker, tiny interactions.
   ============================================================ */

(function () {
  "use strict";

  // Expand <svg data-icon="i-name"> into the sprite's <use>.
  function hydrateIcons(root) {
    (root || document).querySelectorAll("svg[data-icon]").forEach(function (svg) {
      const name = svg.getAttribute("data-icon");
      if (!name) return;
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "assets/icons/icons.svg#" + name);
      svg.replaceChildren(use);
    });
  }

  // Mark the active bottom-tab / top-nav link based on data-nav key.
  function setActiveNav(key) {
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === key) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  // Initials-based avatar (no AI faces used in the product).
  function initialsAvatar(person, extraClass) {
    return (
      '<span class="' + (extraClass || "") + '" style="background:' +
      (person.color || "var(--wp-waypoint)") +
      '" title="' + (person.name || "") + '">' +
      (person.initials || "") +
      "</span>"
    );
  }

  // Avatar cluster for a group.
  function avatarCluster(people) {
    const cls = ["av-1", "av-2", "av-3", "av-4"];
    return (
      '<div class="avatars" aria-label="' + people.length + ' travellers">' +
      people
        .slice(0, 4)
        .map(function (p, i) {
          return initialsAvatar(p, cls[i % cls.length]);
        })
        .join("") +
      "</div>"
    );
  }

  // Currency formatting (INR) using tabular numerals via class.
  function inr(amount) {
    const n = Number(amount) || 0;
    return "₹" + n.toLocaleString("en-IN");
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Let each page declare its active nav key via <body data-nav="trips">.
    setActiveNav(document.body.getAttribute("data-nav") || "");
    hydrateIcons(document);
  });

  window.TC = {
    hydrateIcons: hydrateIcons,
    initialsAvatar: initialsAvatar,
    avatarCluster: avatarCluster,
    inr: inr,
    setActiveNav: setActiveNav,
    icon: function (name, cls) {
      return '<svg class="' + (cls || "icon") + '" data-icon="' + name + '" aria-hidden="true"></svg>';
    },
  };
})();
