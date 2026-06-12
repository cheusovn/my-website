'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Fallback: если GSAP не загрузился, просто показываем контент ── */
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal').forEach(el => el.style.opacity = 1);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ==========================================================
     1. BACKGROUND LAYERS
  ========================================================== */
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="aurora-bg">
      <div class="aurora-blob aurora-blob--1"></div>
      <div class="aurora-blob aurora-blob--2"></div>
      <div class="aurora-blob aurora-blob--3"></div>
    </div>
    <div class="noise-overlay"></div>
    <div class="fireflies"></div>
  `);

  /* ==========================================================
     2. FIREFLIES (кислотные светлячки)
  ========================================================== */
  if (!reduceMotion) {
    const fireflies = document.querySelector('.fireflies');
    const count = window.innerWidth < 720 ? 12 : 24;
    for (let i = 0; i < count; i++) {
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
  }

  /* ==========================================================
     3. LENIS SMOOTH SCROLL
  ========================================================== */
  if (typeof Lenis !== 'undefined' && !reduceMotion) {
    const lenis = new Lenis({
      duration: 1.35,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ==========================================================
     4. THREE.JS — кислотное поле частиц в hero
  ========================================================== */
  const heroSection = document.querySelector('.hero');
  if (typeof THREE !== 'undefined' && heroSection && !reduceMotion) {
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

    const COUNT     = window.innerWidth < 640 ? 70 : 170;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const palette   = [
      new THREE.Color('#C8FF00'),
      new THREE.Color('#DCFF5E'),
      new THREE.Color('#00FF88'),
      new THREE.Color('#9BFF2E'),
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
      size: 2.1, vertexColors: true, transparent: true, opacity: .75,
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

    window.addEventListener('resize', () => {
      const w = heroSection.offsetWidth, h = heroSection.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }, { passive: true });
  }

  /* ==========================================================
     5. CUSTOM CURSOR
  ========================================================== */
  const ring = document.getElementById('curRing');
  const dot  = document.getElementById('curDot');

  if (ring && dot && isPointer && !reduceMotion) {
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

    document.querySelectorAll('a, button, .btn, .faq__question, .audience__item, .day, .review, .pain-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });

    window.addEventListener('mouseleave', () => gsap.to([ring, dot], { opacity: 0, duration: .3 }));
    window.addEventListener('mouseenter', () => gsap.to([ring, dot], { opacity: 1, duration: .3 }));
  }

  /* ==========================================================
     6. MAGNETIC BUTTONS
  ========================================================== */
  if (isPointer && !reduceMotion) {
    document.querySelectorAll('.btn').forEach(btn => {
      const xTo = gsap.quickTo(btn, 'x', { duration: .5, ease: 'elastic.out(1,.5)' });
      const yTo = gsap.quickTo(btn, 'y', { duration: .5, ease: 'elastic.out(1,.5)' });
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width  / 2)) * .3);
        yTo((e.clientY - (r.top  + r.height / 2)) * .3);
      });
      btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ==========================================================
     7. HERO ENTRANCE TIMELINE
  ========================================================== */
  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.style.opacity = 1);
  } else {
    gsap.timeline({ delay: .1 })
      .from('.hero__eyebrow', { y: 36, opacity: 0, duration: .7, ease: 'power3.out' })
      .from('.hero h1', {
        y: 40, opacity: 0, filter: 'blur(14px)',
        duration: 1, ease: 'power3.out',
      }, '-=.4')
      .from('.hero__sub', { y: 26, opacity: 0, duration: .65, ease: 'power2.out' }, '-=.5')
      .from('.hero__cta .btn', { y: 26, opacity: 0, scale: .96, duration: .6, ease: 'back.out(1.6)' }, '-=.35')
      .from('.social-proof', { y: 18, opacity: 0, duration: .5, ease: 'power2.out' }, '-=.3')
      .from('.hero__frame', { x: 50, opacity: 0, scale: .96, duration: 1, ease: 'power3.out' }, '-=.9')
      .from('.stats-strip', { y: 40, opacity: 0, duration: .8, ease: 'power3.out' }, '-=.5');

    /* ==========================================================
       8. SCROLL REVEAL — все .reveal элементы
    ========================================================== */
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.fromTo(el,
        { y: 44, opacity: 0 },
        {
          y: 0, opacity: 1, duration: .85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        });
    });

    /* ==========================================================
       9. PARALLAX
    ========================================================== */
    gsap.to('.hero__frame', {
      y: -50, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 },
    });
    gsap.to('.aurora-blob--1', {
      y: -130, ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: 3 },
    });
    gsap.to('.aurora-blob--2', {
      y: -80, ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: 2 },
    });

    /* ==========================================================
       10. TIMELINE PROGRESS — градиент цели (заливается при скролле)
    ========================================================== */
    const bar = document.querySelector('.timeline__bar i');
    if (bar) {
      gsap.to(bar, {
        height: '100%', ease: 'none',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 75%',
          end: 'bottom 60%',
          scrub: 1,
        },
      });
    }

    /* ==========================================================
       11. 3D CARD TILT
    ========================================================== */
    if (isPointer) {
      document.querySelectorAll('.audience__item, .pain-card, .review').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width  - .5;
          const y = (e.clientY - r.top)  / r.height - .5;
          gsap.to(card, {
            rotateY: x * 10, rotateX: -y * 10,
            duration: .25, ease: 'power2.out',
            transformPerspective: 800, force3D: true,
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateY: 0, rotateX: 0,
            duration: .7, ease: 'elastic.out(1,.5)',
          });
        });
      });
    }
  }

  /* ==========================================================
     12. FAQ ACCORDION
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
     13. COUNTDOWN TIMER (дедлайн хранится в localStorage)
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
     14. COUNT-UP (кинетические цифры)
  ========================================================== */
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (!target) return;
    if (reduceMotion) { el.textContent = target; return; }
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
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
     15. STICKY CTA — прячется, когда виден финальный CTA
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
