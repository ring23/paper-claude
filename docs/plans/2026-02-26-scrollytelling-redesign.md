# Scrollytelling Redesign: Career Arcs & Human Layer

**Date:** 2026-02-26
**Status:** Draft

---

## Problem

The WhatIf sliders and guided Missions features feel gimmicky and shallow. They're bolted onto the story panels rather than being organic to the experience. The app needs interactivity with real substance — the kind that makes data the storytelling medium, not a decoration beside text.

## Inspiration

Pudding.cool-style data-driven scrollytelling. The visualization IS the narrative. Scroll-driven, surprising data reveals, "oh wow I didn't know that" moments. Dense, layered datasets shown from unexpected angles.

## Core Concept

Each athlete's StoryPanel becomes a vertical scrollytelling experience. Instead of a static chunk of text + chart + badges, you scroll through **story beats** — discrete narrative moments where the visualization transforms to match. The viz is always visible (sticky-positioned), and as you scroll, it morphs between states.

**Example — Choi Gaon's story in 4 beats:**
- **Beat 1:** "17 years old. First Olympics." — Simple silhouette, heartbeat line flat
- **Beat 2:** "Run 1: crash. Run 2: crash." — Line spikes and flatlines twice, red X marks appear
- **Beat 3:** "Run 3: everything on the line." — Line builds in real-time, tension animation, score ticking up
- **Beat 4:** "90.25. Gold." — Explosion of the score, comparison lollipops fade in showing she beat the field

The hub, alpine landscape, sky themes, and mini-nav all stay exactly as they are. The change is entirely within what happens after you click into an athlete.

---

## Visual & Motion Layer

### Sticky viz canvas that morphs between beats

Instead of separate D3 charts per athlete, each athlete gets ONE persistent visual canvas that transforms between story beats. A line chart dissolves into particles that reform as a bar chart. The viz is the constant; the data and form shift.

### Visual ideas per story archetype

**Career arc athletes (Klaebo, Meyers Taylor):**
A trail/path visualization — like a lit fuse burning across their career timeline. Gold medals pulse and glow as the fuse reaches them. Meyers Taylor's path spans 16 years and 5 Olympic rings.

**Single-moment athletes (Choi, Liu):**
Real-time replay visualizations — Choi's 3 runs as an animated line that draws itself, with a heartbeat/tension meter. Liu's position-swap animated as racing dots overtaking each other.

**Drought-breaker athletes (Braathen, Hughes):**
Calendar/time visualizations — 102 years of empty podiums filling in as ghostly silhouettes, then Braathen appears in gold. A counter ticking up from 1924 to 2026.

### The human layer — between beats

Typographic moments. Full-screen pull quotes. "Population of his hometown: 4,200. Crowd at the finish line: 28,000." Numbers that count up with animated typography against the alpine backdrop.

---

## Data Model: Story Beats

Each athlete gets a `storyBeats[]` array — the ordered sequence of narrative moments. Each beat has:

- **`narration`** — the text that appears as you scroll into this beat (short, punchy — Pudding-style one-liners or stat callouts)
- **`vizState`** — what the sticky visualization should show (which chart type, what data slice, what's highlighted)
- **`emotion`** — drives ambient effects: sky color shift, snowfall intensity, particle bursts
- **`humanDetail`** (optional) — a typographic interstitial ("Age at first Olympics: 15. Age at gold: 17.")

The beats are bespoke per athlete, not templated. Choi gets 6 beats centered around 90 seconds of competition. Klaebo gets 10+ beats spanning a decade of dominance. Meyers Taylor's story breathes across 5 Olympic cycles.

### Data to source per athlete

| Athlete | Career Arc Data | Human Layer |
|---|---|---|
| **Braathen** | GS results 2021-2026, retirement/return timeline | Dual citizenship story, father's Brazilian roots, hometown size |
| **Hughes** | NHL seasons 2019-2026, point totals, playoff runs | Draft pressure at 17, brother rivalry, NJ Devils journey |
| **Liu** | Competition scores 2019-2026, junior-to-senior transition | Started skating age 5, triple axel at 13, Bay Area upbringing |
| **Meyers Taylor** | All Olympic results 2010-2026, world championship placings | Softball-to-bobsled switch, motherhood, military service |
| **Klaebo** | World Cup season standings 2017-2026, all Olympic golds | Grandfather as first coach, Trondheim training, dominance stats |
| **Choi** | Competition scores 2023-2026, X Games/World Cup results | Age at each milestone, hometown, prior crashes |

All sourceable from Olympics.com, Wikipedia, ESPN, and federation sites — the same sources we already cite.

---

## Architecture

### What stays untouched
- `App.tsx` navigation (hub <-> story)
- `AlpineLandscape` parallax background + sky themes
- `HubView`, `OlympicRings`, `AthleteOrbit`, `AvatarCard`
- `MiniHub` sidebar navigation

### What gets replaced
- **`StoryPanel` internals** — instead of a flat list of (text -> chart -> badges -> whatif -> missions), it becomes a scroll container with a sticky viz + beat narrations
- **All current per-athlete D3 viz components** (`RunArc`, `TimeGapChart`, `SaveGauge`, `ScoreLollipop`, `PositionSwap`, `CareerTimeline`, `RadialSweep`, `GoldLeaderboard`, `ShotChart`) — replaced by a new unified `StoryViz` component that morphs between states via GSAP
- **`WhatIfPanel`, `MissionPanel`**, and all supporting files — deleted entirely
- **`Dashboard`, `TimelineView`** — already disconnected, deleted as part of cleanup

### What gets added

**New packages:**
- `gsap` + `@gsap/react` + ScrollTrigger plugin — scroll-driven animation orchestration
- `lottie-react` — crafted motion graphics (medal bursts, heartbeat lines, particle effects)

**New components:**
- `StoryBeat` — scroll-trigger wrapper for each narrative moment
- `StoryViz` — the sticky canvas that receives `vizState` and transitions between chart types using GSAP + D3
- `TypographicMoment` — full-width stat callouts with animated number counters

**New data:**
- `storyBeats` data files per athlete (or one consolidated file with bespoke beat arrays)
- Extended athlete data with career arcs and human-layer details

### Scroll mechanics inside StoryPanel

```
StoryPanel (overflow-y: scroll)
├── Hero section (athlete name, avatar, headline)
├── StoryViz (position: sticky, stays visible)
├── Beat 1 narration (ScrollTrigger fires -> StoryViz morphs)
├── Beat 2 narration (ScrollTrigger fires -> StoryViz morphs)
├── ...
├── TypographicMoment ("hometown pop: 4,200")
├── Final beat (medal moment)
├── MedalBadge + SourceAttribution
└── HistoricCounter
```

---

## Deletion Inventory

### Files to delete entirely
- `src/components/WhatIfPanel.tsx` + `WhatIfPanel.module.css`
- `src/components/MissionPanel.tsx` + `MissionPanel.module.css`
- `src/components/Dashboard.tsx` + `Dashboard.module.css`
- `src/components/TimelineView.tsx` + `TimelineView.module.css`
- `src/data/whatif-scenarios.ts`
- `src/data/missions.ts`
- `src/data/timeline.ts`
- `src/types/whatif.ts`
- `src/types/mission.ts`
- `src/types/timeline.ts`
- `src/utils/hypothetical.ts`
- `src/utils/missions.ts`
- `src/utils/dashboard.ts`
- `src/utils/timeline.ts`
- `tests/whatif.test.ts`
- `tests/missions.test.ts`

### Files to edit (remove dead imports/references)
- `src/components/StoryPanel.tsx` — remove WhatIfPanel and MissionPanel imports and JSX
- `src/components/StoryPanel.module.css` — remove orphaned styles

---

## Implementation Approach

This is a large redesign. Suggested phasing:

### Phase 1: Clean slate
- Delete all WhatIf/Mission/Dashboard/Timeline files
- Clean StoryPanel of dead references
- Install GSAP + ScrollTrigger + lottie-react
- Verify app still runs clean

### Phase 2: Scroll infrastructure
- Build `StoryBeat` scroll-trigger component
- Build `StoryViz` sticky container
- Build `TypographicMoment` component
- Refactor `StoryPanel` to use new scroll layout
- Wire up GSAP ScrollTrigger basics

### Phase 3: First athlete story (Choi Gaon)
- Research and source Choi's career data + human details
- Write Choi's `storyBeats[]` data
- Build Choi's viz states (run arc replay, score explosion)
- Polish transitions and timing
- This becomes the template/proof-of-concept

### Phase 4: Remaining athletes
- One athlete at a time, each with bespoke beats and viz states
- Research, data, beats, viz, polish per athlete

### Phase 5: Motion polish
- Lottie animations for medal moments
- Ambient effects tied to emotion states
- Cross-athlete transition refinements
