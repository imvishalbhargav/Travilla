/* ============================================================
   TripCollab — Async font loader (premium, non-blocking)
   Loads the Google Fonts stylesheet asynchronously so it can
   never block first paint — a slow/unreachable font CDN would
   otherwise blank the app before content shows. System fonts
   cover the fallback; a timeout guarantees we never hang.
   ============================================================ */
(function () {
  "use strict";
  var href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700&display=swap";
  var head = document.head;
  var mark = function () { document.documentElement.classList.add("fonts-loaded"); };
  try {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = mark;
    link.onerror = mark; // fall back to system fonts without blocking
    head.appendChild(link);
    // Safety: never let a hanging stylesheet stall anything.
    setTimeout(mark, 2500);
  } catch (e) {
    mark();
  }
})();
