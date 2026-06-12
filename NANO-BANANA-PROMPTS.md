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

---

## 🎬 НОВЫЕ ПРОМПТЫ — Драматическое hero-видео

Все варианты ниже заточены под дизайн сайта: тёмный фон `#070905`,
кислотно-зелёный `#C8FF00`, мятный `#00FF88`. Соотношение для hero — **4:5 вертикаль**.

> **Совет по инструменту:**  
> — Kling 3.0 — если хотите сохранить своё лицо (прикрепите фото как reference)  
> — Veo 3 — лучшие спецэффекты и кинематографичность, но лицо может измениться  
> — Runway Gen-3 — хорош для камерных движений и магических переходов

---

### 🌀 ВАРИАНТ 1 — «Падение в цифровой мир» *(самый вау)*

> Человек падает сквозь экран в бездонный цифровой универс — как Neo в Матрице,
> только вместо кода — AI-инструменты и нейросетевые огни.

**Kling 3.0 / Veo 3 (text-to-video):**

```
Cinematic vertical video, 4:5 aspect ratio. A confident young man in a premium
black hoodie free-falls backwards through a glowing digital void. He smiles slightly,
arms slightly spread — calm, not scared — like he OWNS this world.

Environment: deep black-green void (#070905). Thousands of acid-green (#C8FF00)
and mint (#00FF88) particles, digits, and glowing UI fragments rush past him
upward as he falls deeper. Glowing text labels float by: "ChatGPT", "Midjourney",
"Kling 3.0", "Veo 3" — they fade in and dissolve like falling stars. Neon green
constellation lines connect particles around him.

Camera: slow-motion (120fps feel), starts wide then slowly pushes into a close-up
of his face — confident, slight smile, looking straight at camera as he falls deeper
into the glow. His hoodie and hair move in the wind of the fall.

Lighting: strong acid-green rim light outlining his silhouette from below (as if
light is coming FROM the void he's falling into). His face is lit by the green glow.

Mood: epic, powerful, cinematic. Like entering another dimension with full confidence.
Duration: 6 seconds. Seamless loop possible.
Aspect ratio: 4:5 vertical portrait.
No text overlays, no watermarks.
```

---

### ✨ ВАРИАНТ 2 — «Магическое призывание нейросетей»

> Человек стоит, делает жест рукой — и вокруг него материализуются
> логотипы/интерфейсы AI-инструментов как магические артефакты.

**Kling 3.0 (image-to-video, прикрепите фото):**

```
Cinematic slow-motion: the man stands in a dark studio, raises one hand slowly
with quiet confidence. As his hand rises, glowing acid-green (#C8FF00) particles
spiral outward from his palm like summoning a spell.

From the swirling particles, holographic UI panels materialize floating in the air
around him: glowing screens showing AI-generated images, video timelines, neural
network nodes. The panels orbit him slowly like planets.

Camera: starts on his face (calm, powerful expression), slowly pulls back to reveal
all the floating holograms. Dramatic push-in on hand when particles first burst.

Lighting: only light source is the green glow from his hand and the holograms —
deep shadows everywhere else. His face intermittently lit by the shifting green light.
Volumetric light rays through the particle cloud.

IMPORTANT: keep the person's face 100% identical to the reference photo.
Do not alter, morph or beautify facial features in any frame.

Mood: wizard meets tech visionary. Magical but grounded.
Duration: 5 seconds. Seamless loop.
Aspect ratio: 4:5 vertical portrait.
```

---

### 🚀 ВАРИАНТ 3 — «Полёт сквозь нейросеть»

> Вид от первого лица или полубоку — человек несётся сквозь
> светящийся тоннель из частиц и нейросетевых узлов.

**Veo 3 (text-to-video, лучшие эффекты):**

```
First-person cinematic shot: flying at incredible speed through a glowing neural
network tunnel. The tunnel is made of acid-green (#C8FF00) and mint (#00FF88)
light nodes connected by neon lines — like the inside of an AI brain.

As we fly through, nodes pulse and fire with electric sparks. The walls of the
tunnel breathe and expand. Speed blur on the sides, sharp in the center.

Halfway through: the tunnel opens into a vast infinite space — a person (young man,
black hoodie) standing at the center of this universe, glowing from within, arms
slightly raised, looking straight at camera.

Camera: rushes toward him and stops just at his face — dramatic smash cut to slow-mo
as we reach him, his expression is calm, powerful, knowing.

Background behind him: infinite dark void with slowly rotating particle galaxy,
acid-green constellation lines, tiny glowing fireflies.

Color grade: deep dark greens and blacks, with electric neon green highlights.
Anamorphic lens flares. Film grain overlay.

Mood: entering the future. Power. Freedom. The person who figured it out.
Duration: 7 seconds.
Aspect ratio: 4:5 vertical portrait.
```

---

### 💥 ВАРИАНТ 4 — «Реальность разлетается» *(минималистичный)*

> Человек стоит — и вокруг него реальность буквально разламывается,
> открывая цифровой мир внутри.

**Runway Gen-3 Alpha / Kling 3.0:**

```
Cinematic split: a man stands confidently in frame, facing camera, slight smile.
Suddenly, reality CRACKS around him — like a broken screen — and through the cracks,
blinding acid-green (#C8FF00) light pours in.

The cracks spread outward from him at the center. Shards of the "normal world"
peel away and dissolve into glowing green particles, revealing a dark premium studio
behind (#070905) with pulsing neon light.

He doesn't flinch. He looks at camera the whole time — he CAUSED this.

Camera: locked off, no movement. Let the environment explode around him while he
stays perfectly still. Then slow push-in to his face as the last shards dissolve.

Lighting: before crack — flat studio light. After crack — dramatic green rim light
from behind outlines his silhouette. His face lit by the green glow from cracks.

IMPORTANT: keep the person's face 100% identical to the reference photo at all times.

Mood: "I know what I'm doing and it changes everything."
Duration: 5 seconds.
Aspect ratio: 4:5 vertical portrait.
```

---

### 🌊 ВАРИАНТ 5 — «Абстракция без лица» *(безопасный вариант, не нужно фото)*

> Если не хотите своё лицо в видео — этот вариант всё равно
> создаёт ощущение магии и движения для hero.

**Любой инструмент:**

```
Abstract luxury motion: point of view falling upward through a vast digital cosmos.
Thousands of acid-green (#C8FF00) and mint (#00FF88) glowing orbs rush past downward
like stars at warp speed. Neural network lines connect and disconnect in real-time,
forming constellations that spell out AI tool names before dissolving.

In the center: a single bright acid-green portal — a circle of pure light — getting
closer as we fall toward it. Around the portal, tiny fragments of AI-generated images
orbit like cosmic debris: product photos, cinematic shots, social media graphics.

Halfway: we pass through the portal — flash of white — then the void on the other side
is calm, particles floating gently, single glowing text cursor blinking.

Camera: immersive first-person. Starts fast, slows down as we reach the portal.
Color: deep dark-green palette, neon acid-green accents, chromatic aberration on edges.
Film grain. Anamorphic bokeh.

Mood: entering the future. The beginning of something. Inevitable.
Duration: 8 seconds. Seamless loop.
Aspect ratio: 4:5 vertical portrait.
```

---

### 📋 Рекомендация для hero-сайта

| Вариант | Инструмент | Нужно фото? | Вау-фактор | Конверсия |
|---------|-----------|-------------|------------|-----------|
| 1 — Падение | Veo 3 | Нет | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 2 — Магия рук | Kling 3.0 | ✅ Да | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 3 — Полёт | Veo 3 | Нет | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 4 — Реальность | Runway | ✅ Да | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 5 — Абстракция | Любой | Нет | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Лучший для конверсии:** Вариант 1 «Падение» — создаёт ощущение входа в новый мир,
метафора курса ("через 7 дней ты в другом измерении"). Можно без фото.

**Лучший с лицом:** Вариант 2 «Магия рук» — вы выглядите как эксперт, который буквально
призывает AI-инструменты. Очень сильный образ для продажи.

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
