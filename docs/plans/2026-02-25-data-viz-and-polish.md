# Data Visualization & Micro-Interactions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add D3.js data visualizations tailored to each athlete's story, and layer in atmosphere, transition choreography, and ambient motion to make the app feel alive.

**Architecture:** Extend the existing React + Framer Motion + CSS Modules stack with D3.js for bespoke SVG visualizations. Ambient motion uses CSS animations for continuous loops and Framer Motion for interactive/event-driven motion. The athlete data model expands with verified Olympic data and per-athlete visualization config. All changes are additive — existing component contracts are preserved.

**Tech Stack:** React 19, TypeScript, Framer Motion 12, D3.js (new), CSS Modules, Vite 7

**Design docs:**
- `docs/design/data-visualization-design.md` — Verified data inventory, viz mapping, accuracy protocol
- `docs/design/micro-interactions-design.md` — Atmosphere, choreography, ambient motion specs

---

## Phase 1: Foundation

### Task 1: Install D3.js and add base types

**Files:**
- Modify: `package.json`
- Create: `src/types/viz.ts`

**Step 1: Install D3**

```bash
npm install d3
npm install -D @types/d3
```

**Step 2: Create shared visualization types**

Create `src/types/viz.ts`:

```typescript
/** Source citation for a data point */
export interface DataSource {
  label: string;       // e.g. "Olympics.com", "ESPN"
  url: string;         // full URL to article
}

/** A single bar in a comparative chart */
export interface BarDatum {
  label: string;
  value: number;
  unit?: string;
  highlight?: boolean; // gold accent for the athlete
}

/** A radial gauge segment */
export interface GaugeDatum {
  label: string;
  value: number;
  max: number;
  unit?: string;
}

/** A point on a timeline */
export interface TimelineDatum {
  year: number;
  label: string;
  medal?: "gold" | "silver" | "bronze";
  isHighlight?: boolean;
}

/** Per-athlete sky theme colors */
export interface SkyTheme {
  deep: string;
  mid: string;
  pale: string;
}
```

**Step 3: Verify build**

```bash
npx tsc --noEmit
```

Expected: No errors.

**Step 4: Commit**

```bash
git add package.json package-lock.json src/types/viz.ts
git commit -m "feat: install d3 and add visualization types"
```

---

### Task 2: Extend athlete data model with verified Olympic data

**Files:**
- Modify: `src/data/athletes.ts`
- Reference: `docs/design/data-visualization-design.md` for all data values and sources

**Step 1: Extend the Athlete interface**

Add new fields to the existing `Athlete` interface in `src/data/athletes.ts`:

```typescript
import type { DataSource, SkyTheme } from "../types/viz";

export interface Athlete {
  // ... existing fields unchanged ...

  /** Expanded verified data for visualizations */
  vizData: AthleteVizData;

  /** Sky gradient theme when this athlete's story is open */
  skyTheme: SkyTheme;

  /** Data sources for this athlete's stats */
  sources: DataSource[];
}
```

Define `AthleteVizData` as a discriminated union — each athlete has a different shape:

```typescript
export type AthleteVizData =
  | BraathenVizData
  | HughesVizData
  | LiuVizData
  | MeyersTaylorVizData
  | KlaeboVizData
  | ChoiVizData;

interface BraathenVizData {
  type: "braathen";
  run1Time: string;              // "1:13.92"
  combinedTime: string;          // "2:25.00"
  competitors: { name: string; margin: string }[];
  run1MarginNote: string;        // "Largest Run 1 margin since 1988"
  droughtYears: number;          // 102
  droughtEditions: number;       // 26
}

interface HughesVizData {
  type: "hughes";
  finalScore: { usa: number; canada: number; overtime: boolean };
  goals: { period: string; scorer: string; team: "USA" | "CAN"; time?: string; assist?: string }[];
  shots: { total: { usa: number; canada: number }; p2: { usa: number; canada: number } };
  hellebuyck: { saves: number; shotsAgainst: number; savePercentage: number; slotSaves: number };
  penaltyKill: { successful: number; total: number };
  hughesTournament: { goals: number; assists: number; points: number; games: number };
  droughtYears: number;          // 46
}

interface LiuVizData {
  type: "liu";
  totalScore: number;            // 226.79
  silverScore: number;           // 224.90
  silverName: string;            // "Sakamoto Kaori"
  afterShortProgram: number;     // 3 (position)
  finalPosition: number;         // 1
  droughtYears: number;          // 24
  droughtLastWinner: string;     // "Sarah Hughes"
  droughtLastYear: number;       // 2002
}

interface MeyersTaylorVizData {
  type: "meyers-taylor";
  totalTime: string;             // "3:57.93"
  silverMargin: string;          // "+0.04"
  bronzeMargin: string;          // "+0.12"
  heat4Time: string;             // "59.51"
  trailedThrough: string;       // "Heats 1-3"
  age: number;                   // 41
  careerMedals: { year: number; city: string; event: string; medal: "gold" | "silver" | "bronze" }[];
  totalMedalCount: { gold: number; silver: number; bronze: number };
}

interface KlaeboVizData {
  type: "klaebo";
  events2026: { event: string; margin?: string; marginNote?: string }[];
  goldsByGames: { year: number; city: string; golds: number }[];
  careerGolds: number;           // 11
  previousRecord: { holder: string; golds: number; year: number };
  allTimeWinterRecord: { holders: string[]; golds: number };
}

interface ChoiVizData {
  type: "choi";
  runs: { run: number; score: number | null; note?: string }[];
  competitors: { name: string; bestScore: number; medal: "gold" | "silver" | "bronze" }[];
  ageYears: number;              // 17
  ageDays: number;               // 101
}
```

**Step 2: Populate each athlete's vizData, skyTheme, and sources**

Fill in verified data from `docs/design/data-visualization-design.md`. Sky themes from `docs/design/micro-interactions-design.md` section 1.2:

```typescript
// Sky themes per athlete
// Braathen: warm golden horizon
skyTheme: { deep: "#2A3D52", mid: "#5A8A6A", pale: "#E8D5A0" }

// Hughes: cooler blue-steel
skyTheme: { deep: "#152840", mid: "#3A6890", pale: "#B0C8D8" }

// Liu: soft rose undertone
skyTheme: { deep: "#1E3050", mid: "#4A7898", pale: "#D8C0C8" }

// Meyers Taylor: warm amber
skyTheme: { deep: "#2A3040", mid: "#5A7A70", pale: "#D8C8A0" }

// Klaebo: deeper Nordic blue
skyTheme: { deep: "#101830", mid: "#305888", pale: "#A8C0D8" }

// Choi: warm red-pink at horizon
skyTheme: { deep: "#201838", mid: "#4A6890", pale: "#D8B8C0" }
```

Each athlete gets a `sources` array with `{ label, url }` objects matching the data-viz design doc.

**Step 3: Verify build**

```bash
npx tsc --noEmit
```

Expected: No errors. All components consuming `Athlete` may need minor updates if fields are now required — check and fix any type errors.

**Step 4: Commit**

```bash
git add src/data/athletes.ts src/types/viz.ts
git commit -m "feat: extend athlete data model with verified Olympic data and sky themes"
```

---

### Task 3: Add CSS tokens for new animations

**Files:**
- Modify: `src/styles/tokens.css`

**Step 1: Add animation and atmosphere tokens**

Append to `src/styles/tokens.css`:

```css
/* Atmosphere transitions */
--sky-transition: 2s ease-in-out;
--sky-transition-close: 1.5s ease-in-out;

/* Ambient animation durations */
--aurora-duration: 20s;
--rings-pulse-duration: 4s;
--title-shimmer-interval: 10s;
--title-shimmer-sweep: 2s;
--mountain-breathe-duration: 8s;

/* Snow modulation */
--snow-speed: 1;

/* Stagger timing */
--panel-stagger: 100ms;
--panel-fade-duration: 400ms;
```

Also add `transition` to the existing sky properties on `:root` so they animate when changed dynamically:

```css
:root {
  /* ... existing properties ... */
  transition: --sky-deep var(--sky-transition),
              --sky-mid var(--sky-transition),
              --sky-pale var(--sky-transition);
}
```

Note: CSS custom property transitions require `@property` registration. Add at top of tokens.css:

```css
@property --sky-deep { syntax: '<color>'; inherits: true; initial-value: #1B3A5C; }
@property --sky-mid { syntax: '<color>'; inherits: true; initial-value: #4A7FA5; }
@property --sky-pale { syntax: '<color>'; inherits: true; initial-value: #C4DCE8; }
```

**Step 2: Verify dev server renders correctly**

```bash
npm run dev
```

Open browser — confirm no visual regressions. Existing styles should be unchanged.

**Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: add CSS tokens for animations and atmosphere transitions"
```

---

## Phase 2: Ambient Motion (CSS-only, low risk)

### Task 4: Aurora light sweep

**Files:**
- Modify: `src/components/AlpineLandscape.tsx`
- Modify: `src/components/AlpineLandscape.module.css`

**Step 1: Add aurora element to AlpineLandscape.tsx**

Insert a `<div className={styles.aurora} />` between the sky gradient and the first mountain SVG layer.

**Step 2: Add CSS animation**

In `AlpineLandscape.module.css`:

```css
.aurora {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.06) 40%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.06) 60%,
    transparent 100%
  );
  background-size: 30% 100%;
  background-repeat: no-repeat;
  animation: auroraSweep var(--aurora-duration, 20s) linear infinite;
  pointer-events: none;
}

@keyframes auroraSweep {
  0% { background-position: -30% 0; }
  100% { background-position: 130% 0; }
}
```

**Step 3: Visual check**

Open dev server. Confirm: a very subtle light band drifts across the sky every ~20s. It should be barely noticeable — felt, not seen.

**Step 4: Commit**

```bash
git add src/components/AlpineLandscape.tsx src/components/AlpineLandscape.module.css
git commit -m "feat: add aurora light sweep to alpine landscape"
```

---

### Task 5: Olympic rings pulse

**Files:**
- Modify: `src/components/OlympicRings.module.css`

**Step 1: Add pulse animation to the glow element**

The `.glow` div in `OlympicRings.module.css` currently has a static gold radial gradient at 12% opacity. Add a breathing animation:

```css
.glow {
  /* ...existing styles... */
  animation: ringsPulse var(--rings-pulse-duration, 4s) ease-in-out infinite;
}

@keyframes ringsPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}
```

**Step 2: Visual check**

Confirm: gold glow gently breathes. Subtle, not distracting.

**Step 3: Commit**

```bash
git add src/components/OlympicRings.module.css
git commit -m "feat: add breathing pulse to Olympic rings glow"
```

---

### Task 6: Title shimmer

**Files:**
- Modify: `src/components/TitleLockup.tsx`
- Modify: `src/components/TitleLockup.module.css`

**Step 1: Add shimmer CSS**

Target only the "FIRST LIGHT" text (the `.title` class). Use `background-clip: text` with an animated gradient:

```css
.title {
  /* ...existing styles... */
  background: linear-gradient(
    90deg,
    var(--ice-white) 0%,
    var(--ice-white) 40%,
    rgba(255, 255, 255, 1) 50%,
    var(--ice-white) 60%,
    var(--ice-white) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleShimmer 12s ease-in-out infinite;
}

@keyframes titleShimmer {
  0%, 80% { background-position: 200% 0; }
  90% { background-position: -200% 0; }
  100% { background-position: -200% 0; }
}
```

The animation holds for ~80% of the cycle (idle), then sweeps over ~10%, then holds again. This creates the "every ~10s" effect.

**Step 2: Visual check**

Confirm: "FIRST LIGHT" gets a subtle light sweep every ~12s. The highlight band should be barely brighter than the base text.

**Step 3: Commit**

```bash
git add src/components/TitleLockup.tsx src/components/TitleLockup.module.css
git commit -m "feat: add shimmer effect to FIRST LIGHT title"
```

---

### Task 7: Mountain breathing

**Files:**
- Modify: `src/components/AlpineLandscape.module.css`

**Step 1: Add breathing animation to the near mountain layer**

Identify the CSS class for the nearest (front) mountain layer. Add:

```css
.mountainNear {
  /* ...existing styles... */
  animation: mountainBreathe var(--mountain-breathe-duration, 8s) ease-in-out infinite;
}

@keyframes mountainBreathe {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1.5px); }
}
```

If the mountain layers are rendered via inline SVG without CSS classes, add a className to the nearest `<svg>` or `<polygon>` wrapper in `AlpineLandscape.tsx` and target that.

**Step 2: Visual check**

Confirm: the nearest mountain gently oscillates ~1.5px vertically. Far and mid mountains stay still. Effect should be almost imperceptible.

**Step 3: Commit**

```bash
git add src/components/AlpineLandscape.tsx src/components/AlpineLandscape.module.css
git commit -m "feat: add breathing animation to near mountain layer"
```

---

### Task 8: Snowflake depth of field

**Files:**
- Modify: `src/components/Snowfall.tsx`

**Step 1: Add depth layer to flake generation**

Modify `generateFlakes` to assign each flake a `depth` (0–1) that affects its visual properties:

```typescript
interface Flake {
  // ...existing fields...
  depth: number;     // 0 = far background, 1 = close foreground
  blur: number;      // 0 or 1px based on depth
}

function generateFlakes(count: number): Flake[] {
  return Array.from({ length: count }, (_, i) => {
    // Distribution: ~60% background, ~30% mid, ~10% foreground
    const rand = Math.random();
    const depth = rand < 0.6 ? Math.random() * 0.3
                : rand < 0.9 ? 0.3 + Math.random() * 0.4
                : 0.7 + Math.random() * 0.3;

    return {
      id: i,
      x: Math.random() * 100,
      size: 1 + depth * 4,                          // 1-5px based on depth
      opacity: 0.15 + depth * 0.6,                  // 0.15-0.75
      duration: 18 - depth * 12,                     // far: ~18s, close: ~6s
      delay: Math.random() * 10,
      drift: (-20 + Math.random() * 40) * (0.5 + depth * 0.5),
      depth,
      blur: depth < 0.3 ? 1 : 0,                    // blur far flakes
    };
  });
}
```

**Step 2: Apply depth properties to rendering**

Update the flake `motion.div` style to include `filter: blur(${f.blur}px)` for far flakes.

**Step 3: Visual check**

Confirm: snow now has visible depth — some flakes are large/sharp/fast (foreground), most are tiny/soft/slow (background). More atmospheric than before.

**Step 4: Commit**

```bash
git add src/components/Snowfall.tsx
git commit -m "feat: add depth of field to snowflakes"
```

---

### Task 9: Enhanced avatar idle drift

**Files:**
- Modify: `src/components/AthleteOrbit.tsx`

**Step 1: Enhance animation with rotation and x-drift**

Update the `motion.div` animate prop for each avatar slot. Add rotation and x-axis oscillation with prime-number-based periods to avoid synchronization:

```typescript
const periods = [
  { yDur: 3.7, xDur: 7.1, rotDur: 5.3, yAmp: 6, xAmp: 2 },
  { yDur: 4.1, xDur: 6.7, rotDur: 4.7, yAmp: 5, xAmp: 1.5 },
  { yDur: 3.3, xDur: 7.9, rotDur: 5.9, yAmp: 7, xAmp: 2.5 },
  { yDur: 4.3, xDur: 6.3, rotDur: 5.1, yAmp: 4, xAmp: 1.8 },
  { yDur: 3.9, xDur: 7.3, rotDur: 4.3, yAmp: 5.5, xAmp: 2.2 },
  { yDur: 4.7, xDur: 6.1, rotDur: 5.7, yAmp: 6.5, xAmp: 1.6 },
];
```

Apply to each avatar's `animate` prop:
- `y: [pos.y, pos.y - periods[i].yAmp, pos.y]` — varied amplitude
- `x: [pos.x, pos.x + periods[i].xAmp, pos.x - periods[i].xAmp, pos.x]` — gentle lateral drift
- `rotate: [0, 1.5, 0, -1.5, 0]` — subtle rotation

Each property gets its own `transition` with mismatched durations so the patterns never synchronize.

**Step 2: Visual check**

Confirm: avatars now float with individual character — slightly different amplitudes, gentle rotation, lateral drift. Feels organic, not mechanical.

**Step 3: Commit**

```bash
git add src/components/AthleteOrbit.tsx
git commit -m "feat: enhance avatar idle drift with rotation and varied timing"
```

---

## Phase 3: Atmosphere & Depth

### Task 10: Parallax cursor tracking on mountain layers

**Files:**
- Modify: `src/components/AlpineLandscape.tsx`
- Modify: `src/components/AlpineLandscape.module.css`

**Step 1: Add mouse tracking with Framer Motion**

In `AlpineLandscape.tsx`, use `useMotionValue` and `useTransform` to create parallax offsets:

```typescript
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const mouseX = useMotionValue(0.5); // normalized 0-1

// Track mouse in the app root or this component
useEffect(() => {
  const handler = (e: MouseEvent) => mouseX.set(e.clientX / window.innerWidth);
  window.addEventListener("mousemove", handler);
  return () => window.removeEventListener("mousemove", handler);
}, []);

// Spring-smoothed for gentle lag
const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });

// Layer offsets (centered at 0 when mouse is at center)
const farX = useTransform(smoothX, [0, 1], [5, -5]);
const midX = useTransform(smoothX, [0, 1], [12, -12]);
const nearX = useTransform(smoothX, [0, 1], [20, -20]);
```

**Step 2: Wrap each mountain SVG in motion.div**

Replace static `<svg>` wrappers (or add wrappers) for each mountain layer with `<motion.div style={{ x: farX }}>`, `<motion.div style={{ x: midX }}>`, `<motion.div style={{ x: nearX }}>`.

The sky gradient and snow field stay unaffected (no wrapper).

**Step 3: Visual check**

Move mouse slowly across viewport. Confirm: near mountains shift most (~20px), far mountains barely move (~5px). Sky stays fixed. Motion should feel smooth and springy, not jittery.

**Step 4: Commit**

```bash
git add src/components/AlpineLandscape.tsx src/components/AlpineLandscape.module.css
git commit -m "feat: add parallax cursor tracking to mountain layers"
```

---

### Task 11: Athlete-themed sky color shifts

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/AlpineLandscape.tsx`

**Step 1: Pass sky theme from App to AlpineLandscape**

In `App.tsx`, derive the current sky theme from the selected athlete:

```typescript
const skyTheme = selectedAthlete?.skyTheme ?? null;
```

Pass `skyTheme` as a prop to `<AlpineLandscape />`.

**Step 2: Apply dynamic CSS custom properties**

In `AlpineLandscape.tsx`, when `skyTheme` is provided, set CSS custom properties on the container:

```typescript
const skyStyle = skyTheme ? {
  '--sky-deep': skyTheme.deep,
  '--sky-mid': skyTheme.mid,
  '--sky-pale': skyTheme.pale,
} as React.CSSProperties : {};
```

Apply to the root div. With the `@property` registrations from Task 3, these will animate automatically.

**Step 3: Visual check**

Click each athlete. Confirm: sky subtly shifts color over ~2s. Each athlete has a distinct mood. On close, sky returns to default.

**Step 4: Commit**

```bash
git add src/App.tsx src/components/AlpineLandscape.tsx
git commit -m "feat: add athlete-themed sky color shifts"
```

---

### Task 12: Snow intensity modulation

**Files:**
- Modify: `src/components/Snowfall.tsx`
- Modify: `src/App.tsx`

**Step 1: Accept a speed prop in Snowfall**

Add `speed?: number` prop (default 1) to `Snowfall`. Multiply each flake's `duration` by `1 / speed` so lower speed = slower fall.

Since Framer Motion's `animate` transition duration is set at mount, the cleanest approach is to use the `speed` prop to adjust the CSS `animation-duration` via a wrapper or to re-key the component. Alternatively, control via a CSS custom property `--snow-speed` and use CSS animations instead of Framer Motion for the fall.

Consider which approach is cleanest given the current Framer Motion implementation. If re-keying is simplest, pass `key={speed}` to force remount when speed changes (acceptable since snow is decorative).

**Step 2: Set speed based on view state**

In `App.tsx`, pass `speed={selectedAthlete ? 0.3 : 1}` to `<Snowfall />` (via `<AlpineLandscape />`).

**Step 3: Visual check**

Open a story panel. Confirm: snow slows dramatically. Close panel — snow returns to normal speed.

**Step 4: Commit**

```bash
git add src/components/Snowfall.tsx src/App.tsx src/components/AlpineLandscape.tsx
git commit -m "feat: modulate snow speed based on view state"
```

---

## Phase 4: Transition Choreography

### Task 13: Enhanced avatar hero flight

**Files:**
- Modify: `src/components/AvatarCard.tsx`
- Modify: `src/components/AthleteOrbit.tsx`
- Modify: `src/components/StoryPanel.tsx`

**Step 1: Tune layoutId spring config**

The `layoutId` shared element transition already exists on AvatarCard's `.ring` element. Enhance the `layout` transition config:

```typescript
<motion.div
  layoutId={`avatar-${athlete.id}`}
  layout
  transition={{
    layout: { type: "spring", stiffness: 280, damping: 30, mass: 0.8 }
  }}
  // ...existing props
>
```

**Step 2: Add scatter animation to non-selected avatars in AthleteOrbit**

When `selectedId` is set, the non-selected avatars should briefly scatter outward before the view transitions. Pass `selectedId` as a prop to `AthleteOrbit`. For non-selected avatars, animate:
- `opacity: 1 → 0.4`
- `scale: 1 → 0.9`
- Add 20px outward drift from center

Use Framer Motion's `animate` prop conditionally based on whether the avatar matches `selectedId`.

**Step 3: Visual check**

Click an athlete. Confirm: the clicked avatar flies smoothly to the story panel while others scatter and fade. The flight should feel snappy (~300ms) with a natural spring.

**Step 4: Commit**

```bash
git add src/components/AvatarCard.tsx src/components/AthleteOrbit.tsx src/components/StoryPanel.tsx
git commit -m "feat: enhance avatar hero flight with scatter and tuned springs"
```

---

### Task 14: Staggered panel content reveal

**Files:**
- Modify: `src/components/StoryPanel.tsx`
- Modify: `src/components/StoryPanel.module.css`

**Step 1: Replace current stagger with refined sequence**

Current implementation uses `staggerChildren: 0.06` on all children uniformly. Replace with explicit delay groups for more cinematic pacing per the design doc section 2.2:

```typescript
const staggerDelays = {
  name: 0,
  headline: 0.1,
  achievement: 0.2,
  stats: 0.32,     // D3 viz will slot in here
  story: 0.5,
  counter: 0.6,
  sources: 0.7,
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};
```

Apply `custom={staggerDelays.name}` etc. to each `motion.div` child so each section has explicit timing.

**Step 2: Visual check**

Open a story panel. Confirm: content layers in sequentially — name appears first, then headline, then achievement, then stats, then story, then counter. Total reveal ~700ms. Each layer fades up 12px.

**Step 3: Commit**

```bash
git add src/components/StoryPanel.tsx src/components/StoryPanel.module.css
git commit -m "feat: refine staggered panel content reveal timing"
```

---

### Task 15: Story-to-story crossfade

**Files:**
- Modify: `src/components/StoryView.tsx`
- Modify: `src/components/StoryPanel.tsx`

**Step 1: Keep panel persistent, only transition content**

Currently `StoryView` uses `AnimatePresence mode="wait"` on `StoryPanel`, keyed by athlete ID. This causes the entire panel (including frosted glass) to exit and re-enter.

Refactor so the frosted glass container is always mounted while in story view. Only the inner content swaps via `AnimatePresence`:

```tsx
// StoryView.tsx
<div className={styles.panel}>
  {/* Frosted glass container — always present */}
  <AnimatePresence mode="wait">
    <StoryPanelContent key={athlete.id} athlete={athlete} />
  </AnimatePresence>
</div>
```

**Step 2: Add exit animation**

Content exit: `opacity: 0, y: -8` over 200ms. Content enter: reuse the stagger from Task 14 but compressed (start delays at 0 instead of waiting for panel entrance).

**Step 3: Visual check**

Click athletes in mini-hub rapidly. Confirm: frosted glass stays put, only content cross-fades. No panel slide animation between athletes. Feels fast and fluid.

**Step 4: Commit**

```bash
git add src/components/StoryView.tsx src/components/StoryPanel.tsx
git commit -m "feat: persistent panel with content-only crossfade between athletes"
```

---

### Task 16: Reverse close choreography

**Files:**
- Modify: `src/components/StoryPanel.tsx`
- Modify: `src/components/StoryView.tsx`
- Modify: `src/components/HubView.tsx`

**Step 1: Add content collapse on exit**

When closing the panel (triggered by Escape or mini-hub click), content should fade out simultaneously (not staggered — collapse is faster than reveal):

```typescript
// Exit variant on stagger container
exit: { opacity: 0, transition: { duration: 0.2 } }
```

**Step 2: Panel slides out after content collapses**

Add a `200ms` delay to the panel's exit `x: "100%"` animation so content fades first, then the glass slides.

**Step 3: Hub view entrance**

In `HubView.tsx`, add entrance animation for title and rings that plays when returning from story view — scale from 0.95 → 1, opacity 0 → 1, ~300ms with slight delay to start after panel exits.

**Step 4: Visual check**

Open and close story panels. Confirm: close feels ~30% faster than open. Content fades, panel slides, hub reassembles. Clean and swift.

**Step 5: Commit**

```bash
git add src/components/StoryPanel.tsx src/components/StoryView.tsx src/components/HubView.tsx
git commit -m "feat: add reverse choreography on panel close"
```

---

## Phase 5: Data Visualization Foundation

### Task 17: Create shared D3 chart utilities

**Files:**
- Create: `src/components/viz/useD3.ts`
- Create: `src/components/viz/chartTheme.ts`

**Step 1: Create useD3 hook**

A reusable hook that creates an SVG ref and handles D3 rendering:

```typescript
// src/components/viz/useD3.ts
import { useRef, useEffect } from "react";
import * as d3 from "d3";

export function useD3(
  renderFn: (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => void,
  deps: React.DependencyList
) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove(); // clear previous render
      renderFn(svg);
    }
  }, deps);

  return ref;
}
```

**Step 2: Create chart theme constants**

```typescript
// src/components/viz/chartTheme.ts
export const chartTheme = {
  gold: "#C6982B",
  goldLight: "#E4C45A",
  navy: "#0B1D3A",
  slate: "#3D5A73",
  mist: "#7A95AA",
  frost: "rgba(255, 255, 255, 0.45)",
  fontFamily: {
    data: "'Space Grotesk', sans-serif",
    label: "'Inter', sans-serif",
  },
  fontSize: {
    dataLg: 24,
    dataMd: 18,
    dataSm: 14,
    label: 11,
    labelLg: 13,
  },
};
```

**Step 3: Verify build**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add src/components/viz/
git commit -m "feat: add shared D3 hook and chart theme constants"
```

---

### Task 18: Create source attribution component

**Files:**
- Create: `src/components/SourceAttribution.tsx`
- Create: `src/components/SourceAttribution.module.css`

**Step 1: Build the component**

A small collapsible footer showing data sources:

```typescript
import type { DataSource } from "../types/viz";

interface Props {
  sources: DataSource[];
}

export default function SourceAttribution({ sources }: Props) {
  const [expanded, setExpanded] = useState(false);
  // Renders a small "Sources" link. On click, expands to show list of source links.
  // Styled: mist color, 12px, frost background when expanded
}
```

**Step 2: Style it**

```css
.trigger {
  font-size: 12px;
  color: var(--mist);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: var(--frost-bg);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  margin-top: 6px;
}

.link {
  font-size: 12px;
  color: var(--ice-blue);
  text-decoration: none;
}
```

**Step 3: Integrate into StoryPanel**

Add `<SourceAttribution sources={athlete.sources} />` as the last element in StoryPanel's content stack. It appears last in the stagger sequence (delay: 0.7s).

**Step 4: Visual check**

Open a story panel. Confirm: small "Sources" text at bottom. Click to expand — shows linked source names. Subtle, doesn't compete with content.

**Step 5: Commit**

```bash
git add src/components/SourceAttribution.tsx src/components/SourceAttribution.module.css src/components/StoryPanel.tsx
git commit -m "feat: add source attribution component to story panels"
```

---

## Phase 6: Per-Athlete Visualizations

Each visualization is a standalone React component using D3.js, rendered inside StoryPanel in place of (or alongside) the existing StatCard row. All components live in `src/components/viz/`.

### Task 19: Braathen — Horizontal time gap bar chart

**Files:**
- Create: `src/components/viz/TimeGapChart.tsx`
- Create: `src/components/viz/TimeGapChart.module.css`

**What it shows:** Braathen at 0 baseline, Odermatt +0.58s, Meillard +1.17s as horizontal bars growing from left. Gold bar for Braathen (at 0), navy bars for others. Labels and margins on each bar.

**D3 approach:**
- `d3.scaleLinear` for time gap → width
- `d3.select` rects with animated `width` transition (0 → target over 800ms, eased)
- SVG text labels for athlete names and +0.58s / +1.17s values
- Below: a minimal "102 years" timeline element — a thin horizontal line from 1924 to 2026 with a single gold dot at the end

**Size:** ~300px wide × ~160px tall (fits in the stat card area of StoryPanel)

**Step 1:** Build the component with hardcoded data from the athlete's `vizData`.

**Step 2:** Add entrance animation — bars grow from left on mount.

**Step 3:** Visual check. Confirm bars render at correct proportions, gold accent on Braathen, time gap labels are legible.

**Step 4: Commit**

```bash
git add src/components/viz/TimeGapChart.tsx src/components/viz/TimeGapChart.module.css
git commit -m "feat: add Braathen time gap bar chart visualization"
```

---

### Task 20: Hughes — Radial save gauge + period shot bars

**Files:**
- Create: `src/components/viz/SaveGauge.tsx`
- Create: `src/components/viz/ShotChart.tsx`
- Create: `src/components/viz/SaveGauge.module.css`
- Create: `src/components/viz/ShotChart.module.css`

**SaveGauge:** A radial arc (270° sweep) showing 41/42 saves. Nearly complete gold ring with a tiny gap. Center text: "97.6%" in Space Grotesk. Label: "41 of 42 saves".

**D3 approach:**
- `d3.arc` generator for the gauge background (mist) and filled portion (gold)
- Animate: arc `endAngle` from 0 → target over 1s
- Center text rendered as SVG `<text>`

**ShotChart:** Grouped bar chart — USA vs Canada shots, labeled by period (P1, P2, P3). Two bars per period group. P2 (19-8) is the dramatic peak.

**D3 approach:**
- `d3.scaleBand` for periods, `d3.scaleLinear` for shot count
- Canada bars in slate, USA bars in ice-blue
- Bars animate height from 0 on mount

**Size:** Gauge ~140×140px. Shot chart ~220×120px. They sit side by side in the viz area.

**Step 1:** Build SaveGauge with animated arc.

**Step 2:** Build ShotChart with grouped bars.

**Step 3:** Visual check both. Confirm gauge reads 97.6%, shot chart shows P2 spike clearly.

**Step 4: Commit**

```bash
git add src/components/viz/SaveGauge.tsx src/components/viz/ShotChart.tsx src/components/viz/SaveGauge.module.css src/components/viz/ShotChart.module.css
git commit -m "feat: add Hughes save gauge and shot chart visualizations"
```

---

### Task 21: Liu — Position swap animation + score lollipop

**Files:**
- Create: `src/components/viz/PositionSwap.tsx`
- Create: `src/components/viz/ScoreLollipop.tsx`
- Create: `src/components/viz/PositionSwap.module.css`
- Create: `src/components/viz/ScoreLollipop.module.css`

**PositionSwap:** Three labeled dots (1st/2nd/3rd) representing standings after SP. On mount, after a 500ms pause, dots rearrange to show Liu moving from 3rd → 1st. Use D3 transition for smooth position interpolation.

**ScoreLollipop:** Horizontal lollipop chart — Liu 226.79, Sakamoto 224.90. Two lines with circles at the end. Gold for Liu, slate for Sakamoto. Scale starts at ~220 to magnify the 1.89-point gap.

**Size:** PositionSwap ~200×80px. ScoreLollipop ~300×60px. Stacked vertically.

**Step 1:** Build PositionSwap with delayed rearrangement.

**Step 2:** Build ScoreLollipop with truncated scale.

**Step 3:** Visual check. Position swap should feel dramatic — pause, then movement. Lollipop should clearly show the gap.

**Step 4: Commit**

```bash
git add src/components/viz/PositionSwap.tsx src/components/viz/ScoreLollipop.tsx src/components/viz/PositionSwap.module.css src/components/viz/ScoreLollipop.module.css
git commit -m "feat: add Liu position swap and score lollipop visualizations"
```

---

### Task 22: Meyers Taylor — Career timeline

**Files:**
- Create: `src/components/viz/CareerTimeline.tsx`
- Create: `src/components/viz/CareerTimeline.module.css`

**What it shows:** Horizontal timeline with 5 nodes (2010, 2014, 2018, 2022, 2026). Each node shows the medal earned (bronze circle, silver circle, gold circle with fills). 2022 has two medals stacked. The gold at 2026 is emphasized (larger, glow). Below the final node: "59.51s" callout for the winning heat.

**D3 approach:**
- Horizontal line with `d3.scalePoint` for years
- Circle nodes with fill colors matching medal type (bronze: #CD7F32, silver: #C0C0C0, gold: var(--gold))
- Labels below each node: city name, event
- Animate: nodes appear sequentially left-to-right, 200ms stagger
- Final gold node pulses once on arrival

**Size:** ~360×140px (spans full width of viz area)

**Step 1:** Build timeline with sequential medal reveal.

**Step 2:** Add Heat 4 callout below the 2026 node.

**Step 3:** Visual check. Timeline should tell the "16-year journey" story at a glance. Gold at the end should feel like a payoff.

**Step 4: Commit**

```bash
git add src/components/viz/CareerTimeline.tsx src/components/viz/CareerTimeline.module.css
git commit -m "feat: add Meyers Taylor career timeline visualization"
```

---

### Task 23: Klaebo — 6-segment radial sweep + leaderboard

**Files:**
- Create: `src/components/viz/RadialSweep.tsx`
- Create: `src/components/viz/GoldLeaderboard.tsx`
- Create: `src/components/viz/RadialSweep.module.css`
- Create: `src/components/viz/GoldLeaderboard.module.css`

**RadialSweep:** Circular chart divided into 6 equal segments (60° each). Each segment represents one event. All fill gold, one by one, with the event name appearing as each fills. Center: "6/6" in large Space Grotesk.

**D3 approach:**
- `d3.pie` with equal values (6 segments)
- `d3.arc` for each segment
- Animate: each segment's `endAngle` grows from `startAngle` → full over 400ms, staggered 300ms apart
- Total animation: ~2.2s for full sweep
- Event labels rendered as `<text>` elements positioned around the ring

**GoldLeaderboard:** Small horizontal bar chart below. Klaebo (11), Bjørgen (8), Dæhlie (8), Bjørndalen (8). Klaebo's bar in gold, others in mist.

**Size:** RadialSweep ~160×160px. Leaderboard ~300×100px.

**Step 1:** Build RadialSweep with sequential fill animation.

**Step 2:** Build GoldLeaderboard as simple horizontal bars.

**Step 3:** Visual check. The sweep filling 6/6 gold should be the most satisfying animation in the app. Leaderboard should clearly show Klaebo's dominance.

**Step 4: Commit**

```bash
git add src/components/viz/RadialSweep.tsx src/components/viz/GoldLeaderboard.tsx src/components/viz/RadialSweep.module.css src/components/viz/GoldLeaderboard.module.css
git commit -m "feat: add Klaebo radial sweep and gold leaderboard visualizations"
```

---

### Task 24: Choi — 3-run sparkline arc + score comparison

**Files:**
- Create: `src/components/viz/RunArc.tsx`
- Create: `src/components/viz/RunArc.module.css`

**RunArc:** 3-point line chart. X-axis: Run 1, Run 2, Run 3. Y-axis: score (0–100). Run 1 and Run 2 are at 0 (crash, shown as X marks or empty circles). Run 3 shoots up to 90.25 (gold-filled circle). The line from 0 → 0 → 90.25 creates a dramatic upswing.

Below: small lollipop comparison — Choi 90.25, Kim 88.00, Ono 85.00.

**D3 approach:**
- `d3.scalePoint` for runs, `d3.scaleLinear` for scores (0-100)
- `d3.line` for the path connecting points
- Animate: path draws itself using `stroke-dashoffset` technique over 1.2s
- Points appear sequentially: X mark, X mark, then gold circle shoots up
- Lollipop below uses same score scale

**Size:** ~300×180px total (arc + lollipop stacked)

**Step 1:** Build RunArc with animated path draw and sequential point reveal.

**Step 2:** Add lollipop comparison below.

**Step 3:** Visual check. The dramatic upswing from two crashes to 90.25 should be emotionally compelling. X marks for crashes should be clear.

**Step 4: Commit**

```bash
git add src/components/viz/RunArc.tsx src/components/viz/RunArc.module.css
git commit -m "feat: add Choi run arc and score comparison visualization"
```

---

### Task 25: Wire visualizations into StoryPanel

**Files:**
- Modify: `src/components/StoryPanel.tsx`
- Create: `src/components/viz/AthleteViz.tsx`

**Step 1: Create AthleteViz dispatcher**

A component that renders the correct visualization based on `athlete.vizData.type`:

```typescript
// src/components/viz/AthleteViz.tsx
export default function AthleteViz({ athlete }: { athlete: Athlete }) {
  switch (athlete.vizData.type) {
    case "braathen": return <TimeGapChart data={athlete.vizData} />;
    case "hughes": return <HughesViz data={athlete.vizData} />;
    case "liu": return <LiuViz data={athlete.vizData} />;
    case "meyers-taylor": return <CareerTimeline data={athlete.vizData} />;
    case "klaebo": return <KlaeboViz data={athlete.vizData} />;
    case "choi": return <RunArc data={athlete.vizData} />;
  }
}
```

Where `HughesViz`, `LiuViz`, and `KlaeboViz` are thin wrappers composing their sub-charts (e.g., `HughesViz` renders `SaveGauge` + `ShotChart` side by side).

**Step 2: Replace StatCard row in StoryPanel**

In `StoryPanel.tsx`, replace the 3× `StatCard` row with `<AthleteViz athlete={athlete} />`. Keep the existing StatCards as a fallback or remove them entirely — the viz replaces their function.

The viz slot should sit at `staggerDelays.stats` (0.32s delay) in the content stagger.

**Step 3: Visual check every athlete**

Click through all 6 athletes. Confirm each shows their unique visualization. Charts animate on entrance and render correctly.

**Step 4: Commit**

```bash
git add src/components/viz/AthleteViz.tsx src/components/StoryPanel.tsx
git commit -m "feat: wire per-athlete visualizations into story panel"
```

---

## Phase 7: Integration & Polish

### Task 26: Prefers-reduced-motion support

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/components/AlpineLandscape.module.css`
- Modify: `src/components/OlympicRings.module.css`
- Modify: `src/components/TitleLockup.module.css`

**Step 1: Add reduced motion overrides**

```css
@media (prefers-reduced-motion: reduce) {
  .aurora { animation: none; }
  .glow { animation: none; }
  .title { animation: none; -webkit-text-fill-color: var(--ice-white); background: none; }
  .mountainNear { animation: none; }
}
```

Keep essential state transitions (panel open/close, view switches) but simplify to fades.

**Step 2: Verify in browser**

Toggle `prefers-reduced-motion: reduce` in DevTools. Confirm ambient animations stop, transitions still work but are simpler.

**Step 3: Commit**

```bash
git add src/styles/tokens.css src/components/AlpineLandscape.module.css src/components/OlympicRings.module.css src/components/TitleLockup.module.css
git commit -m "feat: add prefers-reduced-motion support for ambient animations"
```

---

### Task 27: Full integration visual review

**Files:** None (review only)

**Step 1: Run dev server**

```bash
npm run dev
```

**Step 2: Review checklist**

Walk through every interaction and verify:

- [ ] Hub view: aurora sweeps, rings pulse, title shimmers, mountains breathe, snow has depth, avatars drift organically
- [ ] Click Braathen: sky shifts warm, snow slows, avatar flies, panel staggers in, time gap chart animates, sources link works
- [ ] Click Hughes from mini-hub: content cross-fades (no panel re-entry), sky shifts blue-steel, save gauge + shot chart render
- [ ] Click Liu: position swap animates after pause, score lollipop shows gap
- [ ] Click Meyers Taylor: career timeline reveals medals sequentially, heat 4 callout visible
- [ ] Click Klaebo: radial sweep fills 6/6, leaderboard shows dominance
- [ ] Click Choi: run arc shows dramatic upswing, score comparison clear
- [ ] Press Escape: content collapses fast, panel slides, hub reassembles, sky returns, snow resumes
- [ ] Rapid clicking between athletes: no visual glitches, no stuck animations
- [ ] Move mouse: mountain parallax is smooth, no jitter
- [ ] Idle for 30s: app feels alive (aurora, rings, snow, avatar drift)
- [ ] Reduced motion: ambient animations disabled, transitions simplified

**Step 3: Fix any issues found**

Address visual bugs, timing issues, or performance problems.

**Step 4: Commit fixes**

```bash
git add -A
git commit -m "fix: integration review polish and bug fixes"
```

---

### Task 28: Production build and deploy

**Files:** None (build/deploy only)

**Step 1: Type check**

```bash
npx tsc --noEmit
```

Expected: No errors.

**Step 2: Production build**

```bash
npm run build
```

Expected: Clean build, no warnings.

**Step 3: Preview build locally**

```bash
npx vite preview
```

Walk through the same checklist from Task 27 on the production build.

**Step 4: Deploy**

```bash
npx vercel --prod
```

**Step 5: Commit any build-related changes**

```bash
git add -A
git commit -m "chore: production build verification"
```

---

## Task Dependency Summary

```
Phase 1 (Foundation):     Task 1 → Task 2 → Task 3
Phase 2 (Ambient):        Task 3 → Tasks 4,5,6,7 (parallel) → Task 8 → Task 9
Phase 3 (Atmosphere):     Task 3 → Task 10, Task 2 → Task 11, Task 8 → Task 12
Phase 4 (Choreography):   Tasks 13,14 (parallel) → Task 15 → Task 16
Phase 5 (Viz Foundation):  Task 1 → Task 17, Task 2 → Task 18
Phase 6 (Per-Athlete Viz): Task 17 → Tasks 19-24 (parallel) → Task 25
Phase 7 (Integration):    All above → Tasks 26,27 → Task 28
```

Tasks within the same phase that don't share file dependencies can run in parallel via subagents.
