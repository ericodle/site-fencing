/* ---------------------------------------------------------------------------
   Sheshouzuo Fencing Club — main.js
   No framework, no build step, no dependencies. Runs as a classic script.
   1 i18n · 2 header & nav · 3 scrollspy · 4 reveal on scroll
   5 share · 6 deferred embeds · 7 calendar · 8 contact form
   9 member-app links, misc
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
  var ATTRS = ["placeholder", "aria-label", "title", "alt", "value", "content"];

  var STRINGS = {
    copied: { en: "Link copied.", zh: "連結已複製。" },
    copyFail: { en: "Could not copy — long-press the address bar instead.", zh: "複製失敗，請改為長按網址列。" },
    shared: { en: "Thanks for sharing.", zh: "感謝分享。" },
    sending: { en: "Sending…", zh: "傳送中…" },
    sent: { en: "Sent — thank you. We'll reply by email, usually within a day.", zh: "已寄出，謝謝！我們會以 Email 回覆，通常在一天內。" },
    failed: { en: "That didn't send. Please email {email} directly or message us on LINE.", zh: "傳送失敗，請直接寄信至 {email}，或透過 LINE 聯絡我們。" },
    needName: { en: "Please add a name we can call you by.", zh: "請留下我們可以稱呼您的名字。" },
    needEmail: { en: "Please add an email address we can reply to.", zh: "請留下可以回覆您的 Email。" },
    needMessage: { en: "Please write a message.", zh: "請輸入訊息內容。" },
    cal_regular: { en: "Weekly", zh: "每週" },
    cal_practice: { en: "Practice", zh: "練習" },
    cal_tournament: { en: "Tournament", zh: "比賽" },
    cal_interclub: { en: "Inter-club", zh: "跨館交流" },
    cal_social: { en: "Social", zh: "聚會" },
    calNone: { en: "Nothing else on this month — try the next one.", zh: "本月沒有其他活動了——看看下個月吧。" },
    calPast: { en: "already happened", zh: "已結束" },
    calMap: { en: "Open map", zh: "開啟地圖" },
    calEvery: { en: "every {day}", zh: "每{day}" },
    reg_open: { en: "Registration open", zh: "報名中" },
    reg_soon: { en: "Closes soon", zh: "即將截止" },
    reg_tba: { en: "Not yet announced", zh: "尚未公告" },
    reg_closed: { en: "Registration closed", zh: "報名截止" },
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
  var langHooks = []; // renderers that build text in JS and must rerun on a language switch

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

    // <title> and the meta description carry data-en/data-zh like everything
    // else, so the swap above has already handled them. document.title only
    // needs re-reading because setting textContent on <title> does not always
    // propagate in older engines.
    var titleEl = $("title");
    if (titleEl) doc.title = titleEl.textContent;

    $$("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-set-lang") === currentLang));
    });

    try { localStorage.setItem("et-lang", currentLang); } catch (e) { /* ignore */ }
    buildShareLinks();
    langHooks.forEach(function (fn) { fn(); });
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

  /* 4 ── reveal on scroll ─────────────────────────────────────────────── */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
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
          "YouTube — Sheshouzuo Fencing Club"
        );
        node.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
      } else if (kind === "facebook") {
        var page = box.getAttribute("data-page") || CFG.facebookPage || "";
        var pageUrl = encodeURIComponent("https://www.facebook.com/" + page);
        node = frame(
          "https://www.facebook.com/plugins/page.php?href=" + pageUrl +
          "&tabs=timeline&width=500&height=520&small_header=false&adapt_container_width=true" +
          "&hide_cover=false&show_facepile=true&locale=" + (currentLang === "zh" ? "zh_TW" : "en_US"),
          "Facebook — Sheshouzuo Fencing Club"
        );
      } else if (kind === "map") {
        // OpenStreetMap needs no key and sets no advertising cookies.
        var bbox = "121.5546,25.0428,121.5666,25.0528";
        node = frame(
          "https://www.openstreetmap.org/export/embed.html?bbox=" + bbox + "&layer=mapnik&marker=25.0478,121.5606",
          "Map — Sheshouzuo Fencing Club"
        );
      }

      if (node) {
        box.appendChild(node);
        button.remove();
      }
    });
  });

  /* 7 ── club calendar ───────────────────────────────────────────────────
     A month grid in the manner of the site-fundivers calendar: multi-day
     events are laid into stacked tracks, and a bar restarts (with its title)
     at the start of each week. Events come from js/events.js.             */

  var CAL_TYPES = ["regular", "practice", "tournament", "interclub", "social"];
  var TRACK_H = 18;
  var TRACK_GAP = 2;
  var DAY_MS = 86400000;

  function locale() { return currentLang === "zh" ? "zh-TW" : "en-US"; }
  function pick(pair) { return pair ? (pair[currentLang] || pair.en || "") : ""; }
  function el(tag, cls, text) {
    var node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  // "2026-10-03 09:00" or "2026-10-17", read as local (Taipei) time
  function parseStamp(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?$/.exec(s || "");
    if (!m) return null;
    return {
      day: new Date(+m[1], m[2] - 1, +m[3]),
      at: new Date(+m[1], m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)),
      time: m[4] ? m[4] + ":" + m[5] : ""
    };
  }

  var todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // move a parsed stamp by whole days, keeping its time of day
  function shiftStamp(p, days) {
    var day = new Date(p.day.getFullYear(), p.day.getMonth(), p.day.getDate() + days);
    var at = new Date(day.getTime());
    at.setHours(p.at.getHours(), p.at.getMinutes());
    return { day: day, at: at, time: p.time };
  }

  // weekly sessions expand into one instance per week, through `until`
  // (or for 26 weeks when it is missing)
  var calEvents = [];
  (window.CLUB_EVENTS || []).forEach(function (src) {
    var start = parseStamp(src.start);
    if (!start) return;
    var end = parseStamp(src.end) || start;
    var weekly = src.repeat === "weekly";
    var until = weekly ? parseStamp(src.until) : null;
    var weeks = !weekly ? 1 : until ? Math.floor(Math.round((until.day - start.day) / DAY_MS) / 7) + 1 : 26;
    for (var i = 0; i < weeks; i++) {
      var s = shiftStamp(start, i * 7);
      var e = shiftStamp(end, i * 7);
      var endsAt = e.time ? e.at : new Date(e.day.getTime() + DAY_MS);
      calEvents.push({ src: src, type: src.type, start: s, end: e, weekly: weekly, past: endsAt < new Date() });
    }
  });
  calEvents.sort(function (a, b) { return a.start.at - b.start.at; });

  // Lowest free track per event; on equal starts the longer event goes lower.
  function assignTracks(events) {
    var ranges = events.map(function (ev) {
      return { ev: ev, start: ev.start.day, end: ev.end.day, track: 0 };
    });
    ranges.sort(function (a, b) {
      return (a.start - b.start) || ((b.end - b.start) - (a.end - a.start));
    });
    var trackEnds = [];
    ranges.forEach(function (r) {
      var track = 0;
      while (track < trackEnds.length && !(r.start > trackEnds[track])) track++;
      r.track = track;
      trackEnds[track] = r.end;
    });
    return ranges;
  }

  function spanLabel(ev) {
    var opts = { weekday: "short", month: "short", day: "numeric" };
    var label = ev.start.day.toLocaleDateString(locale(), opts);
    if (ev.start.day.getTime() !== ev.end.day.getTime()) {
      return label + " – " + ev.end.day.toLocaleDateString(locale(), opts);
    }
    if (ev.start.time) label += " · " + ev.start.time + (ev.end.time && ev.end.time !== ev.start.time ? "–" + ev.end.time : "");
    if (ev.weekly) label += " · " + t("calEvery").replace("{day}", ev.start.day.toLocaleDateString(locale(), { weekday: "long" }));
    return label;
  }

  var cal = $("#cal");
  var modal = $("#event-modal");
  var calMonth = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
  var hiddenTypes = {};
  var openEvent = null;

  function calBar(r, day, week, last) {
    var ev = r.ev;
    var time = day.getTime();
    // a bar also restarts where a week row or the month begins or ends
    var isStart = time === r.start.getTime() || day.getDay() === 0 || day.getDate() === 1;
    var isEnd = time === r.end.getTime() || day.getDay() === 6 || day.getDate() === last;
    var title = pick(ev.src.title);
    var bar = el("button", "cal-bar t-" + ev.type);
    bar.type = "button";
    if (isStart) bar.classList.add("is-start");
    if (isEnd) bar.classList.add("is-end");
    if (ev.src.featured) bar.classList.add("is-featured");
    bar.style.top = r.track * (TRACK_H + TRACK_GAP) + "px";
    bar.style.left = isStart ? "3px" : "0";
    bar.style.right = isEnd ? "3px" : "0";
    bar.textContent = isStart ? (ev.src.featured ? "★ " : "") + title : " ";
    bar.title = ev.past ? title + " (" + t("calPast") + ")" : title;
    if (!isStart || ev.past) bar.tabIndex = -1;
    if (!isStart) bar.setAttribute("aria-hidden", "true");
    if (ev.past) {
      bar.classList.add("is-past");
      bar.setAttribute("aria-disabled", "true");
    } else {
      bar.addEventListener("click", function () { openModal(ev); });
    }
    return bar;
  }

  function renderCalendar() {
    if (!cal) return;

    $$(".cal-chip", cal).forEach(function (chip) {
      var type = chip.getAttribute("data-type");
      chip.setAttribute("aria-pressed", String(!hiddenTypes[type]));
      $(".cal-chip-label", chip).textContent = t("cal_" + type);
    });

    var year = calMonth.getFullYear();
    var month = calMonth.getMonth();
    var first = new Date(year, month, 1);
    var last = new Date(year, month + 1, 0);
    $(".cal-month", cal).textContent = first.toLocaleDateString(locale(), { month: "long", year: "numeric" });

    var shown = calEvents.filter(function (ev) { return !hiddenTypes[ev.type]; });
    var ranges = assignTracks(shown);
    var rows = 0;
    ranges.forEach(function (r) {
      if (r.end >= first && r.start <= last) rows = Math.max(rows, r.track + 1);
    });
    var strip = Math.max(1, rows) * (TRACK_H + TRACK_GAP);

    var grid = $(".cal-grid", cal);
    grid.innerHTML = "";
    grid.style.setProperty("--cell-h", (32 + strip + 6) + "px");
    for (var w = 0; w < 7; w++) {
      // 13 Sep 2026 is a Sunday; any Sunday anchors the weekday names
      grid.appendChild(el("div", "cal-wd", new Date(2026, 8, 13 + w).toLocaleDateString(locale(), { weekday: "narrow" })));
    }
    for (var b = 0; b < first.getDay(); b++) grid.appendChild(el("div", "cal-day is-blank"));
    for (var d = 1; d <= last.getDate(); d++) {
      var day = new Date(year, month, d);
      var cell = el("div", "cal-day");
      if (day.getTime() === todayStart.getTime()) cell.classList.add("is-today");
      cell.appendChild(el("span", "cal-date", String(d)));
      var holder = el("div", "cal-strip");
      holder.style.height = strip + "px";
      ranges.forEach(function (r) {
        if (day >= r.start && day <= r.end) holder.appendChild(calBar(r, day, null, last.getDate()));
      });
      cell.appendChild(holder);
      grid.appendChild(cell);
    }
    for (var tail = (first.getDay() + last.getDate()) % 7; tail && tail < 7; tail++) {
      grid.appendChild(el("div", "cal-day is-blank"));
    }

    var list = $(".cal-items", cal);
    list.innerHTML = "";
    var upcoming = shown.filter(function (ev) {
      return !ev.past && !ev.weekly && ev.end.day >= first && ev.start.day <= last;
    });
    if (!upcoming.length) {
      var none = el("li");
      none.appendChild(el("p", "cal-empty", t("calNone")));
      list.appendChild(none);
    }
    upcoming.forEach(function (ev) {
      var item = el("button", "cal-item");
      item.type = "button";
      var head = el("span", "cal-item-head");
      head.appendChild(el("span", "cal-pill t-" + ev.type, t("cal_" + ev.type)));
      head.appendChild(el("span", "", (ev.src.featured ? "★ " : "") + pick(ev.src.title)));
      item.appendChild(head);
      item.appendChild(el("span", "cal-item-meta", spanLabel(ev) + " · " + pick(ev.src.place)));
      item.addEventListener("click", function () { openModal(ev); });
      var li = el("li");
      li.appendChild(item);
      list.appendChild(li);
    });

    if (openEvent) fillModal(openEvent);
  }

  // the tournament desk lists every upcoming event that carries registration info
  function renderTourneys() {
    var list = $("#tourney-list");
    if (!list) return;
    list.innerHTML = "";
    calEvents
      .filter(function (ev) { return ev.src.registration && !ev.past; })
      .slice(0, 4)
      .forEach(function (ev) {
        var reg = ev.src.registration;
        var row = el("button", "event" + (ev.type === "interclub" ? " is-host" : ""));
        row.type = "button";

        var date = el("span", "event-date");
        date.appendChild(el("b", "", ev.start.day.toLocaleDateString(locale(), { month: "short" })));
        var sd = ev.start.day.getDate();
        var ed = ev.end.day.getDate();
        date.appendChild(el("span", "", sd === ed ? String(sd) : sd + "–" + ed));

        var body = el("span", "event-body");
        body.appendChild(el("span", "event-title", pick(ev.src.title)));
        body.appendChild(el("span", "event-meta", pick(ev.src.place)));

        var status = el("span", "event-status");
        status.appendChild(el("span", "reg-pill " + reg.status, t("reg_" + reg.status)));
        if (pick(reg)) status.appendChild(el("small", "", pick(reg)));

        row.appendChild(date);
        row.appendChild(body);
        row.appendChild(status);
        row.addEventListener("click", function () { openModal(ev); });
        var li = el("li");
        li.appendChild(row);
        list.appendChild(li);
      });
  }

  function fillModal(ev) {
    var src = ev.src;
    var type = $("#ev-type");
    type.className = "cal-pill t-" + ev.type;
    type.textContent = t("cal_" + ev.type);
    $("#ev-title").textContent = pick(src.title);
    $("#ev-when").textContent = spanLabel(ev);

    var where = $("#ev-where");
    where.textContent = pick(src.place);
    if (src.map) {
      where.appendChild(doc.createTextNode(" · "));
      var map = el("a", "", t("calMap"));
      map.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(src.map);
      map.target = "_blank";
      map.rel = "noopener";
      where.appendChild(map);
    }

    $("#ev-reg-row").hidden = !src.registration;
    if (src.registration) {
      $("#ev-reg").textContent = t("reg_" + src.registration.status) +
        (pick(src.registration) ? " — " + pick(src.registration) : "");
    }
    $("#ev-details").textContent = pick(src.details);
  }

  function openModal(ev) {
    if (!modal) return;
    openEvent = ev;
    fillModal(ev);
    if (typeof modal.showModal === "function") {
      if (!modal.open) modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  }

  function closeModal() {
    openEvent = null;
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }

  if (modal) {
    modal.addEventListener("close", function () { openEvent = null; });
    // a click on the backdrop lands on the <dialog> itself, outside its body
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-close]")) closeModal();
    });
  }

  if (cal) {
    var filters = $(".cal-filters", cal);
    CAL_TYPES.forEach(function (type) {
      var chip = el("button", "cal-chip");
      chip.type = "button";
      chip.setAttribute("data-type", type);
      chip.appendChild(el("span", "cal-dot t-" + type));
      chip.appendChild(el("span", "cal-chip-label"));
      chip.addEventListener("click", function () {
        hiddenTypes[type] = !hiddenTypes[type];
        renderCalendar();
      });
      filters.appendChild(chip);
    });
    $$("[data-cal-step]", cal).forEach(function (step) {
      step.addEventListener("click", function () {
        calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + Number(step.getAttribute("data-cal-step")), 1);
        renderCalendar();
      });
    });
  }

  langHooks.push(renderCalendar, renderTourneys);
  renderCalendar();
  renderTourneys();

  /* 8 ── contact form ────────────────────────────────────────────────────
     Sends without leaving the page. With no formEndpoint configured, the
     message goes through FormSubmit (formsubmit.co) to CFG.email.         */

  var form = $("#contact-form");
  var formStatus = $("#form-status");
  var inbox = CFG.email || "hello@sheshouzuo.tw";

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

  /* 9 ── member-app links, back to top, scroll wiring ────────────────── */

  /* The member app is a separate thing on its own subdomain, and its address
     is a deployment detail rather than page content — so it is set once in
     js/config.js and stamped onto every [data-app-link] here.

     The markup still carries a literal href, because this site works with
     JavaScript switched off and a login link that does not is not a login
     link. The attribute's value is the path to append, defaulting to /login,
     which is what lets the same wiring serve a "sign up" or "my bookings"
     link later without touching this code. */
  var appBase = String(CFG.appUrl || "").replace(/\/+$/, "");
  if (appBase) {
    $$("[data-app-link]").forEach(function (a) {
      a.href = appBase + (a.getAttribute("data-app-link") || "/login");
    });
  }


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
