// Munch Machine — Editorial. Lenis smooth scroll + GSAP intro/scroll choreography.

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
if (!gsap) console.error('[main] GSAP missing');
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

// ============================================================
// LENIS smooth scroll (graceful if missing)
// ============================================================
let lenis = null;
try {
  const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 768);
  if (window.Lenis && !isMobile) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
    });
    if (ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    if (gsap) {
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    lenis.stop();
    document.documentElement.classList.add('lenis');
  } else {
    console.warn('[main] Lenis missing — using native scroll');
  }
} catch (err) {
  console.error('[main] Lenis init failed', err);
  lenis = null;
}

// ============================================================
// INTRO — logo stroke draw → text reveal → curtain split
// ============================================================
function killIntro() {
  document.getElementById('intro')?.remove();
}

function bootSite() {
  try { lenis?.start(); } catch {}
  killIntro();
  try { runRevealQueue(); } catch (e) { console.error(e); }
  try { runProcessPin(); } catch (e) { console.error(e); }
}

function runIntro() {
  if (!gsap) { bootSite(); return; }

  // Safety: no matter what, page boots after 5s
  const safety = setTimeout(() => bootSite(), 5000);

  const tl = gsap.timeline({
    onComplete: () => {
      clearTimeout(safety);
      bootSite();
    }
  });

  // Logo strokes draw in
  tl.to('#intro .intro-logo svg path, #intro .intro-logo svg rect, #intro .intro-logo svg line', {
    strokeDashoffset: 0,
    duration: 1.1,
    ease: 'power2.inOut',
    stagger: 0.04,
  })
  .to('#intro .intro-logo svg path, #intro .intro-logo svg rect, #intro .intro-logo svg line', {
    fillOpacity: 1,
    duration: 0.5,
    ease: 'power2.out',
  }, '-=0.3')

  // Letters reveal
  .to('#intro .intro-text span', {
    y: '0%',
    duration: 0.7,
    ease: 'expo.out',
    stagger: 0.025,
  }, '-=0.4')

  // Meta fade
  .to('#intro .intro-meta', {
    opacity: 1,
    duration: 0.4,
  }, '-=0.2')

  // Hold
  .to({}, { duration: 0.4 })

  // Letters retract
  .to('#intro .intro-text span', {
    y: '-110%',
    duration: 0.5,
    ease: 'power3.in',
    stagger: 0.015,
  })
  .to(['#intro .intro-logo', '#intro .intro-meta'], {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in',
  }, '<')

  // Curtain split — top up, bottom down
  .to('#intro .intro-curtain.top', {
    y: '0%',
    duration: 0.7,
    ease: 'expo.inOut',
  }, '-=0.2')
  .to('#intro .intro-curtain.bot', {
    y: '0%',
    duration: 0.7,
    ease: 'expo.inOut',
  }, '<')
  .to('#intro', {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.inOut',
    pointerEvents: 'none',
  }, '+=0.05')
  .to('#intro .intro-curtain.top', {
    y: '-100%',
    duration: 0.7,
    ease: 'expo.inOut',
  }, '<')
  .to('#intro .intro-curtain.bot', {
    y: '100%',
    duration: 0.7,
    ease: 'expo.inOut',
  }, '<');

  // Hero choreography (text reveal masks) starts as curtains open
  tl.from('.hero [data-line]', {
    yPercent: 110,
    duration: 1,
    ease: 'expo.out',
    stagger: 0.1,
  }, '-=0.5')
  .from('.hero .fade-up', {
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.out',
    stagger: 0.08,
  }, '-=0.7');
}

// ============================================================
// SCROLL REVEAL — line masks + fade-ups via ScrollTrigger
// ============================================================
function runRevealQueue() {
  // Line-mask reveals on every section heading
  document.querySelectorAll('[data-reveal-lines]').forEach(el => {
    const lines = el.querySelectorAll('[data-line]');
    gsap.set(lines, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(lines, {
        yPercent: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
      })
    });
  });

  // Generic fade-up reveals
  document.querySelectorAll('[data-reveal]:not([data-reveal-lines])').forEach(el => {
    const delay = parseFloat(el.dataset.revealDelay || '0');
    gsap.set(el, { opacity: 0, y: 36 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: 'expo.out',
        delay,
      })
    });
  });

  // Header background on scroll
  const header = document.getElementById('site-header');
  ScrollTrigger.create({
    start: 60,
    end: 999999,
    onUpdate: self => header.classList.toggle('scrolled', self.scroll() > 60),
  });
}

// ============================================================
// HORIZONTAL PINNED PROCESS — Buzzworthy signature
// ============================================================
function runProcessPin() {
  const section = document.querySelector('.process-pin-section');
  const pin = document.getElementById('process-pin');
  const track = document.getElementById('process-track');
  if (!section || !pin || !track) return;

  // Skip horizontal pin on mobile — CSS stacks vertically
  if (window.innerWidth <= 700) return;

  let scrollDistance = 0;
  let runway = 0;

  function measure() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    scrollDistance = Math.max(0, track.scrollWidth - vw + 80);
    runway = scrollDistance + vh;          // sticky needs vh + horizontal distance
    section.style.height = runway + 'px';
  }

  function update() {
    const rect = section.getBoundingClientRect();
    const passed = Math.min(Math.max(-rect.top, 0), scrollDistance);
    const progress = scrollDistance > 0 ? passed / scrollDistance : 0;
    track.style.transform = `translate3d(${-scrollDistance * progress}px, 0, 0)`;
  }

  measure();
  requestAnimationFrame(update);

  // Re-measure when fonts / layout settle
  if (document.fonts?.ready) document.fonts.ready.then(() => { measure(); requestAnimationFrame(update); });
  setTimeout(() => { measure(); requestAnimationFrame(update); }, 200);
  setTimeout(() => { measure(); requestAnimationFrame(update); }, 1000);

  window.addEventListener('resize', () => { measure(); requestAnimationFrame(update); });

  // Hook into Lenis if present (fires per smooth scroll frame), otherwise native scroll
  if (lenis) {
    lenis.on('scroll', update);
  } else {
    window.addEventListener('scroll', update, { passive: true });
  }
}


// ============================================================
// Inquiry form
// ============================================================
(() => {
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Transmitting…';
    btn.disabled = true;
    try {
      const r = await fetch('https://formspree.io/f/mqejkyvn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (r.ok) {
        btn.innerHTML = '✓ Received — we will be in touch';
        form.reset();
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 3500);
      } else {
        throw new Error();
      }
    } catch {
      btn.innerHTML = 'Error — retry';
      btn.disabled = false;
    }
  });
})();

// ============================================================
// TARGET CURSOR — ported from React Bits TargetCursor to vanilla
// Organic rounded arcs spin idle, snap to .cursor-target on hover
// ============================================================
(() => {
  if (matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.getElementById('target-cursor');
  if (!cursor || !gsap) return;

  const dot = cursor.querySelector('.target-cursor-dot');
  const corners = Array.from(cursor.querySelectorAll('.target-cursor-corner'));
  const SELECTOR = 'a[href], button, [role="button"], .faq-item .ch, .cursor-target';
  const SPIN_DURATION = 2.5;
  const HOVER_DURATION = 0.2;
  const BORDER_W = 2;
  const CORNER_SIZE = 14;
  let activeTarget = null;
  let activePad = BORDER_W;
  let currentLeaveHandler = null;
  let resumeTimeout = null;
  let spinTl = null;
  let activeStrength = { current: 0 };

  gsap.set(cursor, { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2 });

  function createSpin() {
    spinTl?.kill();
    spinTl = gsap.timeline({ repeat: -1 })
      .to(cursor, { rotation: '+=360', duration: SPIN_DURATION, ease: 'none' });
  }
  createSpin();

  // Ticker — snaps corners toward live target rect (recalculated every frame)
  function tickerFn() {
    if (!activeTarget) return;
    const s = activeStrength.current;
    if (s === 0) return;
    const rect = activeTarget.getBoundingClientRect();
    const pad = activePad;
    const livePositions = [
      { x: rect.left - pad,                    y: rect.top - pad },
      { x: rect.right + pad - CORNER_SIZE,     y: rect.top - pad },
      { x: rect.right + pad - CORNER_SIZE,     y: rect.bottom + pad - CORNER_SIZE },
      { x: rect.left - pad,                    y: rect.bottom + pad - CORNER_SIZE },
    ];
    const cx = gsap.getProperty(cursor, 'x');
    const cy = gsap.getProperty(cursor, 'y');
    corners.forEach((corner, i) => {
      const curX = gsap.getProperty(corner, 'x');
      const curY = gsap.getProperty(corner, 'y');
      const tX = livePositions[i].x - cx;
      const tY = livePositions[i].y - cy;
      const fX = curX + (tX - curX) * s;
      const fY = curY + (tY - curY) * s;
      const dur = s >= 0.99 ? 0.2 : 0.05;
      gsap.to(corner, { x: fX, y: fY, duration: dur, ease: dur ? 'power1.out' : 'none', overwrite: 'auto' });
    });
  }

  // Follow cursor + detect targets (handles mouseover suppression during scroll)
  addEventListener('mousemove', e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power3.out' });
    let el = document.elementFromPoint(e.clientX, e.clientY);
    let found = null;
    while (el && el !== document.body) {
      if (el.matches?.(SELECTOR)) { found = el; break; }
      el = el.parentElement;
    }
    if (found && found !== activeTarget) enterTarget(found);
    else if (!found && activeTarget) currentLeaveHandler?.();
  });

  addEventListener('mousedown', () => {
    gsap.to(dot, { scale: 0.6, duration: 0.25 });
    gsap.to(cursor, { scale: 0.92, duration: 0.2 });
  });
  addEventListener('mouseup', () => {
    gsap.to(dot, { scale: 1, duration: 0.25 });
    gsap.to(cursor, { scale: 1, duration: 0.2 });
  });

  function enterTarget(found) {
    if (activeTarget && currentLeaveHandler) {
      activeTarget.removeEventListener('mouseleave', currentLeaveHandler);
      currentLeaveHandler = null;
    }
    if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }

    activeTarget = found;
    corners.forEach(c => gsap.killTweensOf(c));

    gsap.killTweensOf(cursor, 'rotation');
    spinTl?.pause();
    gsap.set(cursor, { rotation: 0 });

    const isLoose = found.closest('.site-header .nav') !== null
      || found.closest('.logo') !== null
      || found.closest('.faq-item .ch') !== null || found.matches?.('.faq-item .ch')
      || found.closest('.site-footer') !== null;
    gsap.to(dot, { opacity: isLoose ? 0 : 1, duration: 0.2 });
    activePad = isLoose ? 12 : BORDER_W;

    const rect = found.getBoundingClientRect();
    const cx = gsap.getProperty(cursor, 'x');
    const cy = gsap.getProperty(cursor, 'y');
    const pad = activePad;
    const initialPositions = [
      { x: rect.left - pad,                y: rect.top - pad },
      { x: rect.right + pad - CORNER_SIZE, y: rect.top - pad },
      { x: rect.right + pad - CORNER_SIZE, y: rect.bottom + pad - CORNER_SIZE },
      { x: rect.left - pad,                y: rect.bottom + pad - CORNER_SIZE },
    ];

    gsap.ticker.add(tickerFn);
    gsap.to(activeStrength, { current: 1, duration: HOVER_DURATION, ease: 'power2.out' });

    corners.forEach((corner, i) => {
      gsap.to(corner, {
        x: initialPositions[i].x - cx,
        y: initialPositions[i].y - cy,
        duration: 0.2, ease: 'power2.out'
      });
    });

    const leaveHandler = () => {
      gsap.ticker.remove(tickerFn);
      gsap.set(activeStrength, { current: 0, overwrite: true });
      activeTarget = null;
      gsap.to(dot, { opacity: 1, duration: 0.2 });

      gsap.killTweensOf(corners);
      const positions = [
        { x: -CORNER_SIZE * 1.7, y: -CORNER_SIZE * 1.7 },
        { x: CORNER_SIZE * 0.7,  y: -CORNER_SIZE * 1.7 },
        { x: CORNER_SIZE * 0.7,  y: CORNER_SIZE * 0.7 },
        { x: -CORNER_SIZE * 1.7, y: CORNER_SIZE * 0.7 },
      ];
      corners.forEach((c, i) => {
        gsap.to(c, { x: positions[i].x, y: positions[i].y, duration: 0.3, ease: 'power3.out' });
      });

      resumeTimeout = setTimeout(() => {
        if (!activeTarget && cursor && spinTl) {
          const rot = gsap.getProperty(cursor, 'rotation') % 360;
          spinTl.kill();
          spinTl = gsap.timeline({ repeat: -1 })
            .to(cursor, { rotation: '+=360', duration: SPIN_DURATION, ease: 'none' });
          gsap.to(cursor, {
            rotation: rot + 360,
            duration: SPIN_DURATION * (1 - rot / 360),
            ease: 'none',
            onComplete: () => spinTl?.restart()
          });
        }
        resumeTimeout = null;
      }, 50);

      found.removeEventListener('mouseleave', leaveHandler);
      currentLeaveHandler = null;
    };

    currentLeaveHandler = leaveHandler;
    found.addEventListener('mouseleave', leaveHandler);
  }

  // mouseover kept as fast path for non-scroll cases
  addEventListener('mouseover', e => {
    let t = e.target;
    let found = null;
    while (t && t !== document.body) {
      if (t.matches?.(SELECTOR)) { found = t; break; }
      t = t.parentElement;
    }
    if (found && found !== activeTarget) enterTarget(found);
  }, { passive: true });
})();


// ============================================================
// KICKOFF
// ============================================================
if (document.readyState === 'complete') {
  requestAnimationFrame(runIntro);
} else {
  window.addEventListener('load', () => requestAnimationFrame(runIntro));
}

// Final hard safety — if anything above throws synchronously, this still kills overlay
setTimeout(() => {
  if (document.getElementById('intro')) {
    console.warn('[main] safety bail — removing intro after 6s');
    bootSite();
  }
}, 6000);
