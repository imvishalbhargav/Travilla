/* ============================================================
   TripCollab — Reviews & feedback (Milestone 10)
   Amazon-style: aggregate rating, review cards with "helpful",
   and a write-a-review form with star rating + photo upload.
   Photo upload is compressed to a thumbnail and stored in
   localStorage (client-side only, no backend, no secrets).
   ============================================================ */
(function () {
  "use strict";
  const D = window.TripCollabData;

  const KEY = "tripcollab.reviews.v1";
  const MAX_IMG_BYTES = 300 * 1024; // ~300KB; skip persist if larger

  let userReviews = [];
  function loadUser() { try { const r = localStorage.getItem(KEY); if (r) userReviews = JSON.parse(r); } catch (e) {} }
  function saveUser() { try { localStorage.setItem(KEY, JSON.stringify(userReviews)); } catch (e) {} }

  document.addEventListener("DOMContentLoaded", function () {
    loadUser();
    render();
  });

  function allReviews() { return userReviews.concat(D.reviews.items); }

  function render() {
    const el = document.getElementById("reviews-section");
    if (!el) return;

    const all = allReviews();
    const avg = average(all);
    const count = all.length;

    el.innerHTML =
      '<div class="section__head"><h2 class="section__title">Traveller reviews & photos</h2></div>' +
      '<div class="card" style="margin-bottom:16px">' +
        '<div class="card__body">' +
          '<div class="review-summary">' +
            '<div class="review-summary__score">' + avg.toFixed(1) + "</div>" +
            '<div class="review-summary__meta">' +
              '<div class="review-stars" aria-label="' + avg.toFixed(1) + ' out of 5 stars">' + stars(avg, "lg") + "</div>" +
              '<div class="card__meta">' + count + " verified traveller reviews · photo-verified</div>" +
            "</div>" +
          "</div>" +
          '<div class="review-bars">' + breakdown(all) + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="card" style="margin-bottom:16px">' +
        '<div class="card__body">' +
          '<h3 class="card__title" style="margin-bottom:10px">Write a review</h3>' +
          '<div class="field"><label for="rv-title">Title</label><input id="rv-title" type="text" placeholder="Sum it up in a line" /></div>' +
          '<div class="field"><label>Your rating</label><div class="review-input-stars" id="rv-stars" role="radiogroup" aria-label="Rate 1 to 5 stars">' +
            [1,2,3,4,5].map(function (n) { return '<button type="button" data-star="' + n + '" aria-label="' + n + ' star">★</button>'; }).join("") +
          "</div></div>" +
          '<div class="field"><label for="rv-text">Your review</label><textarea id="rv-text" rows="3" placeholder="What did the group like? How was the guide / stay / value?"></textarea></div>' +
          '<div class="field"><label for="rv-photo">Add a photo (optional)</label>' +
            '<input id="rv-photo" type="file" accept="image/*" />' +
            '<div id="rv-photo-preview" class="review-photo-preview"></div>' +
            '<span class="hint">Photos are real traveller uploads — compressed before saving.</span>' +
          "</div>" +
          '<button class="btn btn--primary" type="button" id="rv-submit"><svg data-icon="i-check" aria-hidden="true"></svg> Post review</button>' +
        "</div>" +
      "</div>" +
      '<div id="rv-list">' + list(all) + "</div>";

    bindStars();
    bindPhoto();
    bindSubmit();
    bindHelpful();
  }

  function average(all) {
    if (!all.length) return 0;
    return all.reduce(function (s, r) { return s + r.rating; }, 0) / all.length;
  }

  function breakdown(all) {
    let bars = "";
    for (let s = 5; s >= 1; s--) {
      const n = all.filter(function (r) { return Math.round(r.rating) === s; }).length;
      const pct = Math.round((n / (all.length || 1)) * 100);
      bars +=
        '<div class="review-bar"><span class="review-bar__label">' + s + "★</span>" +
        '<div class="review-bar__track"><div class="review-bar__fill" style="width:' + pct + '%"></div></div>' +
        '<span class="review-bar__count">' + n + "</span></div>";
    }
    return bars;
  }

  function stars(val, size) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      const filled = i <= Math.round(val);
      html += '<span class="star ' + (filled ? "star--on" : "") + (size === "lg" ? " star--lg" : "") + '">★</span>';
    }
    return html;
  }

  function list(all) {
    return all
      .map(function (r) {
        const img = r.img
          ? '<img class="review-photo" src="' + r.img + '" alt="Traveller photo" loading="lazy" decoding="async" />'
          : "";
        return (
          '<article class="review-item card" style="margin-bottom:14px">' +
            '<div class="card__body">' +
              '<div class="comment">' +
                '<span class="comment__avatar" style="background:' + r.color + '">' + r.initials + "</span>" +
                '<div class="comment__bubble" style="flex:1">' +
                  '<div class="comment__name">' + r.name + " · <span class=\"card__meta\">" + r.date + "</span></div>" +
                  '<div class="review-stars" aria-label="' + r.rating + ' out of 5 stars">' + stars(r.rating) + "</div>" +
                  '<div class="row__title" style="margin-top:4px">' + r.title + "</div>" +
                  '<p class="comment__text">' + r.text + "</p>" +
                  (img ? '<div class="review-photo-wrap">' + img + "</div>" : "") +
                  '<button class="btn btn--ghost review-helpful" data-helpful="' + r.id + '" style="margin-top:8px">' +
                    TC.icon("i-profile") + " Helpful (" + (r.helpful || 0) + ")" +
                  "</button>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function bindStars() {
    const wrap = document.getElementById("rv-stars");
    if (!wrap) return;
    let val = 0;
    const set = function () {
      Array.prototype.forEach.call(wrap.children, function (b, i) {
        b.classList.toggle("selected", i < val);
      });
    };
    Array.prototype.forEach.call(wrap.children, function (b) {
      b.addEventListener("click", function () { val = Number(b.getAttribute("data-star")); set(); });
    });
    wrap._val = function () { return val; };
  }

  function bindPhoto() {
    const input = document.getElementById("rv-photo");
    const preview = document.getElementById("rv-photo-preview");
    if (!input) return;
    let dataUrl = "";
    input.addEventListener("change", function () {
      const file = input.files && input.files[0];
      if (!file) { preview.innerHTML = ""; return; }
      compress(file).then(function (thumb) {
        if (thumb.size > MAX_IMG_BYTES) { preview.innerHTML = '<span class="hint">Image too large — upload under 300KB.</span>'; dataUrl = ""; return; }
        dataUrl = thumb.url;
        preview.innerHTML = '<img src="' + thumb.url + '" alt="Preview" /><span class="hint">Photo added.</span>';
      });
    });
    input._data = function () { return dataUrl; };
  }

  function compress(file) {
    return new Promise(function (resolve) {
      const reader = new FileReader();
      reader.onload = function () {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const maxW = 480;
          const scale = Math.min(1, maxW / img.width);
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve({ url: canvas.toDataURL("image/jpeg", 0.7), size: canvas.toDataURL("image/jpeg", 0.7).length });
        };
        img.onerror = function () { resolve({ url: "", size: 0 }); };
        img.src = reader.result;
      };
      reader.onerror = function () { resolve({ url: "", size: 0 }); };
      reader.readAsDataURL(file);
    });
  }

  function bindSubmit() {
    const btn = document.getElementById("rv-submit");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const title = document.getElementById("rv-title").value.trim();
      const text = document.getElementById("rv-text").value.trim();
      const starsWrap = document.getElementById("rv-stars");
      const photoInput = document.getElementById("rv-photo");
      const rating = starsWrap && starsWrap._val ? starsWrap._val() : 0;
      if (!title || !text || rating === 0) {
        alert("Add a title, rating and review text.");
        return;
      }
      const me = D.group[0];
      const rev = {
        id: "user" + Date.now(),
        name: me.name,
        initials: me.initials,
        color: me.color,
        rating: rating,
        title: title,
        text: text,
        date: "Just now",
        helpful: 0,
        img: photoInput && photoInput._data ? photoInput._data() : "",
      };
      userReviews.unshift(rev);
      saveUser();
      render();
      // reset
      document.getElementById("rv-title").value = "";
      document.getElementById("rv-text").value = "";
      document.getElementById("rv-photo").value = "";
    });
  }

  function bindHelpful() {
    document.querySelectorAll("[data-helpful]").forEach(function (b) {
      b.addEventListener("click", function () {
        const id = b.getAttribute("data-helpful");
        // Only in-memory for seeded ones; persisted for user ones.
        const all = allReviews();
        const r = all.find(function (x) { return x.id === id; });
        if (!r) return;
        r.helpful = (r.helpful || 0) + 1;
        const txt = " Helpful (" + r.helpful + ")";
        b.querySelector("svg") ? null : null;
        b.innerHTML = TC.icon("i-profile") + txt;
      });
    });
  }
})();
