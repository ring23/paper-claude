# Scrollytelling Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace WhatIf/Missions with Pudding.cool-style scrollytelling where each athlete gets a bespoke, scroll-driven data narrative with sticky visualizations that morph between states.

**Architecture:** Sticky `StoryViz` container + overlapping `StoryBeat` narration cards driven by GSAP ScrollTrigger. Each athlete has a unique viz renderer and story beats array. The hub, landscape, and navigation are untouched. Phase 1 builds the foundation (cleanup + Choi proof-of-concept). Phase 2 dispatches 4 parallel agents for remaining athletes + mobile + polish.

**Tech Stack:** React 19, TypeScript, GSAP + ScrollTrigger, D3, Lottie, Framer Motion (hero only), Vite, Vitest

**Source Docs:**
- Shaping: `docs/shaping/scrollytelling-redesign-shaping.md`
- Slices: `docs/shaping/scrollytelling-slices.md`
- Prototype: `docs/prototypes/choi-scrollytelling.html`
- Design doc: `docs/plans/2026-02-26-scrollytelling-redesign.md`

---

## Phase Overview

```
Phase 1: Foundation (Sequential, single agent)
├── Task 1: V1 — Clean Slate (delete deprecated files, install deps)
├── Task 2: V2 — Scroll Engine + Choi Story (proof-of-concept)
│
Phase 2: Parallel Agents (4 agents, dispatched after Phase 1 passes)
├── Agent Alpha: V4 + V5 — Career Arc athletes (Klaebo + Meyers Taylor)
├── Agent Bravo: V6 + V7 — Drought Breaker athletes (Braathen + Hughes)
├── Agent Charlie: V8 — Position Race athlete (Liu)
└── Agent Delta: V3 + V9 — Mobile Responsive + Motion Polish
```

**Why this grouping:**
- Alpha & Bravo each pair athletes with similar viz archetypes (career paths / drought counters)
- Charlie handles Liu's unique position-swap pattern solo
- Delta handles cross-cutting concerns (responsive + motion) that touch all components
- V4-V8 are independent of each other per the slices doc; V3 and V9 depend only on V2

---

## Key Files Reference

**Design system:** `src/components/viz/chartTheme.ts` — gold (#C6982B), navy (#0B1D3A), slate (#3D5A73), mist (#7A95AA)
**CSS tokens:** `src/styles/tokens.css` — --frost-bg, --alpine-navy, --gold, spacing vars
**Typography:** Archivo Black (display), Inter (body/labels), Space Grotesk (data/numbers)
**Prototype:** `docs/prototypes/choi-scrollytelling.html` — reference for scroll mechanics, beat state machine, CSS patterns

---

# Phase 1: Foundation

## Task 1: V1 — Clean Slate

**Goal:** Remove all deprecated features, install GSAP stack, verify clean build.

### Step 1: Delete deprecated files

Delete these 32 files:

**Components + CSS (16 files):**
```
src/components/WhatIfPanel.tsx
src/components/WhatIfPanel.module.css
src/components/MissionPanel.tsx
src/components/MissionPanel.module.css
src/components/Dashboard.tsx
src/components/Dashboard.module.css
src/components/TimelineView.tsx
src/components/TimelineView.module.css
src/components/viz/AthleteViz.tsx
src/components/viz/AthleteViz.module.css
src/components/viz/RunArc.tsx
src/components/viz/RunArc.module.css
src/components/viz/TimeGapChart.tsx
src/components/viz/TimeGapChart.module.css
src/components/viz/SaveGauge.tsx
src/components/viz/SaveGauge.module.css
src/components/viz/ShotChart.tsx
src/components/viz/ShotChart.module.css
src/components/viz/ScoreLollipop.tsx
src/components/viz/ScoreLollipop.module.css
src/components/viz/PositionSwap.tsx
src/components/viz/PositionSwap.module.css
src/components/viz/CareerTimeline.tsx
src/components/viz/CareerTimeline.module.css
src/components/viz/RadialSweep.tsx
src/components/viz/RadialSweep.module.css
src/components/viz/GoldLeaderboard.tsx
src/components/viz/GoldLeaderboard.module.css
```

**Data (3 files):**
```
src/data/whatif-scenarios.ts
src/data/missions.ts
src/data/timeline.ts
```

**Types (3 files):**
```
src/types/whatif.ts
src/types/mission.ts
src/types/timeline.ts
```

**Utils (4 files):**
```
src/utils/hypothetical.ts
src/utils/missions.ts
src/utils/dashboard.ts
src/utils/timeline.ts
```

**Tests (4 files):**
```
tests/whatif.test.ts
tests/missions.test.ts
tests/dashboard.test.ts
tests/timeline.test.ts
```

**Keep:** `src/components/viz/chartTheme.ts`, `src/components/viz/useD3.ts`

### Step 2: Clean dead imports from StoryPanel.tsx

Edit `src/components/StoryPanel.tsx` — remove:
- Line 4: `import AthleteViz from "./viz/AthleteViz";`
- Line 7: `import MissionPanel from "./MissionPanel";`
- Line 9: `import WhatIfPanel from "./WhatIfPanel";`
- `whatif: 0.55,` and `missions: 0.85,` from `staggerDelays`
- Lines 68-71: The `<AthleteViz>` motion.div block
- Lines 78-81: The `<WhatIfPanel>` motion.div block
- Lines 98-101: The `<MissionPanel>` motion.div block

Result: StoryPanel becomes a minimal shell (header + headline + achievement + story + counter/medal + sources).

### Step 3: Install new dependencies

```bash
npm install gsap @gsap/react lottie-react
```

### Step 4: Register GSAP plugins

Edit `src/main.tsx` — add before `createRoot`:

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

### Step 5: Verify clean build

```bash
npx tsc --noEmit        # zero errors
npx vitest run           # surviving tests pass (formatters, athletes_data)
npm run dev              # hub loads, click athlete → minimal panel renders
npm run build            # clean bundle
```

### Step 6: Commit

```bash
git add -A
git commit -m "feat: V1 clean slate — remove WhatIf/Missions/Dashboard/Timeline, install GSAP stack"
```

---

## Task 2: V2 — Scroll Engine + Choi Gaon Story

**Goal:** Build the entire scroll infrastructure and prove it with Choi's story. This is the critical proof-of-concept.

**Reference prototype:** `docs/prototypes/choi-scrollytelling.html` — study the beat state machine, CSS patterns, GSAP ScrollTrigger setup, and particle system carefully. The React implementation should match the prototype's behavior.

### Step 1: Create story types (`src/types/story.ts`)

```typescript
// --- Emotions ---
export type StoryEmotion =
  | "neutral"
  | "tension"
  | "crash"
  | "triumph"
  | "reverence"
  | "momentum"
  | "longing";

// --- Beat narration ---
export interface BeatNarration {
  /** Eyebrow label above text, e.g. "Run 1" */
  label?: string;
  /** Main narration text — supports <em> (gold accent) and <span class="accent-red"> */
  text: string;
  /** Smaller secondary line */
  subtext?: string;
}

// --- Typographic moment ---
export interface TypographicMomentData {
  bigNumber: string;
  unit: string;
  /** Supports <strong> for gold accent */
  context: string;
}

// --- Story beat ---
export interface StoryBeatData<TVizState = VizState> {
  id: string;
  narration: BeatNarration;
  vizState: TVizState;
  emotion: StoryEmotion;
  humanDetail?: TypographicMomentData;
}

// --- Per-athlete viz states (discriminated union) ---

export type RunDotState = "pending" | "crashed" | "crashed-dim" | "active" | "gold";
export type ChoiCenterDisplay = "setup" | "crash1" | "crash2" | "tension" | "gold" | "podium";

export interface ChoiVizState {
  type: "choi";
  centerDisplay: ChoiCenterDisplay;
  runDots: [RunDotState, RunDotState, RunDotState];
  showComparison: boolean;
  particleBurst: boolean;
  bgGlow: boolean;
}

// Stubs for Phase 2 agents to extend:
export interface KlaeboVizState {
  type: "klaebo";
  // Defined by Agent Alpha
  [key: string]: unknown;
}

export interface MeyersTaylorVizState {
  type: "meyers-taylor";
  [key: string]: unknown;
}

export interface BraathenVizState {
  type: "braathen";
  [key: string]: unknown;
}

export interface HughesVizState {
  type: "hughes";
  [key: string]: unknown;
}

export interface LiuVizState {
  type: "liu";
  [key: string]: unknown;
}

/** Union of all athlete viz states. Phase 2 agents replace stubs with full types. */
export type VizState =
  | ChoiVizState
  | KlaeboVizState
  | MeyersTaylorVizState
  | BraathenVizState
  | HughesVizState
  | LiuVizState;
```

### Step 2: Create Choi story beats data (`src/data/storyBeats/choi.ts`)

Create directory `src/data/storyBeats/` first.

```typescript
import type { StoryBeatData, ChoiVizState } from "../../types/story";

export const choiStoryBeats: StoryBeatData<ChoiVizState>[] = [
  {
    id: "choi-setup",
    narration: {
      label: "Halfpipe Final",
      text: "Three runs. Ninety seconds each.",
      subtext: "Only the best score counts.",
    },
    vizState: {
      type: "choi",
      centerDisplay: "setup",
      runDots: ["pending", "pending", "pending"],
      showComparison: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "neutral",
  },
  {
    id: "choi-crash1",
    narration: {
      label: "Run 1",
      text: "She clips the lip. <span class=\"accent-red\">Crash.</span>",
      subtext: "Score: DNF",
    },
    vizState: {
      type: "choi",
      centerDisplay: "crash1",
      runDots: ["crashed", "pending", "pending"],
      showComparison: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "crash",
  },
  {
    id: "choi-crash2",
    narration: {
      label: "Run 2",
      text: "Washed out on the first hit. <span class=\"accent-red\">Another crash.</span>",
      subtext: "Score: DNF",
    },
    vizState: {
      type: "choi",
      centerDisplay: "crash2",
      runDots: ["crashed-dim", "crashed", "pending"],
      showComparison: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "crash",
  },
  {
    id: "choi-tension",
    narration: {
      text: "<em>One run left.</em>",
      subtext: "Everything on this.",
    },
    vizState: {
      type: "choi",
      centerDisplay: "tension",
      runDots: ["crashed-dim", "crashed-dim", "active"],
      showComparison: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },
  {
    id: "choi-gold",
    narration: {
      label: "Run 3",
      text: "She drops in.",
    },
    vizState: {
      type: "choi",
      centerDisplay: "gold",
      runDots: ["crashed-dim", "crashed-dim", "gold"],
      showComparison: false,
      particleBurst: true,
      bgGlow: true,
    },
    emotion: "triumph",
    humanDetail: {
      bigNumber: "17",
      unit: "years, 101 days",
      context: "South Korea's <strong>first-ever</strong> Olympic snow-sport gold medalist.",
    },
  },
  {
    id: "choi-podium",
    narration: {
      text: "She dethroned Chloe Kim.",
      subtext: "The youngest halfpipe champion in Olympic history.",
    },
    vizState: {
      type: "choi",
      centerDisplay: "podium",
      runDots: ["crashed-dim", "crashed-dim", "gold"],
      showComparison: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "triumph",
  },
];
```

### Step 3: Create StoryBeat component

**`src/components/StoryBeat.tsx`** — ScrollTrigger wrapper per narration step.

Props:
- `beat: StoryBeatData` — the beat data
- `index: number` — for stagger/ordering
- `onActivate: (beat: StoryBeatData) => void` — callback when this beat enters viewport
- `scrollerRef: React.RefObject<HTMLElement>` — the scroll container (StoryView's `.panel` div)

Key mechanics:
- Each beat is `min-height: 100vh` (so there's scroll distance for the trigger)
- ScrollTrigger at `start: "top 55%"`, `end: "bottom 45%"`
- Both `onEnter` and `onEnterBack` call `onActivate`
- The glass-blur narration card is positioned at the bottom of each step via flexbox `justify-content: flex-end`
- Card uses `backdrop-filter: blur(16px)` + dark semi-transparent background (matching prototype's `.step-card`)
- Narration renders `beat.narration.text` as `dangerouslySetInnerHTML` (it contains `<em>` and `<span>` markup)

**Critical:** GSAP ScrollTrigger must use `scroller: scrollerRef.current` because the scroll container is StoryView's `.panel` div (`overflow-y: auto`), NOT the window.

**`src/components/StoryBeat.module.css`:**
- `.step` — `min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; position: relative; z-index: 10; padding: 0 var(--space-2xl) var(--space-2xl); pointer-events: none;`
- `.card` — glass blur card: `background: rgba(7, 13, 24, 0.82); backdrop-filter: blur(16px); border-radius: 16px; padding: 28px 32px; max-width: 420px; pointer-events: auto;`
- `.label` — eyebrow: `font-family: 'Space Grotesk', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--mist); margin-bottom: 8px;`
- `.text` — main: `font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 500; color: #E8E2D8; line-height: 1.4;`
- `.subtext` — secondary: `font-size: 14px; color: #6B7D8D; margin-top: 8px;`
- `.text em` — `color: var(--gold); font-style: normal;`
- `.text .accent-red` — `color: #CD2E3A;` (Note: CSS modules won't match inner HTML classes — use `:global(.accent-red)` or style via parent selector)

### Step 4: Create StoryViz component

**`src/components/StoryViz.tsx`** — Sticky viz container that dispatches to per-athlete renderers.

Props:
- `athlete: Athlete`
- `vizState: VizState | null`

Layout:
- `position: sticky; top: 0; height: 100vh; z-index: 1; pointer-events: none;`
- Centered flexbox for the viz content
- Background glow div (toggled by `vizState.bgGlow` where applicable)

Renderer dispatch:
```typescript
switch (vizState?.type) {
  case "choi":
    return <ChoiVizRenderer state={vizState} athlete={athlete} />;
  // Phase 2 agents add cases here:
  // case "klaebo": return <KlaeboVizRenderer ... />;
  // etc.
  default:
    return null;
}
```

**`src/components/StoryViz.module.css`:**
- `.vizPanel` — `position: sticky; top: 0; height: 100vh; display: flex; align-items: center; justify-content: center; z-index: 1; pointer-events: none;`
- `.bgGlow` — `position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(198, 152, 43, 0.15) 0%, transparent 70%); opacity: 0; transition: opacity 1s;`
- `.bgGlowActive` — `opacity: 0.5;`

### Step 5: Create ChoiVizRenderer

**`src/components/viz/renderers/ChoiVizRenderer.tsx`** — Direct translation of prototype's `goToBeat()` state machine.

Create directory `src/components/viz/renderers/` first.

Props:
- `state: ChoiVizState`
- `athlete: Athlete`

This component renders:
1. **Run tracker** — 3 dots in a row, each with:
   - Border color transitions (slate → red → gold)
   - X mark overlay for crashes
   - Run number label
   - Glow shadow for active/gold states
2. **Center display** — switches based on `state.centerDisplay`:
   - `"setup"` — "3 RUNS" text
   - `"crash1"` — single red ✕
   - `"crash2"` — double red ✕✕
   - `"tension"` — pulsing gold ring + "One run left" text (CSS `@keyframes pulseGold`)
   - `"gold"` — animated score counter 0→90.25 (GSAP `gsap.fromTo` with `snap: { innerText: 0.01 }`)
   - `"podium"` — score stays + comparison bars animate in
3. **Comparison bars** — 3 horizontal bars (Choi 90.25, Chloe Kim 89.00, Mitsuki Ono 85.25)
   - Width calculated as `(score - 82) / 10 * 100%`
   - Staggered GSAP width animation
4. **Particle burst** — 40 particles spawned via GSAP on `state.particleBurst === true`
   - Random size 3-8px, random angle 0-360°, distance 100-400px
   - Gold and gold-light colors
   - Duration 1.2-2s with `power2.out` ease

Use `useGSAP` from `@gsap/react` with `dependencies: [state]` to trigger transitions.
Use `useRef` for DOM element references. No D3 needed here — all HTML elements with GSAP transitions (matching prototype approach).

**`src/components/viz/renderers/ChoiVizRenderer.module.css`:**
- CSS variables for colors: `--red: #CD2E3A; --red-dim: rgba(205, 46, 58, 0.25); --gold-glow: rgba(198, 152, 43, 0.35);`
- `.runTracker` — flex row of dots
- `.runDot` — `width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--slate);`
- `.centerDisplay` — absolute center, large text area
- `.comparisonBar` — `height: 28px; border-radius: 4px; background: var(--gold);`
- `.particle` — `position: absolute; border-radius: 50%; pointer-events: none;`
- `@keyframes pulseGold` — scale and opacity pulse at 1.5s interval

### Step 6: Create TypographicMoment component

**`src/components/TypographicMoment.tsx`**

Props:
- `detail: TypographicMomentData`
- `scrollerRef: React.RefObject<HTMLElement>`

Layout: Full-viewport centered section with staggered entrance animation (GSAP timeline):
1. `bigNumber` — `font-family: 'Archivo Black'; font-size: clamp(80px, 15vw, 160px); color: var(--gold);`
2. `unit` — `font-family: 'Space Grotesk'; font-size: clamp(18px, 3vw, 28px); color: #7A95AA; text-transform: uppercase; letter-spacing: 0.15em;`
3. Horizontal divider — animated width 0→48px
4. `context` — `font-family: 'Inter'; font-size: clamp(14px, 2vw, 18px); color: #6B7D8D;`
5. `context strong` — `color: var(--gold);`

ScrollTrigger: `trigger: self, start: "top 60%", scroller: scrollerRef.current`

GSAP timeline: staggered reveal — bigNumber (0s) → unit (0.3s) → divider (0.5s) → context (0.7s). Each with opacity 0→1 + y 30→0.

### Step 7: Refactor StoryPanel for scrollytelling

**`src/components/StoryPanel.tsx`** — Complete rewrite of the component internals.

New props:
```typescript
interface Props {
  athlete: Athlete;
  scrollerRef: React.RefObject<HTMLElement>;
}
```

New layout structure:
```
StoryPanel
├── Hero section (min-height: 100vh)
│   ├── Flag emoji + sport label (eyebrow)
│   ├── Athlete name (Archivo Black, clamp(40px, 8vw, 64px))
│   ├── Headline (gold italic)
│   └── Scroll hint (animated down arrow, CSS @keyframes pulseDown)
├── Scrolly section (position: relative)
│   ├── StoryViz (sticky, receives vizState)
│   └── Steps overlay (margin-top: -100vh for overlap)
│       └── StoryBeat × N (map over athlete's storyBeats)
├── TypographicMoment (if any beat has humanDetail)
├── Footer
│   ├── HistoricCounter
│   ├── MedalBadge
│   └── SourceAttribution
```

State management:
```typescript
const [vizState, setVizState] = useState<VizState | null>(null);

const handleBeatActivate = useCallback((beat: StoryBeatData) => {
  setVizState(beat.vizState);
}, []);
```

Hero parallax: GSAP ScrollTrigger with `scrub: true` — hero content fades up and out as user scrolls.

Story beats: loaded from `src/data/storyBeats/choi.ts` (for now). Eventually dispatched by athlete ID.

**Story beats loader pattern** (for StoryPanel to import the right beats per athlete):
```typescript
// src/data/storyBeats/index.ts
import type { StoryBeatData } from "../../types/story";
import { choiStoryBeats } from "./choi";

const beatsByAthlete: Record<string, StoryBeatData[]> = {
  choi: choiStoryBeats,
  // Phase 2 agents add entries here
};

export function getStoryBeats(athleteId: string): StoryBeatData[] {
  return beatsByAthlete[athleteId] ?? [];
}
```

### Step 8: Edit StoryView to pass scrollerRef

**`src/components/StoryView.tsx`** — Add a ref on the `.panel` div and pass it to StoryPanel:

```typescript
import { useRef } from "react";

// Inside component:
const panelRef = useRef<HTMLDivElement>(null);

// In JSX:
<motion.div className={styles.panel} ref={panelRef} ...>
  <AnimatePresence mode="wait">
    <StoryPanel key={athlete.id} athlete={athlete} scrollerRef={panelRef} />
  </AnimatePresence>
</motion.div>
```

### Step 9: Update StoryPanel.module.css

Replace entire contents with scrollytelling layout:

```css
/* Hero section */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 var(--space-2xl);
  position: relative;
}

.heroEyebrow {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--mist);
  margin-bottom: var(--space-md);
}

.heroName {
  font-family: 'Archivo Black', sans-serif;
  font-weight: 400;
  font-size: clamp(40px, 8vw, 64px);
  color: var(--alpine-navy);
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.heroHeadline {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: clamp(18px, 2.5vw, 24px);
  color: var(--gold);
  font-style: italic;
  margin-top: var(--space-md);
  line-height: 1.3;
}

.scrollHint {
  position: absolute;
  bottom: var(--space-xl);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--mist);
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.scrollArrow {
  width: 2px;
  height: 24px;
  background: var(--mist);
  animation: pulseDown 2s ease-in-out infinite;
}

@keyframes pulseDown {
  0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
  50% { opacity: 1; transform: scaleY(1); }
}

/* Scrolly section */
.scrolly {
  position: relative;
}

.stepsOverlay {
  margin-top: -100vh;
  position: relative;
  z-index: 10;
}

/* Footer */
.footer {
  padding: var(--space-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  max-width: 680px;
}

.footerBottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-xl);
}
```

### Step 10: Write tests for story beat data

**`tests/storyBeats.test.ts`:**

```typescript
import { describe, it, expect } from "vitest";
import { choiStoryBeats } from "../src/data/storyBeats/choi";
import { getStoryBeats } from "../src/data/storyBeats/index";

describe("Choi story beats", () => {
  it("has 6 beats", () => {
    expect(choiStoryBeats).toHaveLength(6);
  });

  it("each beat has unique id", () => {
    const ids = choiStoryBeats.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each beat has narration text", () => {
    for (const beat of choiStoryBeats) {
      expect(beat.narration.text).toBeTruthy();
    }
  });

  it("first beat is setup, last is podium", () => {
    expect(choiStoryBeats[0].vizState.centerDisplay).toBe("setup");
    expect(choiStoryBeats[5].vizState.centerDisplay).toBe("podium");
  });

  it("gold beat has particle burst and bg glow", () => {
    const goldBeat = choiStoryBeats.find((b) => b.vizState.centerDisplay === "gold");
    expect(goldBeat?.vizState.particleBurst).toBe(true);
    expect(goldBeat?.vizState.bgGlow).toBe(true);
  });

  it("gold beat has human detail", () => {
    const goldBeat = choiStoryBeats.find((b) => b.vizState.centerDisplay === "gold");
    expect(goldBeat?.humanDetail).toBeDefined();
    expect(goldBeat?.humanDetail?.bigNumber).toBe("17");
  });
});

describe("getStoryBeats", () => {
  it("returns choi beats for 'choi'", () => {
    expect(getStoryBeats("choi")).toBe(choiStoryBeats);
  });

  it("returns empty array for unknown athlete", () => {
    expect(getStoryBeats("unknown")).toEqual([]);
  });
});
```

### Step 11: Verify

```bash
npx tsc --noEmit                    # zero errors
npx vitest run                      # all tests pass
npm run dev                         # click Choi → full scrollytelling:
                                    #   hero → scroll → 6 beats with viz transitions
                                    #   → typographic "17 years" → footer
                                    #   scroll back up → transitions reverse
npm run build                       # clean bundle
```

### Step 12: Commit

```bash
git add -A
git commit -m "feat: V2 scroll engine + Choi story — scrollytelling proof-of-concept with GSAP ScrollTrigger"
```

### Step 13: Demo gate verification

Manual testing checklist:
- [ ] Click Choi from hub → hero with name/headline appears
- [ ] Scroll → viz panel becomes sticky, first beat card appears
- [ ] Beat 1 (Setup): 3 pending dots visible, "3 RUNS" center display
- [ ] Beat 2 (Crash 1): dot 1 turns red with X, red ✕ in center
- [ ] Beat 3 (Crash 2): dot 2 turns red with X, ✕✕ in center
- [ ] Beat 4 (Tension): dots 1-2 dimmed, dot 3 pulses gold, ring animation
- [ ] Beat 5 (Gold): score animates 0→90.25, particles burst, background glows
- [ ] Beat 6 (Podium): comparison bars animate in (Choi, Kim, Ono)
- [ ] Typographic moment: "17" / "years, 101 days" with staggered reveal
- [ ] Footer: historic counter + medal badge + sources
- [ ] Scroll BACKWARD → beats reverse correctly
- [ ] Click different athlete → panel shows minimal shell (no beats yet)
- [ ] Return to Choi → scrollytelling works again
- [ ] No console errors

---

# Phase 2: Parallel Agents

**Dispatch condition:** Phase 1 (Tasks 1-2) passes all verification checks.

**Agent isolation:** Each agent works in a separate git worktree (`isolation: "worktree"`). The orchestrator merges their work after review.

**Shared files that agents modify:**
- `src/types/story.ts` — each agent replaces their VizState stub with full type definition
- `src/data/storyBeats/index.ts` — each agent adds their import + `beatsByAthlete` entry
- `src/components/StoryViz.tsx` — each agent adds their renderer's `case` to the switch

**Merge strategy:** These shared files have clearly separated sections. The orchestrator merges by:
1. Combining VizState type definitions (each agent adds their own interface)
2. Combining story beats imports and map entries
3. Combining renderer switch cases

---

## Agent Alpha: Career Arc Athletes (V4 + V5)

### Context for Agent

You are building scrollytelling stories for two "career arc" athletes — Klaebo (cross-country skiing legend, 6 golds at 2026 Games) and Meyers Taylor (5-Olympics bobsled veteran). Both use timeline/path visualizations showing achievement accumulation over time.

**Existing infrastructure (built in Phase 1):**
- `src/types/story.ts` — `StoryBeatData`, `StoryEmotion`, `BeatNarration`, `TypographicMomentData`, `VizState` union
- `src/components/StoryBeat.tsx` — ScrollTrigger wrapper (use as-is)
- `src/components/StoryViz.tsx` — Sticky container with renderer dispatch switch
- `src/components/TypographicMoment.tsx` — Full-viewport stat callout
- `src/data/storyBeats/index.ts` — Beats loader with `getStoryBeats()`
- `docs/prototypes/choi-scrollytelling.html` — Reference for GSAP patterns
- `src/components/viz/renderers/ChoiVizRenderer.tsx` — Reference for renderer pattern

**Design system:** Gold #C6982B, Navy #0B1D3A, Slate #3D5A73, Mist #7A95AA. Fonts: Archivo Black (display), Inter (body), Space Grotesk (data).

### Task 3: Klaebo Story (V4)

**Files to create:**
- `src/data/storyBeats/klaebo.ts`
- `src/components/viz/renderers/KlaeboVizRenderer.tsx`
- `src/components/viz/renderers/KlaeboVizRenderer.module.css`
- `tests/storyBeats-klaebo.test.ts`

**Files to modify:**
- `src/types/story.ts` — Replace `KlaeboVizState` stub with full type
- `src/data/storyBeats/index.ts` — Add klaebo import + map entry
- `src/components/StoryViz.tsx` — Add `case "klaebo"` to switch

**Viz concept: Lit-fuse career timeline.** A horizontal fuse/path that burns across the screen, with gold medal dots that pulse and glow as the fuse reaches them. Three eras: PyeongChang 2018 (3 golds), Beijing 2022 (2 golds), Milano 2026 (6 golds = record).

**KlaeboVizState fields:**
```typescript
export interface KlaeboVizState {
  type: "klaebo";
  fuseProgress: number;          // 0-1, how far the fuse has burned
  activeEra: "2018" | "2022" | "2026" | null;
  litGolds: number;              // how many gold dots are lit (0-11)
  showLeaderboard: boolean;      // career total comparison
  explosion: boolean;            // gold 6 climax
}
```

**Beat structure (10 beats):**
1. Intro — "Six events. No one has ever done this." → fuse at 0%, no golds lit
2. PyeongChang 2018 — fuse burns to 30%, 3 golds light up (Sprint, Team Sprint, 4×10km)
3. Beijing 2022 — fuse extends to 55%, +2 golds (Sprint, Team Sprint)
4. Milano begins — fuse approaching 60%, tension
5. Golds 1-2 — Skiathlon + Sprint Classic, fuse to 70%, 7 golds lit
6. Golds 3-4 — 10km Free + Relay, fuse to 80%, 9 golds lit
7. Gold 5 — ties Heiden record, fuse to 90%, 10 golds lit (reverence beat)
8. Gold 6 — 50km Marathon, +8.9s margin, fuse hits 100%, explosion, 11 golds
9. Career total — leaderboard: Klaebo 11, Bjørgen 8, Dæhlie 8, Bjørndalen 8
10. Coda — "Only Phelps has more. Ever."

**TypographicMoment:** `"6/6"` / `"events · six golds"` / `"No athlete has swept every event at a single Winter Games."`

**Renderer implementation:**
- SVG-based fuse path (horizontal bezier curve) with GSAP `drawSVG`-style animation (animate `stroke-dashoffset`)
- Gold medal dots positioned along the fuse at each gold's position
- Dots start as slate outlines, light up gold with glow shadow when the fuse reaches them
- Era labels (2018, 2022, 2026) below the fuse
- Leaderboard: horizontal bars similar to Choi's comparison bars
- Explosion: particle burst (reuse pattern from ChoiVizRenderer) at the final gold

**Data to add to `athletes.ts` (Klaebo entry):**
- `careerGoldsByYear: { year: number; games: string; event: string }[]` — all 11 golds
- `events2026: { event: string; margin?: string; date: string }[]` — needs date field for fuse ordering

### Task 4: Meyers Taylor Story (V5)

**Files to create:**
- `src/data/storyBeats/meyersTaylor.ts`
- `src/components/viz/renderers/MeyersTaylorVizRenderer.tsx`
- `src/components/viz/renderers/MeyersTaylorVizRenderer.module.css`
- `tests/storyBeats-meyersTaylor.test.ts`

**Files to modify:**
- `src/types/story.ts` — Replace `MeyersTaylorVizState` stub with full type
- `src/data/storyBeats/index.ts` — Add meyersTaylor import + map entry
- `src/components/StoryViz.tsx` — Add `case "meyers-taylor"` to switch

**Viz concept: 5-Olympics career path.** A winding path visualization with 5 Olympic ring waypoints spanning 2010-2026. Each waypoint shows the medal color earned. The path is drawn progressively as the user scrolls.

**MeyersTaylorVizState fields:**
```typescript
export interface MeyersTaylorVizState {
  type: "meyers-taylor";
  pathProgress: number;           // 0-1, how far the career path extends
  activeOlympics: number | null;  // index 0-4 (2010-2026)
  litMedals: number;              // 0-5 medals revealed
  showAge: boolean;               // age counter visible
  showTensionHeat: boolean;       // heat 4 countdown
  goldMoment: boolean;            // final gold reveal
}
```

**Beat structure (8 beats):**
1. Intro — "Five Olympics. Sixteen years." → empty path with 5 ring markers
2. Vancouver 2010 — path draws to ring 1, bronze dot appears (age 25)
3. Sochi 2014 — path extends to ring 2, silver dot (age 29)
4. PyeongChang 2018 — path to ring 3, silver dot (age 33)
5. Beijing 2022 — path to ring 4, gold + silver dots (age 37)
6. Gap — "A baby. The pandemic. A comeback at 40." (longing emotion, path pauses)
7. Milano tension — path approaching ring 5, trailing by 0.12s, tension
8. Gold — 59.51 fastest heat 4 ever, path reaches ring 5, gold burst

**TypographicMoments:**
- `"41"` / `"years old"` / `"Oldest individual Winter Olympic gold medalist."`
- `"0.04"` / `"seconds"` / `"The margin of victory."`

**Data to add to `athletes.ts` (Meyers Taylor entry):**
- `ageAtEachOlympics: { year: number; age: number; city: string }[]`
- `heat4Rank: number`
- `trailingMarginAfterRun3: number`

### Agent Alpha Verification

```bash
npx tsc --noEmit                    # zero errors
npx vitest run                      # all tests pass including new klaebo + meyersTaylor tests
npm run dev                         # click Klaebo → lit-fuse scrollytelling
                                    # click Meyers Taylor → career-path scrollytelling
npm run build                       # clean bundle
```

### Agent Alpha Commits

```bash
git add -A && git commit -m "feat: V4 Klaebo lit-fuse career timeline scrollytelling"
# then after Meyers Taylor:
git add -A && git commit -m "feat: V5 Meyers Taylor career-path scrollytelling"
```

---

## Agent Bravo: Drought Breaker Athletes (V6 + V7)

### Context for Agent

You are building scrollytelling stories for two "drought breaker" athletes — Braathen (102-year drought for South America) and Hughes (46-year drought for US hockey). Both use time-counter visualizations showing the weight of a long wait before the breakthrough moment.

**Same infrastructure context as Agent Alpha above.**

### Task 5: Braathen Story (V6)

**Files to create:**
- `src/data/storyBeats/braathen.ts`
- `src/components/viz/renderers/BraathenVizRenderer.tsx`
- `src/components/viz/renderers/BraathenVizRenderer.module.css`
- `tests/storyBeats-braathen.test.ts`

**Files to modify:**
- `src/types/story.ts` — Replace `BraathenVizState` stub
- `src/data/storyBeats/index.ts` — Add braathen entry
- `src/components/StoryViz.tsx` — Add `case "braathen"` to switch

**Viz concept: Drought counter.** An animated counter ticking from 1924 → 2026 (102 years, 26 Winter Olympics editions). Empty podium silhouettes accumulate as years pass. At the breakthrough, the counter stops and a gold explosion fills the final podium.

**BraathenVizState fields:**
```typescript
export interface BraathenVizState {
  type: "braathen";
  counterYear: number;            // 1924-2026 (animated)
  counterEditions: number;        // 1-26
  showRunBars: boolean;           // run time comparison bars
  activeRun: 1 | 2 | null;       // which run is highlighted
  droughtBroken: boolean;         // gold burst at endpoint
  showComparison: boolean;        // final comparison bars
}
```

**Beat structure (7 beats):**
1. Intro — "1924. Chamonix. The first Winter Olympics." → counter at 1924
2. Drought start — "102 years. Zero South American medals." → counter begins ticking
3. Counter running — 26 editions tick past (GSAP animated counter) → numbers fly by
4. Run 1 — "Leads by 0.58 seconds." → run time bar chart, run 1 highlighted
5. Run 2 — "Combined time locked." → both runs visible, tension
6. Drought broken — gold burst at 2026 endpoint → counter stops, celebration
7. Podium — comparison time bars → Braathen vs competitors

**TypographicMoment:** `"102"` / `"years"` / `"Zero South American medals. Until now."`

**Data to add to `athletes.ts` (Braathen entry):**
- `winterGamesEditions: { year: number; city: string; edition: number }[]` — 26 entries
- `run2Time: number`
- `run1Rank: number`

### Task 6: Hughes Story (V7)

**Files to create:**
- `src/data/storyBeats/hughes.ts`
- `src/components/viz/renderers/HughesVizRenderer.tsx`
- `src/components/viz/renderers/HughesVizRenderer.module.css`
- `tests/storyBeats-hughes.test.ts`

**Files to modify:**
- `src/types/story.ts` — Replace `HughesVizState` stub
- `src/data/storyBeats/index.ts` — Add hughes entry
- `src/components/StoryViz.tsx` — Add `case "hughes"` to switch

**Viz concept: Game replay + drought timeline.** Starts with a drought counter (1980→2026), then transitions to a simplified rink diagram showing key game moments — goals appearing, save counter filling up, overtime drama.

**HughesVizState fields:**
```typescript
export interface HughesVizState {
  type: "hughes";
  droughtYear: number;            // 1980-2026
  showRink: boolean;              // ice rink diagram visible
  gamePhase: "pre" | "p1" | "p2" | "p3" | "ot" | null;
  usaScore: number;
  canScore: number;
  saveGaugeFill: number;          // 0-1 (Hellebuyck's save %)
  showOTGoal: boolean;            // Hughes' winner
  celebration: boolean;
}
```

**Beat structure (8 beats):**
1. 1980 Miracle — "Miracle on Ice. 1980." → drought counter at 1980
2. 46 years — counter ticks 1980→2026, US results flash past
3. Pregame — rink diagram appears, teams set
4. P1 goal — Boldy scores, USA 1-0
5. P2 wall — Hellebuyck save gauge fills (41 saves), Canada ties
6. OT setup — 3v3 overtime, score 1-1
7. OT goal — Hughes, top shelf, USA 2-1, celebration
8. Coda — "Not a miracle. Inevitable."

**TypographicMoment:** `"41"` / `"saves"` / `"Hellebuyck faced 42 shots. He stopped everything but one."`

**Data to add to `athletes.ts` (Hughes entry):**
- `gameChronology: { period: string; time: string; event: string; team: string }[]`
- `droughtGames: { year: number; result: string }[]` — US results 1984-2022

### Agent Bravo Verification

Same as Agent Alpha — `tsc`, `vitest`, `dev` (click Braathen + Hughes), `build`.

### Agent Bravo Commits

```bash
git add -A && git commit -m "feat: V6 Braathen drought-counter scrollytelling"
git add -A && git commit -m "feat: V7 Hughes game-replay scrollytelling"
```

---

## Agent Charlie: Position Race Athlete (V8)

### Context for Agent

You are building the scrollytelling story for Liu (figure skating comeback). This is a unique "position swap" visualization where dots representing skaters move up and down a leaderboard in real-time as scores come in.

**Same infrastructure context as Agent Alpha above.**

### Task 7: Liu Story (V8)

**Files to create:**
- `src/data/storyBeats/liu.ts`
- `src/components/viz/renderers/LiuVizRenderer.tsx`
- `src/components/viz/renderers/LiuVizRenderer.module.css`
- `tests/storyBeats-liu.test.ts`

**Files to modify:**
- `src/types/story.ts` — Replace `LiuVizState` stub
- `src/data/storyBeats/index.ts` — Add liu entry
- `src/components/StoryViz.tsx` — Add `case "liu"` to switch

**Viz concept: Position race + drought counter.** Starts with a 24-year drought counter (Sarah Hughes 2002→2026). Then transitions to a vertical leaderboard with 3 dots (Liu, competitors) that swap positions as the competition unfolds. Liu starts 3rd after the short program, then rockets to 1st after the free skate.

**LiuVizState fields:**
```typescript
export interface LiuVizState {
  type: "liu";
  droughtYear: number;             // 2002-2026
  showStandings: boolean;          // position dots visible
  positions: { name: string; position: number; score: number | null }[];
  activePhase: "short" | "free" | "final" | null;
  liuRising: boolean;              // motion trail animation
  goldMoment: boolean;             // final score reveal
  showMargin: boolean;             // comparison bars
}
```

**Beat structure (7 beats):**
1. Drought intro — "Sarah Hughes. 2002." → counter at 2002
2. 24 years — counter ticks to 2026
3. Short program — 3 dots appear, Liu in 3rd position
4. Free skate begins — tension, dots quiver
5. Liu rising — Liu's dot accelerates upward with motion trail
6. Gold — 226.79, Liu locks to 1st position, gold moment
7. Margin — comparison score bars

**TypographicMoment:** `"24"` / `"years"` / `"Last American: Sarah Hughes, 2002. Salt Lake City."`

**Data to add to `athletes.ts` (Liu entry):**
- `shortProgramScore: number`
- `shortProgramLeaders: { name: string; score: number; country: string }[]`
- `freeSkateScore: number`

### Agent Charlie Verification

Same as Agent Alpha — `tsc`, `vitest`, `dev` (click Liu), `build`.

### Agent Charlie Commit

```bash
git add -A && git commit -m "feat: V8 Liu position-race scrollytelling"
```

---

## Agent Delta: Mobile Responsive + Motion Polish (V3 + V9)

### Context for Agent

You are handling two cross-cutting concerns: (1) making the entire app mobile-responsive (390px+), and (2) adding motion polish (Lottie animations, ambient emotion effects). These touch multiple files but don't create new athlete stories.

**Same infrastructure context as Agent Alpha above. You will be modifying existing CSS modules and adding Lottie assets.**

### Task 8: Mobile Responsive (V3)

**Files to modify:**
- `src/styles/tokens.css` — Add `100svh` support, toggle overflow for scrollytelling
- `src/components/StoryView.module.css` — Hide sidebar on mobile, full-width panel
- `src/components/StoryPanel.module.css` — Clamp all font sizes, responsive padding
- `src/components/StoryBeat.module.css` — Full-width cards, reduced padding on mobile
- `src/components/StoryViz.module.css` — Responsive scaling
- `src/components/viz/renderers/ChoiVizRenderer.module.css` — Scale run dots, comparison bars
- `src/components/AthleteOrbit.tsx` — Responsive orbit radii
- `src/components/AvatarCard.tsx` — Smaller avatars on mobile
- `src/components/TypographicMoment.module.css` — Responsive typography

**Files to create:**
- None (all CSS modifications to existing files)

**Key changes:**

**StoryView mobile collapse (`max-width: 767px`):**
```css
@media (max-width: 767px) {
  .left { display: none; }
  .panel {
    position: relative;
    width: 100%;
    border-left: none;
  }
}
```

**tokens.css overflow fix:**
- Current: `overflow: hidden` on `html, body, #root` blocks scrollytelling on mobile
- Add a `.scrollytelling-active` class that sets `overflow-y: auto; height: auto`
- StoryView toggles this class on mount/unmount via `useEffect`
- Use `100svh` instead of `100vh` for iOS Safari URL bar

**Typography (all `clamp()` based):**
```
Hero name:     clamp(28px, 7.5vw, 64px)
Hero headline: clamp(16px, 2.5vw, 24px)
Beat text:     clamp(16px, 2.5vw, 22px)
Beat subtext:  clamp(13px, 1.8vw, 14px)
Data large:    clamp(48px, 10vw, 160px)
Body:          clamp(14px, 1.8vw, 16px)
```

**Touch targets:**
- All interactive elements ≥ 44px min-height
- Hover styles wrapped in `@media (hover: hover) and (pointer: fine)`
- Step card padding: `clamp(20px, 5vw, 40px)`

**AthleteOrbit responsive:**
```typescript
const getOrbitRadii = (vw: number) => {
  if (vw < 480) return { RX: vw * 0.38, RY: vw * 0.20 };
  if (vw < 768) return { RX: vw * 0.42, RY: vw * 0.22 };
  return { RX: 320, RY: 170 };
};
```

**Performance on mobile:**
- Snowfall: reduce flake count (18 on mobile vs 40 desktop)
- Backdrop filter: `blur(12px)` on mobile (vs 16px)
- `ScrollTrigger.normalizeScroll(true)` for iOS momentum scroll

**Breakpoints:**
```
≤ 767px:    Mobile — full-width panel, compact orbit, stacked layout
768-1023px: Tablet — narrower sidebar (200px), adjusted orbit
≥ 1024px:   Desktop — unchanged
```

### Task 9: Motion Polish (V9)

**Files to create:**
- `src/assets/lottie/medal-burst.json` — Gold medal explosion animation (author or source a Lottie file)
- `src/components/effects/MedalBurst.tsx` — Lottie wrapper component
- `src/components/effects/MedalBurst.module.css`
- `src/components/effects/EmotionAmbience.tsx` — Sky/snow ambient effects tied to emotion

**Files to modify:**
- `src/components/StoryViz.tsx` — Add `MedalBurst` overlay for gold moments
- `src/components/AlpineLandscape.tsx` — Accept `emotion` prop for ambient shifts
- `src/components/Snowfall.tsx` — Accept `emotion` prop for intensity changes
- `src/components/StoryPanel.tsx` — Pass current beat emotion to landscape/snowfall
- `src/App.tsx` — Thread emotion prop through component tree

**Ambient emotion effects (driven by `StoryEmotion`):**
- `crash` → brief red-shift in sky gradient, snowfall pauses momentarily
- `triumph` → gold tint in sky, snowfall intensifies, brief particle rush
- `tension` → sky darkens slightly, snowfall slows
- `reverence` → pale/quiet sky, reduced motion, subtle glow
- `neutral` → default state, normal sky and snow

**MedalBurst implementation:**
- Use `lottie-react` `<Lottie>` component
- Trigger on viz states that have `particleBurst: true` or equivalent
- Positioned as absolute overlay on StoryViz
- Auto-play once, no loop
- Gold/warm color scheme matching the design system

**Cross-athlete transition:**
- When switching athletes (different `key` in AnimatePresence), viz dissolves gracefully
- GSAP `gsap.to(vizContainer, { opacity: 0, duration: 0.3 })` before new renderer mounts

### Agent Delta Verification

```bash
npx tsc --noEmit
npx vitest run
npm run dev                         # Test at 390px, 768px, 1024px+ widths
                                    # Verify scrollytelling works on mobile
                                    # Check emotion effects (sky shifts, snow changes)
npm run build
```

### Agent Delta Commits

```bash
git add -A && git commit -m "feat: V3 mobile responsive — full-width panel, clamp typography, touch-safe"
git add -A && git commit -m "feat: V9 motion polish — Lottie medal burst, ambient emotion effects"
```

---

# Orchestrator Protocol

## Dispatch Sequence

1. **Complete Phase 1** (Tasks 1-2) sequentially in the main worktree
2. **Verify** Phase 1 passes all checks (tsc, vitest, manual demo gate)
3. **Dispatch 4 agents in parallel**, each in `isolation: "worktree"`:
   - Agent Alpha (V4+V5): Career arcs
   - Agent Bravo (V6+V7): Drought breakers
   - Agent Charlie (V8): Position race
   - Agent Delta (V3+V9): Mobile + polish
4. **Monitor** agent progress — check in periodically, answer questions
5. **Review** each agent's output when it completes (code review)
6. **Merge** agent worktrees into main branch, resolving shared file conflicts

## Checkpoint Protocol

After each agent completes, the orchestrator should:

1. **Review the agent's diff** — does it match the plan?
2. **Run verification** — `tsc`, `vitest`, manual click-through
3. **Check shared files** — are the VizState types, story beats index, and StoryViz switch cases correctly added?
4. **Merge** — use `git merge` or cherry-pick from the worktree branch

## Merge Order

Merge agents in this order to minimize conflicts:
1. **Agent Charlie** (Liu) — smallest diff, fewest shared file changes
2. **Agent Alpha** (Klaebo + Meyers Taylor) — medium diff
3. **Agent Bravo** (Braathen + Hughes) — medium diff
4. **Agent Delta** (Mobile + Polish) — cross-cutting, merge last so it can test all athletes

After each merge: `npx tsc --noEmit && npx vitest run && npm run build`

## Escalation to User

The orchestrator should relay to the user when:
- An agent encounters an architectural ambiguity not covered by the plan
- A merge conflict requires a judgment call about which approach to keep
- A demo gate fails and the fix isn't obvious
- An agent's implementation diverges significantly from the plan's vision

## Final Verification

After all agents are merged:
- [ ] All 6 athletes have scrollytelling experiences
- [ ] Each athlete's viz is bespoke (not templated)
- [ ] Scroll backward works for all athletes
- [ ] Mobile (390px) works for all athletes
- [ ] Typographic moments render for all athletes
- [ ] Medal bursts fire on gold moments
- [ ] Ambient emotion effects shift sky/snow
- [ ] Hub, landscape, navigation untouched
- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npx vitest run` — all tests pass
- [ ] `npm run build` — clean bundle
- [ ] No console errors
