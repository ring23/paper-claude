# Micro-Interactions & Polish Design — First Light: The Podium

> Making the app feel alive through atmosphere, choreography, and ambient motion.

## Principles

1. **Felt, not seen** — The best micro-interactions are ones users sense but don't consciously notice. Subtlety over spectacle.
2. **Compound delight** — Each small detail alone is negligible. Together they create the feeling of a living world.
3. **Performance first** — All ambient animations use CSS transforms/opacity or Framer Motion values. No layout thrashing. Target 60fps.
4. **Meaningful motion** — Every animation communicates something: depth, focus, transition, life. No motion for motion's sake.

## Tools

- **Framer Motion** (already in project) — `useMotionValue`, `useTransform`, `layoutId`, `AnimatePresence`, spring physics
- **CSS animations** — For continuous ambient loops (aurora, shimmer, breathing) where JS overhead isn't needed
- **CSS custom properties** — For dynamic theming (sky color shifts per athlete)

---

## 1. Atmosphere & Depth

### 1.1 Parallax Cursor Tracking

**What:** As the mouse moves across the 1440x900 viewport, the 3 mountain layers shift horizontally at different rates. Creates instant depth perception.

**Implementation:**
- Track mouse position with `useMotionValue` on the root container
- Transform mouse X (0–1440) into layer offsets:
  - Far mountains: ±5px shift
  - Mid mountains: ±12px shift
  - Near mountains: ±20px shift
- Sky and snow field stay fixed (anchored to viewport)
- Use `useTransform` with smooth spring interpolation to avoid jittery tracking
- On touch devices / no mouse: disable (or use device orientation if available)

**Timing:** Continuous, spring-damped (stiffness ~50, damping ~30 for gentle lag)

### 1.2 Athlete-Themed Sky Shifts

**What:** When a story panel opens, the sky gradient subtly shifts to echo the athlete's country/identity colors. The world changes mood to match the story.

**Color mapping:**
| Athlete | Sky Shift | Reasoning |
|---|---|---|
| Braathen | Warm golden horizon tones | Brazil's yellow/green warmth |
| Hughes | Cooler blue-steel, slightly desaturated | American ice, hockey arena feel |
| Liu | Soft rose undertone at horizon | Elegance, figure skating artistry |
| Meyers Taylor | Deep warm amber low sky | Grit, endurance, golden hour |
| Klaebo | Deeper Nordic blue, crisper contrast | Norwegian winter, dominance |
| Choi | Subtle warm red-pink at horizon edge | Korean flag energy, youth |

**Implementation:**
- Each athlete object gets a `skyTheme` property: an array of 3 hex values (deep, mid, pale) that replace the default sky gradient
- Transition via CSS custom properties (`--sky-deep`, `--sky-mid`, `--sky-pale`) with `transition: 2s ease`
- On panel close, transition back to default sky

**Timing:** 2s ease-in-out on open, 1.5s on close (slightly faster return feels natural)

### 1.3 Snow Intensity Modulation

**What:** Snow falls gently in the hub view. When a story panel opens, snowfall slows dramatically — a "time stands still" moment. On close, it resumes.

**Implementation:**
- Current snowfall uses randomized fall durations per flake
- Add a global `snowSpeed` multiplier (CSS custom property or Framer Motion value)
- Hub view: `snowSpeed: 1` (normal)
- Story panel open: animate `snowSpeed` to `0.3` over 1s
- Story panel close: animate back to `1` over 0.8s
- The slowing creates a cinematic "breath held" feeling during the story reveal

**Timing:** 1s to slow, 0.8s to resume

---

## 2. Transition Choreography

### 2.1 Avatar Hero Flight

**What:** When clicking an athlete in the hub, their avatar flies from its orbit position to the story panel's avatar slot. Other avatars scatter before settling into the mini-hub grid.

**Implementation:**
- Already using Framer Motion `layoutId` for shared element transitions
- Enhance with explicit spring config: `stiffness: 280, damping: 30` for a snappy-but-smooth flight
- The clicked avatar scales from its hub size to the story panel size during flight
- Country gradient ring stays visible throughout the flight (visual continuity)

**Sequence:**
1. **0ms:** Click registered. Clicked avatar begins flight.
2. **0-50ms:** Other 5 avatars begin scattering outward (opacity dims to 0.4, scale to 0.9, drift outward 20px)
3. **100-400ms:** Hero avatar in flight (spring physics, ~300ms)
4. **300ms:** Frost glass panel begins entering from right
5. **400ms:** Hero avatar lands in story panel position
6. **400-500ms:** Other avatars settle into mini-hub 3x2 grid positions
7. **500ms+:** Content stagger begins (see 2.2)

### 2.2 Staggered Panel Content Reveal

**What:** Story panel content builds in layers rather than appearing as a block. Each layer enters 80-120ms after the previous one.

**Sequence (starting after avatar lands at ~400ms):**
1. **+0ms:** Frosted glass backdrop fully visible (entered during 2.1)
2. **+0ms:** Athlete name + country/sport metadata fade up
3. **+100ms:** Gold headline fades up
4. **+200ms:** Achievement text appears
5. **+320ms:** Stat cards / D3 visualizations animate in (staggered 80ms between cards)
6. **+500ms:** Story narrative text fades up
7. **+600ms:** Historic counter begins counting, medal badge appears
8. **+700ms:** Source attribution link fades in (last, lowest priority)

**Animation per element:** `opacity: 0 → 1`, `y: 12px → 0`, `duration: 400ms`, `ease: [0.25, 0.1, 0.25, 1]`

**Stagger:** 80-120ms between groups. Total reveal: ~700ms from panel landing.

### 2.3 Story-to-Story Crossfade

**What:** When switching athletes from the mini-hub, outgoing content fades down while incoming content fades up, with a brief glass-only moment.

**Sequence:**
1. **0ms:** Click new athlete in mini-hub
2. **0-200ms:** Current story content fades out (opacity 1 → 0, y: 0 → -8px)
3. **100-300ms:** Current hero avatar flies to mini-hub; new avatar flies from mini-hub to panel (simultaneous swap using `layoutId`)
4. **200ms:** Brief moment — only frosted glass visible. Clean palate.
5. **200-900ms:** New content stagger reveal (same as 2.2, compressed to ~500ms since panel is already open)

**Key detail:** The frosted glass panel itself does NOT exit and re-enter. It stays. Only the content inside transitions. This feels faster and more fluid than a full panel swap.

### 2.4 Panel Close: Reverse Choreography

**What:** Closing reverses the open sequence. Content collapses, avatar flies home, world reassembles.

**Sequence:**
1. **0ms:** Close triggered (click mini-hub background or press Escape)
2. **0-200ms:** Story text, stats, headline fade out simultaneously (faster than the staggered open — collapse is quicker than reveal)
3. **200-500ms:** Hero avatar flies from panel back to its orbit position (spring physics)
4. **200ms:** Frost glass panel begins sliding out to the right
5. **300-600ms:** Mini-hub avatars fly from grid back to orbit ellipse positions
6. **500ms:** Panel fully gone. Hub view restored.
7. **500-700ms:** Title lockup and Olympic rings scale/fade back to full size

**Design note:** Close should feel ~30% faster than open. Opening builds anticipation; closing should feel swift and clean.

---

## 3. Ambient Motion

### 3.1 Aurora Light Sweep

**What:** A very subtle, slow-moving gradient overlay across the sky. Northern lights energy but barely perceptible.

**Implementation:**
- A `div` layered between the sky gradient and the first mountain layer
- Background: horizontal linear gradient (transparent → rgba(white, 0.06) → transparent), ~30% width of viewport
- CSS animation: `translateX(-100%)` to `translateX(200%)` over 18-22 seconds, infinite loop
- Opacity: 5-8% — felt more than seen
- Consider a second sweep layer at different speed/angle for organic feel
- Pause during story panel open (keep focus on content)

**Timing:** 18-22s loop, linear easing

### 3.2 Olympic Rings Pulse

**What:** The gold glow on the Olympic rings gently breathes.

**Implementation:**
- The existing gold glow (likely a `filter: drop-shadow` or `box-shadow`) gets a CSS animation
- Animate glow opacity: 0.3 → 0.6 → 0.3
- Sinusoidal easing (`ease-in-out`)
- 4s full cycle
- In story view (mini-hub), reduce to a gentler pulse (0.2 → 0.35) at smaller ring size

**Timing:** 4s cycle, continuous

### 3.3 Title Shimmer

**What:** "FIRST LIGHT" gets a slow-moving highlight that sweeps across the text, evoking the name literally — light passing across a surface.

**Implementation:**
- CSS `background-clip: text` with a gradient that includes a bright highlight band
- Animate `background-position` to sweep the highlight left-to-right
- Gradient: solid text color → slightly lighter band (~120% brightness, 40px wide) → solid text color
- Triggers every ~10 seconds, sweep takes ~2s
- Only on "FIRST LIGHT" text, not subtitle
- In mini-hub state, disable or reduce frequency (smaller text, less impact)

**Timing:** 2s sweep, 10s interval between sweeps

### 3.4 Mountain Breathing

**What:** The nearest mountain layer has a barely perceptible vertical oscillation, like the landscape gently inhaling.

**Implementation:**
- CSS animation on the near mountain layer: `translateY(0px)` → `translateY(-1.5px)` → `translateY(0px)`
- Sinusoidal easing
- 8s full cycle
- Only the nearest layer breathes. Mid and far stay static. This reinforces depth.
- The snow field at the base could have a matching micro-shift to stay connected

**Timing:** 8s cycle, continuous, sinusoidal

### 3.5 Idle Avatar Drift Enhancement

**What:** Enhance the existing float animation with slight rotational drift and individualized timing.

**Current state:** Simple y-axis bob, 3-5s, staggered start.

**Enhancement:**
- Add rotation: ±1.5 degrees oscillation, on a different period than the y-bob (e.g., if y-bob is 4s, rotation is 5.5s). The mismatched periods create organic, non-repeating patterns.
- Vary y-amplitude per avatar: some bob 6px, others 4px. Creates a sense of individual weight.
- Add very slight x-axis drift (±2px, 7s cycle) so avatars feel like they're floating in space, not on a rail.
- Each avatar's timing offsets should be prime-number-based to avoid synchronization (e.g., delays of 0s, 0.7s, 1.3s, 2.1s, 3.1s, 4.3s)

### 3.6 Snowflake Depth of Field

**What:** Snowflakes exist at different "depths" — some are large and sharp (foreground), others are tiny and soft (background).

**Current state:** 40 snowflakes with randomized drift/fall.

**Enhancement:**
- Assign each flake a depth layer (0.0 to 1.0)
- Depth affects:
  - **Size:** Foreground flakes 4-6px, background flakes 1-2px
  - **Opacity:** Foreground 0.7-0.9, background 0.2-0.4
  - **Blur:** Background flakes get `filter: blur(1px)`, foreground stays sharp
  - **Speed:** Background flakes fall ~40% slower (parallax)
  - **Parallax response:** If cursor parallax is active (1.1), deeper flakes shift less with cursor movement
- Distribution: ~60% background, ~30% mid, ~10% foreground. Most snow is atmospheric, a few flakes feel close.

---

## Performance Considerations

- All ambient animations use `transform` and `opacity` only — composited by GPU, no layout recalculation
- CSS animations preferred over JS for continuous loops (aurora, rings pulse, mountain breathing)
- Framer Motion used for interactive/event-driven animations (parallax, transitions, avatar flight)
- `will-change: transform` on parallax layers and animated elements
- Snow particle count stays at 40 — depth variation adds richness without adding elements
- Consider `prefers-reduced-motion` media query: disable aurora, mountain breathing, title shimmer; keep essential transitions but simplify to fades
- Test on lower-end hardware — ambient animations should degrade gracefully

## Interaction with Data Visualizations

- D3 chart entrance animations should integrate into the staggered panel reveal sequence (2.2, step 5)
- Charts animate after stat cards / in place of stat cards — not simultaneously
- D3 animations should feel consistent with Framer Motion timing: spring-based where possible, same stagger rhythm
- Consider: charts animate on reveal but also have subtle idle states (e.g., Klaebo's radial segments gently glow, Hellebuyck's gauge has a faint pulse)
