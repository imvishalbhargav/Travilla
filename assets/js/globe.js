/* ============================================================
   TripCollab — Lightweight 3D journey (Milestone 9)
   Dependency-free orthographic "globe" on a 2D canvas:
   - dotted sphere of latitude/longitude points
   - great-circle route arc (Jaipur -> Goa)
   - moving spark + markers
   - auto-rotates; honors prefers-reduced-motion (static frame)
   - pauses when off-screen (IntersectionObserver); DPR-capped
   Optional & never blocks core function (static fallback exists).
   No WebGL library, no network, no secrets.
   ============================================================ */

(function () {
  "use strict";

  var D = window.TripCollabData;
  var reducer = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = reducer ? reducer.matches : false;
  if (reducer) {
    reducer.addEventListener && reducer.addEventListener("change", function (e) { reduceMotion = e.matches; });
  }

  var TAU = Math.PI * 2;

  // Lat / lon (degrees).
  var JAIPUR = { lat: 26.9124, lon: 75.7873, label: "Jaipur" };
  var GOA = { lat: 15.2993, lon: 74.1240, label: "Goa" };

  // Build a dotted sphere: sample lat rings and lon meridians.
  function buildSphere(radius, latStep, lonStep) {
    var pts = [];
    for (var lat = -90; lat <= 90; lat += latStep) {
      for (var lon = 0; lon < 360; lon += lonStep) {
        pts.push(latLonToVec(lat, lon, radius));
      }
    }
    return pts;
  }

  function latLonToVec(lat, lon, r) {
    var la = lat * Math.PI / 180;
    var lo = lon * Math.PI / 180;
    return {
      x: r * Math.cos(la) * Math.cos(lo),
      y: r * Math.cos(la) * Math.sin(lo),
      z: r * Math.sin(la),
    };
  }

  // Interpolate along a great circle between two points (slerp).
  function slerp(a, b, t, r) {
    var dot = a.x * b.x + a.y * b.y + a.z * b.z;
    dot = Math.max(-1, Math.min(1, dot));
    var theta = Math.acos(dot);
    if (theta < 1e-6) return { x: a.x, y: a.y, z: a.z };
    var sinTheta = Math.sin(theta);
    var w1 = Math.sin((1 - t) * theta) / sinTheta;
    var w2 = Math.sin(t * theta) / sinTheta;
    return {
      x: a.x * w1 + b.x * w2,
      y: a.y * w1 + b.y * w2,
      z: a.z * w1 + b.z * w2,
    };
  }

  function rotate(vec, angleX, angleY) {
    // Rotate around Y (spin) then X (tilt).
    var cy = Math.cos(angleY), sy = Math.sin(angleY);
    var x1 = vec.x * cy + vec.z * sy;
    var z1 = -vec.x * sy + vec.z * cy;
    var cx = Math.cos(angleX), sx = Math.sin(angleX);
    var y2 = vec.y * cx - z1 * sx;
    var z2 = vec.y * sx + z1 * cx;
    return { x: x1, y: y2, z: z2 };
  }

  function project(vec, cx, cy, scale) {
    // Orthographic: keep if z > 0 (toward viewer).
    return { x: cx + vec.x * scale, y: cy - vec.y * scale, z: vec.z };
  }

  function makeSpark(progress) { return progress; }

  function Globe(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.opts = opts || {};
    this.progress = 0;
    this.visible = false;
    this.running = false;
    this.time = 0;

    this.a = latLonToVec(JAIPUR.lat, JAIPUR.lon, 1);
    this.b = latLonToVec(GOA.lat, GOA.lon, 1);
    // Route arc raised slightly above the sphere surface.
    this.arc = [];
    for (var i = 0; i <= 40; i++) {
      var p = slerp(this.a, this.b, i / 40, 1.04);
      // Lift ~4% above the sphere so the arc reads over the terminator.
      p.x *= 1.04; p.y *= 1.04; p.z *= 1.04;
      this.arc.push(p);
    }

    this.sphereDots = buildSphere(1, 14, 14);

    // Hover/DRP awareness.
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    var ro = (window.ResizeObserver && new ResizeObserver(this.resize.bind(this))) || null;
    if (ro) ro.observe(canvas.parentElement);
    this.resize();

    // Pause when off-screen.
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(this.onVis.bind(this), { threshold: 0.05 });
      io.observe(canvas);
    }
  }

  Globe.prototype.resize = function () {
    var box = this.canvas.parentElement.getBoundingClientRect();
    var w = box.width || this.canvas.clientWidth || 640;
    var h = Math.max(240, Math.min(360, Math.round(w * 0.56)));
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.w = w; this.h = h;
    this.renderFrame(0);
  };

  Globe.prototype.onVis = function (entries) {
    this.visible = entries[0].isIntersecting;
    if (this.visible && !this.running && !reduceMotion) this.start();
    if (!this.visible && this.running) this.stop();
  };

  Globe.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    var self = this;
    this._last = performance.now();
    var tick = function (t) {
      if (!self.running) return;
      var dt = (t - self._last) / 1000;
      self._last = t;
      self.time += dt;
      self.progress = (self.progress + dt * 0.16) % 1;
      self.renderFrame(t);
      self._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  };

  Globe.prototype.stop = function () {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  };

  Globe.prototype.renderFrame = function (t) {
    var ctx = this.ctx, w = this.w, h = this.h;
    if (!ctx) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var cx = w / 2, cy = h / 2;
    var scale = Math.min(w, h) * 0.44;
    var spin = this.time * 0.18 + 0.4; // auto-rotate
    var tilt = 0.35;

    // Outer glow ring.
    ctx.beginPath();
    ctx.arc(cx, cy, scale * 1.02, 0, TAU);
    ctx.strokeStyle = "rgba(14,124,134,0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Sphere dots (front faces only).
    ctx.fillStyle = "rgba(14,124,134,0.5)";
    for (var i = 0; i < this.sphereDots.length; i++) {
      var rv = rotate(this.sphereDots[i], tilt, spin);
      if (rv.z > 0.02) {
        var p = project(rv, cx, cy, scale);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1, 0, TAU);
        ctx.fill();
      }
    }

    // Route arc.
    ctx.beginPath();
    var started = false;
    for (var j = 0; j < this.arc.length; j++) {
      var rv2 = rotate(this.arc[j], tilt, spin);
      if (rv2.z > 0.02) {
        var p2 = project(rv2, cx, cy, scale);
        if (!started) { ctx.moveTo(p2.x, p2.y); started = true; }
        else ctx.lineTo(p2.x, p2.y);
      }
    }
    ctx.strokeStyle = "var(--wp-waypoint)";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();

    // Markers + spark.
    this.drawMarker(ctx, this.a, tilt, spin, cx, cy, scale, "#0E7C86", JAIPUR.label);
    this.drawMarker(ctx, this.b, tilt, spin, cx, cy, scale, "#B9770E", GOA.label);

    var sp = this.arc[Math.floor(this.progress * this.arc.length)];
    var srv = rotate(sp, tilt, spin);
    if (srv.z > 0.02) {
      var sp2 = project(srv, cx, cy, scale);
      ctx.beginPath();
      ctx.arc(sp2.x, sp2.y, 4, 0, TAU);
      ctx.fillStyle = "var(--wp-amber)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sp2.x, sp2.y, 8, 0, TAU);
      ctx.strokeStyle = "rgba(185,119,14,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Status text (only when idle/reduced).
    this.updateStatus();
  };

  Globe.prototype.drawMarker = function (ctx, vec, tilt, spin, cx, cy, scale, color, label) {
    var rv = rotate(vec, tilt, spin);
    if (rv.z <= 0.02) return;
    var p = project(rv, cx, cy, scale);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, TAU);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, TAU);
    ctx.strokeStyle = color.replace(")", ",0.3)").replace("rgb", "rgba");
    ctx.lineWidth = 2;
    ctx.stroke();
    // Label offset (roughly up-right).
    ctx.font = "700 11px Inter, system-ui, sans-serif";
    ctx.fillStyle = "var(--wp-ink)";
    ctx.textAlign = "center";
    ctx.fillText(label, p.x, p.y - 16);
  };

  Globe.prototype.updateStatus = function () {
    var el = document.getElementById("route3d-status");
    if (!el) return;
    if (reduceMotion) el.textContent = "Static 3D frame (reduced motion)";
    else el.textContent = "Live orbit · auto-rotating";
  };

  // ---- Init ----
  function init() {
    var canvas = document.getElementById("route3d");
    if (!canvas) return;

    var wrap = document.getElementById("route3d-canvas-wrap");
    var stat = document.getElementById("route3d-static");
    var toggle = document.querySelectorAll("[data-view]");

    var globe = null;
    var prefers3D = !reduceMotion && !!canvas.getContext && !!canvas.getContext("2d");

    function setView(view) {
      var use3d = (view === "3d") && prefers3D;
      if (wrap) wrap.hidden = !use3d;
      if (stat) stat.hidden = use3d;
      toggle.forEach(function (b) {
        var sel = (b.getAttribute("data-view") === "3d" && use3d) ||
                  (b.getAttribute("data-view") === "map" && !use3d);
        b.setAttribute("aria-selected", sel ? "true" : "false");
      });
      if (use3d && !globe) {
        globe = new Globe(canvas, {});
        if (reduceMotion) { globe.renderFrame(0); }
        else if (globe.visible) globe.start();
      }
    }

    toggle.forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        setView(b.getAttribute("data-view"));
      });
    });

    // Start in 3D if supported & motion allowed, else static fallback.
    setView(prefers3D ? "3d" : "map");

    // Fill static legs regardless.
    fillStaticLegs();
  }

  function fillStaticLegs() {
    var el = document.getElementById("route3d-static-legs");
    if (!el) return;
    var legs = [
      { icon: "i-train", title: "Train · Jaipur → Madgaon", sub: "1,400 km · ~26h · 3AC" },
      { icon: "i-cab", title: "Local taxi / jeep", sub: "Station → Palolem beach cottages" },
      { icon: "i-hotel", title: "Stay · Little India Beach Cottages", sub: "2 nights, shared" },
    ];
    el.innerHTML = legs
      .map(function (l) {
        return (
          '<div class="row">' +
            '<span class="tl-item__icon">' + TC.icon(l.icon) + "</span>" +
            '<div class="row__main"><div class="row__title">' + l.title + "</div>" +
            '<div class="row__sub">' + l.sub + "</div></div>" +
          "</div>"
        );
      })
      .join("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
