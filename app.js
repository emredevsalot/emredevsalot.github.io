// Renders the portfolio from window.SITE (data.js) into the page's containers:
// #stats, #featured, #brands, #awards, #filters, #grid, #experience, #skills, plus the detail popup.
(function () {
  const S = window.SITE;
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function fmt(n) {
    if (n == null) return "–";
    if (n >= 1e6) return (n / 1e6 >= 10 ? Math.round(n / 1e6) : (n / 1e6).toFixed(1).replace(/\.0$/, "")) + "M";
    if (n >= 1e3) return (n / 1e3 >= 10 ? Math.round(n / 1e3) : (n / 1e3).toFixed(1).replace(/\.0$/, "")) + "K";
    return String(n);
  }
  const monthYear = (d) => {
    if (!d) return "";
    const [y, m] = d.split("-");
    return m ? new Date(+y, +m - 1).toLocaleString("en", { month: "short", year: "numeric" }) : y;
  };
  const asOf = monthYear(S.totals.asOf);
  const place = (r) => (r.startsWith("2nd") ? 2 : r.startsWith("3rd") ? 3 : r.startsWith("1st") ? 1 : 9);
  const awardShort = (a) => (place(a.result) < 9 ? a.result : "Honorable Mention");

  // ---------- ordering ----------
  // Own lenses newest first, then Spectacles, brand lenses and YouTube Effects.
  const kindRank = { lens: 0, specs: 1, "client-lens": 2, "youtube-effect": 3 };
  const items = S.items.slice().sort((a, b) =>
    kindRank[a.kind] - kindRank[b.kind] || (b.date || "").localeCompare(a.date || ""));
  const featured = S.items
    .filter((x) => x.featured)
    .sort((a, b) => (a.kind === "lens" ? 0 : 1) - (b.kind === "lens" ? 0 : 1) || (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

  // ---------- stats ----------
  const statList = [
    { id: "views", value: fmt(S.totals.views) + "+", label: "lens views", note: `as of ${asOf}` },
    { id: "awards", value: S.totals.awards.total, label: "challenge awards", note: `${S.totals.awards["2nd_place"]}× 2nd · ${S.totals.awards["3rd_place"]}× 3rd` },
    { id: "lenses", value: S.totals.lenses, label: "own Snapchat Lenses", note: "since May 2024" },
    { id: "brands", value: S.totals.brands, label: "global brands", note: "lenses built with the QReal team" },
  ];
  const statsEl = $("#stats");
  // Which tiles show, in what order and with what wording comes from profile/site.json (hero_stats).
  const shown = (S.site && S.site.hero_stats && S.site.hero_stats.length)
    ? S.site.hero_stats.map((h) => ({ ...statList.find((s) => s.id === h.id), ...h })).filter((s) => s.value !== undefined)
    : statList;
  if (statsEl) statsEl.innerHTML = shown.map((s) =>
    `<div class="stat"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div><div class="stat-note">${s.note}</div></div>`).join("");

  // ---------- media helpers ----------
  const videoOf = (x) => x.media.preview || x.media.walkthrough;
  const isWide = (x) => x.kind === "specs";

  function thumb(x, { autoplay = false } = {}) {
    const v = videoOf(x);
    if (!x.media.poster && !v) return `<div class="thumb thumb-text"><span>${esc(x.name)}</span></div>`;
    const poster = x.media.poster ? `<img src="${x.media.poster}" alt="" loading="lazy">` : "";
    const vid = v ? `<video muted loop playsinline preload="none" data-src="${v}" ${autoplay ? "data-autoplay" : ""}></video>` : "";
    return `<div class="thumb ${isWide(x) ? "wide" : ""}">${poster}${vid}</div>`;
  }
  function awardBadge(x) {
    if (!x.award) return "";
    const p = place(x.award.result);
    return `<span class="badge badge-${p < 9 ? "place" : "hm"}" title="${esc(x.award.challenge)}">${p < 9 ? (p === 2 ? "2nd" : "3rd") + " place" : "Award"}</span>`;
  }
  // Left-hand label: multiplayer / web lens beat the generic type, since those are the newest work.
  const typeLabel = (x) => x.tags.includes("multiplayer") ? "Multiplayer" : x.tags.includes("web-lens") ? "Web Lens"
    : x.kind === "lens" ? x.type : x.kind === "client-lens" ? "QReal" : x.kindLabel;
  // Right-hand label: plays only for 1M+ lenses, otherwise the date or the brand.
  const keyStat = (x) => x.showStats ? `${fmt(x.stats.plays)} plays` : x.client ? esc(x.client) : monthYear(x.date);

  // ---------- featured ----------
  const featEl = $("#featured");
  if (featEl) featEl.innerHTML = featured.map((x, i) => `
    <article class="feat ${isWide(x) ? "feat-wide" : ""}" data-slug="${x.slug}" tabindex="0">
      ${thumb(x, { autoplay: true })}
      ${awardBadge(x)}
      <div class="feat-body">
        <div class="feat-meta"><span class="feat-num">${String(i + 1).padStart(2, "0")}</span><span class="kind">${esc(typeLabel(x))}</span></div>
        <h3>${esc(x.name)}</h3>
        <p>${esc(x.desc)}</p>
        <div class="feat-stats">${x.showStats
          ? `<span><b>${fmt(x.stats.plays)}</b> plays</span><span><b>${fmt(x.stats.shares)}</b> shares</span>`
          : `<span>${esc(monthYear(x.date))}</span>`}</div>
      </div>
    </article>`).join("");

  // ---------- brands ----------
  const brandsEl = $("#brands");
  if (brandsEl) brandsEl.innerHTML = S.brands.map((b) => `<span class="brand">${esc(b)}</span>`).join("");

  // ---------- awards ----------
  const awardsEl = $("#awards");
  if (awardsEl) {
    const byItem = Object.fromEntries(S.items.map((x) => [x.slug, x]));
    awardsEl.innerHTML = S.awards.slice().sort((a, b) => place(a.result) - place(b.result)).map((a) => {
      const x = byItem[a.item];
      return `<li class="award award-${place(a.result) < 9 ? "place" : "hm"}" data-slug="${a.item}" tabindex="0">
        <span class="award-result">${esc(awardShort(a))}</span>
        <span class="award-challenge">${esc(a.challenge)}</span>
        <span class="award-item">${esc(x ? x.name : a.item)}</span>
        <span class="award-org">${esc(a.organizer)}</span>
        ${x ? thumb(x) : ""}
      </li>`;
    }).join("");
  }

  // ---------- spotlight: the most-played lens, with its Snapcode ----------
  const spotEl = $("#spotlight");
  if (spotEl) {
    const x = S.items.filter((i) => i.showStats).sort((a, b) => b.stats.plays - a.stats.plays)[0];
    spotEl.innerHTML = `
      <div class="spot-media">${thumb(x, { autoplay: true })}</div>
      <div class="spot-body">
        <span class="label">My most-played lens</span>
        <h3>${esc(x.name)}</h3>
        <p>${esc(x.desc)}</p>
        <div class="spot-stats"><div><b>${fmt(x.stats.plays)}</b><span>plays</span></div><div><b>${fmt(x.stats.shares)}</b><span>shares</span></div></div>
        <div class="spot-try">
          ${x.media.snapcode ? `<img src="${x.media.snapcode}" alt="Snapcode for ${esc(x.name)}">` : ""}
          <div><b>Scan to try it</b><a class="btn" href="${x.link}" target="_blank" rel="noopener">Open on Snapchat ↗</a></div>
        </div>
        <span class="muted small">Snapchat stats as of ${monthYear(x.stats.as_of)}</span>
      </div>`;
  }

  // ---------- filters + grid ----------
  const filters = [
    { id: "all", label: "All work", test: () => true },
    { id: "multiplayer", label: "Multiplayer", test: (x) => x.tags.includes("multiplayer") },
    { id: "web-lens", label: "Web Lenses", test: (x) => x.tags.includes("web-lens") },
    { id: "client-lens", label: "Brand Lenses", test: (x) => x.kind === "client-lens" },
    { id: "award", label: "Awarded", test: (x) => !!x.award },
    { id: "game", label: "Games", test: (x) => x.kind === "lens" && x.type === "Game" },
    { id: "face", label: "Face & camera", test: (x) => x.kind === "lens" && /Face|Camera|World/.test(x.type) },
    { id: "specs", label: "Spectacles", test: (x) => x.kind === "specs" },
    { id: "youtube-effect", label: "YouTube Effects", test: (x) => x.kind === "youtube-effect" },
  ];
  let current = "all";
  // Start with 3 rows; "See more" adds 3 at a time. Rows are measured, so this works at any column count.
  const ROW_STEP = 3;
  let rowsShown = ROW_STEP;
  let visible = items;
  const filtersEl = $("#filters");
  const gridEl = $("#grid");

  function renderFilters() {
    filtersEl.innerHTML = filters.map((f) => {
      const n = items.filter(f.test).length;
      return `<button class="chip ${f.id === current ? "on" : ""}" data-filter="${f.id}">${f.label}<span class="count">${n}</span></button>`;
    }).join("");
  }
  function renderGrid() {
    const f = filters.find((f) => f.id === current);
    visible = items.filter(f.test);
    gridEl.innerHTML = visible.map((x) => `
      <article class="card ${isWide(x) ? "card-wide" : ""} card-${x.kind}" data-slug="${x.slug}" tabindex="0">
        ${thumb(x)}
        ${awardBadge(x)}
        <div class="card-body">
          <h4>${esc(x.name)}</h4>
          <div class="card-meta"><span>${esc(typeLabel(x))}</span><span>${keyStat(x)}</span></div>
        </div>
      </article>`).join("");
    limitRows();
  }
  const moreBtn = document.createElement("button");
  moreBtn.className = "btn btn-ghost see-more";
  moreBtn.addEventListener("click", () => { rowsShown += ROW_STEP; limitRows(); });
  function limitRows() {
    const cards = [...gridEl.children];
    cards.forEach((c) => c.classList.remove("is-hidden"));
    const tops = [...new Set(cards.map((c) => c.offsetTop))].sort((a, b) => a - b);
    const perRow = cards.filter((c) => c.offsetTop === tops[0]).length;
    // don't hide a lonely partial row behind the button: if what's left is less than a row, show it
    const left = tops[rowsShown] == null ? 0 : cards.filter((c) => c.offsetTop >= tops[rowsShown]).length;
    const cutoff = left && left < perRow ? null : tops[rowsShown];
    let hidden = 0;
    if (cutoff != null) cards.forEach((c) => { if (c.offsetTop >= cutoff) { c.classList.add("is-hidden"); hidden++; } });
    moreBtn.hidden = hidden === 0;
    moreBtn.textContent = `See more (${hidden} more)`;
    if (!moreBtn.isConnected) gridEl.after(moreBtn);
  }
  let resizeT;
  window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => gridEl && limitRows(), 150); });
  if (filtersEl && gridEl) {
    renderFilters();
    renderGrid();
    document.addEventListener("click", (e) => {
      const g = e.target.closest("[data-goto-filter]");
      if (!g) return;
      current = g.dataset.gotoFilter;
      rowsShown = ROW_STEP;
      renderFilters();
      renderGrid();
    });
    filtersEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      current = b.dataset.filter;
      rowsShown = ROW_STEP;
      renderFilters();
      renderGrid();
    });
  }

  // Hover-to-play on grid cards; featured videos play while on screen.
  // Keep the poster visible until the video actually has frames, so slow loads never show black.
  function play(v) {
    if (!v) return;
    if (!v.src) { v.src = v.dataset.src; v.addEventListener("playing", () => v.parentElement.classList.add("playing")); }
    else if (!v.paused || v.readyState > 2) v.parentElement.classList.add("playing");
    v.play().catch(() => {});
  }
  function pause(v) { if (!v) return; v.pause(); v.parentElement.classList.remove("playing"); }
  document.addEventListener("pointerover", (e) => { const c = e.target.closest(".card, .award"); if (c && !c.contains(e.relatedTarget)) play($("video", c)); });
  document.addEventListener("pointerout", (e) => { const c = e.target.closest(".card, .award"); if (c && !c.contains(e.relatedTarget)) pause($("video", c)); });
  const io = new IntersectionObserver((es) => es.forEach((en) => (en.isIntersecting ? play(en.target) : pause(en.target))), { threshold: 0.35 });
  document.querySelectorAll("video[data-autoplay]").forEach((v) => io.observe(v));

  // ---------- experience + skills ----------
  const expEl = $("#experience");
  if (expEl) expEl.innerHTML = S.experience.map((r) => `
    <li class="role">
      <span class="role-dates">${monthYear(r.start)} – ${r.end ? monthYear(r.end) : "Present"}</span>
      <span class="role-title">${esc(r.title)}</span>
      ${r.company ? `<span class="role-company">${esc(r.company)}</span>` : ""}
    </li>`).join("");
  const skillsEl = $("#skills");
  if (skillsEl) skillsEl.innerHTML = S.skills.core.map((s) => `<span class="skill">${esc(s)}</span>`).join("");

  // ---------- detail modal ----------
  const modal = document.createElement("dialog");
  modal.className = "modal";
  document.body.appendChild(modal);
  let openIdx = -1;
  let list = items;

  function linkButtons(x) {
    const L = x.links || {};
    const out = [];
    if (x.kind === "lens" || x.kind === "client-lens") out.push(["Try it on Snapchat", x.link]);
    if (L.live) out.push(["Open live", L.live]);
    if (L.code) out.push(["Source code", L.code]);
    return out.filter(([, u]) => u).map(([t, u], i) => `<a class="btn ${i ? "btn-ghost" : ""}" href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join("");
  }
  function openModal(slug, fromList) {
    list = fromList || items;
    openIdx = list.findIndex((x) => x.slug === slug);
    if (openIdx < 0) { list = items; openIdx = items.findIndex((x) => x.slug === slug); }
    renderModal();
    if (!modal.open) {
      modal.showModal();
      history.pushState({ modal: true }, "");  // so the phone's Back button closes the popup instead of leaving
    }
  }
  function renderModal() {
    const x = list[openIdx];
    const v = videoOf(x);
    modal.innerHTML = `
      <div class="modal-inner ${isWide(x) ? "modal-wide" : ""}">
        <div class="modal-media">${v
          ? `<video src="${v}" ${x.media.poster ? `poster="${x.media.poster}"` : ""} autoplay muted loop playsinline controls></video>`
          : `<div class="thumb thumb-text"><span>${esc(x.name)}</span></div>`}</div>
        <div class="modal-info">
          <div class="modal-top"><span class="kind">${esc([x.kindLabel, x.kind === "lens" ? typeLabel(x) : x.client || monthYear(x.date)].filter(Boolean).join(" · "))}</span>
            <button class="modal-close" aria-label="Close">✕</button></div>
          <h3>${esc(x.name)}</h3>
          ${x.award ? `<div class="modal-award">${place(x.award.result) < 9 ? "🏆" : "🏅"} ${esc(x.award.result)}, ${esc(x.award.challenge)} <small>${esc(x.award.organizer)}</small></div>` : ""}
          ${x.desc ? `<p>${esc(x.desc)}</p>` : x.kind === "client-lens" ? `<p class="muted">Branded lens${x.client ? ` for ${esc(x.client)}` : ""}, developed as part of the QReal team.</p>` : ""}
          ${x.showStats ? `<dl class="modal-stats">
              <div><dt>Plays</dt><dd>${fmt(x.stats.plays)}</dd></div>
              <div><dt>Shares</dt><dd>${fmt(x.stats.shares)}</dd></div>
            </dl><div class="muted small">Snapchat stats as of ${monthYear(x.stats.as_of)}</div>` : ""}
          ${x.tech.length ? `<div class="tech">${x.tech.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
          <div class="modal-links">${linkButtons(x)}</div>
          ${x.media.snapcode ? `<div class="snapcode"><img src="${x.media.snapcode}" alt="Snapcode for ${esc(x.name)}"><span>Scan to try it</span></div>` : ""}
          <div class="modal-nav"><button data-step="-1">← Prev</button><span>${openIdx + 1} / ${list.length}</span><button data-step="1">Next →</button></div>
        </div>
      </div>`;
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".modal-close")) return modal.close();
    const s = e.target.closest("[data-step]");
    if (s) { openIdx = (openIdx + +s.dataset.step + list.length) % list.length; renderModal(); }
  });
  modal.addEventListener("close", () => {
    if (modal.open) return;               // already reopened
    modal.innerHTML = "";                 // stops the video
    if (history.state && history.state.modal) history.back();
  });
  addEventListener("popstate", () => { if (modal.open) modal.close(); });
  document.addEventListener("keydown", (e) => {
    if (modal.open && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      openIdx = (openIdx + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length;
      renderModal();
    } else if (!modal.open && e.key === "Enter" && e.target.dataset?.slug) {
      e.target.click();
    }
  });
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-slug]");
    if (!el || modal.contains(el)) return;
    const inGrid = gridEl && gridEl.contains(el);
    const inAwards = awardsEl && awardsEl.contains(el);
    if (inAwards) {
      const order = [...awardsEl.children].map((li) => li.dataset.slug);
      return openModal(el.dataset.slug, order.map((slug) => items.find((x) => x.slug === slug)).filter(Boolean));
    }
    const inFeat = featEl && featEl.contains(el);
    openModal(el.dataset.slug, inGrid ? visible : inFeat ? featured : items);
  });

  // ---------- small text bindings ----------
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const k = el.dataset.bind;
    const map = {
      views: fmt(S.totals.views), shares: fmt(S.totals.shares), plays: fmt(S.totals.plays),
      lenses: S.totals.lenses, asOf, awards: S.totals.awards.total, brands: S.totals.brands,
      multiplayer: S.totals.multiplayer, webLenses: S.totals.webLenses, viewsPlus: fmt(S.totals.views) + "+", playsPlus: fmt(S.totals.plays) + "+",
      specs: S.totals.specs, youtube: S.totals.youtube,
      total: S.items.length, email: S.profile.email,
    };
    el.textContent = map[k] ?? "";
  });
})();
