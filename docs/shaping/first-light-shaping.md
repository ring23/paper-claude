---
shaping: true
---

# First Light: The Podium — Shaping

## Source

> I would like to explore Paper (paper.design/), how it integrates with Claude Code and how it can be used to aid in agentic software development. I'd like to use Paper and the Claude Code MCP server for Paper to create a simple, yet really fun and interesting, demo application. We will document how others can follow a similar process.

> This is for my own exploration/learning, but could also be educational for me and others. I'd also like to build something visually impressive with it that demonstrates the power of Paper + Claude, but also somewhat practical. Visually impressive/fun is more important than practical.

> Visual style priorities: Data visualization > Polished UI/UX > Interactive/playful

> Let's combine First Light with Podium Parade. [...] Beautiful interactive data viz/stats with avatars/caricatures.

---

## Problem

User wants to learn Paper + Claude Code integration by building something visually stunning. No existing demo exists that showcases Paper's shader/animation capabilities while teaching the workflow to others.

## Outcome

A polished, shareable demo that:
- Celebrates the 2026 Winter Olympics with beautiful data visualization
- Features stylized athlete avatars/caricatures
- Demonstrates Paper's unique capabilities (shaders, animations, live data)
- Documents the Paper + Claude workflow for others to follow

---

## Requirements (R)

| ID | Requirement | Status |
|----|-------------|--------|
| R0 | Showcase 2026 Winter Olympics historic firsts with visual impact | Core goal |
| R1 | Feature athlete avatars/caricatures (not photos) | Must-have |
| R2 | Include interactive elements users can play with | Must-have |
| R3 | Demonstrate Paper's shader/animation capabilities | Must-have |
| R4 | Be achievable in a focused session (not weeks of work) | Must-have |
| R5 | Export as shareable artifact (video, web, or both) | Nice-to-have |
| R6 | Include data visualization elements | Must-have |
| R7 | Document the Paper + Claude workflow as we build | Must-have |

---

## Featured Athletes (Data)

| Athlete | Country | Story | Visual Hook |
|---------|---------|-------|-------------|
| Lucas Pinheiro Braathen | Brazil 🇧🇷 | First South American Winter Olympic medal EVER (Gold, GS) | Tropical → snow transition |
| Jack Hughes | USA 🇺🇸 | Hockey gold, 46 years after "Miracle on Ice" | Missing teeth, OT winner pose |
| Alysa Liu | USA 🇺🇸 | First US women's figure skating gold in 24 years | Elegant spin silhouette |
| Elana Meyers Taylor | USA 🇺🇸 | Oldest individual Winter gold at 41 | Bobsled helmet, powerful stance |
| Johannes Klaebo | Norway 🇳🇴 | 6 golds - most ever at single Winter Olympics | Ski raise victory pose |
| Gaon Choi | South Korea 🇰🇷 | 17-year-old defeats mentor Chloe Kim | Youth energy, snowboard grab |

---

## Shapes

### Selected Format: Interactive Kiosk

An exploratory hub with orbiting athlete avatars around a central Olympic medal/flame. Click or hover on any athlete to expand their story with animated transitions and celebratory effects.

---

## Shape A: Interactive Kiosk

| Part | Mechanism | Flag |
|------|-----------|:----:|
| **A1** | Central hub (Olympic medal/rings) with ambient shader animation | |
| **A2** | Orbiting athlete avatars with country-gradient backgrounds | |
| **A3** | Hover state: avatar glows, name/tagline appears | |
| **A4** | Click state: Split Reveal - hub shrinks left, story panel slides in right | |
| **A5** | Athlete story panel (Rich): avatar, headline, context, stats, historic counter, medal, podium animation, country flag | |
| **A6** | Click another athlete: story panel cross-fades to new athlete | |
| **A7** | Click hub or close: panel slides out, hub expands back | |

### Avatar Style (Decided)

**Pixar-style 3D caricatures** - Big expressive eyes, warm lighting, slightly exaggerated proportions, athletic builds, sport equipment, country-gradient backgrounds.

Reference: `images/avatars/jack-hughes-avatar.png`

| Athlete | Avatar Status |
|---------|---------------|
| Jack Hughes | ✅ Complete |
| Lucas Pinheiro Braathen | Placeholder |
| Alysa Liu | Placeholder |
| Elana Meyers Taylor | Placeholder |
| Johannes Klaebo | Placeholder |
| Gaon Choi | Placeholder |

---

## Fit Check

| Req | Requirement | Status | A |
|-----|-------------|--------|---|
| R0 | Showcase 2026 Winter Olympics historic firsts with visual impact | Core goal | ✅ |
| R1 | Feature athlete avatars/caricatures (not photos) | Must-have | ✅ |
| R2 | Include interactive elements users can play with | Must-have | ✅ |
| R3 | Demonstrate Paper's shader/animation capabilities | Must-have | ✅ |
| R4 | Be achievable in a focused session (not weeks of work) | Must-have | ✅ |
| R5 | Export as shareable artifact (video, web, or both) | Nice-to-have | ✅ |
| R6 | Include data visualization elements | Must-have | ✅ |
| R7 | Document the Paper + Claude workflow as we build | Must-have | ✅ |

**Shape A selected. Ready for implementation.**

**Design doc:** `docs/design/first-light-design.md`
**Implementation plan:** `docs/design/first-light-implementation.md`

---

## Design Direction

**Premium Alpine** — Sophisticated winter resort atmosphere. Layered mountain landscape background with sky gradient, alpine silhouettes, and snowfall particles. Content on frosted glass panels. Olympic gold as singular warm accent against icy blues and snow whites.

**Tech stack:** Vite + React + Framer Motion + CSS Modules. Deployed to Vercel.

Revised from initial "stadium at night" dark cinematic direction after reviewing winter-themed references and deciding the design needed real atmospheric immersion, not just a dark UI.

---

## Implementation Plan (Summary)

### Phase 1-2: Paper Design ✅
- Hub State artboard (orbital avatar layout) — Complete
- Story Panel artboard (split-reveal with Hughes) — Complete

### Phase 3: Web App Scaffold
- Initialize Vite + React + TypeScript project
- Design tokens as CSS custom properties
- Typed athlete data module

### Phase 4: Alpine Landscape
- SVG mountain silhouettes (3-4 depth layers)
- Sky gradient background
- Snowfall particle animation (Framer Motion)

### Phase 5: Hub View
- Title lockup (Playfair Display)
- Olympic rings with gold glow
- 6 orbiting AvatarCards with country gradient rings
- Float animation + page entrance

### Phase 6: Story Panel + Split Reveal
- Frosted glass story panel (AnimatePresence)
- Shared element avatar transition (layoutId)
- Stats, historic counter, medal badge components
- Mini hub with dimmed/active avatar states

### Phase 7: Polish + Deploy
- Animation tuning, visual refinements
- Deploy to Vercel
- Cross-browser verification

### Phase 8: Documentation
- Paper + Claude workflow write-up

