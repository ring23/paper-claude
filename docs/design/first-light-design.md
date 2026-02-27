# First Light: The Podium — Design Document

## Overview

An interactive kiosk celebrating historic firsts from the 2026 Winter Olympics. Users explore a central hub surrounded by 6 athlete avatars, set against an immersive alpine mountain landscape. Clicking an athlete triggers a split-reveal transition exposing their story, stats, and historic achievement on a frosted glass panel.

**Two deliverables:**
1. **Paper design mockups** — Visual system and key states designed in Paper (demonstrates Paper + Claude workflow)
2. **Interactive web app** — Vite + React application with Framer Motion animations, deployed to Vercel

**Tech stack:** Vite + React + Framer Motion + CSS Modules. Deployed to Vercel.

### Why React + Framer Motion?

- **Component reuse** — 6 athletes share identical component structures (AvatarCard, StatCard, StoryPanel). React makes this clean, not copy-paste.
- **State-driven UI** — The kiosk has clear states (hub view, story panel open, which athlete selected). `useState` handles this naturally.
- **Framer Motion** — Purpose-built for React animation. `layoutId` gives us shared-element avatar transitions for free. `AnimatePresence` handles panel mount/unmount. Staggered children are declarative, not imperative.
- **Vite** — Zero-config dev server with hot reload. Builds to static files for Vercel.

---

## Visual Direction

**"Premium Alpine"** — A sophisticated winter resort atmosphere. The entire kiosk lives inside a layered mountain landscape — sky gradient, silhouetted alpine peaks, a snow field — creating a real *place*, not just a UI. Content floats on frosted glass panels above this landscape. Olympic gold is the singular warm accent that makes everything celebratory.

Think: Olympic broadcast graphics meets alpine lodge. Refined, not cartoonish. Atmospheric, not flat.

---

## Design System

### Color Palette: Premium Alpine

Built from a winter mountain landscape — sky blues, snow whites, alpine shadows — with Olympic gold as the singular warm accent.

#### Atmosphere (backgrounds & environment)

| Role | Value | Usage |
|------|-------|-------|
| **Sky Deep** | `#1B3A5C` | Top of sky gradient, header area |
| **Sky Mid** | `#4A7FA5` | Middle sky, mountain backdrops |
| **Sky Pale** | `#C4DCE8` | Lower sky, ambient light |
| **Snow** | `#EBF2F7` | Main surface, snow field |
| **Ice White** | `#F5F9FC` | Brightest snow highlights |

#### Surfaces (frosted glass)

| Role | Value | Usage |
|------|-------|-------|
| **Frost** | `rgba(255,255,255,0.55)` | Card/panel glass, with backdrop-blur |
| **Frost Hover** | `rgba(255,255,255,0.70)` | Interactive hover states |
| **Frost Border** | `rgba(255,255,255,0.30)` | Frosted glass edges |
| **Shadow Alpine** | `rgba(27,58,92,0.12)` | Subtle panel shadows |

#### Text

| Role | Value | Usage |
|------|-------|-------|
| **Alpine Navy** | `#0B1D3A` | Primary headlines, key content |
| **Slate** | `#3D5A73` | Body text, descriptions |
| **Mist** | `#7A95AA` | Captions, labels, secondary info |

#### Accents

| Role | Value | Usage |
|------|-------|-------|
| **Gold** | `#C6982B` | Olympic gold — primary accent, medals, highlights |
| **Gold Light** | `#E4C45A` | Gold shimmer, glows |
| **Ice Blue** | `#5BA3D9` | Interactive elements, links, hover states |

#### Mountain Silhouette Layers (back to front)

`#1B3A5C` → `#2D5F85` → `#4A7FA5` → `#8CB8D4`

#### Country Accent Colors

| Country | Primary | Secondary | Gradient |
|---------|---------|-----------|----------|
| Brazil | `#009B3A` | `#FFDF00` | Green → Yellow |
| USA | `#B31942` | `#0A3161` | Red → Blue |
| Norway | `#BA0C2F` | `#00205B` | Red → Navy |
| South Korea | `#CD2E3A` | `#0047A0` | Red → Blue |

### Typography: Alpine Editorial

Editorial elegance paired with athletic boldness — luxury ski magazine meets Olympic broadcast.

| Role | Font | Weight | Size | Tracking | Usage |
|------|------|--------|------|----------|-------|
| **Display** | Playfair Display | 900 (Black) | 56-72px | -0.02em | "FIRST LIGHT" title, hero moments |
| **Athlete Name** | Archivo Black | 400 | 40-48px | -0.03em | Athlete names, bold declarations |
| **Heading** | Inter | 700 (Bold) | 24-28px | -0.01em | Section headings, achievement headlines |
| **Subheading** | Inter | 500 (Medium) | 16-18px | 0.01em | Achievement text, descriptions |
| **Body** | Inter | 400 (Regular) | 16px | 0 | Story text, narratives |
| **Caption** | Inter | 400 (Regular) | 13-14px | 0.02em | Labels, metadata |
| **Label** | Inter | 600 (SemiBold) | 11-12px | 0.08em | All-caps tags, small labels |
| **Stats** | Space Grotesk | 300-700 | 28-72px | -0.02em | Numbers, data viz, counters |

Line heights: 1.1 for display, 1.2 for headings, 1.5 for body, 1.6 for captions.

### Spacing Rhythm

| Scale | Value | Usage |
|-------|-------|-------|
| **xs** | 4px | Tight inline gaps |
| **sm** | 8px | Icon gaps, dense labels |
| **md** | 16px | Component internal padding |
| **lg** | 24px | Card padding, section gaps |
| **xl** | 40px | Major section spacing |
| **2xl** | 64px | Panel padding, hero breathing room |

### Frost Tokens

```css
--frost-bg: rgba(255, 255, 255, 0.55);
--frost-bg-hover: rgba(255, 255, 255, 0.70);
--frost-border: rgba(255, 255, 255, 0.30);
--frost-blur: blur(24px);
--frost-shadow: 0 8px 32px rgba(27, 58, 92, 0.10);
--frost-radius: 20px;
```

| Variant | Opacity | Blur | Use |
|---------|---------|------|-----|
| `frost-panel` | 55% white | 24px | Story panel, main containers |
| `frost-card` | 45% white | 16px | Stat cards, avatar hover tooltips |
| `frost-subtle` | 30% white | 12px | Mini hub, secondary surfaces |
| `frost-pill` | 60% white | 20px | Medal badge, tags, labels |

---

## Visual Environment: Alpine Landscape

The entire kiosk lives inside a mountain landscape scene. Not a flat-color background — a layered, atmospheric environment.

**Background layers (back to front):**
1. **Sky gradient** — `#1B3A5C` (top) → `#4A7FA5` → `#C4DCE8` (horizon). Full viewport height.
2. **Far mountains** — `#1B3A5C` silhouette SVG, ~20% height, jagged alpine peaks
3. **Mid mountains** — `#2D5F85` silhouette, ~30% height, slightly larger peaks
4. **Near mountains** — `#4A7FA5` silhouette, ~35% height, prominent ridgeline
5. **Snow field** — `#C4DCE8` → `#EBF2F7` gradient, bottom ~25%, the "ground" where content sits
6. **Snowfall particles** — Framer Motion animated, sparse floating dots at varying speeds and opacities

Content surfaces float above this landscape on frosted glass panels.

---

## Layout & Components

### Viewport: 1440 x 900px

Fixed viewport — no scrolling. Everything lives on a single screen.

### Hub State (Default View)

```
┌─────────────────────────────────────────────────┐
│  ~~~ sky gradient ~~~                           │
│                                                 │
│         F I R S T   L I G H T                   │
│            THE PODIUM · 2026                    │
│                                                 │
│  /\  /\      [Avatar]    [Avatar]     /\  /\    │
│ /  \/  \                             /  \/  \   │
│/   /\   \ [Avatar]  ◉ RINGS  [Avatar]  /\   \  │
│   /  \         [Avatar]  [Avatar]     /  \      │
│~~~~~~~~~~~ snow field ~~~~~~~~~~~~~~~~~~~~~~~~~~│
│         Click an athlete to explore             │
└─────────────────────────────────────────────────┘
```

- Title lockup floats in the sky area
- Olympic rings with gold glow sit at the center
- Athlete avatars orbit around the hub, positioned along the mountain ridgeline
- Snowfall particles drift gently across the scene

### Story Panel State (Split Reveal)

```
┌──────────────────┬──────────────────────────────┐
│ /\ /\            │ ┌─────────────────────────┐  │
│/  \/  \          │ │  [AVATAR] JACK HUGHES   │  │
│  [mini hub]      │ │  USA · Ice Hockey       │  │
│  ◉ rings         │ │                         │  │
│                  │ │  46 Years in the Making  │  │
│  [J] [L] [A]    │ │                         │  │
│  [E] [J] [G]    │ │  [2-1] [OT] [41]       │  │
│                  │ │                         │  │
│  (mountains      │ │  Story text here...     │  │
│   still visible) │ │                         │  │
│~~~ snow ~~~~     │ │  46 years               │  │
│                  │ │  ★ GOLD MEDAL           │  │
│                  │ └─────────────────────────┘  │
└──────────────────┴──────────────────────────────┘
```

**Left (~30%):** Mountain landscape remains visible. Shrunk hub with mini avatars overlaid. Active athlete highlighted with gold ring, others dimmed.

**Right (~70%):** Frosted glass panel (`frost-panel`) slides in. Content hierarchy: avatar + name → headline → stats → story → historic counter → medal badge.

---

## Component Specifications

### AvatarCard

| Size | Circle | Ring Width | Initial Size | Use |
|------|--------|-----------|-------------|-----|
| `lg` | 120px | 3px gradient | 44px Archivo Black | Hub orbit, story header |
| `sm` | 56px | 2px gradient | 20px Archivo Black | Mini hub grid |

- Ring gradient: athlete's country colors
- Active state: ring swaps to gold gradient (`#C6982B → #E4C45A`)
- Dimmed state: 40% opacity
- Hover: scale 1.08, gold ring appears, name label brightens

### StatCard

- `frost-card` surface (45% white, 16px blur)
- Value: Space Grotesk Bold 32px, `#0B1D3A`
- Label: Inter SemiBold 11px, `#7A95AA`, all-caps, `0.08em` tracking
- Padding: 16px 28px, border-radius: 14px

### MedalBadge

- `frost-pill` surface
- Gold circle (36px) with star SVG icon
- "GOLD MEDAL" — Inter Bold 13px, gold color, all-caps

### HistoricCounter

- Large number: Space Grotesk Light 72px, `#C6982B`
- Unit label: Inter SemiBold 16px, `#0B1D3A`
- Context: Inter Regular 14px, `#7A95AA`
- Number animates counting up on mount (Framer Motion `useMotionValue`)

---

## Athlete Data

All data verified against actual 2026 Milano Cortina results.

| Athlete | Country | Event | Medal | Historic First |
|---------|---------|-------|-------|----------------|
| Lucas Pinheiro Braathen | Brazil | Giant Slalom | Gold | 1st South American Winter Olympic medal ever |
| Jack Hughes | USA | Ice Hockey | Gold | 1st US hockey gold in 46 years (since 1980) |
| Alysa Liu | USA | Figure Skating | Gold | 1st US women's skating gold in 24 years |
| Elana Meyers Taylor | USA | Monobob | Gold | Oldest individual Winter gold medalist (41) |
| Johannes Hoesflot Klaebo | Norway | Cross-Country (all 6) | 6x Gold | Most golds by one athlete at a single Winter Games |
| Choi Gaon | South Korea | Snowboard Halfpipe | Gold | Youngest halfpipe champion (17), 1st Korean snow-sports gold |

See `first-light-implementation.md` for the complete data model.

---

## Interaction Specifications

### Hover States
- **Avatar hover**: scale 1.08, gold ring border appears, name label brightens
- **Transition**: Framer Motion `whileHover`, 200ms spring
- **Cursor**: pointer

### Click → Split Reveal (Framer Motion)
- `AnimatePresence` wraps StoryPanel — mounts/unmounts on athlete select
- `layoutId="avatar-{id}"` on AvatarCard and AthleteHeader avatar — shared element transition
- Story content children: staggered `motion.div` with `initial={{ y: 20, opacity: 0 }}` and `animate={{ y: 0, opacity: 1 }}` with `transition={{ delay: i * 0.05 }}`

### Switch Athletes
- Click another avatar in the shrunk hub
- `AnimatePresence mode="wait"` cross-fades story content
- Active avatar highlight moves with `layoutId`

### Close Panel
- Click hub area or press Escape
- `AnimatePresence` exit animation: panel slides out right, landscape expands back

### Ambient Animations
- **Snowfall**: Framer Motion particles — randomized x drift, y fall, varying opacity and size
- **Avatar float**: Subtle vertical oscillation via `motion.div` with `animate={{ y: [0, -6, 0] }}`, 3-5s duration, staggered
- **Page entrance**: Title fades in, avatars stagger in from `scale: 0` with spring easing

---

## React Component Architecture

```
App
├── AlpineLandscape              ← SVG mountain layers + sky gradient + snowfall
│   ├── SkyGradient
│   ├── MountainLayer × 3-4
│   ├── SnowField
│   └── Snowfall                 ← Animated particles (Framer Motion)
├── HubView                      ← Default state
│   ├── TitleLockup              ← "FIRST LIGHT / THE PODIUM"
│   ├── OlympicRings             ← SVG, gold accent
│   └── AthleteOrbit             ← Positions 6 avatars in ellipse
│       └── AvatarCard × 6       ← Reusable: image/initial, gradient ring, name, sport
├── StoryPanel                   ← AnimatePresence, slides in on athlete select
│   ├── AthleteHeader            ← Large avatar + name + country
│   ├── Headline                 ← Gold achievement tagline
│   ├── StatsRow                 ← 3× StatCard (frosted glass)
│   │   └── StatCard             ← Reusable: value + label
│   ├── StoryText                ← Narrative paragraph
│   ├── HistoricCounter          ← Big animated number
│   └── MedalBadge               ← Gold/Silver/Bronze
└── MiniHub                      ← Shrunk left panel when story is open
    ├── MiniTitle
    ├── MiniRings
    └── MiniAvatarGrid           ← 6 small AvatarCards, active highlighted
```

---

## Placeholder Avatars

For the 5 athletes without generated avatars, use styled initials:
- Circle with country gradient background (darker interior tones)
- Large initial letter (Archivo Black, white)
- Same hover/click/transition behavior as real avatars

---

## Paper Artboards

| Artboard | Name | Size | Status |
|----------|------|------|--------|
| 1 | Hub State | 1440x900 | Complete (v1 — dark theme, to be revisited for Alpine) |
| 2 | Story Panel — Hughes | 1440x900 | Complete (v1 — dark theme, to be revisited for Alpine) |
| 3 | Component Sheet | 1440x900 | Optional |

---

## Files

```
paper-claude/
├── docs/
│   ├── shaping/
│   │   └── first-light-shaping.md
│   └── design/
│       ├── first-light-design.md          ← This file
│       └── first-light-implementation.md
├── images/
│   ├── avatars/
│   │   └── jack-hughes-avatar.png
│   └── originals/
│       └── jack-huges.jpeg
├── src/                                    ← Vite + React app
│   ├── index.html
│   ├── main.tsx
│   ├── App.tsx
│   ├── data/
│   │   └── athletes.ts
│   ├── components/
│   │   ├── AlpineLandscape.tsx
│   │   ├── HubView.tsx
│   │   ├── AthleteOrbit.tsx
│   │   ├── AvatarCard.tsx
│   │   ├── StoryPanel.tsx
│   │   ├── StatsRow.tsx
│   │   ├── StatCard.tsx
│   │   ├── HistoricCounter.tsx
│   │   ├── MedalBadge.tsx
│   │   ├── MiniHub.tsx
│   │   ├── OlympicRings.tsx
│   │   ├── Snowfall.tsx
│   │   └── TitleLockup.tsx
│   └── styles/
│       ├── tokens.css                      ← CSS custom properties
│       └── *.module.css                    ← Component styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── vercel.json
```
