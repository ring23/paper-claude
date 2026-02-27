---
shaping: true
---

# Scrollytelling Redesign — Shaping

## Source

> I don't really like our what if and guided missions additions to our app. I'd like to completely remove and rethink how we can make our app more interactive and data viz rich.

> They felt gimmicky/shallow.

> Pudding.cool is a great example [of what engaging looks like].

> Career arcs over time and the "human" layer excite me the most.

> Real data, but curated for story — we only include data points that serve the narrative arc. If we can't find good career-arc data for one athlete, we lean into a different angle.

> Hybrid approach — keep the hub-to-athlete navigation, but within each athlete's panel, use scroll-triggered sections that reveal data progressively.

> I would also encourage you to explore powerful animated graphics, visuals, motion graphics.

---

## Problem

The WhatIf sliders and guided Missions are bolted-on novelties that don't earn their screen time. The app's core strength — data-driven storytelling about historic Olympic moments — deserves interactivity where the visualization IS the narrative, not a decoration beside text.

## Outcome

Each athlete's story becomes a Pudding.cool-style scrollytelling experience. Bespoke story beats with a sticky viz canvas that transforms as you scroll. Career arcs and human-layer details make the data personal. The hub, landscape, and navigation stay untouched.

---

## Requirements (R)

| ID | Requirement | Status |
|----|-------------|--------|
| R0 | Replace WhatIf/Missions with scroll-driven storytelling where the viz IS the narrative | Core goal |
| R1 | Sticky visualization canvas that morphs between states as user scrolls | Must-have |
| R2 | Each athlete gets bespoke story beats — not a templated/uniform experience | Must-have |
| R3 | Career arc data + human-layer details (age, hometown, personal story) per athlete | Must-have |
| R4 | Hub, alpine landscape, sky themes, and mini-nav stay untouched | Must-have |
| R5 | All data is real, cited, and curated for each athlete's strongest narrative angle | Must-have |
| R6 | Scroll animations orchestrated by Framer Motion scroll APIs (useInView, useScroll) + CSS transitions | Must-have |
| R7 | Rich motion graphics for climactic moments (gold bursts, score counters, particle effects) | Must-have |
| R8 | Typographic interstitial moments for human-layer stats between viz beats | Nice-to-have |
| R9 | Mobile-optimized — scrollytelling experience works well on phone-width viewports (390px+). Viz scales down, type remains readable, touch-friendly | Must-have |

---

## Shape A: Hybrid Scrollytelling

| Part | Mechanism | Flag |
|------|-----------|:----:|
| **A1** | **Clean slate** — Delete all WhatIf, Missions, Dashboard, Timeline files + dead imports from StoryPanel. Install `gsap`, `@gsap/react`, ScrollTrigger plugin, `lottie-react`. | |
| **A2** | **Scroll engine** — `StoryBeat` component wraps each narration step with GSAP ScrollTrigger (onEnter/onEnterBack callbacks). `StoryViz` is a sticky container (CSS `position: sticky`) that receives `vizState` and orchestrates transitions. `TypographicMoment` renders full-width stat callouts with animated counters. | |
| **A3** | **StoryPanel refactor** — Replace flat (text → chart → badges → whatif → missions) layout with scroll container: hero section → sticky StoryViz → overlapping beat narrations (glass-blur step cards at viewport bottom) → typographic moments → medal/sources footer. Negative margin overlap pattern as proven in prototype. | |
| **A4** | **Story beat data model** — `StoryBeat` type with `narration`, `vizState` (discriminated union per athlete), `emotion` (drives ambient effects), optional `humanDetail`. Each athlete gets a bespoke `storyBeats[]` array. No shared template forced on different narrative shapes. | |
| **A5** | **Per-athlete viz renderer** — `StoryViz` dispatches to athlete-specific renderers. Each renderer uses D3 for data bindings + GSAP for transitions between states. Choi: run-tracker with crash X marks → score explosion. Klaebo: lit-fuse career timeline. Meyers Taylor: 5-Olympics career path. Braathen/Hughes: drought counters. Liu: position-swap racing dots. | |
| **A6** | **Data sourcing** — Extend `athletes.ts` with career arc arrays and human-layer fields. Each athlete's data shaped to their strongest narrative (Choi = single-moment drama, Klaebo = decade of dominance, etc.). All sourced from Olympics.com, Wikipedia, ESPN, federation sites. | |
| **A7** | **Motion polish** — Lottie animations for medal-moment bursts and heartbeat lines. Gold particle system (CSS + GSAP, as proven in prototype). Ambient sky/snowfall shifts tied to beat `emotion` field. | |
| **A8** | 🟡 **Mobile responsive** — On mobile (≤768px): StoryPanel goes full-width (no MiniHub sidebar), viz scales down via `clamp()`/`vw` units, step cards stretch full-width with reduced padding, SVG visualizations use `viewBox` for fluid scaling, font sizes use `clamp()` for readability floor (min 14px body), touch-safe tap targets (44px+). Scrollytelling pattern is inherently mobile-native (vertical scroll). | |

---

## Fit Check: R × A

| Req | Requirement | Status | A |
|-----|-------------|--------|---|
| R0 | Replace WhatIf/Missions with scroll-driven storytelling where the viz IS the narrative | Core goal | ✅ |
| R1 | Sticky visualization canvas that morphs between states as user scrolls | Must-have | ✅ |
| R2 | Each athlete gets bespoke story beats — not a templated/uniform experience | Must-have | ✅ |
| R3 | Career arc data + human-layer details per athlete | Must-have | ✅ |
| R4 | Hub, alpine landscape, sky themes, and mini-nav stay untouched | Must-have | ✅ |
| R5 | All data is real, cited, and curated for each athlete's strongest narrative angle | Must-have | ✅ |
| R6 | Scroll animations orchestrated by Framer Motion scroll APIs | Must-have | ✅ |
| R7 | Rich motion graphics for climactic moments | Must-have | ✅ |
| R8 | Typographic interstitial moments for human-layer stats | Nice-to-have | ✅ |
| R9 | Mobile-optimized — scrollytelling works on 390px+ viewports, readable type, touch-friendly | Must-have | ✅ |

**Notes:**
- R9 satisfied by A8: `clamp()` sizing, `viewBox` SVGs, full-width mobile layout, 44px+ touch targets

**Shape A selected. All requirements satisfied.**

---

## Prototype

Working HTML prototype validates the scroll mechanics, viz transitions, and overall feel:
`docs/prototypes/choi-scrollytelling.html`

Demonstrates: sticky viz with GSAP ScrollTrigger, run-tracker state machine, score counter animation, gold particle burst, typographic moments, glass-blur narration cards.

---

## Design References

- **Design system**: `src/components/viz/chartTheme.ts` — gold (#C6982B), navy (#0B1D3A), slate (#3D5A73), mist (#7A95AA)
- **Typography**: Archivo Black (display), Inter (body/labels), Space Grotesk (data/numbers)
- **Per-athlete sky themes**: defined in `athletes.ts` `skyTheme` field
- **Design doc**: `docs/plans/2026-02-26-scrollytelling-redesign.md`
