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
  const isMobile = window.innerWidth < 720;

  /* ==========================================================
     1. BACKGROUND LAYERS — на всю страницу
  ========================================================== */
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="aurora-bg">
      <div class="aurora-blob aurora-blob--1"></div>
      <div class="aurora-blob aurora-blob--2"></div>
      <div class="aurora-blob aurora-blob--3"></div>
      <div class="aurora-blob aurora-blob--4"></div>
    </div>
    <div class="grid-overlay"></div>
    <div class="noise-overlay"></div>
    <div class="fireflies"></div>
    <div class="scroll-progress"><i></i></div>
  `);

  /* ==========================================================
     2. FIREFLIES (кислотные светлячки по всей странице)
  ========================================================== */
  if (!reduceMotion) {
    const fireflies = document.querySelector('.fireflies');
    const count = isMobile ? 18 : 38;
    for (let i = 0; i < count; i++) {
      const f = document.createElement('div');
      f.className = 'firefly';
      const size = Math.random() * 2.5 + 1.5;
      f.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}vw;top:${Math.random()*100+10}vh`;
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
     4. THREE.JS — кислотное поле частиц НА ВСЮ СТРАНИЦУ
        (fixed-слой за контентом, реагирует на мышь и скролл)
  ========================================================== */
  if (typeof THREE !== 'undefined' && !reduceMotion) {
    const canvas = document.createElement('canvas');
    canvas.className = 'space-canvas';
    document.body.insertAdjacentElement('afterbegin', canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 90;

    const COUNT     = isMobile ? 90 : 190;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const palette   = [
      new THREE.Color('#C8FF00'),
      new THREE.Color('#DCFF5E'),
      new THREE.Color('#00FF88'),
      new THREE.Color('#9BFF2E'),
    ];

    for (let i = 0; i < COUNT; i++) {
      positions[i*3]   = (Math.random() - .5) * 220;
      positions[i*3+1] = (Math.random() - .5) * 130;
      positions[i*3+2] = (Math.random() - .5) * 70;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.7, vertexColors: true, transparent: true, opacity: .5,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* линии-созвездия между ближними частицами — глубина и «дороговизна» */
    const lineGeo = new THREE.BufferGeometry();
    const linePos = [];
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = positions[i*3] - positions[j*3];
        const dy = positions[i*3+1] - positions[j*3+1];
        const dz = positions[i*3+2] - positions[j*3+2];
        if (dx*dx + dy*dy + dz*dz < 280) {
          linePos.push(positions[i*3], positions[i*3+1], positions[i*3+2],
                       positions[j*3], positions[j*3+1], positions[j*3+2]);
        }
      }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      color: 0xC8FF00, transparent: true, opacity: .045,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    scene.add(lines);

    let mouseX = 0, mouseY = 0, scrollRot = 0;
    window.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth  - .5) * 2;
      mouseY = (e.clientY / window.innerHeight - .5) * -2;
    }, { passive: true });
    window.addEventListener('scroll', () => {
      scrollRot = window.scrollY * .00018;
    }, { passive: true });

    (function threeLoop() {
      requestAnimationFrame(threeLoop);
      const t = Date.now() * .001;
      const ry = t * .02 + mouseX * .07 + scrollRot;
      const rx = t * .007 + mouseY * .035 + scrollRot * .4;
      points.rotation.y = ry; lines.rotation.y = ry;
      points.rotation.x = rx; lines.rotation.x = rx;
      const pos = geo.attributes.position;
      for (let i = 0; i < COUNT; i++) {
        pos.array[i*3+1] += Math.sin(t * .25 + i * .6) * .006;
      }
      pos.needsUpdate = true;
      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
     7. HERO ENTRANCE — пословный разлёт заголовка
  ========================================================== */
  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.style.opacity = 1);
  } else {

    // Разбиваем h1 на слова для каскадного появления (DOM-обход — не ломает <em> и <br>)
    const splitWords = root => {
      [...root.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.innerHTML = `<span class="wi">${part}</span>`;
            frag.appendChild(w);
          });
          node.replaceWith(frag);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
          splitWords(node);
        }
      });
    };
    const h1 = document.querySelector('.hero h1');
    if (h1) splitWords(h1);

    gsap.timeline({ delay: .1 })
      .from('.hero__eyebrow .pill', { y: 30, opacity: 0, stagger: .12, duration: .6, ease: 'power3.out' })
      .from('.hero h1 .wi', {
        yPercent: 110, rotateZ: 4, opacity: 0,
        stagger: .06, duration: .9, ease: 'power4.out',
      }, '-=.3')
      .from('.hero__sub', { y: 26, opacity: 0, duration: .65, ease: 'power2.out' }, '-=.5')
      .from('.hero__cta .btn', { y: 26, opacity: 0, scale: .96, duration: .6, ease: 'back.out(1.6)' }, '-=.35')
      .from('.social-proof .avatar-img, .social-proof .avatar-count', {
        scale: 0, opacity: 0, stagger: .07, duration: .5, ease: 'back.out(2.2)',
      }, '-=.3')
      .from('.social-proof p', { y: 14, opacity: 0, duration: .5, ease: 'power2.out' }, '-=.3')
      .from('.hero__frame', { x: 60, opacity: 0, scale: .95, rotateY: -8, duration: 1.1, ease: 'power3.out', transformPerspective: 900 }, '-=1.1')
      .from('.hero__frame-badge', { y: 24, opacity: 0, duration: .6, ease: 'power3.out' }, '-=.4')
      .from('.stats-strip .stat', { y: 44, opacity: 0, stagger: .1, duration: .7, ease: 'power3.out' }, '-=.5');

    /* ==========================================================
       8. SCROLL REVEAL — с вариациями по типу элемента
    ========================================================== */
    document.querySelectorAll('.reveal').forEach(el => {
      const st = { trigger: el, start: 'top 88%', toggleActions: 'play none none none' };

      if (el.tagName === 'H2') {
        gsap.fromTo(el,
          { y: 60, opacity: 0, rotateX: 35, transformOrigin: '50% 100%' },
          { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: 'power3.out', scrollTrigger: st });
      } else if (el.classList.contains('day')) {
        gsap.fromTo(el,
          { x: -54, opacity: 0 },
          { x: 0, opacity: 1, duration: .8, ease: 'power3.out', scrollTrigger: st });
      } else if (el.classList.contains('review') || el.classList.contains('pain-card')) {
        gsap.fromTo(el,
          { y: 56, opacity: 0, scale: .94, rotateZ: gsap.utils.random(-2, 2) },
          { y: 0, opacity: 1, scale: 1, rotateZ: 0, duration: .9, ease: 'power3.out', scrollTrigger: st });
      } else if (el.classList.contains('shift-col')) {
        const fromLeft = el.classList.contains('shift-col--before');
        gsap.fromTo(el,
          { x: fromLeft ? -64 : 64, opacity: 0 },
          { x: 0, opacity: 1, duration: .95, ease: 'power3.out', scrollTrigger: st });
      } else {
        gsap.fromTo(el,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: .85, ease: 'power3.out', scrollTrigger: st });
      }
    });

    /* ==========================================================
       9. ПАРАЛЛАКС — многослойный, на всех секциях
    ========================================================== */
    const parallax = (targets, y, scrub = 1.5) => {
      gsap.utils.toArray(targets).forEach((el, i) => {
        const depth = Array.isArray(y) ? y[i % y.length] : y;
        gsap.to(el, {
          y: depth, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub },
        });
      });
    };

    gsap.to('.hero__frame', {
      y: -70, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 },
    });
    gsap.to('.hero__content', {
      y: -30, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2.5 },
    });

    parallax('.stats-strip', -36, 2);
    parallax('.pain-card',  [-22, -52, -82]);
    parallax('.shift-col--before', -28, 2);
    parallax('.shift-col--after',  -64, 2);
    parallax('.author__visual', -46, 2);
    parallax('.review', [-24, -56, -36]);
    parallax('.audience__item', [-16, -42, -28, -36, -20, -48]);
    parallax('.offer-card .offer__list', -20, 2.5);
    parallax('.cta-card h2', -18, 2.5);

    // Фоновые блобы — глубинный параллакс на весь скролл
    [['.aurora-blob--1', -160, 3], ['.aurora-blob--2', -110, 2],
     ['.aurora-blob--3', -200, 2.5], ['.aurora-blob--4', -90, 3.5]].forEach(([sel, y, scrub]) => {
      gsap.to(sel, {
        y, ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub },
      });
    });

    /* ==========================================================
       10. SCROLL PROGRESS BAR (кислотная линия сверху)
    ========================================================== */
    gsap.to('.scroll-progress i', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: .3 },
    });

    /* ==========================================================
       11. TIMELINE PROGRESS — градиент цели
    ========================================================== */
    const bar = document.querySelector('.timeline__bar i');
    if (bar) {
      gsap.to(bar, {
        height: '100%', ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 75%', end: 'bottom 60%', scrub: 1 },
      });
    }

    // Номера дней вспыхивают при достижении
    document.querySelectorAll('.day__num').forEach(num => {
      gsap.fromTo(num,
        { scale: .6, opacity: .2 },
        { scale: 1, opacity: 1, duration: .5, ease: 'back.out(2.5)',
          scrollTrigger: { trigger: num, start: 'top 80%', toggleActions: 'play none none none' } });
    });

    /* ==========================================================
       12. MARQUEE — ускоряется от скорости скролла
    ========================================================== */
    const track = document.querySelector('.marquee__track');
    if (track) {
      let speedTween;
      ScrollTrigger.create({
        trigger: 'body', start: 'top top', end: 'bottom bottom',
        onUpdate(self) {
          const v = Math.min(Math.abs(self.getVelocity()) / 400, 5);
          if (speedTween) speedTween.kill();
          track.style.animationDuration = (28 / (1 + v)) + 's';
          speedTween = gsap.delayedCall(.35, () => track.style.animationDuration = '28s');
        },
      });
    }

    /* ==========================================================
       13. 3D CARD TILT + hero-кадр следует за мышью
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
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: .7, ease: 'elastic.out(1,.5)' });
        });
      });

      const frame = document.querySelector('.hero__frame');
      const heroSection = document.querySelector('.hero');
      if (frame && heroSection) {
        heroSection.addEventListener('mousemove', e => {
          const r = heroSection.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width  - .5;
          const y = (e.clientY - r.top)  / r.height - .5;
          gsap.to(frame, {
            rotateY: x * 7, rotateX: -y * 5,
            duration: .6, ease: 'power2.out',
            transformPerspective: 1100, force3D: true,
          });
        });
        heroSection.addEventListener('mouseleave', () => {
          gsap.to(frame, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1,.4)' });
        });
      }
    }
  }

  /* ==========================================================
     14. FAQ ACCORDION
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
     15. COUNTDOWN TIMER (дедлайн хранится в localStorage)
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
     16. COUNT-UP (кинетические цифры)
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
     17. STICKY CTA — прячется, когда виден финальный CTA
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
