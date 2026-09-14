/* ---------------------------------------------------------------------------
   Ember Tide Fencing Club — main.js
   No framework, no build step, no dependencies. Runs as a classic script.
   1 i18n · 2 header & nav · 3 scrollspy · 4 reveal & counters
   5 share · 6 deferred embeds · 7 contact form · 8 misc
   --------------------------------------------------------------------------- */
(function () {
  "use strict";

  var CFG = window.CLUB || {};
  var doc = document;
  var $ = function (sel, root) { return (root || doc).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };

  /* 1 ── language ─────────────────────────────────────────────────────────
     Bilingual content lives in the markup as data-en / data-zh pairs, so the
     page is readable (and indexable) with JavaScript switched off. Attributes
     follow the same pattern: data-en-placeholder, data-zh-aria-label, ...    */

  var LANGS = ["en", "zh"];
  var ATTRS = ["placeholder", "aria-label", "title", "alt", "value"];

  var STRINGS = {
    docTitle: {
      en: "Ember Tide Fencing Club · 焰潮擊劍會 — Competitive, cooperative, English-friendly fencing in Taipei",
      zh: "焰潮擊劍會 Ember Tide Fencing Club — 台北競技、合作、英語友善的擊劍會"
    },
    metaDesc: {
      en: "Ember Tide Fencing Club (焰潮擊劍會) is a competitive fencing club for Taipei's English-speaking community. Foil, épée and saber, a tournament calendar with registration help, guests from other clubs welcome, and training kept low-cost.",
      zh: "焰潮擊劍會是為台北英語社群而生的競技擊劍俱樂部。花劍、銳劍、軍刀，提供賽事行事曆與報名協助，歡迎其他俱樂部劍手來訪，並努力維持低廉的訓練費用。"
    },
    copied: { en: "Link copied.", zh: "連結已複製。" },
    copyFail: { en: "Could not copy — long-press the address bar instead.", zh: "複製失敗，請改為長按網址列。" },
    shared: { en: "Thanks for sharing.", zh: "感謝分享。" },
    sending: { en: "Sending…", zh: "傳送中…" },
    sent: { en: "Sent — thank you. We'll reply by email, usually within a day.", zh: "已寄出，謝謝！我們會以 Email 回覆，通常在一天內。" },
    failed: { en: "That didn't send. Please email {email} directly or message us on LINE.", zh: "傳送失敗，請直接寄信至 {email}，或透過 LINE 聯絡我們。" },
    needName: { en: "Please add a name we can call you by.", zh: "請留下我們可以稱呼您的名字。" },
    needEmail: { en: "Please add an email address we can reply to.", zh: "請留下可以回覆您的 Email。" },
    needMessage: { en: "Please write a message.", zh: "請輸入訊息內容。" },
    ytMissing: {
      en: "No video is wired up yet — set data-video on this block in index.html to a YouTube video ID.",
      zh: "尚未設定影片——請在 index.html 中將此區塊的 data-video 改為 YouTube 影片 ID。"
    }
  };

  function t(key) {
    var row = STRINGS[key] || {};
    return row[currentLang] || row.en || "";
  }

  var currentLang = "en";

  function detectLang() {
    var url = new URLSearchParams(location.search).get("lang");
    if (LANGS.indexOf(url) > -1) return url;
    try {
      var saved = localStorage.getItem("et-lang");
      if (LANGS.indexOf(saved) > -1) return saved;
    } catch (e) { /* private mode — fall through */ }
    if (CFG.defaultLang && CFG.defaultLang !== "auto" && LANGS.indexOf(CFG.defaultLang) > -1) {
      return CFG.defaultLang;
    }
    return /^zh/i.test(navigator.language || "") ? "zh" : "en";
  }

  function applyLang(lang) {
    currentLang = LANGS.indexOf(lang) > -1 ? lang : "en";
    var other = currentLang === "en" ? "zh" : "en";

    doc.documentElement.lang = currentLang === "zh" ? "zh-Hant-TW" : "en";
    doc.documentElement.setAttribute("data-lang", currentLang);

    // text nodes
    $$("[data-" + currentLang + "]").forEach(function (el) {
      var value = el.getAttribute("data-" + currentLang);
      if (value !== null) el.textContent = value;
    });
    // elements that only carry the other language still need something sane
    $$("[data-" + other + "]:not([data-" + currentLang + "])").forEach(function (el) {
      var value = el.getAttribute("data-" + other);
      if (value !== null) el.textContent = value;
    });

    // attributes
    ATTRS.forEach(function (attr) {
      $$("[data-" + currentLang + "-" + attr + "]").forEach(function (el) {
        el.setAttribute(attr, el.getAttribute("data-" + currentLang + "-" + attr));
      });
    });

    doc.title = t("docTitle");
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("metaDesc"));

    $$("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-set-lang") === currentLang));
    });

    try { localStorage.setItem("et-lang", currentLang); } catch (e) { /* ignore */ }
    buildShareLinks();
  }

  $$("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLang(btn.getAttribute("data-set-lang")); });
  });

  applyLang(detectLang());

  /* 2 ── header & mobile nav ──────────────────────────────────────────── */

  var topbar = $("#topbar");
  var burger = $("#burger");
  var nav = $("#nav");

  function setStuck() {
    if (topbar) topbar.classList.toggle("is-stuck", window.scrollY > 12);
  }
  setStuck();

  function closeNav() {
    doc.body.classList.remove("nav-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }

  if (burger) {
    burger.addEventListener("click", function () {
      var open = doc.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }
  if (nav) {
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
  }
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) closeNav();
  });

  /* 3 ── scrollspy ───────────────────────────────────────────────────── */

  var navLinks = $$("#nav a[href^='#']");
  var sections = navLinks
    .map(function (a) { return doc.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  function spy() {
    var line = window.scrollY + (window.innerHeight * 0.3);
    var active = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= line) active = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + active);
    });
  }

  /* 4 ── reveal on scroll + stat counters ────────────────────────────── */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target) || reduced) { el.textContent = target + suffix; return; }
    var start = performance.now();
    var dur = 1100;
    (function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        $$("[data-count]", entry.target).forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    $$("[data-count]").forEach(countUp);
  }

  /* 5 ── share ───────────────────────────────────────────────────────── */

  var shareStatus = $("#share-status");

  function shareUrl() { return location.href.split("#")[0]; }
  function shareBlurb() { return (CFG.shareTitle || doc.title) + " — " + (CFG.shareText || ""); }

  function buildShareLinks() {
    var u = encodeURIComponent(shareUrl());
    var txt = encodeURIComponent(shareBlurb());
    var map = {
      line: "https://social-plugins.line.me/lineit/share?url=" + u + "&text=" + txt,
      facebook: "https://www.facebook.com/sharer/sharer.php?u=" + u,
      whatsapp: "https://wa.me/?text=" + txt + "%20" + u
    };
    Object.keys(map).forEach(function (key) {
      var el = $("[data-share='" + key + "']");
      if (el) el.href = map[key];
    });
  }
  buildShareLinks();

  function say(el, message, ok) {
    if (!el) return;
    el.textContent = message;
    el.className = "form-status " + (ok === false ? "err" : "ok");
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.textContent = ""; }, 4000);
  }

  var nativeBtn = $("[data-share='native']");
  if (nativeBtn) {
    if (!navigator.share) {
      nativeBtn.style.display = "none";
    } else {
      nativeBtn.addEventListener("click", function () {
        navigator.share({ title: CFG.shareTitle || doc.title, text: CFG.shareText || "", url: shareUrl() })
          .then(function () { say(shareStatus, t("shared")); })
          .catch(function () { /* user cancelled */ });
      });
    }
  }

  var copyBtn = $("[data-share='copy']");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var url = shareUrl();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
          .then(function () { say(shareStatus, t("copied")); })
          .catch(function () { say(shareStatus, t("copyFail"), false); });
      } else {
        say(shareStatus, t("copyFail"), false);
      }
    });
  }

  /* 6 ── deferred third-party embeds ─────────────────────────────────────
     Nothing from YouTube, Facebook or OpenStreetMap loads until the visitor
     asks for it, which keeps the page fast and keeps their cookies out of it. */

  function frame(src, title, height) {
    var f = doc.createElement("iframe");
    f.src = src;
    f.title = title;
    f.loading = "lazy";
    f.allowFullscreen = true;
    f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    if (height) f.style.height = height;
    else f.style.height = "100%";
    f.style.position = "absolute";
    f.style.inset = "0";
    f.style.width = "100%";
    return f;
  }

  $$("[data-embed]").forEach(function (box) {
    var button = $(".embed-consent", box);
    if (!button) return;

    button.addEventListener("click", function () {
      var kind = box.getAttribute("data-embed");
      var node = null;

      if (kind === "youtube") {
        var id = box.getAttribute("data-video") || "";
        if (!id || id.indexOf("REPLACE") === 0) {
          button.innerHTML = "";
          var note = doc.createElement("span");
          note.textContent = t("ytMissing");
          button.appendChild(note);
          return;
        }
        node = frame(
          "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&modestbranding=1",
          "YouTube — Ember Tide Fencing Club"
        );
        node.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
      } else if (kind === "facebook") {
        var page = box.getAttribute("data-page") || CFG.facebookPage || "";
        var pageUrl = encodeURIComponent("https://www.facebook.com/" + page);
        node = frame(
          "https://www.facebook.com/plugins/page.php?href=" + pageUrl +
          "&tabs=timeline&width=500&height=520&small_header=false&adapt_container_width=true" +
          "&hide_cover=false&show_facepile=true&locale=" + (currentLang === "zh" ? "zh_TW" : "en_US"),
          "Facebook — Ember Tide Fencing Club"
        );
      } else if (kind === "map") {
        // OpenStreetMap needs no key and sets no advertising cookies.
        var bbox = "121.5546,25.0428,121.5666,25.0528";
        node = frame(
          "https://www.openstreetmap.org/export/embed.html?bbox=" + bbox + "&layer=mapnik&marker=25.0478,121.5606",
          "Map — Ember Tide Fencing Club"
        );
      }

      if (node) {
        box.appendChild(node);
        button.remove();
      }
    });
  });

  /* 7 ── contact form ────────────────────────────────────────────────────
     Sends without leaving the page. With no formEndpoint configured, the
     message goes through FormSubmit (formsubmit.co) to CFG.email.         */

  var form = $("#contact-form");
  var formStatus = $("#form-status");
  var inbox = CFG.email || "hello@embertide.tw";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // form.name / form.method and friends are shadowed by HTMLFormElement's
      // own properties, so always reach fields through form.elements.
      var fields = form.elements;
      if (fields.website && fields.website.value) return; // honeypot: silently drop

      var value = function (el) { return (el && el.value || "").trim(); };
      var name = value(fields.name);
      var email = value(fields.email);
      var message = value(fields.message);
      if (!name) { say(formStatus, t("needName"), false); fields.name.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say(formStatus, t("needEmail"), false); fields.email.focus(); return; }
      if (!message) { say(formStatus, t("needMessage"), false); fields.message.focus(); return; }

      var select = fields.topic;
      var topic = select ? select.options[select.selectedIndex].textContent.trim() : "";

      var payload = {
        name: name,
        email: email,
        topic: topic,
        message: message,
        pageLanguage: currentLang,
        _subject: "Website message — " + topic + " — " + name,
        _template: "table",
        _captcha: "false"
      };

      var endpoint = CFG.formEndpoint || "https://formsubmit.co/ajax/" + inbox;
      var submit = $("[type='submit']", form);
      if (submit) submit.disabled = true;
      say(formStatus, t("sending"));

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("bad status " + res.status);
          return res.json().catch(function () { return {}; });
        })
        .then(function (data) {
          // FormSubmit reports some failures, like an unactivated inbox, with a 200
          if (data && String(data.success) === "false") throw new Error(data.message || "not sent");
          form.reset();
          say(formStatus, t("sent"));
        })
        .catch(function () { say(formStatus, t("failed").replace("{email}", inbox), false); })
        .then(function () { if (submit) submit.disabled = false; });
    });
  }

  /* 8 ── back to top, scroll wiring ──────────────────────────────────── */

  var toTop = $("#to-top");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  // links that point at a closed FAQ answer open it on the way there
  function openDetails(id) {
    var el = id && doc.getElementById(id);
    if (el && el.tagName === "DETAILS") el.open = true;
  }
  $$("a[href^='#']").forEach(function (a) {
    a.addEventListener("click", function () { openDetails(a.getAttribute("href").slice(1)); });
  });
  openDetails(location.hash.slice(1));

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      setStuck();
      spy();
      if (toTop) toTop.classList.toggle("is-on", window.scrollY > 700);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
