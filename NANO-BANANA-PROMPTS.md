# 🎨 Промпты для Nano Banana и Kling 3.0

Дизайн-система сайта: кислотно-зелёный `#C8FF00` + мятный `#00FF88` на глубоком тёмном фоне `#070905`.
Все изображения должны попадать в эту палитру — тогда сайт выглядит как единый дорогой продукт.

**Куда класть файлы:** папка `images/`, имена файлов указаны под каждым промптом.

---

## 📸 №1 — HERO-визуал (ГЛАВНОЕ ФОТО, нужно ВАШЕ ФОТО)

Это самая важная картинка на сайте — она продаёт доверие. Личное фото основателя в hero
конвертирует лучше любой абстракции: покупатель сразу видит живого человека, а не «школу-однодневку».

> **Прикрепите своё фото** (портрет по грудь, хорошее освещение, нейтральный фон — Nano Banana пересадит вас в сцену).

**Промпт:**

```
Edit this photo: place this exact person (keep face 100% identical, do not alter facial
features) into a premium cinematic scene. He is a successful AI content creator standing
confidently in a dark modern studio, arms crossed, slight confident smile, looking at camera.
Wearing a premium black hoodie or black blazer over dark t-shirt. Background: dark studio
(#070905) with out-of-focus screens showing AI-generated video timelines, soft volumetric
acid-green (#C8FF00) rim light from the left edge outlining his silhouette, subtle mint-green
(#00FF88) glow reflections. Shallow depth of field, shot on 85mm lens, editorial magazine
quality, dramatic but clean lighting, vertical 4:5 portrait orientation, photorealistic,
8k detail. No text, no watermarks.
```

**Файл:** `images/hero.jpg` (вертикаль 4:5, минимум 1080×1350)

---

## 📸 №2 — Портрет для блока «Кто ведёт курс» (нужно ВАШЕ ФОТО)

Второе касание доверия: здесь вы «ближе» к читателю — теплее, человечнее, чем в hero.

> **Прикрепите своё фото** (можно другое, чем для hero — лучше с лёгкой улыбкой).

**Промпт:**

```
Edit this photo: keep this exact person's face 100% identical. Create a warm, approachable
yet premium portrait. He is sitting relaxed at a modern desk, leaning slightly forward,
genuine friendly smile, making eye contact with camera. Dark stylish casual outfit.
Environment: dark moody workspace, a laptop with glowing acid-green (#C8FF00) interface
visible but blurred in background, warm key light on face, subtle green neon accent light
in background bokeh. Authentic, trustworthy, mentor energy — like a person you'd want to
learn from. 85mm portrait lens look, vertical 4:5, photorealistic, editorial quality.
No text, no watermarks.
```

**Файл:** `images/author.jpg` (вертикаль 4:5)

---

## 📸 №3 — Аватары для отзывов (по желанию)

⚠️ **Лучший вариант — реальные фото и реальные отзывы учеников** (попросите разрешение в чате курса).
Реальные скрины переписок из Telegram конвертируют сильнее любой генерации.
Если реальных фото нет, сгенерируйте нейтральные портреты:

**Промпт (меняйте описание человека для каждого аватара):**

```
Photorealistic casual portrait of a [30-year-old russian woman with brown hair, soft smile /
35-year-old man with short beard / 28-year-old woman with blonde hair], natural daylight,
amateur smartphone selfie quality (slightly imperfect, authentic), neutral home or office
background, looking at camera, friendly genuine expression, square 1:1 crop.
No text, no watermarks.
```

**Файлы:** `images/avatar1.jpg` … `images/avatar5.jpg` (квадрат 1:1, от 200×200)

---

## 📸 №4 — Open Graph картинка для соцсетей (опционально, но желательно)

Когда сайт шерят в Telegram/WhatsApp — превью должно продавать.

**Промпт:**

```
Premium dark landing page social preview banner, 1200x630. Deep near-black green background
(#070905) with subtle grain texture. Bold oversized typography placeholder area on the left,
abstract acid-green (#C8FF00) liquid glass 3D shape on the right with mint (#00FF88) glow,
floating glowing particles, thin neon green border frame. Luxury tech aesthetic, cinematic
lighting, ultra clean composition. No text, no watermarks (text will be added later).
```

**Файл:** `images/og-image.jpg` (1200×630). После генерации добавьте в `<head>`:
```html
<meta property="og:image" content="images/og-image.jpg" />
```

---

## 🎬 KLING 3.0 — видео для hero (опционально, максимальный «вау»)

Видео вместо статичной картинки в hero — главный тренд дорогих лендингов 2026.

**Вариант А — оживить вашу hero-картинку (рекомендую):**
сгенерируйте сначала картинку №1, затем скормите её Kling 3.0 как первый кадр.

```
Cinematic slow motion: the man stands confidently in a dark studio, subtle camera push-in
(slow dolly forward), acid-green rim light gently pulses and shifts, floating dust particles
drift through volumetric light beams, screens in the background flicker softly with AI video
timelines, his hoodie fabric moves slightly. Atmosphere: premium, powerful, calm confidence.
Slow, smooth, luxurious motion. 5 seconds, seamless loop, 4:5 vertical.
```

**Вариант Б — абстрактный фон без человека:**

```
Abstract luxury motion background: dark green-black void (#070905), slow-flowing liquid
glass waves with acid-green (#C8FF00) and mint (#00FF88) iridescent highlights, soft
volumetric glow, tiny glowing particles rising slowly like fireflies, gentle chromatic
aberration on edges. Hypnotic, expensive, calm. Slow seamless loop, 10 seconds, 16:9.
```

**Как вставить видео в hero** — замените `<img>` внутри `.hero__frame` в `index.html`:

```html
<video autoplay muted loop playsinline poster="images/hero.jpg">
  <source src="images/hero.mp4" type="video/mp4" />
</video>
```

И добавьте в `style.css` рядом с `.hero__frame img`:
```css
.hero__frame video {
  border-radius: calc(var(--radius) - 4px);
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}
```

---

## ✅ Чек-лист после генерации

1. `hero.jpg` — заменили, ваше лицо узнаваемо, зелёный свет в кадре
2. `author.jpg` — заменили, тёплый и живой портрет
3. Отзывы в секции «Результаты учеников» — заменили тексты на **реальные** отзывы
4. (опц.) `og-image.jpg` + мета-тег
5. (опц.) `hero.mp4` из Kling 3.0
6. Сжать всё через [squoosh.app](https://squoosh.app) — каждое фото < 300 КБ, иначе сайт будет грузиться медленно и убьёт конверсию
