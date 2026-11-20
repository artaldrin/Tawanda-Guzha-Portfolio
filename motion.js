/* Scroll choreography — Lenis smooth scroll + GSAP ScrollTrigger + SplitText.
   Everything that moves on scroll uses transform/opacity only, so it stays smooth.
   If the libraries fail to load, or the visitor prefers reduced motion, the page stays fully usable and static. */
(() => {
  "use strict";
  const UI = window.PORTFOLIO_UI || {};
  const root = document.documentElement;
  const reduce = UI.reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || !window.Lenis || reduce) {
    root.classList.add("no-motion");
    root.classList.remove("curtain");
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const O = UI.orbit;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  root.classList.add("motion");

  /* ---------- Smooth scrolling (Lenis), driven by GSAP's ticker so everything shares one clock ---------- */
  const lenis = new Lenis({
    lerp: 0.11,            // higher = more responsive, lower = floatier
    wheelMultiplier: 1,
    smoothWheel: true,
    syncTouch: false,      // phones keep their native scroll feel
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // anchor links glide
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id === "#" || id === "#main") return;
    const target = id === "#top" ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: id === "#top" ? 0 : -70, duration: 1.4 });
  });
  // stop page scroll while a dialog is open
  $$("dialog").forEach((d) => {
    new MutationObserver(() => (d.open ? lenis.stop() : lenis.start())).observe(d, { attributes: true, attributeFilter: ["open"] });
  });

  /* ---------- Opening curtain ---------- */
  const intro = document.createElement("div");
  intro.className = "intro";
  intro.setAttribute("aria-hidden", "true");
  intro.innerHTML = `<p class="intro-name">Tawanda Aldrin Guzha</p><p class="intro-sub"><span>Design</span><span>Motion</span><span>Fine art</span></p><span class="intro-count">0</span>`;
  document.body.appendChild(intro);
  root.classList.remove("curtain");
  lenis.stop();
  window.scrollTo(0, 0);

  gsap.set(".hero-portrait", { xPercent: -50, x: 0, transformOrigin: "50% 100%" });

  const fontsIn = Promise.race([
    Promise.all([
      document.fonts.load('400 1em "Bodoni Moda"'),
      document.fonts.load('italic 400 1em "Bodoni Moda"'),
      document.fonts.load('400 1em "Hanken Grotesk"'),
    ]).then(() => document.fonts.ready),
    new Promise((r) => setTimeout(r, 2500)),
  ]);

  fontsIn.then(() => {
    const name = SplitText.create(".intro-name", { type: "chars", mask: "chars" });
    const count = { v: 0 };
    const counter = $(".intro-count", intro);

    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(name.chars, { yPercent: 110, duration: 1, stagger: 0.025 })
      .from(".intro-sub span", { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.08 }, 0.3)
      .to(count, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => (counter.textContent = Math.round(count.v)) }, 0)
      .to(name.chars, { yPercent: -110, duration: 0.6, stagger: 0.012, ease: "power3.in" }, 1.35)
      .to(".intro-sub, .intro-count", { autoAlpha: 0, duration: 0.3 }, 1.35)
      .to(intro, { yPercent: -100, duration: 1, ease: "expo.inOut" }, 1.6)
      .from(".hero-portrait", { y: 120, autoAlpha: 0, duration: 1.6 }, 1.9)
      .from(".hero-glow", { autoAlpha: 0, duration: 1.4 }, 2.0)
      .from(".orbit", { autoAlpha: 0, scale: 0.9, duration: 1.8 }, 2.0)
      .from(".hero-hello", { autoAlpha: 0, y: 14, duration: 0.8 }, 2.2)
      .from(".hero-title .line > span", { yPercent: 115, duration: 1.2, stagger: 0.1 }, 2.25)
      .from(".hero-actions > *, .hero-quote > *, .orbit-toggle, .scroll-cue", { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.08 }, 2.6)
      .from(".topbar", { autoAlpha: 0, y: -14, duration: 0.8 }, 2.5)
      .add(() => { intro.remove(); lenis.start(); }, 2.7);

    buildScroll();
  });

  function buildScroll() {
    /* Progress line along the top */
    gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });

    /* ---------- HERO: pinned; the ring flies apart and he settles back.
       He shrinks toward the bottom of the screen so his head never slides under the menu. ---------- */
    gsap.timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: "+=80%", pin: true, scrub: true },
      defaults: { ease: "none" },
    })
      .to(O, { spread: 1.9, tilt: 24, fade: 0, duration: 1 }, 0)
      .to(".hero-portrait", { scale: 0.84, duration: 1 }, 0)
      .to(".hero-glow", { scale: 1.3, autoAlpha: 0.5, duration: 1 }, 0)
      .to(".hero-copy", { x: -100, autoAlpha: 0, duration: 0.55 }, 0)
      .to(".hero-quote", { x: 100, autoAlpha: 0, duration: 0.55 }, 0)
      .to(".scroll-cue, .orbit-toggle", { autoAlpha: 0, duration: 0.2 }, 0)
      .to(".hero-veil", { opacity: 0.65, duration: 0.7 }, 0.3);

    /* ---------- BAND: drifts on its own, speeds up and flips with scroll direction ---------- */
    const band = gsap.to(".band-track > div", { xPercent: -50, repeat: -1, duration: 30, ease: "none" });
    let dir = 1;
    const settle = gsap.delayedCall(0.25, () => gsap.to(band, { timeScale: dir, duration: 1, ease: "power2.out", overwrite: true }));
    ScrollTrigger.create({
      trigger: ".band", start: "top bottom", end: "bottom top",
      onUpdate(self) {
        dir = self.direction;
        const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 500);
        gsap.to(band, { timeScale: dir * boost, duration: 0.25, overwrite: true });
        settle.restart(true);
      },
    });

    /* ---------- Text that fills in as you read ---------- */
    $$("[data-fill]").forEach((el) => {
      const split = SplitText.create(el, { type: "words" });
      gsap.fromTo(split.words, { opacity: 0.15 }, {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 50%", scrub: true },
      });
    });

    /* ---------- Big titles rise letter by letter (once) ---------- */
    $$(".split-title").forEach((el) => {
      const split = SplitText.create(el, { type: "words,chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.02,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
    ScrollTrigger.batch(".section-head p, .contact-sub, .crafts li, .post, .tools li, .ref-card > *", {
      start: "top 90%", once: true,
      onEnter: (els) => gsap.from(els, { y: 36, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 }),
    });

    /* ---------- VIDEO: the showreel frame grows as it comes in ---------- */
    gsap.fromTo(".showreel-frame", { scale: 0.7 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: ".showreel", start: "top bottom", end: "center 60%", scrub: true },
    });
    const revealReels = () => gsap.from("#panel-video .reel", { y: 40, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: "power3.out", overwrite: true });
    ScrollTrigger.create({ trigger: "#panel-video", start: "top 88%", once: true, onEnter: revealReels });
    $$(".tabs [role=tab]").forEach((t) => t.addEventListener("click", () => requestAnimationFrame(() => { revealReels(); ScrollTrigger.refresh(); })));

    /* Ghost words drifting sideways */
    $$(".ghost").forEach((g) => {
      gsap.fromTo(g, { xPercent: 5 }, { xPercent: -35, ease: "none", scrollTrigger: { trigger: g.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* ---------- FINE ART: the cream wall grows out to the edges ---------- */
    gsap.fromTo(".art-bg", { scaleX: 0.86, scaleY: 0.94 }, {
      scaleX: 1, scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".art-sheet", start: "top bottom", end: "top 20%", scrub: true },
    });
    ScrollTrigger.batch(".art-item", {
      start: "top 92%", once: true,
      onEnter: (els) => gsap.from(els, { y: 70, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.08 }),
    });

    /* ---------- JOURNEY: the line draws itself ---------- */
    gsap.fromTo(".tl-line", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline-wrap", start: "top 75%", end: "bottom 65%", scrub: true } });
    $$(".tl-item").forEach((item) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 82%", once: true }, defaults: { ease: "power3.out" } });
      tl.add(() => item.classList.add("lit"))
        .from($(".tl-when", item), { x: -30, autoAlpha: 0, duration: 0.8 }, 0)
        .from(item.querySelectorAll(".tl-title, .tl-org, .tl-text, .tl-badge"), { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 0.05);
    });

    /* Contact: a warm glow fades up as you arrive */
    gsap.fromTo(".contact-warm", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: ".contact", start: "top 85%", end: "top 25%", scrub: true } });

    /* Top bar becomes solid only once the hero has left */
    ScrollTrigger.create({
      trigger: ".band", start: "top 80px",
      onEnter: () => $(".topbar").classList.add("scrolled"),
      onLeaveBack: () => $(".topbar").classList.remove("scrolled"),
    });

    /* ---------- Cursor + magnetic buttons (mouse only) ---------- */
    if (finePointer) {
      const cursor = $(".cursor");
      const label = $(".cursor-label");
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
      window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); cursor.classList.add("on"); }, { passive: true });
      document.addEventListener("pointerleave", () => cursor.classList.remove("on"));
      document.addEventListener("pointerover", (e) => {
        const t = e.target.closest("[data-cursor]");
        const onControl = e.target.closest(".post-arrow, .tabs button, .orbit-toggle");
        cursor.classList.toggle("big", !!t && !onControl);
        label.textContent = t && !onControl ? t.dataset.cursor : "";
        cursor.classList.toggle("link", (!t || onControl) && !!e.target.closest("a, button"));
      });
      $$(".magnetic").forEach((btn) => {
        const bx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "elastic.out(1, 0.45)" });
        const by = gsap.quickTo(btn, "y", { duration: 0.5, ease: "elastic.out(1, 0.45)" });
        btn.addEventListener("pointermove", (e) => {
          const r = btn.getBoundingClientRect();
          bx((e.clientX - r.left - r.width / 2) * 0.25);
          by((e.clientY - r.top - r.height / 2) * 0.3);
        });
        btn.addEventListener("pointerleave", () => { bx(0); by(0); });
      });
    }

    // late-loading images change heights
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
})();
