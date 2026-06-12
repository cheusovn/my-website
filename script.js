'use strict';

/* ── GSAP plugin registration ── */
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. BACKGROUND LAYERS
  ========================================================== */
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="aurora-bg">
      <div class="aurora-blob aurora-blob--1"></div>
      <div class="aurora-blob aurora-blob--2"></div>
      <div class="aurora-blob aurora-blob--3"></div>
    </div>
    <div class="silk-overlay"></div>
    <div class="noise-overlay"></div>
    <div class="page-glow-edges"></div>
    <div class="page-sheen"></div>
    <div class="fireflies"></div>
  `);

  /* ==========================================================
     2. FIREFLIES
  ========================================================== */
  const fireflies = document.querySelector('.fireflies');
  for (let i = 0; i < 24; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    const size = Math.random() * 2.5 + 1.5;
    f.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}vw;top:${Math.random()*100+20}vh`;
    f.style.setProperty('--fly-dur',   (Math.random()*14+12)+'s');
    f.style.setProperty('--fly-delay', (-Math.random()*18)+'s');
    f.style.setProperty('--blink-dur', (Math.random()*3+3)+'s');
    f.style.setProperty('--fx1', (Math.random()*80-40)+'px');
    f.style.setProperty('--fy1', (Math.random()*-80-20)+'px');
    f.style.setProperty('--fx2', (Math.random()*80-40)+'px');
    f.style.setProperty('--fy2', (Math.random()*-140-40)+'px');
    f.style.setProperty('--fx3', (Math.random()*80-40)+'px');
    f.style.setProperty('--fy3', (Math.random()*-200-60)+'px');
    fireflies.appendChild(f);
  }

  /* ==========================================================
     3. LENIS SMOOTH SCROLL
  ========================================================== */
  const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ==========================================================
     4. THREE.JS PARTICLE FIELD IN HERO
  ========================================================== */
  const heroSection = document.querySelector('.hero');
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  heroSection.insertAdjacentElement('afterbegin', canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(heroSection.offsetWidth, heroSection.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, heroSection.offsetWidth / heroSection.offsetHeight, 0.1, 1000);
  camera.position.z = 90;

  const COUNT     = window.innerWidth < 640 ? 80 : 180;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const palette   = [
    new THREE.Color('#00ff88'),
    new THREE.Color('#00e5ff'),
    new THREE.Color('#2bffa3'),
    new THREE.Color('#a0ffd3'),
  ];

  for (let i = 0; i < COUNT; i++) {
    positions[i*3]   = (Math.random() - .5) * 180;
    positions[i*3+1] = (Math.random() - .5) * 90;
    positions[i*3+2] = (Math.random() - .5) * 50;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 2.2, vertexColors: true, transparent: true, opacity: .8,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let heroMouseX = 0, heroMouseY = 0;
  heroSection.addEventListener('mousemove', e => {
    const r = heroSection.getBoundingClientRect();
    heroMouseX = ((e.clientX - r.left) / r.width  - .5) * 2;
    heroMouseY = ((e.clientY - r.top)  / r.height - .5) * -2;
  }, { passive: true });

  (function threeLoop() {
    requestAnimationFrame(threeLoop);
    const t = Date.now() * .001;
    points.rotation.y = t * .025 + heroMouseX * .06;
    points.rotation.x = t * .008 + heroMouseY * .03;
    const pos = geo.attributes.position;
    for (let i = 0; i < COUNT; i++) {
      pos.array[i*3+1] += Math.sin(t * .25 + i * .6) * .006;
    }
    pos.needsUpdate = true;
    renderer.render(scene, camera);
  })();

  const onHeroResize = () => {
    const w = heroSection.offsetWidth, h = heroSection.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onHeroResize, { passive: true });

  /* ==========================================================
     5. CUSTOM CURSOR
  ========================================================== */
  const ring = document.getElementById('curRing');
  const dot  = document.getElementById('curDot');
  const isPointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  if (ring && dot && isPointer) {
    document.body.classList.add('custom-cursor-active');

    let rx = 0, ry = 0, mx = 0, my = 0;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      gsap.set(dot, { x: mx - 3, y: my - 3 });
    }, { passive: true });

    gsap.ticker.add(() => {
      rx += (mx - rx) * .11;
      ry += (my - ry) * .11;
      gsap.set(ring, { x: rx - 20, y: ry - 20 });
    });

    document.querySelectorAll('a, button, .btn, .faq__question, .audience__item, .banner-img').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });

    window.addEventListener('mouseleave', () => gsap.to([ring, dot], { opacity: 0, duration: .3 }));
    window.addEventListener('mouseenter', () => gsap.to([ring, dot], { opacity: 1, duration: .3 }));
  }

  /* ==========================================================
     6. MAGNETIC BUTTONS
  ========================================================== */
  if (isPointer) {
    document.querySelectorAll('.btn').forEach(btn => {
      const xTo = gsap.quickTo(btn, 'x', { duration: .5, ease: 'elastic.out(1,.5)' });
      const yTo = gsap.quickTo(btn, 'y', { duration: .5, ease: 'elastic.out(1,.5)' });
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width  / 2)) * .35);
        yTo((e.clientY - (r.top  + r.height / 2)) * .35);
      });
      btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ==========================================================
     7. REMOVE .reveal CLASS  — GSAP takes over
  ========================================================== */
  document.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal'));

  /* ==========================================================
     8. HERO ENTRANCE TIMELINE
  ========================================================== */
  gsap.timeline({ delay: .15 })
    .from('.hero__eyebrow', { y: 40, opacity: 0, duration: .8, ease: 'power3.out' })
    .from('.hero h1', {
      scale: .88, opacity: 0, filter: 'blur(18px)',
      duration: 1.1, ease: 'power3.out',
    }, '-=.45')
    .from('.hero__sub', { y: 28, opacity: 0, duration: .7, ease: 'power2.out' }, '-=.55')
    .from('.hero .banner-img', { y: 55, opacity: 0, scale: .97, duration: 1, ease: 'power3.out' }, '-=.45')
    .from('.benefits li', { y: 28, opacity: 0, stagger: .07, duration: .55, ease: 'power2.out' }, '-=.45')
    .from('.deadline', { y: 28, opacity: 0, duration: .6, ease: 'power2.out' }, '-=.3')
    .from('.hero .btn', { y: 28, opacity: 0, scale: .95, duration: .65, ease: 'back.out(1.7)' }, '-=.3')
    .from('.social-proof', { y: 20, opacity: 0, duration: .5, ease: 'power2.out' }, '-=.35');

  /* ==========================================================
     9. SCROLL TRIGGER ANIMATIONS + PARALLAX
  ========================================================== */

  // Parallax: hero banner
  gsap.to('.hero .banner-img', {
    y: -90, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 },
  });

  // Parallax: other banners
  document.querySelectorAll('.banner-section .banner-img, .skills .banner-img').forEach(img => {
    gsap.to(img, {
      y: -60, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
    });
  });

  // Parallax: aurora blobs depth
  gsap.to('.aurora-blob--1', {
    y: -130, ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: 3 },
  });
  gsap.to('.aurora-blob--2', {
    y: -80, ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: 2 },
  });

  // Section headings
  document.querySelectorAll('section h2').forEach(h => {
    gsap.from(h, {
      y: 50, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: h, start: 'top 86%', toggleActions: 'play none none none' },
    });
  });

  // Story & author glass cards
  document.querySelectorAll('.story__inner, .author__inner').forEach(card => {
    gsap.from(card, {
      y: 65, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
    });
  });

  // Audience grid — stagger
  gsap.from('.audience__item', {
    y: 50, opacity: 0, stagger: .07, duration: .7, ease: 'power2.out',
    scrollTrigger: { trigger: '.audience__list', start: 'top 80%', toggleActions: 'play none none none' },
  });

  // CTA card
  gsap.from('.cta-card', {
    y: 60, opacity: 0, scale: .97, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-card', start: 'top 85%', toggleActions: 'play none none none' },
  });

  // FAQ items
  gsap.from('.faq__item', {
    y: 30, opacity: 0, stagger: .09, duration: .65, ease: 'power2.out',
    scrollTrigger: { trigger: '.faq__list', start: 'top 80%', toggleActions: 'play none none none' },
  });

  /* ==========================================================
     10. 3D CARD TILT (GSAP-powered)
  ========================================================== */
  if (isPointer) {
    document.querySelectorAll('.audience__item').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        gsap.to(card, {
          rotateY: x * 16, rotateX: -y * 16,
          y: -9, scale: 1.025,
          duration: .25, ease: 'power2.out',
          transformPerspective: 700, force3D: true,
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0, rotateX: 0, y: 0, scale: 1,
          duration: .7, ease: 'elastic.out(1,.5)',
        });
      });
    });

    // Tilt on story & author cards (subtle)
    document.querySelectorAll('.story__inner, .author__inner, .cta-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        gsap.to(card, {
          rotateY: x * 6, rotateX: -y * 6, y: -4,
          duration: .3, ease: 'power2.out',
          transformPerspective: 1200, force3D: true,
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0, rotateX: 0, y: 0,
          duration: .7, ease: 'elastic.out(1,.5)',
        });
      });
    });
  }

  /* ==========================================================
     11. FAQ ACCORDION
  ========================================================== */
  document.querySelectorAll('.faq__question').forEach(q => {
    q.addEventListener('click', () => {
      const isOpen = q.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq__question').forEach(o => {
        o.setAttribute('aria-expanded', 'false');
        const a = o.nextElementSibling;
        if (a) a.style.maxHeight = null;
      });
      if (!isOpen) {
        q.setAttribute('aria-expanded', 'true');
        q.nextElementSibling.style.maxHeight = q.nextElementSibling.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================
     12. COUNTDOWN TIMER
  ========================================================== */
  const STORAGE_KEY = 'trueai_deadline';
  let deadline = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (!deadline || deadline < Date.now()) {
    deadline = Date.now() + (23*3600 + 54*60 + 31) * 1000;
    localStorage.setItem(STORAGE_KEY, String(deadline));
  }

  const elH    = document.querySelectorAll('[data-timer="h"]');
  const elM    = document.querySelectorAll('[data-timer="m"]');
  const elS    = document.querySelectorAll('[data-timer="s"]');
  const elForm = document.querySelectorAll('[data-timer="form"]');
  const pad    = n => String(n).padStart(2, '0');

  function tick() {
    const left = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
    const h = Math.floor(left / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;
    elH.forEach(e => e.textContent = pad(h));
    elM.forEach(e => e.textContent = pad(m));
    elS.forEach(e => e.textContent = pad(s));
    elForm.forEach(e => e.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`);
    document.querySelectorAll('.deadline__unit span').forEach(el => {
      el.classList.remove('tick-pulse');
      void el.offsetWidth;
      el.classList.add('tick-pulse');
    });
  }
  tick();
  setInterval(tick, 1000);

  /* ==========================================================
     13. COUNT-UP via GSAP ScrollTrigger
  ========================================================== */
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (!target) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter() {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val); },
          onComplete() { el.textContent = target; },
        });
      },
    });
  });

  /* ==========================================================
     14. STICKY CTA — hide when main CTA visible
  ========================================================== */
  const ctaSection = document.querySelector('#cta');
  const stickyCta  = document.querySelector('.sticky-cta');
  if (ctaSection && stickyCta) {
    ScrollTrigger.create({
      trigger: ctaSection, start: 'top 70%',
      onEnter:     () => gsap.to(stickyCta, { opacity: 0, pointerEvents: 'none', duration: .3 }),
      onLeaveBack: () => gsap.to(stickyCta, { opacity: 1, pointerEvents: 'auto', duration: .3 }),
    });
  }

});
