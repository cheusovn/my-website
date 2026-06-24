'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Fallback: если GSAP не загрузился, просто показываем контент ── */
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal').forEach(el => el.style.opacity = 1);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Видео, картинки и шрифты догружаются ПОСЛЕ DOMContentLoaded и меняют высоту
  // страницы. Без пересчёта ScrollTrigger держит старые координаты → точки
  // срабатывания «уезжают», и скролл выглядит бесконечным. Пересчитываем.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const isMobile = window.innerWidth < 720;

  // Уважение к reduced-motion: останавливаем фоновое видео в hero
  if (reduceMotion) {
    document.querySelectorAll('video[autoplay]').forEach(v => { v.pause(); v.removeAttribute('autoplay'); });
  }

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
    <div class="scroll-progress"><i></i></div>
  `);

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
     6. MAGNETIC BUTTONS — лёгкое притяжение, без «прыжков» (со вкусом)
  ========================================================== */
  if (isPointer && !reduceMotion) {
    document.querySelectorAll('.btn').forEach(btn => {
      const xTo = gsap.quickTo(btn, 'x', { duration: .6, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: .6, ease: 'power3.out' });
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width  / 2)) * .14);
        yTo((e.clientY - (r.top  + r.height / 2)) * .14);
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
      } else if (el.classList.contains('step')) {
        gsap.fromTo(el,
          { y: 54, opacity: 0, scale: .95 },
          { y: 0, opacity: 1, scale: 1, duration: .9, ease: 'power3.out', scrollTrigger: st });
      } else if (el.classList.contains('guarantee__card')) {
        gsap.fromTo(el,
          { y: 50, opacity: 0, scale: .97 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: st });
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
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub, invalidateOnRefresh: true },
        });
      });
    };

    // Тяжёлый scrub-параллакс — только на десктопе. На мобильных он сатурирует
    // главный поток (видео + blur-слои + iframe) и вызывает фризы.
    if (!isMobile) {
      gsap.to('.hero__frame', {
        y: -70, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2, invalidateOnRefresh: true },
      });
      gsap.to('.hero__content', {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2.5, invalidateOnRefresh: true },
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
          scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub, invalidateOnRefresh: true },
        });
      });
    }

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
       12. MARQUEE — равномерная скорость
    ========================================================== */

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
            rotateY: x * 4, rotateX: -y * 4,
            duration: .4, ease: 'power2.out',
            transformPerspective: 1000, force3D: true,
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
     17. PEEK CTA — появляется после ухода с первого экрана, прячется у финального CTA
  ========================================================== */
  const peekCta = document.querySelector('#peekCta');
  if (peekCta) {
    gsap.set(peekCta, { xPercent: -50 });
    const showPeek = () => gsap.to(peekCta, { xPercent: -50, y: 0, opacity: 1, pointerEvents: 'auto', duration: .6, ease: 'power3.out' });
    const hidePeek = () => gsap.to(peekCta, { xPercent: -50, y: 120, opacity: 0, pointerEvents: 'none', duration: .4 });

    // Показать только когда пользователь ушёл ниже hero (чтобы не наезжать на главную кнопку)
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      ScrollTrigger.create({
        trigger: heroSection, start: 'bottom 92%',
        onEnter: showPeek,
        onLeaveBack: hidePeek,
      });
    }
    // Скрыть у финального CTA, чтобы не дублировать
    const ctaSection = document.querySelector('#cta');
    if (ctaSection) {
      ScrollTrigger.create({
        trigger: ctaSection, start: 'top 85%',
        onEnter: hidePeek,
        onLeaveBack: showPeek,
      });
    }
  }

  /* ==========================================================
     19. MOTION PREVIEW — масштаб iframe под контейнер
  ========================================================== */
  const motionFrame = document.querySelector('.motion-preview__frame');
  if (motionFrame) {
    const scaleIframe = () => {
      const w = motionFrame.offsetWidth;
      const scale = w / 1080;
      motionFrame.querySelector('iframe').style.transform = `scale(${scale})`;
    };
    scaleIframe();
    new ResizeObserver(scaleIframe).observe(motionFrame);
  }

  /* ==========================================================
     18. VALUE STACK — строки появляются по очереди (нет .reveal — анимируем здесь)
  ========================================================== */
  gsap.utils.toArray('.value-stack__row, .value-stack__total, .value-stack__free').forEach((row, i) => {
    gsap.fromTo(row,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: .5, ease: 'power2.out',
        scrollTrigger: { trigger: row, start: 'top 94%', toggleActions: 'play none none none' },
        delay: i * .06,
      });
  });

});
