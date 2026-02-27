# First Light: The Podium — Implementation Plan

## Context

The shaping phase is complete. Design system revised to **Premium Alpine** direction:
- Interactive kiosk format with split-reveal interaction
- Pixar-style 3D caricature avatars (1 complete, 5 placeholders)
- Premium Alpine theme: mountain landscape, frosted glass, icy blues, Olympic gold
- See `first-light-design.md` for full visual specifications

**Tech stack:** Vite + React + Framer Motion + CSS Modules. Deployed to Vercel.

This plan has two tracks:
1. **Paper Track** — Design key states as artboards (demonstrates Paper + Claude workflow) — Phases 1-2 complete
2. **Web App Track** — Build the interactive React application — Phases 3-7

**Data source:** All athlete data verified against actual 2026 Milano Cortina results.

---

## Phase 1: Paper Design — Hub State Artboard ✅

**Status: Complete** (v1 — dark theme. Alpine revision optional.)

Designed the default hub view in Paper: title lockup, Olympic rings with gold glow, 6 athlete avatars in elliptical orbit with country-gradient rings, footer prompt.

---

## Phase 2: Paper Design — Story Panel Artboard ✅

**Status: Complete** (v1 — dark theme. Alpine revision optional.)

Designed the split-reveal state: left panel with shrunk hub and mini avatar grid (Hughes highlighted, others dimmed), right story panel with name block, gold headline, stats row, story text, historic counter, medal badge.

---

## Phase 3: Web App — Scaffold & Project Setup

**Goal:** Initialize the Vite + React project with all dependencies, design tokens, and athlete data.

### Steps

1. **Initialize Vite project**
   ```bash
   npm create vite@latest src -- --template react-ts
   cd src && npm install
   npm install framer-motion
   ```

2. **Configure project structure**
   ```
   src/
   ├── index.html
   ├── main.tsx
   ├── App.tsx
   ├── data/
   │   └── athletes.ts
   ├── components/
   │   └── (empty, built in later phases)
   └── styles/
       └── tokens.css
   ```

3. **Create `styles/tokens.css`** — CSS custom properties from design system:
   ```css
   :root {
     /* Atmosphere */
     --sky-deep: #1B3A5C;
     --sky-mid: #4A7FA5;
     --sky-pale: #C4DCE8;
     --snow: #EBF2F7;
     --ice-white: #F5F9FC;

     /* Frost surfaces */
     --frost-bg: rgba(255, 255, 255, 0.55);
     --frost-bg-hover: rgba(255, 255, 255, 0.70);
     --frost-border: rgba(255, 255, 255, 0.30);
     --frost-blur: blur(24px);
     --frost-shadow: 0 8px 32px rgba(27, 58, 92, 0.10);
     --frost-radius: 20px;

     /* Text */
     --alpine-navy: #0B1D3A;
     --slate: #3D5A73;
     --mist: #7A95AA;

     /* Accents */
     --gold: #C6982B;
     --gold-light: #E4C45A;
     --ice-blue: #5BA3D9;

     /* Mountain layers */
     --mountain-far: #1B3A5C;
     --mountain-mid: #2D5F85;
     --mountain-near: #4A7FA5;
     --mountain-front: #8CB8D4;

     /* Spacing */
     --space-xs: 4px;
     --space-sm: 8px;
     --space-md: 16px;
     --space-lg: 24px;
     --space-xl: 40px;
     --space-2xl: 64px;
   }
   ```

4. **Create `data/athletes.ts`** — Typed athlete data:

```ts
export interface Athlete {
  id: string;
  name: string;
  country: string;
  flag: string;
  sport: string;
  colors: { primary: string; secondary: string };
  avatar: string | null;
  initial: string;
  headline: string;
  achievement: string;
  stats: { label: string; value: string }[];
  story: string;
  medal: "gold" | "silver" | "bronze";
  historicStat: { value: string; unit: string; context: string };
}

export const athletes: Athlete[] = [
  {
    id: "braathen",
    name: "Lucas Pinheiro Braathen",
    country: "Brazil",
    flag: "🇧🇷",
    sport: "Alpine Skiing",
    colors: { primary: "#009B3A", secondary: "#FFDF00" },
    avatar: null,
    initial: "L",
    headline: "Snow Meets Samba",
    achievement: "First South American to win a Winter Olympic medal — ever. And it was gold.",
    stats: [
      { label: "Event", value: "GS" },
      { label: "Margin", value: "+0.58s" },
      { label: "Historic", value: "1st" }
    ],
    story: "In 102 years and 26 editions of the Winter Olympics, no South American had ever won a medal. Lucas Pinheiro Braathen — born in Brazil, raised in Norway — changed that forever, charging to giant slalom gold and beating defending champion Marco Odermatt by over half a second.",
    medal: "gold",
    historicStat: { value: "1st", unit: "ever", context: "South American Winter Olympic medalist" }
  },
  {
    id: "hughes",
    name: "Jack Hughes",
    country: "USA",
    flag: "🇺🇸",
    sport: "Ice Hockey",
    colors: { primary: "#B31942", secondary: "#0A3161" },
    avatar: "/images/avatars/jack-hughes-avatar.png",
    initial: "J",
    headline: "46 Years in the Making",
    achievement: "First US men's hockey gold since the 1980 Miracle on Ice",
    stats: [
      { label: "Final", value: "2-1" },
      { label: "GWG", value: "OT" },
      { label: "Saves", value: "41" }
    ],
    story: "The last time the United States won Olympic hockey gold, it was called a miracle. Jack Hughes buried the overtime winner in 3-on-3 OT against Canada while Connor Hellebuyck stopped 41 shots. This time, it wasn't a miracle — it was inevitable.",
    medal: "gold",
    historicStat: { value: "46", unit: "years", context: "since last US hockey gold" }
  },
  {
    id: "liu",
    name: "Alysa Liu",
    country: "USA",
    flag: "🇺🇸",
    sport: "Figure Skating",
    colors: { primary: "#B31942", secondary: "#0A3161" },
    avatar: null,
    initial: "A",
    headline: "Grace Under Pressure",
    achievement: "First US women's figure skating gold in 24 years",
    stats: [
      { label: "Score", value: "226.79" },
      { label: "After SP", value: "3rd" },
      { label: "Golds", value: "2" }
    ],
    story: "Not since Sarah Hughes in 2002 had an American woman stood atop the Olympic figure skating podium. Sitting third after the short program, Alysa Liu delivered a career-best free skate to surge past Japan's Sakamoto and Nakai for gold — her second of these Games after the team event.",
    medal: "gold",
    historicStat: { value: "24", unit: "years", context: "since last US women's skating gold" }
  },
  {
    id: "meyers-taylor",
    name: "Elana Meyers Taylor",
    country: "USA",
    flag: "🇺🇸",
    sport: "Bobsled",
    colors: { primary: "#B31942", secondary: "#0A3161" },
    avatar: null,
    initial: "E",
    headline: "Age Is Just a Number",
    achievement: "Oldest individual Winter Olympic gold medalist at 41",
    stats: [
      { label: "Age", value: "41" },
      { label: "Olympics", value: "5th" },
      { label: "Career Medals", value: "6" }
    ],
    story: "At 41, most athletes are long retired. Elana Meyers Taylor trailed Germany's Laura Nolte through three runs, then unleashed a blistering 59.51-second final heat to steal gold by four hundredths of a second. The oldest individual Winter Olympic champion ever — proof that grit outlasts gravity.",
    medal: "gold",
    historicStat: { value: "41", unit: "years old", context: "oldest individual Winter gold medalist" }
  },
  {
    id: "klaebo",
    name: "Johannes Hoesflot Klaebo",
    country: "Norway",
    flag: "🇳🇴",
    sport: "Cross-Country Skiing",
    colors: { primary: "#BA0C2F", secondary: "#00205B" },
    avatar: null,
    initial: "J",
    headline: "The Perfect Games",
    achievement: "6 gold medals — most ever by one athlete at a single Winter Olympics",
    stats: [
      { label: "Golds", value: "6" },
      { label: "Events", value: "6" },
      { label: "Career", value: "11" }
    ],
    story: "Six events. Six golds. Johannes Klaebo didn't just break Eric Heiden's 46-year-old record of five golds at a single Winter Games — he obliterated it. With 11 career Olympic golds, only Michael Phelps has more. Norway's king of the snow is the greatest Winter Olympian who ever lived.",
    medal: "gold",
    historicStat: { value: "6", unit: "golds", context: "most by one athlete at a single Winter Olympics" }
  },
  {
    id: "choi",
    name: "Choi Gaon",
    country: "South Korea",
    flag: "🇰🇷",
    sport: "Snowboard Halfpipe",
    colors: { primary: "#CD2E3A", secondary: "#0047A0" },
    avatar: null,
    initial: "G",
    headline: "The Student Becomes the Master",
    achievement: "17-year-old defeats mentor Chloe Kim for halfpipe gold",
    stats: [
      { label: "Age", value: "17" },
      { label: "Score", value: "90.25" },
      { label: "Run", value: "3rd" }
    ],
    story: "She crashed hard on her first run. Then Choi Gaon did what champions do — she got back up. Her third-run score of 90.25 dethroned two-time Olympic champion Chloe Kim and delivered South Korea's first-ever Olympic snow-sports gold. She was 17 years old.",
    medal: "gold",
    historicStat: { value: "17", unit: "years old", context: "youngest halfpipe Olympic champion" }
  }
];
```

5. **Add Google Fonts** to `index.html`:
   - Playfair Display (Black 900)
   - Archivo Black (400)
   - Inter (300, 400, 500, 600, 700)
   - Space Grotesk (300, 400, 500, 600, 700)

6. **Set up base `App.tsx`** with:
   - `useState<string | null>(null)` for selected athlete
   - Conditional rendering: HubView (no selection) vs split layout (selection active)
   - AlpineLandscape as the persistent background

### Verification
- `npm run dev` starts without errors
- Fonts load correctly
- Design tokens render (test with a simple colored div)
- TypeScript compiles cleanly

---

## Phase 4: Web App — Alpine Landscape Background

**Goal:** Build the immersive mountain landscape that persists behind all content.

### Steps

1. **Create `AlpineLandscape.tsx`**
   - Full viewport `position: fixed` background layer
   - SVG sky gradient (linear, top to bottom: `#1B3A5C` → `#4A7FA5` → `#C4DCE8`)
   - 3-4 mountain range SVGs as silhouette layers, each a different blue tone
   - Snow field gradient at bottom (`#C4DCE8` → `#EBF2F7`)

2. **Create mountain SVG paths**
   - Jagged alpine peaks — organic, not geometric
   - Each layer at different heights and peak patterns for depth
   - Far mountains: subtle, small. Near mountains: prominent, taller.

3. **Create `Snowfall.tsx`**
   - 30-50 snowflake particles (small circles, 2-4px)
   - Each with randomized: x position, fall speed, opacity, size, horizontal drift
   - Framer Motion `animate` with `repeat: Infinity`
   - Staggered start for organic feel

### Verification
- Landscape fills viewport with clear depth layers
- Mountains have natural alpine silhouettes
- Snowfall is subtle and atmospheric (not distracting)
- Performance: no jank from particle animations

---

## Phase 5: Web App — Hub View

**Goal:** Build the hub layout with animated avatars floating above the landscape.

### Steps

1. **Create `TitleLockup.tsx`**
   - "FIRST LIGHT" — Playfair Display Black, 64px, `#0B1D3A` (or light color if over sky)
   - "THE PODIUM" — Inter Light, 18px, `#3D5A73`, all-caps, wide tracking
   - "Milano Cortina 2026" — Inter Regular, 13px, `#7A95AA`
   - Framer Motion entrance: fade in + slight y slide

2. **Create `OlympicRings.tsx`**
   - 5 interlocking circles SVG, gold color (`#C6982B`), 2px stroke
   - Subtle gold radial glow behind (CSS radial-gradient)

3. **Create `AvatarCard.tsx`** (reusable component)
   - Props: `athlete`, `size` ("lg" | "sm"), `isActive`, `isDimmed`, `onClick`
   - Circle with country gradient ring (3px border)
   - Avatar image or initial-letter placeholder
   - Name label + sport label below
   - `motion.div` with `whileHover={{ scale: 1.08 }}`
   - `layoutId={`avatar-${athlete.id}`}` for shared element transitions

4. **Create `AthleteOrbit.tsx`**
   - Positions 6 AvatarCards in elliptical pattern
   - Pre-calculated positions for 6 clock positions
   - Each avatar floats with `motion.div animate={{ y: [0, -6, 0] }}`, staggered timing

5. **Create `HubView.tsx`**
   - Composes TitleLockup + OlympicRings + AthleteOrbit
   - Page entrance animation: title fades in, then avatars stagger in with spring easing
   - Footer prompt text

### Verification
- All 6 avatars visible with correct names and country colors
- Hover effects smooth (scale + gold ring)
- Float animation creates gentle organic motion
- Avatars sit naturally within the mountain landscape
- Layout centered and balanced

---

## Phase 6: Web App — Story Panel & Split Reveal

**Goal:** Build the click-to-reveal interaction with frosted glass panels.

### Steps

1. **Create `StoryPanel.tsx`**
   - Frosted glass panel: `backdrop-filter: blur(24px)`, `rgba(255,255,255,0.55)` bg
   - Slides in from right with Framer Motion `initial={{ x: "100%" }}` → `animate={{ x: 0 }}`
   - Content as staggered `motion.div` children

2. **Create story panel sub-components:**
   - `AthleteHeader.tsx` — Large avatar (with `layoutId` matching orbit avatar) + name + country
   - `StatsRow.tsx` + `StatCard.tsx` — Frosted glass stat cards
   - `HistoricCounter.tsx` — Animated number counting up with `useMotionValue` + `useTransform`
   - `MedalBadge.tsx` — Gold badge with star icon

3. **Create `MiniHub.tsx`**
   - Shrunk left panel with mini title, rings, and 6 small AvatarCards
   - Active athlete: gold ring, full opacity
   - Others: 40% opacity, still clickable
   - Mountain landscape visible behind (the left panel is transparent/overlay)

4. **Wire up state in `App.tsx`:**
   ```tsx
   const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);

   // Hub view: selectedAthlete === null
   // Story view: selectedAthlete !== null
   ```
   - `AnimatePresence` wrapping conditional story panel render
   - Avatar click → `setSelectedAthlete(id)`
   - Hub click / Escape → `setSelectedAthlete(null)`
   - Different avatar click while panel open → `setSelectedAthlete(newId)`

5. **Shared element avatar transition:**
   - `layoutId={`avatar-${id}`}` on both the orbit AvatarCard and the AthleteHeader avatar
   - Framer Motion automatically animates between positions when the component tree changes

### Verification
- Click avatar → frosted panel slides in with correct athlete data
- Avatar smoothly transitions from orbit position to story header
- Click different avatar → content cross-fades to new athlete
- Click hub or Escape → panel slides out, hub expands back
- Frosted glass effect visible with landscape blurred behind
- All athlete data renders correctly
- Number counting animation works on historic stat

---

## Phase 7: Polish & Deploy

**Goal:** Refine visual details and deploy to Vercel.

### Steps

1. **Refine animations**
   - Tune spring configs for smooth feel
   - Ensure no animation jank or stuttering
   - Page load entrance sequence timing

2. **Visual polish**
   - Gold shimmer on headline text (CSS gradient animation)
   - Fine-tune frost blur and opacity across all glass surfaces
   - Verify snowfall doesn't interfere with content readability
   - Typography contrast check against landscape background

3. **Responsive refinements**
   - Primary target: 1440x900
   - Secondary: 1280x800 and common laptop viewports
   - No mobile layout needed (kiosk format)

4. **Deploy to Vercel**
   - Connect git repo to Vercel
   - Configure build command: `npm run build`
   - Verify production build works

5. **Cross-browser test**
   - Chrome, Firefox, Safari (for `backdrop-filter` support)
   - Fallback for browsers without `backdrop-filter`: solid white bg instead

### Verification
- Full flow: load → hover → click → switch → close
- No visual glitches, clipping, or overflow
- Frosted glass renders correctly across browsers
- Snowfall performance is smooth (target 60fps)
- Deployed URL accessible and working

---

## Phase 8: Documentation

**Goal:** Document the Paper + Claude workflow for others.

### Steps

1. Capture the workflow — what was designed in Paper vs built in code
2. Note key learnings — what worked well, what was tricky
3. Create a brief "How to" section in the project docs
4. Update shaping doc with final status

---

## Summary Timeline

| Phase | Track | Deliverable | Status |
|-------|-------|-------------|--------|
| 1 | Paper | Hub State artboard | ✅ Complete |
| 2 | Paper | Story Panel artboard | ✅ Complete |
| 3 | Web | Vite + React scaffold + data + tokens | Next |
| 4 | Web | Alpine landscape background | — |
| 5 | Web | Hub view with animated avatars | — |
| 6 | Web | Story panel + split reveal interactions | — |
| 7 | Web | Polish + deploy to Vercel | — |
| 8 | Docs | Workflow documentation | — |

Phases 3-4 can potentially run together. Phase 5 depends on 3-4. Phase 6 depends on 5.
