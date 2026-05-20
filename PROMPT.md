# OBSIDIAN MOTO — Build Prompt

Paste this entire document to Claude / Cursor / any agentic coding assistant as the brief for rebuilding this product page from scratch. It captures everything I learned the hard way iterating on this site, so reading it carefully end-to-end will save the next builder ~10 rounds of trial and error.

---

## 0. WHAT YOU ARE BUILDING

A single-page, scroll-driven product landing for a **fictional premium custom motorcycle brand called "Obsidian Moto"**, headquartered in Berlin, est. 2018. The hero bike on the page is the **Obsidian K7** — a 1923cc V-Twin matte-black bobber with subtle blue rim lighting, limited to 24 hand-built units worldwide, priced at €34,900.

Tone & feel: **Tesla configurator × Apple product page × Harley-Davidson editorial**. Dark, dramatic, luxury. Pure black backgrounds, deep blacks preserved everywhere, blue (#3b82f6) as the single accent. Type is a clash of **Instrument Serif italic** for headlines and **Inter** for UI with **Geist Mono** for technical labels.

The page must feel like a **$50,000 agency website**. Every interaction should have a small reward. Nothing generic.

---

## 1. ASSETS THE USER WILL PROVIDE — CRITICAL READING

You will receive two raw asset packs from the user:

### 1a. A sequential image set
- ~200+ JPG frames of the motorcycle rotating a full 360°.
- Native resolution: 1764×1176, named `ezgif-frame-001.jpg` through `ezgif-frame-211.jpg` (or similar zero-padded sequence).
- Background: **pure black (#000)**. This matters — see §9 (gotchas).
- Subject: matte black custom motorcycle with subtle electric-blue rim lighting on tyres and chrome edges, sitting on a polished glossy floor that creates a reflection in the bottom third of each frame.
- **DO NOT re-encode these JPGs.** They are already at appropriate quality. Re-encoding (even at high q) introduces visible softness on wide displays. **Copy them straight from source into `/public/frames/`**, sampling 60 evenly-spaced frames across the rotation:
  ```bash
  for i in $(seq 1 60); do
    src_idx=$(awk -v i=$i 'BEGIN{printf "%d", 1 + (i-1)*210/59}')
    src=$(printf "assets/source/ezgif-frame-%03d.jpg" $src_idx)
    dst=$(printf "public/frames/f%03d.jpg" $i)
    cp "$src" "$dst"
  done
  ```
- Pick one clean side-view frame (typically frame 1) and copy it to `/public/hero-bike.jpg` as a fallback for ConfigSection.

### 1b. A short MP4 of the same bike rotating 360°
- Source: ~7s, 24fps, 1764×1176, H.264. The video is what the source frames were split from.
- **You MUST re-encode it for scroll scrubbing** before placing in `/public/`. The re-encode forces every frame to be a keyframe so seeking via `video.currentTime = ...` is instant and frame-accurate. Without this, slow scroll stutters because the decoder rebuilds B/P frames on each seek.
  ```bash
  ffmpeg -y -i "source.mp4" \
    -c:v libx264 -preset slow -crf 20 \
    -g 1 -keyint_min 1 \
    -an \
    -pix_fmt yuv420p \
    -movflags +faststart \
    public/bike-rotation.mp4
  ```
- Resulting file: ~9–10 MB. Larger than the original but the only way scrubbing feels buttery.

### 1c. Watermark warning
If the source video / frames have an AI-generation watermark (e.g. "Veo"), crop the watermark off the frames with ffmpeg (`-vf "crop=W:H:X:Y"`) and the video the same way, before any of the steps above. Do NOT try to mask it with CSS — the user will notice.

### 1d. The source `assets/` folder is not committed
Put a `/assets/` line in `.gitignore`. Only the processed outputs in `/public/` go to the repo. The full source assets are typically 150–250 MB which is too big for git.

---

## 2. TECH STACK — EXACT VERSIONS MATTER

| Package | Version | Why |
|---|---|---|
| `next` | **16.x** | App Router, server components, Turbopack dev. **There are breaking changes vs Next 14/15 you may know — when in doubt, read `node_modules/next/dist/docs/` before writing code.** |
| `react` / `react-dom` | **19.x** | Required by Next 16. |
| `tailwindcss` | **v4** | Configured via `@theme` block in `globals.css`, NOT `tailwind.config.js`. |
| `@tailwindcss/postcss` | v4 | PostCSS plugin for Tailwind v4. |
| `framer-motion` | **^12** | `useScroll`, `useTransform`, `useMotionValueEvent`, `useMotionTemplate`, `useSpring`, `useMotionValue`, `useInView`, `AnimatePresence`, `motion.*`. |
| `lenis` | **^1.3** | Smooth scroll wrapper. Works with framer-motion's `useScroll` out of the box. |
| `lucide-react` | **^1.16** | **WARNING: this version strips trademarked brand icons.** No `Instagram`, `Youtube`, `Twitter`, `Facebook`, `Tiktok`. Use semantic substitutes: `Camera` (IG), `PlayCircle` (YT), `AtSign` (X). |
| `clsx` + `tailwind-merge` | latest | For the `cn()` utility. |
| `@radix-ui/react-slot` + `class-variance-authority` | latest | Used by shadcn-ui patterns even if you don't init full shadcn. |

TypeScript strict mode. ESLint via `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.

---

## 3. DESIGN SYSTEM

Define in `src/app/globals.css` via Tailwind v4 `@theme` block:

```css
@import "tailwindcss";

@theme {
  --color-background: #0a0a0a;
  --color-surface: #141414;
  --color-accent: #3b82f6;
  --color-accent-hover: #60a5fa;
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255, 255, 255, 0.7);
  --color-text-muted: rgba(255, 255, 255, 0.4);
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-accent: rgba(59, 130, 246, 0.3);

  --font-sans: var(--font-inter), sans-serif;
  --font-serif: var(--font-instrument-serif), serif;
  --font-mono: var(--font-geist-mono), monospace;
}
```

### Typography rules
- Headlines (`h1`/`h2`): `font-serif italic tracking-[-0.04em] leading-[0.95]`. Always italic. Big.
- Subtitle below italic headline: same serif italic, `text-white/40` (muted second line of every section — this is the brand's visual rhythm).
- Body: `Inter`, weight 300 for prose, 400–500 for UI.
- Eyebrow labels (every section starts with one): `text-[10px] uppercase tracking-[0.3em] text-accent font-mono`. Pattern: `"03 · The Craft"`.
- Technical / monospace text (prices in spec panels, VINs, log lines): `font-mono text-[10px]–[11px]`, uppercase, letter-spacing `0.2–0.3em`.
- Prices: serif italic, large, e.g. `font-serif italic text-4xl tracking-tight`.

### Spacing
- Section vertical padding: `py-28 md:py-44` (very generous — luxury feel).
- Container max-width: 1400–1600px, depending on section.
- Use `container mx-auto px-6 md:px-12` as the standard inner wrapper.

### Easing constant
Use **`[0.16, 1, 0.3, 1]`** (cubic-bezier) as the default `ease` for every entrance animation. Consistency makes the whole site feel like one piece.

### Color palette beyond background
- Card surface: `bg-[#0f0f0f]/80 backdrop-blur-sm`.
- Bike "stage" containers: **`bg-black` (pure #000), not `bg-[#0a0a0a]`** — see §9.
- Borders: `border-white/8` (subtle), `border-accent/30` (selected/active).
- Green (used only for "Available" / "Studio open"): Tailwind `green-400`/`green-500`.
- Red (used only for the ignition button): Tailwind `red-500`/`red-600`/`red-950`.

---

## 4. FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx          # Root layout. Mounts BootSplash + CustomCursor.
│   ├── page.tsx            # Composes the 8 sections + SectionNav.
│   ├── globals.css         # Tailwind v4 @theme + global cursor:none rules.
│   └── favicon.ico
├── components/
│   ├── Header.tsx          # Fixed top nav + live Berlin clock.
│   ├── ScrollShowcase.tsx  # SECTION 1 — scroll-scrubbing MP4 hero. LOCKED.
│   ├── Hero.tsx            # SECTION 2 — 3-col listing layout. LOCKED.
│   ├── BikeViewer.tsx      # Controlled 60-frame drag rotator (used by Hero).
│   ├── SpecsPanel.tsx      # Right column of Hero (used by Hero).
│   ├── BuildSection.tsx    # SECTION 3 — "Built by hand. Not by machine."
│   ├── ConfigSection.tsx   # SECTION 4 — color/exhaust/seat configurator.
│   ├── ReviewsSection.tsx  # SECTION 5 — press cards + marquee logos.
│   ├── StartEngine.tsx     # SECTION 6 — physical ignition button + dealer reveal.
│   ├── FinalCTA.tsx        # SECTION 7 — aurora bg + email form.
│   ├── Footer.tsx          # Big OBSIDIAN wordmark + 4-col links.
│   ├── SmoothScroll.tsx    # Lenis wrapper.
│   └── effects/
│       ├── Reveal.tsx       # whileInView fade+slide wrapper.
│       ├── RevealWords.tsx  # Word-by-word headline stagger.
│       ├── Counter.tsx      # Number tween on first viewport entry.
│       ├── Tilt3D.tsx       # Cursor-following 3D card tilt + gloss.
│       ├── CustomCursor.tsx # Global dot + ring cursor.
│       ├── SectionNav.tsx   # Right-side vertical pip nav (lg+ only).
│       └── BootSplash.tsx   # Intro screen with real preload progress.
├── lib/
│   └── utils.ts             # cn() helper (clsx + tailwind-merge).
public/
├── frames/f001.jpg … f060.jpg   # Hero rotation frames (copied from source).
├── bike-rotation.mp4            # All-keyframe re-encoded scrubber.
└── hero-bike.jpg                # Fallback side-view frame.
```

---

## 5. PAGE COMPOSITION

`src/app/page.tsx`:

```tsx
<SmoothScroll>
  <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-accent/30">
    <Header />
    <div id="showcase">         <ScrollShowcase /></div>
    <div id="configurator-hero"><Hero /></div>
    <div id="craft">            <BuildSection /></div>
    <div id="paint">            <ConfigSection /></div>
    <div id="press">            <ReviewsSection /></div>
    <div id="ignition">         <StartEngine /></div>
    <div id="subscribe">        <FinalCTA /></div>
    <Footer />
    <SectionNav />
  </main>
</SmoothScroll>
```

The wrapper divs carry the section ids so the locked components (`ScrollShowcase`, `Hero`) stay untouched.

`src/app/layout.tsx` body content:

```tsx
<body className={`${fonts} bg-[#0a0a0a]`}>
  <BootSplash />     {/* mounts above everything on first load only */}
  <CustomCursor />   {/* global, hover-capable devices only */}
  {children}
</body>
```

---

## 6. SECTION-BY-SECTION SPEC

### 6.1 Header — `src/components/Header.tsx`

- Fixed top, `z-50`.
- Two states: transparent gradient at top of page, solid `bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5` after `scrollY > 50`.
- **Do NOT use `mix-blend-difference`** on the header text. It looks broken over the hero's blue rim lighting.
- Three regions in the bar:
  1. Brand: `font-serif italic text-2xl` "OBSIDIAN MOTO" + tiny `EST. 2018` letterspaced underneath.
  2. Centre: live status pill — `● Studio open · Berlin · {HH:MM} CET`. Green pulse dot (`bg-green-400` + `animate-ping` halo). Time is `new Date().toLocaleTimeString("en-DE", { timeZone: "Europe/Berlin", ... })`, refreshed every 30s. **Render `--:--` placeholder server-side** to avoid hydration mismatch.
  3. Nav: `Models · Custom Builds · About · Contact` with underline-grow on hover (origin-left scale-x-0 → 100). Cart link with mono `(0)` counter.

### 6.2 ScrollShowcase — `src/components/ScrollShowcase.tsx` **(SECTION 1 — LOCK ONCE WORKING)**

This is the page's WOW moment. **A single `<video>` element is scrubbed by scroll position.** Frames-stack approach was tried and rejected — the user noticed micro-stutters because images are discrete; video is a smooth stream.

- Section height: `260vh`, `bg-black`.
- Inner: `sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center`.
- One `<video ref={videoRef} src="/bike-rotation.mp4" muted playsInline preload="auto">` filling the viewport via `object-contain`.
- Wrap the video in a `motion.div` with a `scale` derived from scroll (`[0, 0.5, 1] → [0.95, 1.02, 0.97]`) — gives the bike a subtle breathing motion.
- Scroll → `video.currentTime` pump:
  - `useScroll({ target: sectionRef, offset: ["start end", "end start"] })` → `scrollYProgress`.
  - In `useMotionValueEvent(scrollYProgress, "change", p => ...)`, map the central 80 % of scroll to the full video duration: `t = clamp((p − 0.1) / 0.8, 0, 1) * video.duration`.
  - **Throttle seeks through `requestAnimationFrame`** — issue at most one seek per repaint. Without rAF coalescing, fast scroll queues seek requests faster than the decoder services them.
  - Only call `video.currentTime = t` if `|video.currentTime − t| > 0.01` to avoid redundant seeks.
  - Wait for `loadedmetadata` before the first seek.
- Three captions rendered as `motion.div`s with `useTransform`-derived opacity + y, ranges:
  - Caption 1 (`[0, 0.05, 0.28, 0.38]`): "Obsidian K7 · 2024" eyebrow + "The blackest / ride." headline + subline.
  - Caption 2 (`[0.36, 0.46, 0.58, 0.68]`): right side, "01 · Powertrain" + "1923cc. / Hand-tuned." + subline.
  - Caption 3 (`[0.64, 0.74, 0.86, 0.96]`): left side, "02 · Finish" + "Matte. Black. / Forever." + subline.
- Bottom scroll-progress strip: `SCROLL TO ROTATE` + 24px line whose `scaleX = scrollYProgress`.

### 6.3 Hero — `src/components/Hero.tsx` **(SECTION 2 — LOCK ONCE WORKING)**

3-column grid that mimics a premium car-dealer listing:

`grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-5 lg:gap-6`

**LEFT (`<aside>` 300px) — Listing card:**
- `bg-[#0f0f0f]/80 backdrop-blur-sm border border-white/8 rounded-2xl p-6`.
- Order: `← BACK TO MODELS` mono link → `● NEW ARRIVAL · 2024` pill → `Obsidian K7` (serif italic h1) → `The blackest ride.` subtitle → `€34,900` (serif italic) + `AVAILABLE` green pill → `Ships in 2 weeks · Hand-built, one of 24` muted line → key info table (Calendar/Bike/Fuel/Settings icons + label + value) → 4 stacked buttons: **Reserve Now (blue gradient, primary)**, Book a Viewing (outlined + Eye icon), Add to Favorites (outlined + Heart), Share this Build (outlined + Share2).

**CENTRE (`1fr`) — Bike viewer stage:**
- Stage container: `relative w-full h-[56vh] md:h-[70vh] rounded-2xl overflow-hidden bg-black border border-white/5`.
- Inside: `<BikeViewer currentFrame={currentFrame} setCurrentFrame={setCurrentFrame} />`.
- Floating UI inside the stage:
  - `DRAG TO ROTATE` pill at top, with `RotateCw` icon.
  - `360°` pill at bottom centre.
- Below the stage:
  - Tab row: `EXTERIOR · DETAILS · ENGINE` (visual-only switch — site only has rotation frames, but the tabs maintain editorial parity with car-dealer references).
  - Thumbnail strip: 8 thumbs spaced through the rotation (frames 1, 9, 17, 24, 31, 38, 45, 53). Clicking a thumb calls `setCurrentFrame(frame)`. Active thumb gets `border-accent ring-2 ring-accent/30 ring-offset-2 ring-offset-[#0a0a0a]`.

**RIGHT (`<aside>` 320px) — `<SpecsPanel />`:**
- Same `bg-[#0f0f0f]/80` card treatment as the left.
- `SPECIFICATIONS` mono header + 9 spec rows with small icons (Cog/Zap/TrendingUp/Gauge/Weight/Fuel/Calendar/Paintbrush/Hash), each `icon · label · value`.
- **Live build status block** below the specs: `● Live · Build Status` pulsing dot, "Production 23 / 24 claimed", animated gradient progress bar (`width: 95.83 %`), bottom row with `🛡 Auth · Verified` and a fake hex signature `Sig 0xA4F2…91C`.
- Three stacked CTAs: **Open Configurator (primary blue gradient + Activity icon)**, Compare Specs (outlined + GitCompare), Technical Datasheet (outlined + Download).

### 6.4 BikeViewer — `src/components/BikeViewer.tsx` *(consumed by Hero)*

Controlled 360° drag viewer. **This is the component most often broken on rebuilds — read carefully.**

- Accept `currentFrame` + `setCurrentFrame` as props. Hero owns the state.
- 60 `<img>` elements stacked absolutely inside one container, only the active one has `opacity: 1`, the rest have `opacity: 0`. **DO NOT swap `src` on a single visible img** — that flickers on slow networks and looks cheap.
- Preload all 60 frames via `new window.Image()` in a `useEffect` so the opacity swap never blocks on decode. Track loaded count; show a tiny `LOADING · {n}%` mono overlay while it's preloading.
- **`mix-blend-mode` and `scale` go on the WRAPPER**, not on each img. That keeps the compositor at one operation per repaint instead of sixty.
- The container has `bg-black` (from Hero) — **so we don't actually need mix-blend-lighten any more** (it was lifting the bike's darks against the previous `#0a0a0a` bg). Stack without blend.
- Pointer interactions:
  - `onPointerDown`: capture pointer, record `startX = e.clientX`, `startFrame = currentFrame`, kill any auto-rotate timer.
  - `onPointerMove`: `frameDelta = Math.round((e.clientX − startX) / 8)`, `next = ((startFrame − frameDelta − 1) % 60 + 60) % 60 + 1`. **RAF-throttle the setCurrentFrame call** — pointermove fires ~200 Hz, you only want to render at 60 Hz.
  - `onPointerUp` / `onPointerCancel`: release capture, restart idle timer.
- Idle auto-rotate: 3s of inactivity → `setInterval` that advances the frame every 80 ms, wrapping at 60.
- A `RotateCw` icon + "Drag to Rotate" caption float on top of the stack (purely decorative — the parent stage shows the same pill).
- Cursor on the container: Tailwind `cursor-grab active:cursor-grabbing`. The custom global cursor reads the computed `cursor` style and adapts to "hover" state automatically.

### 6.5 SpecsPanel — `src/components/SpecsPanel.tsx` *(consumed by Hero)*

See structure under §6.3 RIGHT. The progress bar uses a gradient + an inset shadow: `bg-gradient-to-r from-accent/50 via-accent to-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.6)]`.

### 6.6 BuildSection — `src/components/BuildSection.tsx`

- Eyebrow: `03 · The Craft`.
- Background: `bg-[#0a0a0a]`.
- **Animated vertical accent line** down the left edge of the section — `scaleY` driven by `useScroll` so the line "draws itself" as the user scrolls past.
- Two-column layout:
  - Left column: italic headline using `<RevealWords text="Built by hand." />` and a second line `<RevealWords text="Not by machine." delay={0.2} />` wrapped in `<span className="block text-white/40">`. This "italic line 1 + muted italic line 2" pattern is the brand's headline signature; repeat it across every section.
  - Right column: long-form paragraph (4–5 sentences about hand-assembly, aerospace titanium, hand-laid carbon fiber, proprietary ceramic coating). Below that, 3 stat cards with parallax `y` (subtle, ±40px across the section):
    - `Hammer` · Build time · `<Counter to={6} suffix=" weeks" />`
    - `Layers` · Components · `<Counter to={312} suffix=" parts" />`
    - `Sparkles` · Hand finished · `<Counter to={100} suffix="%" />`
- Each stat card: `bg-[#121212] border border-white/8 rounded-2xl p-6`, hover halo `bg-gradient-to-br from-accent/20 to-transparent` on `group-hover`.

### 6.7 ConfigSection — `src/components/ConfigSection.tsx`

- Eyebrow: `04 · Configurator`.
- Background: `bg-[#0d0d0d] border-y border-white/5`.
- 2-column layout (3/5 + 2/5).
- **Left: bike preview that re-tints on color selection.** The bike is the same hero-bike.jpg, wrapped in a `motion.img` whose `filter` prop animates between CSS filter strings per color.
  - Obsidian Matte: `filter: "none"`.
  - Vantablack: `filter: "brightness(0.88) contrast(1.18) saturate(0)"`. **DO NOT push brightness lower than 0.85 or the bike disappears entirely.** The previous attempt at `0.55` made it invisible. We want it to read as "deeper than matte" without losing form.
  - Gunmetal: `filter: "brightness(1.18) saturate(0.4) contrast(0.95)"`.
  - Cobalt Blue: `filter: "hue-rotate(15deg) saturate(2.2) brightness(0.95)"` — shifts the rim lighting from sky-blue to deeper cobalt.
- Behind the bike, an **ambient color halo** matches the selected paint: a full-section radial-gradient that crossfades via `AnimatePresence mode="sync"` keyed on `color.name`.
- **Right: configurator stack.**
  - Color row: 4 swatch circles. Active swatch has a `border-accent shadow-[0_0_16px_rgba(59,130,246,0.5)]` ring outside the swatch.
  - Exhaust row: 3 wide buttons (`Standard Dual` / `Titanium Slash-cut +€2400` / `Carbon Fiber Racing +€3100`). Active button highlight uses **framer-motion `layoutId`** so the accent fill slides between options like a magic-move.
  - Seat row: 2 wide buttons (`Premium Leather` / `Alcantara Sport +€450`). Same layoutId pattern (different id from exhaust).
  - Total row: `Total` label + €amount that **counts smoothly between previous and new totals** (use `useMotionValue` + `animate(mv, value, { duration: 0.55, ease: [0.16, 1, 0.3, 1] })` + `useTransform(mv, v => Math.round(v).toLocaleString())`).
  - `Proceed to Checkout` button — white → accent on hover, with an arrow that translates right.

### 6.8 ReviewsSection — `src/components/ReviewsSection.tsx`

- Eyebrow: `05 · Press`.
- Background: `bg-[#0a0a0a]`.
- Headline: `What they're saying.` (RevealWords).
- **3 review cards in a row, each wrapped in `<Tilt3D>`.** Each card:
  - `bg-[#121212] border border-white/8 rounded-2xl p-8 md:p-10`.
  - Decorative big `"` opening quote in the top-right corner at `text-[160px] text-white/[0.04]` — visual texture.
  - Star row that staggers in (5 stars pop-in one by one with `type: spring, stiffness: 240, damping: 14`).
  - Italic serif quote.
  - Mono attribution line in `text-accent` + tiny role line beneath in `text-white/40`.
- 3 awards below: `Trophy` / `Award` / `Medal` icons in `bg-accent/10 border border-accent/30` circles, with title + sub.
- **Infinite marquee of press logos** below the awards:
  - Render the logo list TWICE (`[...logos, ...logos]`) and animate `x: ["0%", "-50%"]` with `repeat: Infinity, duration: 32s, ease: "linear"`.
  - Logos are plain uppercase text in `font-mono tracking-[0.3em] text-white/30` — not actual logos (no licensing).
  - Left + right edge fade strips so logos don't appear/disappear abruptly: `bg-gradient-to-r from-[#0a0a0a] to-transparent`.
  - Example list: `MOTOR TREND · RIDE MAGAZINE · CYCLE WORLD · BIKE EXIF · ASPHALT & RUBBER · ROBB REPORT · GQ · WALLPAPER*`.

### 6.9 StartEngine — `src/components/StartEngine.tsx`

This is the page's emotional climax. It replaces the standard "Other Models" grid you'd find on most dealer sites — because Obsidian Moto only sells the K7. The customer's last action on the page is to **press a physical-looking ignition button**, which triggers a state machine that ends with the dealer's contact details.

- Eyebrow: `06 · Ignition`.
- Background: `bg-[#0a0a0a]`, with a **state-driven ambient glow** behind the button: cool-blue radial gradient while idle, warm-red radial gradient once the engine is running.
- Layout: 2-column (text left, button right). Headline: `Start / your engine.` (RevealWords). Body: "One push of the button is the only paperwork. We'll line up financing, a test ride at the workshop, and a build slot in the next quarterly cohort."
- **The button** (this is the hero element of the section — render it with care):
  - 200–224 px diameter.
  - Three concentric layers:
    1. Outer chrome bezel: `bg-gradient-to-br from-zinc-300/30 via-zinc-500/20 to-black/60`, 6 px padding.
    2. Inner barrel: `bg-gradient-to-br from-zinc-900 to-zinc-950`, 12 px padding, with `shadow-[inset_0_8px_16px_rgba(0,0,0,0.7)]` for depth.
    3. Red dome: `bg-gradient-to-b from-red-500 via-red-600 to-red-800`, with `inset` shadows for top highlight + bottom shadow, and an outer `0 0 30px rgba(185,28,28,0.45)` glow.
  - Power icon (`lucide-react`) centred, `text-red-950 strokeWidth={2.5}`.
  - White specular highlight at the top of the dome.
  - States (state machine: `'idle' | 'starting' | 'running'`):
    - **idle**: outer halo pulses on a 2.4s loop, label below says `● Press to start`. Button scales `[1, 1.025, 1]` on the same loop.
    - **starting**: dome turns slightly brighter, halo blooms `[1.05, 1.18, 1.05]` on a 0.6s loop, label says `Igniting…`. The startup log (see below) fills in.
    - **running**: dome turns bright red, halo settles at constant high opacity, **button vibrates** via `motion.div` with `animate={{ x: [0, -1.5, 1.5, -1, 1, 0], y: [...] }}` on a 0.45s linear infinite loop. Label says `✨ Engine running`.
  - On click (idle only): set state to `starting`. After 5 log lines × ~420 ms each + a 450 ms hold, set state to `running`.
- **ECU Telemetry terminal** — always rendered, content depends on state:
  - `bg-black/40 border border-white/8 rounded-xl p-5 font-mono text-[11px]`.
  - Header: `● ECU · LIVE TELEMETRY`.
  - Idle: one line `> awaiting ignition input…` in white/30.
  - Starting / Running: lines fill in one at a time (with `Check` icons):
    - `INITIATING IGNITION SEQUENCE`
    - `FUEL PUMP · OK`
    - `OIL PRESSURE · 4.2 BAR`
    - `ECU HANDSHAKE · OK`
    - `ENGINE RUNNING` *(in `text-red-400` — the climactic line)*
- **Dealer hand-off cards** — 3 cards in a row, **only rendered after state === 'running'**, fade up with stagger. Wrap the group in `<AnimatePresence>` so they unmount cleanly if the engine is somehow reset.
  - `MapPin` · Visit the workshop · `Köpenicker Straße 41` · `10179 Berlin · Mon–Sat 10:00–19:00`.
  - `Phone` · Talk to the builder · `+49 30 5557 2018` · `Mr. Stein answers personally.`
  - `Mail` · Send a request · `build@obsidianmoto.com` · `Reply within the hour, every hour.`
  - Each card: `bg-[#121212] border border-white/10 rounded-2xl p-6` with an accent icon circle, mono label, big serif italic value, small muted sub, and a `Continue →` row at the bottom that lights up to accent on hover.

### 6.10 FinalCTA — `src/components/FinalCTA.tsx`

- Background: `bg-[#0a0a0a]`.
- **Drifting aurora bg** — two large radial-gradient blurred blobs (one accent-blue, one violet at lower opacity) that translate + rotate on slow 18–22s infinite loops. `mix-blend` not needed; rely on blur + opacity.
- **Floating particles** — 18 small `bg-accent` dots positioned via *deterministic* pseudo-random formulas: `left: ${(i * 53) % 100}%`, `top: ${(i * 37) % 100}%`. **Do NOT use `Math.random()`** in render — it causes SSR/CSR hydration mismatch. Each dot pulses opacity + drifts y on its own 4s loop with delay `(i * 0.4) % 6`.
- Drops Quarterly pill: `● Drops Quarterly · 50 builds / year`.
- Headline: `Yours / for the taking.` (RevealWords pattern).
- Body: "Subscribe to be first when new builds drop. No spam, no resale lists. One email per quarter."
- Email form: `bg-black/40 border border-white/15 backdrop-blur-sm` input + `Notify Me` white button that flips to accent on hover.
- 3 stat counters across the bottom: `<Counter to={124} />` Builds shipped · `<Counter to={18} />` Countries · `<Counter to={5} decimals={1} suffix="/5" />` Owner rating.

### 6.11 Footer — `src/components/Footer.tsx`

- Background: `bg-black border-t border-white/10`.
- **Giant brand wordmark** at the top — `font-serif italic text-[14vw] tracking-[-0.05em]` with `bg-gradient-to-b from-white/8 to-white/[0.02] bg-clip-text text-transparent`. Reads "OBSIDIAN" only. Decorative, `aria-hidden`.
- 4-column grid below (`grid-cols-2 md:grid-cols-5`, first col spans 2):
  - Col 1 (2x wide): `Obsidian Moto` brand line + `Est. 2018 · Berlin` mono tag + description paragraph + a row of 4 social icon buttons. **Icons: `Camera` (IG), `PlayCircle` (YT), `AtSign` (X), `Mail`. Lucide 1.16 does NOT ship Instagram / Youtube / Twitter** — these are stripped for trademark reasons. Use the substitutes verbatim.
  - Col 2: Shop links (All Models, Apparel, Parts & Accessories, Gift Cards).
  - Col 3: Custom links (Start a Build, Gallery, Process, FAQ).
  - Col 4: Studio links (About, Press Kit, Careers, Contact).
- All footer links use an `<FooterLink>` component with an underline that grows on hover (`origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`).
- Bottom row: copyright + `● Made with craft` mono badge + Privacy / Terms links.

---

## 7. POLISH TOOLKIT — `src/components/effects/`

These are tiny utility components, each ≤120 lines.

### Reveal
```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
>
```
Used everywhere for entrance fades.

### RevealWords
Split a string on `\n` → lines, then on spaces → words. Each word is wrapped in `<span class="inline-block overflow-hidden">` containing a `<motion.span>` that starts at `y: 100%, opacity: 0` and animates to `y: 0, opacity: 1` with per-word `delay = baseDelay + i * 0.07`. Triggered by `whileInView`. Use everywhere a headline appears.

### Counter
On `useInView`, run a `requestAnimationFrame` loop that tweens `value: 0 → to` over `duration` ms with ease-out cubic (`1 − Math.pow(1 − t, 3)`). Format with `toFixed(decimals)` and a `prefix`/`suffix`.

### Tilt3D
Wraps children in a `motion.div` with `transformStyle: 'preserve-3d'`. Mouse move within the element updates two `motionValue`s (normalised −0.5…0.5). Spring those values to drive `rotateX` (max 8°) and `rotateY` (max 8°). Also expose CSS variables `--gx`/`--gy` so a `bg-[radial-gradient(circle_at_var(--gx)_var(--gy),...)]` highlight tracks the cursor. Reset to 0 on `onMouseLeave`. Used by ReviewsSection.

### CustomCursor
Native cursor hidden globally via `cursor: none` in `globals.css` (gated by `@media (hover: hover) and (pointer: fine)`). Two fixed elements track the mouse:
- A 6 px dot using `useMotionValue` (1:1 follow).
- A 32 px ring using `useSpring(motionValue, { stiffness: 380, damping: 32, mass: 0.6 })` (lagged).
- Both have `mix-blend-difference` so they're visible on any background.
- `pointermove` handler reads `getComputedStyle(target).cursor` to detect hover over interactive elements (`pointer`/`grab`/`grabbing`) or queries closest `button, a, [role='button'], [data-cursor='hover']`. In hover state: ring scales to 1.8, dot scales to 0.4.
- `pointerdown` shrinks ring to 0.85.
- Only enabled after a `useEffect` confirms the media query matches — touch / coarse-pointer devices fall back to the system cursor untouched.

### SectionNav
Vertical right-edge pip nav, `hidden lg:flex`. For each section id, set up an `IntersectionObserver` with thresholds `[0, 0.15, 0.3, 0.5, 0.7, 0.9, 1]`, store the latest intersection ratio per id, and on every update mark the highest-ratio id as `active`. Render a button per section: `[number · label] [line]` where the line is a `motion.span` whose `width` animates from 12 px to 28 px when active and `backgroundColor` flips from white/30 to accent. Click → `el.scrollIntoView({ behavior: "smooth" })`.

### BootSplash
Full-screen overlay shown on first load only:
- Two `motion.div`s for top + bottom curtains (`exit` translates them off-screen with `ease: [0.85, 0, 0.15, 1]`).
- A central column with `EST. 2018 · BERLIN` eyebrow, big serif italic `Obsidian Moto` wordmark, and a 64-wide (md: 80) progress bar that fills with `scaleX = pct`.
- Preload: on mount, kick off 60 `new window.Image()` requests (one per frame) AND one `document.createElement("video")` with `preload = "auto"` and `src = "/bike-rotation.mp4"`. Increment a `loaded` counter on each `onload` / `loadeddata`. Target = 61 (60 frames + 1 video).
- Smooth the percentage so it doesn't jump from 0 % to 80 % on cache hits: `setPct(p => p + (desired − p) * 0.12)` in a RAF loop.
- Safety timeout: after 4 s, force `loaded = target` so a slow network never strands the visitor.
- Once `loaded >= target`, hold a minimum 1100 ms (so the splash feels intentional) then `setVisible(false)`, which triggers the `exit` animations.
- Lock `document.body.style.overflow = "hidden"` while visible.

---

## 8. NON-NEGOTIABLE GOTCHAS — READ TWICE

These were learned by burning iterations. Don't skip.

1. **Bike stage containers must be `bg-black` (#000), not `bg-[#0a0a0a]`.** If the surrounding panel is brighter than the bike's true black, any `mix-blend-lighten` on the bike lifts the bike's darks to that brighter shade and the result looks washed out / grey. Match the bg exactly, or skip `mix-blend-lighten` entirely (when bgs already match, the blend is a no-op anyway).

2. **For scroll-driven rotation, prefer a single `<video>` over an image stack.** A 24fps H.264 stream gives smoother visual motion than discrete JPGs ever can. Re-encode the source with `-g 1 -keyint_min 1` (every frame a keyframe) so seeking is instant. Throttle `video.currentTime` writes through `requestAnimationFrame`.

3. **Image-stack scroll rotation is technically possible but introduces "ticks" on slow scroll.** A crossfade between adjacent frames *seems* like the fix but actually causes a **brightness pulse**: at fr = 0.5 both layers sit at 50 % opacity, the black bg shows through proportionally, the composite dims ~25 %, and the user sees it as the lights blinking. If you must use frames (no MP4 available), use **rounding** (`Math.round(frameMotion)`), accept that slow scroll will tick, and shorten the section / add rest plateaus so the tick window is small.

4. **For the Hero's drag rotation, RAF-throttle `setCurrentFrame`.** `pointermove` fires ~200 Hz; React + the compositor can't keep up if you call `setState` on every event. Coalesce through `requestAnimationFrame` so at most one update lands per browser repaint.

5. **`mix-blend-mode` and `transform: scale` go on the WRAPPER of the frame stack**, not on each img. One compositing op per repaint instead of sixty.

6. **Never `Math.random()` in render.** Particle positions, line offsets, anything that the user might see jitter — derive from a deterministic formula like `(i * 53) % 100` so server-rendered and client-rendered markup match exactly. React 19 + Next 16 will warn loudly on hydration mismatches.

7. **`lucide-react` 1.16 strips trademarked brand icons.** No Instagram, Youtube, Twitter, Facebook, Tiktok, X. Use Camera / PlayCircle / AtSign / Mail / Globe / Share as semantic substitutes. The build will fail with `Export X doesn't exist in target module` if you try to import the brand names.

8. **`useScroll({ target, offset: ["start end", "end start"] })`** means "0 when the section's start hits the viewport's end, 1 when the section's end hits the viewport's start". For sticky-pinned scroll sections of height 200–260vh, this is the standard offset.

9. **For animated CSS filters on a `motion.img`, use `useMotionTemplate`**: `const filter = useMotionTemplate\`blur(\${blurPx}px)\`` and pass `style={{ filter }}`. Setting a string directly won't interpolate.

10. **Custom cursor must be gated behind `(hover: hover) and (pointer: fine)`** media query. Touch devices have no cursor and forcing one breaks tap targets.

11. **Boot splash must lock body scroll** while visible, otherwise users see the page rendering behind the splash on slow connections.

12. **Lenis + Framer Motion `useScroll`** work together out of the box — Lenis updates the real `scrollY` value, framer reads it. Don't try to plumb Lenis's scroll value into framer manually.

13. **Header should NOT use `mix-blend-difference`.** It looked good in early sketches but inverts to red/yellow over the hero's blue rim lighting and reads as broken. Use `bg-gradient-to-b from-[#0a0a0a]/60 to-transparent` at the top of the page, and switch to solid `bg-[#0a0a0a]/80 backdrop-blur-md` after `scrollY > 50`.

14. **The section eyebrow pattern is mandatory.** Every section below ScrollShowcase opens with:
    ```tsx
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
        0X · Section Name
      </span>
      <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-accent/40 to-transparent" />
    </div>
    ```
    It's how the whole page reads as one editorial system.

15. **The headline pattern is also mandatory.** Every section's h2 is two lines, first line white italic + second line muted-white italic:
    ```tsx
    <h2 className="text-5xl md:text-7xl font-serif italic tracking-[-0.04em] leading-[0.95]">
      <RevealWords text={"First line."} />
      <span className="block text-white/40">
        <RevealWords text={"Second line."} delay={0.2} />
      </span>
    </h2>
    ```

16. **First two sections (ScrollShowcase + Hero) are LOCKED once they look right.** They're load-bearing — every other section's visual rhythm is calibrated against them. Resist the urge to "improve" them after the page is otherwise done; it will cascade.

17. **All bike imagery is matte black on a black background.** This is the whole visual premise of the brand. Don't add colored overlays, don't tint with `hue-rotate` unless the user explicitly picks Cobalt Blue in the configurator.

---

## 9. BUILD & DEPLOY

```bash
# install
npm install

# dev
npm run dev          # opens on http://localhost:3000 (or 3001 if 3000 busy)

# production
npm run build
npm run start
```

Deploys to Vercel with zero configuration. The MP4 + 60 JPGs total ~12 MB of static assets in `/public/` — well within Vercel's limits.

---

## 10. ONE-LINER FOR THE AGENT

If you want to drop this to an AI assistant as a single instruction:

> Build a Next.js 16 + Tailwind v4 + Framer Motion 12 single-page landing for a fictional premium custom motorcycle brand called Obsidian Moto, following PROMPT.md exactly. The user will provide a folder of ~200 JPG frames of the bike rotating 360° and a ~7s MP4 of the same rotation. Process the assets per §1 (copy frames straight, re-encode video with `-g 1` for keyframe-on-every-frame scrubbing). Build the 8 sections in §6 in order, leaning on the effects toolkit in §7. Read §8 (gotchas) twice before writing the first line of `BikeViewer.tsx` or `ScrollShowcase.tsx`. Use `[0.16, 1, 0.3, 1]` as the universal easing. Don't `Math.random()` in render. Don't try to "improve" ScrollShowcase or Hero once they work.

That's the whole brief. Go.
