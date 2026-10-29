// Page behaviour for the portfolio site: emoji avatar, phone menu, slingshot mini-game, brand marquee.
// Loaded after data.js and app.js.

// Duplicate the brand list so the marquee loops seamlessly.
(() => { const b = document.getElementById("brands"); if (b) b.innerHTML += b.innerHTML; })();

// Avatar emoji: starts as a ghost, swaps to a random one on hover (Pop & spin).
(() => {
  const EMOJI = ["🎮", "🕹️", "👾", "🎯", "🚀", "✨", "🎨", "🧩", "🎲", "🏆", "🎃", "🤖", "🌈", "🔥", "⚡", "🪄", "📸", "🦄", "🍕", "🎉", "😎", "🐙", "🌵", "👻"];
  const A = { out: [{ transform: "scale(1) rotate(0)" }, { transform: "scale(0) rotate(-120deg)" }], outT: { duration: 160, easing: "ease-in" },
    in: [{ transform: "scale(0) rotate(120deg)" }, { transform: "scale(1.25) rotate(-10deg)" }, { transform: "scale(1) rotate(0)" }], inT: { duration: 340, easing: "cubic-bezier(.34,1.56,.64,1)" } };
  const el = document.querySelector(".avatar .emoji");
  const pick = (not) => { let e; do { e = EMOJI[Math.floor(Math.random() * EMOJI.length)]; } while (e === not); return e; };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let busy = false;
  document.querySelector(".avatar").addEventListener("pointerenter", async (e) => {
    if (e.pointerType !== "mouse" || busy) return;
    busy = true;
    if (!reduce) await el.animate(A.out, A.outT).finished;
    el.textContent = pick(el.textContent);
    if (!reduce) await el.animate(A.in, A.inT).finished;
    busy = false;
  });
})();

// Phone menu: toggle the dropdown; close it on link click, outside click or Escape.
(() => {
  const btn = document.querySelector(".menu-btn"), panel = document.getElementById("menu-panel");
  const set = (open) => { panel.hidden = !open; btn.setAttribute("aria-expanded", open); };
  btn.addEventListener("click", (e) => { e.stopPropagation(); set(panel.hidden); });
  panel.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("click", (e) => { if (!panel.hidden && !panel.contains(e.target)) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  // After scrolling a little past the name card, float the button at the top.
  new IntersectionObserver(([e]) => document.body.classList.toggle("menu-float", !e.isIntersecting && e.boundingClientRect.top < 0),
    { rootMargin: "-40px 0px 0px 0px" }).observe(document.querySelector(".nc-c .who"));
})();

// Emoji slingshot mini-game on the avatar circle: press and drag to pull back,
// release to launch the emoji; it bounces off boxes (+1 each) and the screen edges.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const av = document.querySelector(".avatar"), em = av.querySelector(".emoji");
  const NEXT = ["🎮", "👾", "🎯", "🚀", "🧩", "🎲", "🏆", "🎃", "🤖", "🔥", "🦄", "🍕", "🎉", "😎", "🐙", "👻"];
  const DRAG_START = 8, MAX_PULL = 140, POWER = 0.0115, GRAVITY = 0.0025;  // slingshot (px, px/ms per px, px/ms²)
  let pulling = false, origin = null, pull = { x: 0, y: 0 }, shot = null;

  // ---------- slingshot ----------
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "sling");
  svg.innerHTML = '<line class="sling-aim"/><line class="sling-band"/><line class="sling-band"/>';
  document.body.appendChild(svg);
  const [bandL, bandR] = svg.querySelectorAll(".sling-band"), aim = svg.querySelector(".sling-aim");
  const set = (el, a) => Object.entries(a).forEach(([k, v]) => el.setAttribute(k, v));

  function startPull() {
    pulling = true;
    shot = document.createElement("span");
    shot.className = "rain sling-shot";
    shot.textContent = em.textContent;
    shot.style.fontSize = getComputedStyle(em).fontSize;
    document.body.appendChild(shot);
    em.style.opacity = "0";
    svg.classList.add("on");
  }
  function drawPull() {
    const x = origin.x + pull.x, y = origin.y + pull.y, len = Math.hypot(pull.x, pull.y);
    shot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    // two strings, one from each side of the circle, like a real slingshot fork
    const w = Math.max(1.5, 5 - len / 40);
    const a = origin.r * 0.55;  // anchor points inside the yellow circle, where a yellow string is invisible
    set(bandL, { x1: origin.x - a, y1: origin.y, x2: x, y2: y, "stroke-width": w });
    set(bandR, { x1: origin.x + a, y1: origin.y, x2: x, y2: y, "stroke-width": w });
    set(aim, { x1: origin.x, y1: origin.y, x2: origin.x - pull.x * 0.9, y2: origin.y - pull.y * 0.9 });
  }
  // A hit: the box gets nudged away from the impact, flashes yellow, and the combo count ("+1", "+2", ...) floats up.
  const TARGETS = ".name-card, .stat, .feat, .card:not(.is-hidden), .award, .panel, .contact-box";
  const STEP = 4, REST = 0.8, FRICTION = 0.07, MIN_HIT = 0.15, ROLL = 0.996;  // ms, bounciness, surface grip, px/ms, floor drag per step
  function hit(box, x, y, nx, ny, n, impact) {
    if (box) {
      // knocked away from the emoji, harder hits push further, then it springs back with a couple of wobbles
      const r = box.getBoundingClientRect(), big = Math.max(1, Math.max(r.width, r.height) / 260);
      const a = Math.min(4 + impact * 14, 22) / big;
      const px = -nx * a, py = -ny * a, tilt = (nx ? -nx : ny * (x < r.left + r.width / 2 ? 1 : -1)) * a / 4;
      box.animate(
        [{ transform: "none" },
         { transform: `translate(${px}px, ${py}px) rotate(${tilt}deg)`, offset: 0.18 },
         { transform: `translate(${-px * 0.45}px, ${-py * 0.45}px) rotate(${-tilt * 0.45}deg)`, offset: 0.45 },
         { transform: `translate(${px * 0.18}px, ${py * 0.18}px) rotate(${tilt * 0.18}deg)`, offset: 0.7 },
         { transform: "none" }],
        { duration: 620, easing: "ease-out" }
      );
    }
    if (box) box.animate([{ borderColor: "#FFFC00", boxShadow: "0 0 0 2px rgba(255,252,0,.35)" }, { borderColor: "", boxShadow: "none" }], { duration: 600, easing: "ease-out" });
    x = Math.min(Math.max(x, 30), innerWidth - 30);  // keep the number on screen for edge hits
    y = Math.max(y, 72);
    const p = document.createElement("span");
    p.className = "score-pop";
    p.textContent = "+" + n;
    p.style.fontSize = Math.min(20 + (n - 1) * 3, 38) + "px";  // bigger with every skip
    document.body.appendChild(p);
    p.animate(
      [{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(.6)`, opacity: 1 },
       { transform: `translate(${x}px, ${y - 46}px) translate(-50%, -50%) scale(1.1)`, opacity: 1, offset: 0.6 },
       { transform: `translate(${x}px, ${y - 64}px) translate(-50%, -50%) scale(1)`, opacity: 0 }],
      { duration: 800, easing: "ease-out" }
    ).finished.then(() => p.remove());
  }

  // Best score (most hits in one shot), remembered in this browser; shown as a small badge under the circle.
  let best = 0;
  try { best = +localStorage.getItem("slingBest") || 0; } catch {}
  const badge = document.createElement("span");
  badge.className = "sling-best";
  badge.setAttribute("aria-hidden", "true");
  av.parentElement.appendChild(badge);
  function showBest(isNew) {
    badge.classList.remove("pill");
    badge.textContent = "🏆 " + best;
    badge.style.left = av.offsetLeft + av.offsetWidth / 2 + "px";
    badge.style.top = av.offsetTop + av.offsetHeight - 6 + "px";  // sits on the circle's bottom edge, above the divider
    badge.classList.add("on");
    if (isNew) badge.animate([{ transform: "translateX(-50%) scale(1)" }, { transform: "translateX(-50%) scale(1.35)" }, { transform: "translateX(-50%) scale(1)" }], { duration: 450, easing: "cubic-bezier(.34,1.56,.64,1)" });
  }
  function record(hits) {
    const isNew = hits > best;
    if (isNew) { best = hits; try { localStorage.setItem("slingBest", best); } catch {} }
    showBest(isNew);
    spawnPowerups();
  }
  if (best) showBest(false);
  addEventListener("resize", () => { if (badge.classList.contains("pill")) showPill(); else if (badge.classList.contains("on")) showBest(false); });

  // ---------- power-ups ----------
  // After a few plays, small power-ups appear in empty spots on screen. Fly the emoji through one
  // to collect it; the effect lasts for the rest of that shot.
  const UNLOCK = 3, MAX_POWERUPS = 2, POWERUP_LIFE = 30000;
  const POWERS = [
    { icon: "⚡", name: "Boost!" },          // faster right away
    { icon: "🪶", name: "Feather!" },        // much lower gravity
    { icon: "💎", name: "Double points!" },  // every hit counts twice
    { icon: "🌀", name: "Super bounce!" },   // barely loses speed on bounces
  ];
  const AVOID = TARGETS + ", .sec-head, .brands-sec, #filters, .see-more, header.nav, .menu-btn, footer";
  let plays = 0;
  try { plays = +localStorage.getItem("slingPlays") || 0; } catch {}
  const live = new Set();

  function floatText(text, near, size = 16) {
    const r = near.getBoundingClientRect();
    const p = document.createElement("span");
    p.className = "score-pop";
    p.textContent = text;
    p.style.fontSize = size + "px";
    document.body.appendChild(p);
    const x = Math.min(Math.max(r.left + r.width / 2, 90), innerWidth - 90), y = Math.max(r.top, 72);
    p.animate(
      [{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(.7)`, opacity: 0 },
       { transform: `translate(${x}px, ${y - 30}px) translate(-50%, -50%) scale(1.05)`, opacity: 1, offset: 0.25 },
       { transform: `translate(${x}px, ${y - 44}px) translate(-50%, -50%) scale(1)`, opacity: 1, offset: 0.8 },
       { transform: `translate(${x}px, ${y - 52}px) translate(-50%, -50%) scale(1)`, opacity: 0 }],
      { duration: 1400, easing: "ease-out" }
    ).finished.then(() => p.remove());
  }

  // Random empty spot in the visible part of the page, away from boxes, headings and other power-ups.
  function findSpot() {
    const avoid = [...document.querySelectorAll(AVOID)].map((e) => e.getBoundingClientRect())
      .filter((r) => r.width && r.bottom > 0 && r.top < innerHeight);
    // try roomy spots first, then accept tighter gaps (e.g. the space between two sections)
    for (const gap of [30, 14, 4]) {
      const m = 19 + gap;  // power-up radius + breathing room
      for (let i = 0; i < 80; i++) {
        const x = 30 + Math.random() * (innerWidth - 60), y = 70 + Math.random() * (innerHeight - 120);
        const clear = avoid.every((r) => x < r.left - m || x > r.right + m || y < r.top - m || y > r.bottom + m)
          && [...live].every((p) => Math.hypot(p.vx - x, p.vy - y) > 140);
        if (clear) return { x, y };
      }
    }
    return null;
  }

  // On phone-size screens the stat tiles fill the width right under the name card, so a shot can't
  // get past them to reach open space: no power-ups there (the rest of the game works the same).
  const narrow = matchMedia("(max-width: 720px)");
  const powerupsOn = () => !narrow.matches;
  narrow.addEventListener("change", () => { if (!powerupsOn()) [...live].forEach(expire); });

  function spawnPowerups() {
    if (plays < UNLOCK || !powerupsOn()) return;
    [...live].forEach((p) => { const r = p.el.getBoundingClientRect(); p.vx = r.left + r.width / 2; p.vy = r.top + r.height / 2; });
    const want = Math.min(MAX_POWERUPS - live.size, plays === UNLOCK ? 2 : 1);
    for (let i = 0; i < want; i++) {
      const spot = findSpot();
      if (!spot) return;
      const type = POWERS[Math.floor(Math.random() * POWERS.length)];
      const el = document.createElement("span");
      el.className = "powerup";
      el.textContent = type.icon;
      el.setAttribute("aria-hidden", "true");
      el.style.left = spot.x + scrollX + "px";   // placed in the page, so it scrolls with the content
      el.style.top = spot.y + scrollY + "px";
      document.body.appendChild(el);
      el.animate([{ transform: "translate(-50%, -50%) scale(0)" }, { transform: "translate(-50%, -50%) scale(1.2)" }, { transform: "translate(-50%, -50%) scale(1)" }],
        { duration: 400, easing: "cubic-bezier(.34,1.56,.64,1)" });
      const p = { el, type, vx: spot.x, vy: spot.y };
      p.timer = setTimeout(() => expire(p), POWERUP_LIFE);
      live.add(p);
    }
  }
  function expire(p) {
    if (!live.delete(p)) return;
    p.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }).finished.then(() => p.el.remove());
  }
  setTimeout(spawnPowerups, 1500);  // returning players who already unlocked them

  // Until the visitor's first throw, the badge spot invites them to play instead of showing a best score.
  function showPill() {
    badge.textContent = "Pull me!";
    badge.style.left = av.offsetLeft + av.offsetWidth / 2 + "px";
    badge.style.top = av.offsetTop + av.offsetHeight - 6 + "px";
    badge.classList.add("on", "pill");
  }
  if (!plays && !best) showPill();
  // if there wasn't room, try again where the visitor scrolls to
  let scrollT = 0;
  addEventListener("scroll", () => {
    clearTimeout(scrollT);
    scrollT = setTimeout(() => { if (live.size < MAX_POWERUPS && !document.querySelector(".sling-shot")) spawnPowerups(); }, 400);
  }, { passive: true });

  function launch(demo = false) {
    svg.classList.remove("on");
    // count throws; on the 3rd one power-ups unlock and appear right away, so this shot can already grab them
    if (!demo) {
      plays++;
      try { localStorage.setItem("slingPlays", plays); } catch {}
      if (badge.classList.contains("pill")) badge.classList.remove("on", "pill");  // the best score shows once this shot ends
      if (plays === UNLOCK && powerupsOn()) { floatText("Power-ups unlocked!", av, 15); spawnPowerups(); }
    }
    const el = shot;
    shot = null;
    const R = parseFloat(el.style.fontSize) / 2 || 14, DEG = 180 / Math.PI;
    let x = origin.x + pull.x, y = origin.y + pull.y, vx = -pull.x * POWER, vy = -pull.y * POWER;
    let rot = 0, spin = vx / R * DEG * 0.5, last = performance.now(), acc = 0, still = 0, hits = 0, outside = 0;
    let g = GRAVITY, rest = REST, mult = 1, pickups = [];   // power-ups can change these for this shot
    const born = last;

    // Boxes as rounded rectangles (screen coords), re-measured if the page scrolls mid-flight.
    let boxes = [], dirty = true;
    const measure = () => {
      boxes = [...document.querySelectorAll(TARGETS)].map((b) => {
        const r = b.getBoundingClientRect();
        const rad = Math.min(parseFloat(getComputedStyle(b).borderTopLeftRadius) || 0, r.width / 2, r.height / 2);
        return { b, l: r.left, t: r.top, r: r.right, btm: r.bottom, rad, home: b.classList.contains("name-card") };
      }).filter((q) => q.r > q.l && q.btm > 0 && q.t < innerHeight);
      pickups = [...live].map((p) => { const r = p.el.getBoundingClientRect(); return { p, x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      dirty = false;
    };
    const onScroll = () => { dirty = true; };
    addEventListener("scroll", onScroll, { passive: true });

    // Bounce off a surface with outward normal (nx, ny): reflect the normal part, keep most of the sliding part.
    function bounce(nx, ny) {
      const vn = vx * nx + vy * ny;
      if (vn >= 0) return 0;                       // already moving away
      const tx = -ny, ty = nx, vt = vx * tx + vy * ty;
      const vt2 = vt * (1 - FRICTION), vn2 = -vn * rest;
      vx = tx * vt2 + nx * vn2;
      vy = ty * vt2 + ny * vn2;
      spin = (vt2 / R) * DEG;                       // the surface sets the spin, like rolling
      return -vn;                                   // impact speed
    }

    function collect(k) {
      const { p } = pickups[k];
      pickups.splice(k, 1);
      if (!live.delete(p)) return;
      clearTimeout(p.timer);
      if (p.type.icon === "⚡") { const sp = Math.hypot(vx, vy), f = Math.min(1.8, 3 / Math.max(sp, 0.01)); vx *= f; vy *= f; }
      if (p.type.icon === "🪶") g = GRAVITY * 0.4;
      if (p.type.icon === "💎") mult = 2;
      if (p.type.icon === "🌀") rest = 0.95;
      el.classList.add("powered");
      p.el.animate([{ transform: "translate(-50%, -50%) scale(1)", opacity: 1 }, { transform: "translate(-50%, -50%) scale(2.2)", opacity: 0 }],
        { duration: 350, easing: "ease-out", fill: "forwards" }).finished.then(() => p.el.remove());
      floatText(p.type.icon + " " + p.type.name, p.el, 17);
    }

    function physics(h) {
      vy += g * h;
      x += vx * h;
      y += vy * h;
      rot += spin * h;
      if (dirty) measure();
      for (const q of boxes) {
        if (q.home && outside < 120) {
          // the shot starts in (or right next to) the name card; the card only turns solid
          // once the emoji has been fully outside it for a moment, so it can't hit itself on release
          const out = x < q.l - R || x > q.r + R || y < q.t - R || y > q.btm + R;
          outside = out ? outside + h : 0;
          continue;
        }
        // closest point on the rounded box to the emoji's centre
        const cx = Math.max(q.l + q.rad, Math.min(x, q.r - q.rad));
        const cy = Math.max(q.t + q.rad, Math.min(y, q.btm - q.rad));
        let dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
        const min = R + q.rad;
        if (d >= min) continue;
        if (d === 0) { dx = 0; dy = -1; d = 1; }    // centre exactly inside: push up
        const nx = dx / d, ny = dy / d;
        x += nx * (min - d);                        // push fully out, so it can never sink in
        y += ny * (min - d);
        const impact = bounce(nx, ny);
        if (impact > MIN_HIT) hit(q.b, x, y, nx, ny, (hits += mult), impact);  // only real impacts score, not resting contact
      }
      for (let k = pickups.length - 1; k >= 0; k--) if (Math.hypot(x - pickups[k].x, y - pickups[k].y) < R + 18) collect(k);
      // screen edges: walls on the sides and top, a floor at the bottom; they score too,
      // but only on a real impact (not while rolling along the floor)
      const wall = (nx, ny) => { const impact = bounce(nx, ny); if (impact > MIN_HIT) hit(null, x, y, nx, ny, (hits += mult), impact); };
      if (x < R) { x = R; wall(1, 0); }
      if (x > innerWidth - R) { x = innerWidth - R; wall(-1, 0); }
      if (y < R) { y = R; wall(0, 1); }
      if (y > innerHeight - R) {
        y = innerHeight - R;
        wall(0, -1);
        if (Math.abs(vy) < 0.05) vy = 0;           // stop tiny hops and let it roll
        vx *= ROLL;
        spin = (vx / R) * DEG;
      }
    }

    (function frame(now) {
      const dt = Math.min(50, now - last);
      acc += dt;                                   // fixed small steps: same feel at any frame rate, no tunnelling
      last = now;
      while (acc >= STEP) { physics(STEP); acc -= STEP; }
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg)`;
      // finished once it has been (almost) still for half a second, on the floor or on top of a box
      still = Math.hypot(vx, vy) < 0.06 ? still + dt : 0;
      if (still > 500 || now - born > 12000) {
        removeEventListener("scroll", onScroll);
        if (!demo) record(hits);
        el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }).finished.then(() => el.remove());
      } else requestAnimationFrame(frame);
    })(last);
    // the circle reloads with a new emoji
    em.textContent = NEXT.filter((e) => e !== em.textContent)[Math.floor(Math.random() * (NEXT.length - 1))];
    em.style.opacity = "";
    em.animate([{ transform: "scale(0)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(.34,1.56,.64,1)" });
  }
  function resetPull() {
    pulling = false;
    svg.classList.remove("on");
    if (shot) { shot.remove(); shot = null; }
    em.style.opacity = "";
  }

  // ---------- one gesture handler for all three ----------
  // Move/up are listened for on the whole window while a gesture is active, so a release
  // anywhere (even outside the circle or the window) always ends the gesture.
  let gesture = null;
  function onMove(e) {
    if (!gesture || e.pointerId !== gesture) return;
    let dx = e.clientX - origin.x, dy = e.clientY - origin.y;
    const len = Math.hypot(dx, dy);
    if (!pulling && len < DRAG_START) return;
    if (!pulling) startPull();
    if (len > MAX_PULL) { dx *= MAX_PULL / len; dy *= MAX_PULL / len; }
    pull = { x: dx, y: dy };
    drawPull();
  }
  function onUp(e) {
    if (!gesture || (e && e.pointerId !== undefined && e.pointerId !== gesture)) return;
    end(e && e.type === "pointerup");
  }
  function end(release) {
    if (pulling) { pulling = false; release && Math.hypot(pull.x, pull.y) > 20 ? launch() : resetPull(); }
    gesture = null;
    origin = null;
    removeEventListener("pointermove", onMove);
    removeEventListener("pointerup", onUp);
    removeEventListener("pointercancel", onUp);
    removeEventListener("blur", onBlur);
  }
  const onBlur = () => end(false);
  av.addEventListener("pointerdown", (e) => {
    if (gesture !== null) end(false);   // never stack two gestures
    e.preventDefault();                 // no native text drag from the emoji
    const r = av.getBoundingClientRect();
    origin = { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
    gesture = e.pointerId;
    pulling = false;
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);
    addEventListener("blur", onBlur);
  });
  av.addEventListener("contextmenu", (e) => e.preventDefault());

  // ---------- one-time demo ----------
  // First-time visitors see a hand pull the slingshot and let go, once, a few seconds after the page loads.
  // It only runs while the name card is on screen and stops the moment the visitor scrolls, clicks or types.
  let demoSeen = false;
  try { demoSeen = !!localStorage.getItem("slingDemoSeen"); } catch {}
  if (!demoSeen && !plays) {
    let wait = 0, stop = null;
    const cancelEvents = ["pointerdown", "wheel", "touchstart", "keydown"];
    const cancel = () => { clearTimeout(wait); if (stop) stop(); cleanup(); };
    const cleanup = () => cancelEvents.forEach((t) => removeEventListener(t, cancel, true));
    cancelEvents.forEach((t) => addEventListener(t, cancel, { capture: true, passive: true }));
    new IntersectionObserver(([e], io) => {
      clearTimeout(wait);
      if (e.intersectionRatio > 0.6) wait = setTimeout(() => { io.disconnect(); runDemo(); }, 2500);
    }, { threshold: [0, 0.6] }).observe(av.closest(".name-card"));

    function runDemo() {
      if (gesture !== null || pulling) return;
      try { localStorage.setItem("slingDemoSeen", "1"); } catch {}
      const r = av.getBoundingClientRect();
      origin = { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
      // pull down and to the left (kept on screen), so the shot flies up and to the right towards the tiles
      const target = { x: -Math.max(20, Math.min(85, origin.x - 45)), y: 80 };
      const hand = document.createElement("span");
      hand.className = "demo-hand";
      hand.textContent = "👆";
      document.body.appendChild(hand);
      const place = (x, y, s = 1) => { hand.style.transform = `translate(${x}px, ${y}px) translate(-30%, -8%) scale(${s})`; };
      let raf = 0, alive = true;
      stop = () => { alive = false; cancelAnimationFrame(raf); if (pulling) { pulling = false; resetPull(); } hand.remove(); };
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const t0 = performance.now();
      hand.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "forwards" });
      (function tick(now) {
        if (!alive) return;
        const t = now - t0;
        if (t < 700) {                                  // glide onto the circle
          const k = ease(t / 700);
          place(origin.x + 70 * (1 - k), origin.y + 70 * (1 - k));
        } else if (t < 900) {                           // press
          place(origin.x, origin.y, 0.88);
        } else if (t < 1700) {                          // pull back
          if (!pulling) startPull();
          const k = ease((t - 900) / 800);
          pull = { x: target.x * k, y: target.y * k };
          drawPull();
          place(origin.x + pull.x, origin.y + pull.y, 0.88);
        } else if (t < 2000) {                          // hold, aiming
          place(origin.x + pull.x, origin.y + pull.y, 0.88);
        } else {                                        // let go
          pulling = false;
          launch(true);
          place(origin.x + target.x, origin.y + target.y, 1);
          hand.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 200, fill: "forwards" }).finished.then(() => hand.remove());
          stop = null;
          cleanup();
          return;
        }
        raf = requestAnimationFrame(tick);
      })(t0);
    }
  }
})();

