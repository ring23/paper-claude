---
shaping: true
---

# Scrollytelling Redesign — Slices

Parent: `docs/shaping/scrollytelling-redesign-shaping.md`

---

## Slice Overview

| Slice | Title | Demo Gate | Dependencies |
|-------|-------|-----------|--------------|
| **V1** | Clean Slate | App runs, WhatIf/Missions gone, new deps installed | None |
| **V2** | Scroll Engine + Choi Story | Click Choi → full scrollytelling experience with viz transitions | V1 |
| **V3** | Mobile Responsive | App works on 390px viewport, scrollytelling included | V2 |
| **V4** | Klaebo Story | Click Klaebo → lit-fuse career timeline scrollytelling | V2 |
| **V5** | Meyers Taylor Story | Click Meyers Taylor → career-path scrollytelling | V2 |
| **V6** | Braathen Story | Click Braathen → drought-counter scrollytelling | V2 |
| **V7** | Hughes Story | Click Hughes → game-replay scrollytelling | V2 |
| **V8** | Liu Story | Click Liu → position-race scrollytelling | V2 |
| **V9** | Motion Polish | Lottie medal bursts, ambient emotion effects, particle refinement | V2+ |

V4–V8 are independent of each other (parallelizable). V9 can be woven in alongside or after.

---

## V1: Clean Slate

**Goal:** Remove all deprecated features, install new dependencies, verify app compiles and runs clean.

### Files to Delete (22 files)

**Components:**
- `src/components/WhatIfPanel.tsx` + `WhatIfPanel.module.css`
- `src/components/MissionPanel.tsx` + `MissionPanel.module.css`
- `src/components/Dashboard.tsx` + `Dashboard.module.css`
- `src/components/TimelineView.tsx` + `TimelineView.module.css`

**Data:**
- `src/data/whatif-scenarios.ts`
- `src/data/missions.ts`
- `src/data/timeline.ts`

**Types:**
- `src/types/whatif.ts`
- `src/types/mission.ts`
- `src/types/timeline.ts`

**Utils:**
- `src/utils/hypothetical.ts`
- `src/utils/missions.ts`
- `src/utils/dashboard.ts`
- `src/utils/timeline.ts`

**Tests:**
- `tests/whatif.test.ts`
- `tests/missions.test.ts`
- `tests/dashboard.test.ts`
- `tests/timeline.test.ts`

### Files to Edit

**`src/components/StoryPanel.tsx`** — Remove:
- `import MissionPanel from "./MissionPanel";` (line 7)
- `import WhatIfPanel from "./WhatIfPanel";` (line 9)
- `whatif: 0.55,` and `missions: 0.85,` from `staggerDelays`
- The `<motion.div>` block wrapping `<WhatIfPanel>` (lines 78-81)
- The `<motion.div>` block wrapping `<MissionPanel>` (lines 97-101)

### New Packages

```bash
npm install gsap @gsap/react lottie-react
```

- `gsap` — animation engine + ScrollTrigger (bundled)
- `@gsap/react` — `useGSAP` hook for React context cleanup
- `lottie-react` — Lottie JSON playback for motion graphics

### Also delete old viz components (clearing way for V2)

- `src/components/viz/AthleteViz.tsx`
- `src/components/viz/RunArc.tsx` + `RunArc.module.css`
- `src/components/viz/TimeGapChart.tsx` + `TimeGapChart.module.css`
- `src/components/viz/SaveGauge.tsx` + `SaveGauge.module.css`
- `src/components/viz/ShotChart.tsx` + `ShotChart.module.css`
- `src/components/viz/ScoreLollipop.tsx` + `ScoreLollipop.module.css`
- `src/components/viz/PositionSwap.tsx` + `PositionSwap.module.css`
- `src/components/viz/CareerTimeline.tsx` + `CareerTimeline.module.css`
- `src/components/viz/RadialSweep.tsx` + `RadialSweep.module.css`
- `src/components/viz/GoldLeaderboard.tsx` + `GoldLeaderboard.module.css`

**Keep:** `src/components/viz/chartTheme.ts`, `src/components/viz/useD3.ts`

**Edit `StoryPanel.tsx`:** Also remove the `<AthleteViz>` import and JSX block. StoryPanel becomes a minimal shell (header + story text + medal/sources) until V2 replaces it entirely.

### Verification

1. `npx tsc --noEmit` — zero errors
2. `npx vitest run` — surviving tests pass
3. `npm run dev` — hub loads, click athlete, panel renders (minus charts/whatif/missions)
4. `npm run build` — clean bundle

### Demo Gate

App runs exactly as before, minus WhatIf/Missions panels and D3 charts. StoryPanel shows header, headline, story text, medal badge, and sources. No scroll errors in console.

---

## V2: Scroll Engine + Choi Gaon Story

**Goal:** Build the entire scroll infrastructure and prove it with Choi's story. This is the proof-of-concept slice.

### New Types (`src/types/story.ts`)

```typescript
export type StoryEmotion =
  | "neutral" | "tension" | "crash" | "triumph" | "reverence" | "momentum" | "longing"

export interface BeatNarration {
  label?: string       // eyebrow above text, e.g. "Run 1"
  text: string         // HTML-safe: supports <em> (gold) and <span class="accent-red">
  subtext?: string     // smaller secondary line
}

export interface TypographicMomentData {
  bigNumber: string
  unit: string
  context: string      // supports <strong> for gold accent
}

export interface StoryBeatData<TVizState = VizState> {
  id: string
  narration: BeatNarration
  vizState: TVizState
  emotion: StoryEmotion
  humanDetail?: TypographicMomentData
}

// Per-athlete viz states — discriminated union
export type RunDotState = "pending" | "crashed" | "crashed-dim" | "active" | "gold"
export type ChoiCenterDisplay = "setup" | "crash1" | "crash2" | "tension" | "gold" | "podium"

export interface ChoiVizState {
  type: "choi"
  centerDisplay: ChoiCenterDisplay
  runDots: [RunDotState, RunDotState, RunDotState]
  showComparison: boolean
  particleBurst: boolean
  bgGlow: boolean
}

// ... other athlete VizState types (stubbed in V2, implemented in V4-V8)

export type VizState = ChoiVizState // | KlaeboVizState | ... (extended per slice)
```

### New Components

**`StoryBeat`** — ScrollTrigger wrapper per narration step
- Props: `beat`, `index`, `onActivate`, `scroller` (ref to scroll container)
- Creates `ScrollTrigger.create()` inside `useGSAP` with `scroller` prop
- Triggers at `start: "top 55%"`, `end: "bottom 45%"`
- Renders glass-blur card with narration text at viewport bottom
- **Critical:** Must set `scroller: scrollerRef.current` — the scroll container is StoryView's `.panel` div, not `window`

**`StoryViz`** — Sticky viz container
- Props: `athlete`, `vizState`
- `position: sticky; top: 0; height: 100vh; z-index: 1; pointer-events: none`
- Dispatches to athlete-specific renderer via `switch (vizState.type)`
- Purely reactive — no scroll awareness, just receives state

**`TypographicMoment`** — Full-viewport stat callout
- Props: `detail`, `scroller`
- Own GSAP ScrollTrigger for entrance animation
- Staggered reveal: bigNumber → unit → divider → context
- Lives BELOW the scrolly section in document flow

**`ChoiVizRenderer`** — First athlete-specific renderer
- Direct translation of `goToBeat()` state machine from prototype
- HTML elements (not SVG) for run tracker + center display + comparison bars
- GSAP `gsap.to()` transitions on scene change (no clear-and-redraw)
- `useGSAP({ dependencies: [scene] })` triggers transitions
- Gold particle burst spawned via GSAP on `particleBurst: true`

### StoryPanel Refactor

Replace entire StoryPanel internals with scroll layout:

```
StoryPanel (full width of .panel)
├── Hero section (100vh)
│   ├── Flag + sport label
│   ├── Athlete name (Archivo Black, clamp sizing)
│   ├── Headline (gold italic)
│   └── Scroll hint arrow
├── Scrolly section (position: relative)
│   ├── StoryViz (position: sticky, top: 0, 100vh)
│   └── Steps overlay (margin-top: -100vh, z-index: 10)
│       ├── StoryBeat × N (each min-height: 100vh)
│       └── (glass-blur cards at bottom of each step)
├── TypographicMoment(s) (below scrolly, normal flow)
├── Footer
│   ├── HistoricCounter
│   ├── MedalBadge
│   └── SourceAttribution
```

### StoryView Edit

Add `panelRef` on the `.panel` div, pass as `scrollerRef` to StoryPanel.

### GSAP Registration

Add to `src/main.tsx` (once, at module level):
```typescript
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

### Choi Beat Data (`src/data/storyBeats/choi.ts`)

6 beats:
1. **Setup** — "Three runs. Ninety seconds each." → neutral, 3 pending dots
2. **Run 1 crash** — "She clips the lip." → crash, dot 1 red X
3. **Run 2 crash** — "Washed out on the first hit." → crash, dot 2 red X
4. **Tension** — "One run left." → tension, dot 3 pulsing gold
5. **Gold** — "She drops in." → triumph, score counter 0→90.25, particle burst
6. **Podium** — "She dethroned Chloe Kim." → triumph, comparison bars

TypographicMoment after beat 5: `"17"` / `"years, 101 days"` / `"South Korea's first-ever Olympic snow-sport gold medalist."`

### New CSS Modules

- `StoryPanel.module.css` — hero, scrolly container, steps overlay (negative margin), footer
- `StoryBeat.module.css` — min-height 100vh step, glass-blur card
- `StoryViz.module.css` — sticky panel, inner container
- `TypographicMoment.module.css` — big number, unit, divider, context
- `ChoiVizRenderer.module.css` — run tracker, center display states, comparison bars

### Demo Gate

Click Choi from hub → hero section with name/headline → scroll through 6 beats with viz transforming (run tracker crashes, tension pulse, score explosion, comparison bars) → typographic "17 years old" moment → medal/sources footer. Scroll back up and transitions reverse cleanly.

---

## V3: Mobile Responsive

**Goal:** App works on 390px viewport. Scrollytelling experience fully functional on mobile.

### Layout Changes

**StoryView mobile collapse (`max-width: 767px`):**
- Hide `.left` (MiniHub sidebar): `display: none`
- `.panel` becomes full-width: `position: relative; width: 100%`

**Mobile nav option:** Horizontal strip of `sm` avatar circles at top, `position: fixed`, backdrop-blur. OR: simple back-to-hub button. (Decision deferred to implementation — start with back button, consider nav strip as polish.)

**AthleteOrbit responsive radii:**
```typescript
const getOrbitRadii = (vw: number) => {
  if (vw < 480) return { RX: vw * 0.38, RY: vw * 0.20 };
  if (vw < 768) return { RX: vw * 0.42, RY: vw * 0.22 };
  return { RX: 320, RY: 170 };
};
```
- AvatarCard `lg` size → 80px on mobile (down from 120px)
- Hide sport label on mobile, show last name only

**App root overflow fix:**
- Current: `overflow: hidden` on `html, body, #root` — blocks scrollytelling
- Fix: Toggle body class `scrollytelling` when in story view, setting `overflow-y: auto; height: auto`
- Use `100svh` instead of `100vh` for full-height sections (iOS Safari URL bar)

### Typography

Replace all fixed `font-size` values with `clamp()`:
- Display: `clamp(28px, 7.5vw, 40px)`
- Hero: `clamp(40px, 8vw, 64px)`
- Step text: `clamp(16px, 2.5vw, 22px)`
- Body: `clamp(14px, 1.8vw, 16px)`
- Data large: `clamp(48px, 10vw, 72px)`

### Touch

- All tap targets ≥ 44px min-height
- Hover styles wrapped in `@media (hover: hover) and (pointer: fine)`
- Scroll listeners use `{ passive: true }`
- Step card padding: `clamp(20px, 5vw, 40px)`

### Performance

- Snowfall flake count: 18 on mobile (down from 40)
- `backdrop-filter: blur(12px)` on mobile (down from 24px)
- `ScrollTrigger.normalizeScroll(true)` for iOS momentum scroll

### Breakpoints

```
≤ 767px  — Mobile: full-width panel, compact orbit, stacked layout
768–1023 — Tablet: narrower sidebar (200px), adjusted orbit
≥ 1024   — Desktop: current layout unchanged
```

### Demo Gate

Open on iPhone (or Chrome DevTools 390px): hub renders with compact orbit, all athletes visible, tap to enter story, scrollytelling works with touch, text readable, no overflow/clipping. Tap back to hub works.

---

## V4: Klaebo Story

**Goal:** Lit-fuse career timeline visualization.

### Beat Structure (10 beats)

1. Intro — "Six events. No one has ever done this."
2. PyeongChang 2018 — fuse ignites, 3 golds light
3. Beijing 2022 — fuse extends, +2 golds
4. Milano begins — fuse approaches 2026
5. Golds 1-2 — Skiathlon + Sprint Classic
6. Golds 3-4 — 10km Free + Relay
7. Gold 5 — Heiden record tied (reverence beat)
8. Gold 6 — 50km, +8.9s, full explosion
9. Career total — 11 golds leaderboard vs Dæhlie/Bjørgen/Bjørndalen (8)
10. Coda — "Only Phelps has more. Ever."

TypographicMoment: `"6/6"` / `"events · six golds"`

### Data Additions to `KlaeboVizData`

- `events2026[].date` — for chronological fuse animation
- `careerGoldsByYear: { year, event, games }[]` — 11 individual entries

### New File

- `src/data/storyBeats/klaebo.ts`
- `src/components/viz/renderers/KlaeboVizRenderer.tsx` + CSS module

### Demo Gate

Click Klaebo → scroll through fuse burning across career → 6 golds lighting up → record-breaking moment → leaderboard comparison.

---

## V5: Meyers Taylor Story

**Goal:** Career-path visualization spanning 5 Olympics.

### Beat Structure (8 beats)

1. Intro — "Five Olympics. Sixteen years."
2. Vancouver 2010 — bronze dot
3. Sochi 2014 — silver dot
4. PyeongChang 2018 — silver dot
5. Beijing 2022 — two dots
6. Gap — "A baby. The pandemic. A comeback at 40." (longing)
7. Milano tension — trailing by 0.12s, last run
8. Gold — 59.51, fastest heat ever

TypographicMoments: `"41"` / `"years old"` and `"0.04"` / `"seconds"`

### Data Additions

- `ageAtEachOlympics[]`, `heat4Rank`, `trailingMarginAfterRun3`

### Demo Gate

Click Meyers Taylor → career path draws across 5 Olympics → age counter → tension heat 4 → gold.

---

## V6: Braathen Story

**Goal:** Drought-counter visualization.

### Beat Structure (7 beats)

1. Intro — 1924, first Winter Olympics
2. Drought start — counter begins
3. Counter running — 26 editions tick past (animated)
4. Run 1 — bar chart, leads by 0.58s
5. Run 2 — combined time locked
6. Drought broken — gold burst at 2026 endpoint
7. Podium — comparison bars

TypographicMoment: `"102"` / `"years"` / `"Zero South American medals."`

### Data Additions

- `winterGamesEditions[]` — 26 entries for counter animation
- `run2Time`, `run1Rank`

### Demo Gate

Click Braathen → drought counter ticks 1924→2026 → run gaps → gold explosion.

---

## V7: Hughes Story

**Goal:** Game-replay + drought visualization.

### Beat Structure (8 beats)

1. 1980 Miracle — drought counter starts
2. 46 years — counter animates
3. Pregame — rink diagram
4. P1 goal — Boldy, USA 1-0
5. P2 wall — Hellebuyck save gauge fills
6. OT setup — 3v3, 1-1
7. OT goal — Hughes top shelf
8. Coda — "Not a miracle. Inevitable."

TypographicMoment: `"41"` / `"saves"` / `"Hellebuyck faced 42 shots."`

### Data Additions

- `gameChronology[]` — full event sequence for replay
- `droughtGames[]` — US results 1984-2022

### Demo Gate

Click Hughes → drought counter → game replay beats → OT winner → gold.

---

## V8: Liu Story

**Goal:** Position-race + comeback visualization.

### Beat Structure (7 beats)

1. Drought intro — Sarah Hughes 2002
2. 24 years — counter animates
3. Short program — 3 dots, Liu in 3rd
4. Free skate begins — tension
5. Liu rising — dot accelerates with motion trail
6. Gold — 226.79, dot locks to 1st
7. Margin — comparison bars

TypographicMoment: `"24"` / `"years"` / `"Last American: Sarah Hughes, 2002."`

### Data Additions

- `shortProgramScore`, `shortProgramLeaders[]`, `freeSkateScore`

### Demo Gate

Click Liu → drought → standings dots → position swap animation → score reveal.

---

## V9: Motion Polish

**Goal:** Elevate the emotional impact of climactic moments.

### Scope

- **Lottie medal burst** — JSON animation for gold-medal moments (replaces CSS-only particle burst)
- **Heartbeat/tension line** — Lottie or GSAP-drawn for "one run left" tension moments
- **Ambient emotion effects** — sky gradient shift and snowfall intensity tied to `beat.emotion`:
  - `crash` → brief red-shift in sky, snowfall pauses
  - `triumph` → gold glow, snowfall intensifies
  - `tension` → sky darkens, snowfall slows
  - `reverence` → pale/quiet, reduced motion
- **Cross-athlete transition** — when switching athletes, viz dissolves gracefully before new one builds

### Demo Gate

Scroll through Choi's story → crash moments feel sharp (red sky flash), gold moment has Lottie burst + gold glow + snow rush. Same emotional effects work across all athletes.

---

## Implementation Order

```
V1 (Clean Slate)
  ↓
V2 (Scroll Engine + Choi)  ← the critical proof-of-concept
  ↓
V3 (Mobile)
  ↓
V4–V8 (Remaining athletes, parallelizable)
  ↓
V9 (Motion Polish)
```

V3 can optionally be deferred after V4-V8 if mobile is lower priority, but the sooner it's done, the easier it is to catch layout issues in subsequent athlete slices.
