document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. ФОНОВЫЕ СЛОИ
     ============================================================ */
  const bgHTML = `
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
    <div class="cursor-glow"></div>
  `;
  document.body.insertAdjacentHTML('afterbegin', bgHTML);

  /* ============================================================
     2. СВЕТЛЯЧКИ
     ============================================================ */
  const fireflies = document.querySelector('.fireflies');
  const COUNT = 24;
  for (let i = 0; i < COUNT; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    const size = Math.random() * 2.5 + 1.5;
    f.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}vw;
      top:${Math.random() * 100 + 20}vh;
    `;
    f.style.setProperty('--fly-dur',   (Math.random() * 14 + 12) + 's');
    f.style.setProperty('--fly-delay', (-Math.random() * 18) + 's');
    f.style.setProperty('--blink-dur', (Math.random() * 3 + 3) + 's');
    f.style.setProperty('--fx1', (Math.random() * 80 - 40) + 'px');
    f.style.setProperty('--fy1', (Math.random() * -80 - 20) + 'px');
    f.style.setProperty('--fx2', (Math.random() * 80 - 40) + 'px');
    f.style.setProperty('--fy2', (Math.random() * -140 - 40) + 'px');
    f.style.setProperty('--fx3', (Math.random() * 80 - 40) + 'px');
    f.style.setProperty('--fy3', (Math.random() * -200 - 60) + 'px');
    fireflies.appendChild(f);
  }

  /* ============================================================
     3. СВЕЧЕНИЕ ЗА КУРСОРОМ
     ============================================================ */
  const glow = document.querySelector('.cursor-glow');
  let gx = 0, gy = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    gx = e.clientX - 260;
    gy = e.clientY - 260;
    glow.style.opacity = '1';
  });
  (function loop() {
    cx += (gx - cx) * 0.10;
    cy += (gy - cy) * 0.10;
    glow.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();

  /* ============================================================
     4. ТАЙМЕР ОБРАТНОГО ОТСЧЁТА
     Исправлено: data-timer="h/m/s" соответствует JS-запросам
     ============================================================ */
  // Читаем сохранённый дедлайн или создаём новый (24 часа)
  const STORAGE_KEY = 'trueai_deadline';
  let deadline = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (!deadline || deadline < Date.now()) {
    deadline = Date.now() + (23 * 3600 + 54 * 60 + 31) * 1000;
    localStorage.setItem(STORAGE_KEY, String(deadline));
  }

  const elH = document.querySelectorAll('[data-timer="h"]');
  const elM = document.querySelectorAll('[data-timer="m"]');
  const elS = document.querySelectorAll('[data-timer="s"]');
  const elForm = document.querySelectorAll('[data-timer="form"]');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const left = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
    const h = Math.floor(left / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;
    elH.forEach(e => e.textContent = pad(h));
    elM.forEach(e => e.textContent = pad(m));
    elS.forEach(e => e.textContent = pad(s));
    elForm.forEach(e => e.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`);

    // Пульс при смене секунды
    document.querySelectorAll('.deadline__unit span').forEach(el => {
      el.classList.remove('tick-pulse');
      void el.offsetWidth; // reflow
      el.classList.add('tick-pulse');
    });
  }

  tick();
  setInterval(tick, 1000);

  /* ============================================================
     5. FAQ-АККОРДЕОН
     ============================================================ */
  document.querySelectorAll('.faq__question').forEach(q => {
    q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      const ans = q.nextElementSibling;

      // Закрываем все
      document.querySelectorAll('.faq__question').forEach(o => {
        o.setAttribute('aria-expanded', 'false');
        const a = o.nextElementSibling;
        if (a) a.style.maxHeight = null;
      });

      // Открываем нажатый
      if (!open) {
        q.setAttribute('aria-expanded', 'true');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ============================================================
     6. REVEAL ПРИ СКРОЛЛЕ — с поддержкой stagger для дочерних
     ============================================================ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');

        // Stagger для дочерних элементов
        if (en.target.hasAttribute('data-stagger')) {
          en.target.querySelectorAll('li, .audience__item').forEach((child, i) => {
            child.style.transitionDelay = (i * 0.07) + 's';
            child.classList.add('visible');
          });
        }

        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ============================================================
     7. COUNT-UP АНИМАЦИЯ для статистик
     ============================================================ */
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.target, 10);
      if (!target) return;

      let start = 0;
      const duration = 1500; // мс
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      countIo.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => countIo.observe(el));

  /* ============================================================
     8. TILT-ЭФФЕКТ НА КАРТОЧКАХ АУДИТОРИИ (только desktop)
     ============================================================ */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.audience__item').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - .5;
        const y = (e.clientY - rect.top)  / rect.height - .5;
        card.style.transform = `
          perspective(600px)
          rotateY(${x * 8}deg)
          rotateX(${-y * 8}deg)
          translateY(-7px)
        `;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform .1s ease';
      });
    });
  }

  /* ============================================================
     9. PARALLAX ДЛЯ HERO ИЗОБРАЖЕНИЯ
     ============================================================ */
  const heroBanner = document.querySelector('.hero .banner-img');
  if (heroBanner && window.matchMedia('(min-width: 640px)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBanner.style.transform = `translateY(${scrolled * 0.12}px)`;
    }, { passive: true });
  }

  /* ============================================================
     10. АКТИВНЫЙ КЛАСС ДЛЯ STICKY CTA — скрываем когда CTA виден
     ============================================================ */
  const ctaSection = document.querySelector('#cta');
  const stickyCta  = document.querySelector('.sticky-cta');
  if (ctaSection && stickyCta) {
    const ctaObs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        stickyCta.style.opacity = en.isIntersecting ? '0' : '';
        stickyCta.style.pointerEvents = en.isIntersecting ? 'none' : '';
      });
    }, { threshold: 0.3 });
    ctaObs.observe(ctaSection);
  }

});
