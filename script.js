/* Tawanda Aldrin Guzha — portfolio behaviour */
(() => {
  "use strict";
  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = {
    play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    left: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
  };

  /* An image, or a placeholder tile when the file isn't in yet */
  function media(item, tone = "design", { eager = false, hint = "Image coming soon", shaped = false, alt } = {}) {
    const label = item.label || item.name || item.title || "";
    if (item.src) {
      return `<img src="${esc(item.src)}" alt="${esc(alt ?? label)}" ${eager ? "" : 'loading="lazy"'} decoding="async" />`;
    }
    const shape = shaped ? ` style="aspect-ratio:${esc(item.ratio || "4/5")}"` : "";
    return `<div class="ph" data-tone="${tone}" role="img" aria-label="${esc(alt ?? label)} (placeholder)"${shape}>
      <span class="ph-label">${esc(label)}<span class="ph-hint">${esc(hint)}</span></span></div>`;
  }
  const ratioOf = (r) => { const [a, b] = String(r || "4/5").split("/").map(Number); return a && b ? a / b : 0.8; };

  /* ---------- Person details ---------- */
  const p = D.person;
  const binds = {
    status: p.status,
    signature: p.signature,
    email: p.email || "New email coming soon",
    instagram: p.instagram.handle,
  };
  $$("[data-bind]").forEach((n) => (n.textContent = binds[n.dataset.bind] ?? ""));
  $$("[data-bind-href='instagram']").forEach((n) => (n.href = p.instagram.url));
  const emailLink = $("#email-link");
  if (p.email) emailLink.href = `mailto:${p.email}`;
  else { emailLink.removeAttribute("href"); emailLink.setAttribute("aria-disabled", "true"); }
  $("#year").textContent = new Date().getFullYear();

  const toast = $("#toast");
  let toastTimer;
  const say = (msg) => { toast.textContent = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => (toast.textContent = ""), 3500); };
  $("#copy-email").addEventListener("click", async () => {
    if (!p.email) return say("The email address is coming soon. Instagram works in the meantime.");
    try { await navigator.clipboard.writeText(p.email); say("Email copied."); }
    catch { say(`Copy failed. The address is ${p.email}`); }
  });

  /* ---------- Top bar ---------- */
  const topbar = $(".topbar");
  const heroEl = $(".hero");
  const onScroll = () => topbar.classList.toggle("scrolled", heroEl.getBoundingClientRect().bottom < 90);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const nav = $("#site-nav");
  const menuBtn = $(".menu-toggle");
  const setMenu = (open) => { nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", String(open)); menuBtn.textContent = open ? "Close" : "Menu"; };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });

  const navLinks = $$(".nav a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["design", "video", "art", "journey", "contact"].forEach((id) => spy.observe(document.getElementById(id)));

  /* ---------- Viewer (images) ---------- */
  const viewer = $("#viewer");
  const vStage = $("#viewer-stage");
  const V = { items: [], i: 0, tone: "design", last: null };
  function renderViewer() {
    const it = V.items[V.i];
    vStage.innerHTML = media(it, V.tone, { eager: true });
    $("#viewer-caption").textContent = it.caption !== undefined ? it.caption : (it.label || it.name || "");
    $("#viewer-count").textContent = V.items.length > 1 ? `${V.i + 1} / ${V.items.length}` : "";
    $$(".viewer-btn", viewer).forEach((b) => (b.hidden = V.items.length < 2));
  }
  function openViewer(items, i = 0, tone = "design") {
    Object.assign(V, { items, i, tone, last: document.activeElement });
    renderViewer();
    viewer.showModal();
  }
  const step = (d) => { V.i = (V.i + d + V.items.length) % V.items.length; renderViewer(); };
  $(".viewer-prev").addEventListener("click", () => step(-1));
  $(".viewer-next").addEventListener("click", () => step(1));
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
  let swipeX = null;
  vStage.addEventListener("pointerdown", (e) => (swipeX = e.clientX));
  vStage.addEventListener("pointerup", (e) => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX; swipeX = null;
    if (Math.abs(dx) > 50 && V.items.length > 1) step(dx < 0 ? 1 : -1);
  });

  /* ---------- Player (videos) ---------- */
  const player = $("#player");
  const frame = $("#player-frame");
  let playerLast = null;
  function openPlayer(v) {
    playerLast = document.activeElement;
    frame.innerHTML = v.src
      ? `<video src="${esc(v.src)}" ${v.poster ? `poster="${esc(v.poster)}"` : ""} controls autoplay playsinline preload="auto"></video>`
      : media({ label: v.title, ratio: v.ratio || "16/9" }, "video", { hint: "This video will play here once the MP4 is added", shaped: true });
    $("#player-title").textContent = v.title;
    player.showModal();
  }

  [viewer, player].forEach((dlg) => {
    $(".viewer-close", dlg).addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", () => {
      if (dlg === player) { $("video", frame)?.pause(); frame.innerHTML = ""; playerLast?.focus(); }
      else V.last?.focus();
    });
  });

  /* ---------- Graphic design posts (carousels) ----------
     They move only when clicked, dragged or swiped. Page scrolling and trackpad swipes never move them.
     The frame resizes to each slide's own shape. */
  const posts = $("#posts");
  posts.innerHTML = D.brands.map((b, bi) => {
    const initials = b.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
    return `<article class="post" data-brand="${bi}" aria-labelledby="post-${b.id}">
      <header class="post-head">
        <span class="post-avatar" aria-hidden="true">${esc(initials)}</span>
        <div class="post-meta"><strong id="post-${b.id}">${esc(b.name)}</strong><span>${esc(b.kind)}</span></div>
        <span class="post-count" aria-live="polite">1 / ${b.slides.length}</span>
      </header>
      <div class="post-media">
        <div class="post-viewport" tabindex="0" data-cursor="Drag" aria-roledescription="carousel" aria-label="${esc(b.name)} designs. Use the left and right arrow keys.">
          <div class="post-track">
            ${b.slides.map((s, si) => `<div class="post-slide" data-i="${si}" role="group" aria-roledescription="slide" aria-label="${si + 1} of ${b.slides.length}: ${esc(s.label)}">${media(s, "design")}</div>`).join("")}
          </div>
        </div>
        <button class="post-arrow post-prev" type="button" aria-label="Previous design">${icon.left}</button>
        <button class="post-arrow post-next" type="button" aria-label="Next design">${icon.right}</button>
      </div>
      <footer class="post-foot">
        <div class="post-dots" aria-hidden="true">${b.slides.map(() => "<span></span>").join("")}</div>
        <p class="post-note"><b>${esc(b.name)}</b>${esc(b.note)}</p>
      </footer>
    </article>`;
  }).join("");

  $$(".post", posts).forEach((post) => {
    const brand = D.brands[+post.dataset.brand];
    const vp = $(".post-viewport", post);
    const track = $(".post-track", post);
    const dots = $$(".post-dots span", post);
    const count = $(".post-count", post);
    const prev = $(".post-prev", post);
    const next = $(".post-next", post);
    const n = brand.slides.length;
    const ratios = brand.slides.map((s) => ratioOf(s.ratio));
    let i = 0;

    const fit = () => {
      const w = vp.clientWidth;
      const maxH = Math.min(window.innerHeight * 0.72, 760);
      vp.style.height = `${Math.round(Math.min(w / ratios[i], maxH))}px`;
    };
    const go = (k, animate = true) => {
      i = Math.max(0, Math.min(n - 1, k));
      track.classList.toggle("instant", !animate);
      track.style.transform = `translate3d(${-i * 100}%,0,0)`;
      fit();
      dots.forEach((d, j) => d.classList.toggle("on", j === i));
      count.textContent = `${i + 1} / ${n}`;
      prev.disabled = i === 0;
      next.disabled = i === n - 1;
    };
    // real images report their own shape once loaded
    $$(".post-slide img", post).forEach((img) => {
      const k = +img.closest(".post-slide").dataset.i;
      const set = () => { if (img.naturalWidth) { ratios[k] = img.naturalWidth / img.naturalHeight; if (k === i) fit(); } };
      img.complete ? set() : img.addEventListener("load", set);
    });
    go(0, false);
    window.addEventListener("resize", () => fit());
    prev.addEventListener("click", () => go(i - 1));
    next.addEventListener("click", () => go(i + 1));
    vp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    });

    // drag with mouse, swipe with touch; vertical page scrolling still works on phones
    let down = null;
    vp.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      down = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
    });
    vp.addEventListener("pointermove", (e) => {
      if (!down || e.pointerId !== down.id) return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (!down.moved) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
        down.moved = true; vp.setPointerCapture(e.pointerId); track.classList.add("instant");
      }
      const edge = (i === 0 && dx > 0) || (i === n - 1 && dx < 0) ? 0.3 : 1; // resist past the ends
      track.style.transform = `translate3d(calc(${-i * 100}% + ${dx * edge}px),0,0)`;
    });
    const end = (e) => {
      if (!down || e.pointerId !== down.id) return;
      const { moved, x } = down; down = null;
      if (!moved) return;
      const dx = e.clientX - x;
      vp.dataset.dragged = "1"; setTimeout(() => delete vp.dataset.dragged, 0);
      go(Math.abs(dx) > vp.clientWidth * 0.16 ? i + (dx < 0 ? 1 : -1) : i);
    };
    vp.addEventListener("pointerup", end);
    vp.addEventListener("pointercancel", end);
    vp.addEventListener("click", () => {
      if (vp.dataset.dragged) return;
      openViewer(brand.slides.map((s) => ({ ...s, caption: `${brand.name}: ${s.label}` })), i, "design");
    });
  });

  /* ---------- Video tabs + reels (each video keeps its own shape) ---------- */
  const reels = $("#panel-video");
  const tabs = $$(".tabs [role=tab]");
  const catLabel = { motion: "Motion graphics", editing: "Video editing", automation: "Automation workflow" };
  tabs.forEach((t) => t.insertAdjacentHTML("beforeend", `<span class="n">${D.videos[t.dataset.cat].length}</span>`));

  function renderReels(cat) {
    const list = D.videos[cat];
    reels.innerHTML = list.map((v, i) => {
      let thumb;
      if (v.poster) thumb = `<img src="${esc(v.poster)}" alt="" loading="lazy" decoding="async" />`;
      else if (v.src) thumb = `<video src="${esc(v.src)}#t=0.5" muted playsinline preload="metadata" aria-hidden="true"></video>`;
      else thumb = media({ label: v.title }, "video", { hint: "Video coming soon" });
      const preview = v.src && v.poster ? `<video data-preview src="${esc(v.src)}" muted loop playsinline preload="none" aria-hidden="true"></video>` : "";
      return `<button class="reel" type="button" data-i="${i}" data-cursor="Play" aria-label="Play ${esc(v.title)}">
        <span class="reel-thumb" style="aspect-ratio:${esc(v.ratio || "16/9")}">${thumb}${preview}<span class="reel-play">${icon.play}</span></span>
        <span class="reel-title">${esc(v.title)}</span>
        <span class="reel-sub">${catLabel[cat]}</span>
      </button>`;
    }).join("");
    $$(".reel", reels).forEach((btn) => {
      const v = list[+btn.dataset.i];
      btn.addEventListener("click", () => openPlayer(v));
      const box = $(".reel-thumb", btn);
      const still = $(".reel-thumb > img, .reel-thumb > video:not([data-preview])", btn);
      if (still) {
        const apply = (w, h) => { if (w && h) box.style.aspectRatio = `${w}/${h}`; };
        if (still.tagName === "IMG") still.complete ? apply(still.naturalWidth, still.naturalHeight) : still.addEventListener("load", () => apply(still.naturalWidth, still.naturalHeight));
        else still.addEventListener("loadedmetadata", () => apply(still.videoWidth, still.videoHeight));
      }
      const pv = $("video[data-preview]", btn);
      if (pv && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
        btn.addEventListener("mouseenter", () => { pv.play().then(() => pv.classList.add("ready")).catch(() => {}); });
        btn.addEventListener("mouseleave", () => { pv.pause(); pv.classList.remove("ready"); });
      }
    });
  }
  function selectTab(tab, focus = false) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    reels.setAttribute("aria-labelledby", tab.id);
    renderReels(tab.dataset.cat);
    if (focus) tab.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });
  selectTab(tabs[0]);
  $$("[data-tab]").forEach((a) => a.addEventListener("click", () => selectTab($(`#tab-${a.dataset.tab}`))));

  /* ---------- Fine art (artworks untitled; only the dignitary photos are captioned) ---------- */
  const art = D.art;
  const artItems = art.artworks.map((a, i) => ({ ...a, label: "", caption: "", alt: `Artwork ${i + 1}` }));
  $("#artworks").innerHTML = artItems.map((a, i) => `
    <button class="art-item" type="button" data-i="${i}" data-cursor="View" aria-label="Open artwork ${i + 1}">
      <span class="art-frame" style="display:block;${a.src ? "" : `aspect-ratio:${a.ratio || "4/5"}`}">${media(a, "art", { alt: a.alt, hint: "Artwork coming soon" })}</span>
    </button>`).join("");
  $$("#artworks .art-item").forEach((b) => b.addEventListener("click", () => openViewer(artItems, +b.dataset.i, "art")));

  const withName = (d) => ({ ...d, label: `With ${d.name}`, caption: `With ${d.name}${d.role ? `, ${d.role}` : ""}` });
  $("#presented").innerHTML = art.dignitaries.map((d, i) => `
    <button class="art-item" type="button" data-i="${i}" data-cursor="View" aria-label="Open photo with ${esc(d.name)}">
      <span class="art-frame" style="display:block">${media(withName(d), "paper", { hint: "Photo coming soon" })}</span>
      <span class="art-cap">With ${esc(d.name)}${d.role ? `<span class="art-role">${esc(d.role)}</span>` : ""}</span>
    </button>`).join("");
  $$("#presented .art-item").forEach((b) => b.addEventListener("click", () => openViewer(art.dignitaries.map(withName), +b.dataset.i, "paper")));

  /* ---------- Journey ---------- */
  $("#timeline").innerHTML = D.journey.map((j) => `
    <li class="tl-item">
      <span class="tl-when">${esc(j.when)}</span>
      <div>
        <h3 class="tl-title">${esc(j.title)}</h3>
        <p class="tl-org">${esc(j.org)}</p>
        ${j.badge ? `<span class="tl-badge">${esc(j.text)}</span>` : `<p class="tl-text">${esc(j.text)}</p>`}
      </div>
    </li>`).join("");

  /* ---------- Reference: name, role and phone only ---------- */
  const r = D.reference;
  const tel = r.phone ? r.phone.replace(/[^\d+]/g, "") : "";
  $("#reference").innerHTML = `
    <p class="ref-name${r.name ? "" : " is-placeholder"}">${esc(r.name || "Name to come")}</p>
    <p class="ref-role${r.role ? "" : " is-placeholder"}">${esc(r.role || "Role to come")}</p>
    ${r.phone
      ? `<a class="ref-phone" href="tel:${esc(tel)}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>${esc(r.phone)}</a>`
      : `<p class="ref-phone is-placeholder">Phone number to come</p>`}`;

  /* ---------- Tools ---------- */
  $("#tools").innerHTML = D.tools.map((g) => `<div><h3>${esc(g.group)}</h3><ul>${g.items.map((t) => {
    const name = typeof t === "string" ? t : t.name;
    const logo = typeof t === "string" ? "" : t.logo;
    return `<li><span class="tool-logo">${logo ? `<img src="${esc(logo)}" alt="" width="36" height="36" loading="lazy" decoding="async" />` : ""}</span><span>${esc(name)}</span></li>`;
  }).join("")}</ul></div>`).join("");

  /* ---------- Orbit: a ring of work turning behind the portrait ---------- */
  const orbit = $("#orbit");
  // mix the disciplines so neighbouring panels differ
  const groups = [
    D.brands.flatMap((b) => b.slides.slice(0, 2).map((s) => ({ ...s, label: b.name, caption: `${b.name}: ${s.label}`, tone: "design" }))),
    artItems.map((a) => ({ ...a, label: "Fine art", caption: "", tone: "art" })),
    Object.values(D.videos).flatMap((list) => list.slice(0, 2).map((v) => ({ src: v.poster, label: v.title, video: v, tone: "video" }))),
    art.dignitaries.map((d) => ({ ...withName(d), tone: "paper" })),
  ];
  const pool = [];
  for (let k = 0; groups.some((g) => k < g.length); k++) groups.forEach((g) => g[k] && pool.push(g[k]));
  const N = 22;
  const ring = Array.from({ length: N }, (_, i) => pool[i % pool.length]);
  orbit.innerHTML = ring.map((it, i) => `<div class="orbit-panel" data-i="${i}" aria-hidden="true">${media(it, it.tone, { hint: "" })}</div>`).join("");
  const panels = $$(".orbit-panel", orbit);
  // spread / fade / tilt are driven by the scroll timeline in motion.js
  const O = { rot: 0, vel: 0, speed: reduceMotion ? 0 : 5, paused: false, visible: true, R: 1000, c: 700, tilt: 5, spread: 1, fade: 1, step: 360 / N };

  function layoutOrbit() {
    const W = orbit.clientWidth, H = orbit.clientHeight, small = W < 640;
    O.R = W * (small ? 1.25 : 0.95);
    const P = W * (small ? 0.95 : 0.7);
    O.c = P * 0.78;
    const pw = Math.min((2 * Math.PI * O.R / N) * (small ? 0.78 : 0.86), H / 0.62);
    orbit.style.setProperty("--persp", `${P}px`);
    orbit.style.setProperty("--pw", `${pw}px`);
  }
  function drawOrbit() {
    for (let i = 0; i < N; i++) {
      let a = ((i * O.step + O.rot) % 360 + 540) % 360 - 180;
      const abs = Math.abs(a), el = panels[i];
      const b = abs * O.spread; // spreading pushes panels out past the sides
      if (b > 74 || O.fade < 0.01) { el.style.visibility = "hidden"; continue; }
      el.style.visibility = "visible";
      el.style.opacity = ((b > 56 ? (74 - b) / 18 : 1) * O.fade).toFixed(3);
      el.style.transform = `translateZ(${O.c}px) rotateX(${O.tilt}deg) rotateY(${a * O.spread}deg) translateZ(${-O.R}px)`;
    }
  }
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (O.visible) {
      if (!O.paused && !drag) O.rot += O.speed * dt;
      if (!drag) { O.rot += O.vel; O.vel *= 0.93; if (Math.abs(O.vel) < 0.01) O.vel = 0; }
      drawOrbit();
    }
    requestAnimationFrame(tick);
  }
  let drag = null;
  orbit.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, last: e.clientX, moved: false, panel: e.target.closest(".orbit-panel") };
    O.vel = 0;
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.last; drag.last = e.clientX;
    if (!drag.moved && Math.abs(e.clientX - drag.x) > 6) { drag.moved = true; orbit.setPointerCapture?.(e.pointerId); }
    if (drag.moved) { const k = 90 / orbit.clientWidth; O.rot -= dx * k; O.vel = -dx * k; }
  });
  window.addEventListener("pointerup", () => {
    if (!drag) return;
    const { moved, panel } = drag; drag = null;
    if (!moved && panel) {
      const it = ring[+panel.dataset.i];
      if (it.video) openPlayer(it.video);
      else openViewer([it], 0, it.tone);
    }
  });
  orbit.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); O.vel = 1.4; }
    if (e.key === "ArrowRight") { e.preventDefault(); O.vel = -1.4; }
  });
  const toggle = $(".orbit-toggle");
  if (reduceMotion) { O.paused = true; toggle.setAttribute("aria-pressed", "true"); toggle.setAttribute("aria-label", "Start the turning ring"); }
  toggle.addEventListener("click", () => {
    O.paused = !O.paused;
    if (!O.paused && O.speed === 0) O.speed = 3;
    toggle.setAttribute("aria-pressed", String(O.paused));
    toggle.setAttribute("aria-label", O.paused ? "Start the turning ring" : "Pause the turning ring");
  });
  new IntersectionObserver(([en]) => (O.visible = en.isIntersecting)).observe(orbit);
  document.addEventListener("visibilitychange", () => (last = performance.now()));
  layoutOrbit(); drawOrbit();
  let rz; window.addEventListener("resize", () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { layoutOrbit(); drawOrbit(); }); });
  requestAnimationFrame(tick);

  /* ---------- Showreel (featured video, keeps its own shape) ---------- */
  const featured = D.videos.motion[0] || D.videos.editing[0];
  const showreel = $("#showreel");
  if (featured) {
    showreel.setAttribute("aria-label", `Play ${featured.title}`);
    showreel.style.setProperty("--r", ratioOf(featured.ratio || "16/9"));
    showreel.innerHTML = `
      <span class="showreel-media">${featured.src
        ? `<video src="${esc(featured.src)}" ${featured.poster ? `poster="${esc(featured.poster)}"` : ""} muted loop playsinline autoplay preload="metadata" aria-hidden="true"></video>`
        : media({ label: "Showreel" }, "video", { hint: "Your motion graphics will loop here" })}</span>
      <span class="showreel-play">${icon.play}<span>Play ${esc(featured.title)}</span></span>`;
    const sv = $("video", showreel);
    if (sv) sv.addEventListener("loadedmetadata", () => showreel.style.setProperty("--r", sv.videoWidth / sv.videoHeight));
    showreel.addEventListener("click", () => openPlayer(featured));
  }

  /* ---------- Moving band of crafts ---------- */
  const crafts = ["Graphic design", "Brand identity", "Motion graphics", "Video editing", "Fine art", "AI automation"];
  const bandHalf = crafts.map((c) => `<span>${c}</span><i>✦</i>`).join("");
  $("#band-track").innerHTML = `<div>${bandHalf}${bandHalf}</div><div>${bandHalf}${bandHalf}</div>`;

  /* ---------- Cursor labels ---------- */

  window.PORTFOLIO_UI = { orbit: O, reduceMotion };
})();
