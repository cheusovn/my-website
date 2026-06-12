# 🎨 Промпты для Nano Banana и Kling 3.0

Дизайн-система сайта: кислотно-зелёный `#C8FF00` + мятный `#00FF88` на глубоком тёмном фоне `#070905`.
Все изображения должны попадать в эту палитру — тогда сайт выглядит как единый дорогой продукт.

**Куда класть файлы:** папка `images/`, имена файлов указаны под каждым промптом.
**Соотношение сторон указано в конце каждого промпта** — продублируйте его и в настройках генерации, если Nano Banana их показывает.

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
IMPORTANT: do not alter, beautify or morph the person's face in any way.
Wearing a premium black hoodie or black blazer over dark t-shirt. Background: dark studio
(#070905) with out-of-focus screens showing AI-generated video timelines, soft volumetric
acid-green (#C8FF00) rim light from the left edge outlining his silhouette, subtle mint-green
(#00FF88) glow reflections. Shallow depth of field, shot on 85mm lens, editorial magazine
quality, dramatic but clean lighting, photorealistic, 8k detail. No text, no watermarks.
Aspect ratio: 4:5 vertical portrait.
```

**Файл:** `images/hero.jpg` · **Соотношение: 4:5** (вертикаль, минимум 1080×1350)
*Сейчас в hero уже подключено ваше видео `hero.mp4` — эта картинка работает как постер
(показывается, пока видео грузится, и на медленном интернете), поэтому она всё равно нужна.
Идеально: сделать её из первого кадра видео.*

---

## 📸 №2 — Портрет для блока «Кто ведёт курс» (нужно ВАШЕ ФОТО)

Второе касание доверия: здесь вы «ближе» к читателю — теплее, человечнее, чем в hero.

> **Прикрепите своё фото** (можно другое, чем для hero — лучше с лёгкой улыбкой).

**Промпт:**

```
Edit this photo: keep this exact person's face 100% identical. Create a warm, approachable
yet premium portrait. IMPORTANT: do not alter, beautify or morph the person's face in any
way. He is sitting relaxed at a modern desk, leaning slightly forward,
genuine friendly smile, making eye contact with camera. Dark stylish casual outfit.
Environment: dark moody workspace, a laptop with glowing acid-green (#C8FF00) interface
visible but blurred in background, warm key light on face, subtle green neon accent light
in background bokeh. Authentic, trustworthy, mentor energy — like a person you'd want to
learn from. 85mm portrait lens look, photorealistic, editorial quality.
No text, no watermarks.
Aspect ratio: 4:5 vertical portrait.
```

**Файл:** `images/author.jpg` · **Соотношение: 4:5** (вертикаль, минимум 1080×1350)

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
background, looking at camera, friendly genuine expression.
If a source photo of a real person is attached: keep that person's face 100% identical,
do not alter, beautify or morph facial features in any way.
No text, no watermarks.
Aspect ratio: 1:1 square.
```

**Файлы:** `images/avatar1.jpg` … `images/avatar5.jpg` · **Соотношение: 1:1** (квадрат, от 200×200)

---

## 📸 №4 — Open Graph картинка для соцсетей (опционально, но желательно)

Когда сайт шерят в Telegram/WhatsApp — превью должно продавать.

**Промпт:**

```
Premium dark landing page social preview banner. Deep near-black green background
(#070905) with subtle grain texture. Bold oversized typography placeholder area on the left,
abstract acid-green (#C8FF00) liquid glass 3D shape on the right with mint (#00FF88) glow,
floating glowing particles, thin neon green border frame. Luxury tech aesthetic, cinematic
lighting, ultra clean composition. No people, no faces. No text, no watermarks
(text will be added later).
Aspect ratio: 16:9 horizontal (target size 1200x630).
```

**Файл:** `images/og-image.jpg` · **Соотношение: 1.91:1** (точный размер 1200×630 — сгенерируйте 16:9 и обрежьте по высоте). После генерации добавьте в `<head>`:
```html
<meta property="og:image" content="images/og-image.jpg" />
```

---

## 📸 №5 — Favicon / логотип-иконка (опционально)

**Промпт:**

```
Minimal premium app icon: bold letter "T" or abstract neural spark symbol, acid-green
(#C8FF00) glowing gradient on deep black-green background (#070905), soft neon glow,
rounded square composition, flat modern design, high contrast, crisp edges.
No people, no faces. No text besides the symbol, no watermarks.
Aspect ratio: 1:1 square (512x512).
```

**Файл:** `images/android-chrome-512x512.png` · **Соотношение: 1:1** (512×512)

---

## 🎬 KLING 3.0 — видео

✅ **`images/hero.mp4` уже залито и подключено в hero** (autoplay, без звука, зациклено,
постер — `hero.jpg`). Промпты ниже — если захотите перегенерировать или добавить ещё.

**Вариант А — оживить hero-картинку (image-to-video):**
скормите Kling 3.0 картинку №1 как первый кадр.

```
Cinematic slow motion: the man stands confidently in a dark studio, subtle camera push-in
(slow dolly forward), acid-green rim light gently pulses and shifts, floating dust particles
drift through volumetric light beams, screens in the background flicker softly with AI video
timelines, his hoodie fabric moves slightly. Atmosphere: premium, powerful, calm confidence.
IMPORTANT: keep the person's face 100% identical to the input image at all times — do not
alter, morph, beautify or distort facial features in any frame.
Slow, smooth, luxurious motion. 5 seconds, seamless loop.
Aspect ratio: 4:5 vertical (если 4:5 недоступно — 9:16, обрежется по высоте автоматически).
```

**Вариант Б — абстрактный фон без человека:**

```
Abstract luxury motion background: dark green-black void (#070905), slow-flowing liquid
glass waves with acid-green (#C8FF00) and mint (#00FF88) iridescent highlights, soft
volumetric glow, tiny glowing particles rising slowly like fireflies, gentle chromatic
aberration on edges. Hypnotic, expensive, calm. Slow seamless loop, 10 seconds.
Aspect ratio: 16:9 horizontal.
```

> 💡 Контейнер видео на сайте — вертикальный **4:5** с `object-fit: cover`: видео любого
> соотношения впишется, лишнее обрежется по краям. Для идеального результата генерируйте
> вертикальное (4:5 или 9:16).

---

## ✅ Чек-лист после генерации

1. `hero.jpg` — постер для видео, ваше лицо узнаваемо, зелёный свет в кадре (4:5)
2. `author.jpg` — тёплый «менторский» портрет (4:5)
3. Отзывы в секции «Результаты учеников» — заменить тексты на **реальные** отзывы
4. (опц.) `og-image.jpg` + мета-тег (1200×630)
5. Сжать фото через [squoosh.app](https://squoosh.app) — каждое < 300 КБ
6. Видео `hero.mp4` сейчас весит ~8 МБ — желательно сжать до 2–3 МБ
   (1080p, H.264, без звука, например через [handbrake.fr](https://handbrake.fr) или any video compressor),
   иначе на мобильном интернете hero будет грузиться медленно и часть посетителей уйдёт
