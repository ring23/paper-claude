# Mobile Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Olympic scrollytelling app work well on mobile viewports (390px+) without breaking the existing desktop experience.

**Architecture:** CSS-first approach using a mobile breakpoint at `768px` added to each component's CSS module. A shared `useIsMobile` hook provides JS-level awareness for layout switches (hiding MiniHub, adjusting IntersectionObserver margins). No structural React refactors — the component tree stays identical; only CSS and a few prop tweaks change.

**Tech Stack:** CSS Modules (existing), CSS `clamp()` / media queries, one new React hook (`useIsMobile`), Framer Motion (existing — add reduced-motion respect)

**Breakpoint strategy:** Single breakpoint `@media (max-width: 768px)` — below this, StoryView goes full-width (no sidebar), HubView orbit becomes a grid, viz containers remove max-width constraints.

---

## Task 1: Mobile Foundation — Viewport Fix + `useIsMobile` Hook + Token Updates

**Files:**
- Modify: `src/styles/tokens.css:91-94`
- Create: `src/hooks/useIsMobile.ts`
- Create: `tests/hooks/useIsMobile.test.ts`

**Why first:** Every subsequent task depends on the viewport fix and the hook. The `100vh` bug on mobile Safari (address bar counts toward vh) affects every full-height section. The hook is needed by Task 2 (StoryView layout switch) and Task 5 (IntersectionObserver margin).

**Step 1: Create the `useIsMobile` hook**

```typescript
// src/hooks/useIsMobile.ts
import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

**Step 2: Write a test for the hook**

```typescript
// tests/hooks/useIsMobile.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../../src/hooks/useIsMobile";

describe("useIsMobile", () => {
  const originalInnerWidth = window.innerWidth;
  let listeners: Array<() => void> = [];

  beforeEach(() => {
    listeners = [];
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: window.innerWidth <= 768,
      media: query,
      addEventListener: (_: string, cb: () => void) => listeners.push(cb),
      removeEventListener: (_: string, cb: () => void) => {
        listeners = listeners.filter((l) => l !== cb);
      },
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList));
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { value: originalInnerWidth, writable: true });
    vi.restoreAllMocks();
  });

  it("returns false for desktop widths", () => {
    Object.defineProperty(window, "innerWidth", { value: 1440, writable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true for mobile widths", () => {
    Object.defineProperty(window, "innerWidth", { value: 390, writable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
```

**Step 3: Run the test**

```bash
npx vitest run tests/hooks/useIsMobile.test.ts
```

Expected: PASS

**Step 4: Fix viewport height in tokens.css**

In `src/styles/tokens.css`, change lines 91-94:

```css
/* Before */
html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* After */
html, body, #root {
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@supports not (height: 100dvh) {
  html, body, #root {
    height: 100%;
  }
}
```

**Step 5: Verify dev server renders correctly at desktop width**

```bash
npm run dev
```

Open in browser at 1440px width — everything should look identical to before.

**Step 6: Commit**

```bash
git add src/hooks/useIsMobile.ts tests/hooks/useIsMobile.test.ts src/styles/tokens.css
git commit -m "feat: add useIsMobile hook and fix viewport height for mobile Safari"
```

---

## Task 2: StoryView Layout — Full-Width Panel on Mobile (Hide MiniHub)

**Files:**
- Modify: `src/components/StoryView.tsx:16-58`
- Modify: `src/components/StoryView.module.css:1-37`

**Depends on:** Task 1 (useIsMobile hook)

**What changes:** On mobile, hide the MiniHub sidebar entirely. The panel becomes 100% width. A back button (already implied by `onClose`) becomes the navigation method.

**Step 1: Add mobile media query to StoryView CSS**

Append to `src/components/StoryView.module.css`:

```css
/* --- Mobile: full-width panel, no sidebar --- */
@media (max-width: 768px) {
  .left {
    display: none;
  }

  .panel,
  .panelDark {
    position: relative;
    width: 100%;
    border-left: none;
  }
}
```

**Step 2: Add a mobile back button in StoryView.tsx**

In `src/components/StoryView.tsx`, import and use `useIsMobile`:

```tsx
import { useIsMobile } from "../hooks/useIsMobile";

// Inside the component, before the return:
const isMobile = useIsMobile();

// In the JSX, add a mobile back button inside the panel div, before AnimatePresence:
{isMobile && (
  <button
    className={styles.mobileBack}
    onClick={onClose}
    aria-label="Back to hub"
  >
    ←
  </button>
)}
```

**Step 3: Style the mobile back button**

Add to `src/components/StoryView.module.css`:

```css
.mobileBack {
  display: none;
}

@media (max-width: 768px) {
  .mobileBack {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 100;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    color: #E8E4DE;
    font-size: 20px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
}
```

**Step 4: Verify at desktop width**

Resize browser to 1440px — should look identical (30/70 split, MiniHub visible, no back button).

**Step 5: Verify at mobile width**

Resize to 390px — panel should be full-width, MiniHub hidden, back button visible top-left.

**Step 6: Commit**

```bash
git add src/components/StoryView.tsx src/components/StoryView.module.css
git commit -m "feat: full-width story panel on mobile with back button"
```

---

## Task 3: HubView Mobile — Responsive Orbit + Title

**Files:**
- Modify: `src/components/HubView.module.css:1-45`
- Modify: `src/components/AthleteOrbit.module.css` (full file)
- Modify: `src/components/TitleLockup.module.css` (title font size)
- Modify: `src/components/AvatarCard.module.css` (name/sport font)

**What changes:** On mobile, the orbital avatar layout is likely too wide. Scale it down with a transform. Title uses `clamp()` for responsive sizing. Padding reduces.

**Step 1: Make TitleLockup responsive**

In `src/components/TitleLockup.module.css`, change the fixed `font-size: 64px` to:

```css
font-size: clamp(36px, 10vw, 64px);
```

**Step 2: Make HubView padding responsive**

Append to `src/components/HubView.module.css`:

```css
@media (max-width: 768px) {
  .top {
    padding-top: 48px;
  }

  .anchor {
    top: 35%;
    transform: scale(0.7);
  }

  .prompt {
    padding-bottom: 24px;
    font-size: 13px;
  }
}
```

**Step 3: Verify desktop — no changes at 1440px**

**Step 4: Verify mobile — hub fits at 390px, avatars don't overflow, title readable**

**Step 5: Commit**

```bash
git add src/components/HubView.module.css src/components/TitleLockup.module.css
git commit -m "feat: responsive hub view with scaled orbit on mobile"
```

---

## Task 4: StoryPanel + StoryBeat — Responsive Text + Spacing

**Files:**
- Modify: `src/components/StoryPanel.module.css:1-257`
- Modify: `src/components/StoryBeat.module.css:1-77`
- Modify: `src/components/TypographicMoment.module.css:1-47`

**What changes:** Beat text becomes responsive via `clamp()`. Step height reduces on mobile (80vh instead of 100vh). Padding scales down. TypographicMoment max-width removed on mobile.

**Step 1: Make StoryBeat responsive**

Append to `src/components/StoryBeat.module.css`:

```css
@media (max-width: 768px) {
  .step {
    min-height: 80vh;
  }

  .card {
    padding: 0 16px 20px;
  }

  .text {
    font-size: clamp(16px, 4.5vw, 20px);
    max-width: none;
  }

  .label {
    font-size: 9px;
  }

  .subtext {
    font-size: 12px;
  }
}
```

**Step 2: Make StoryPanel hero + footer responsive**

Append to `src/components/StoryPanel.module.css`:

```css
@media (max-width: 768px) {
  .hero {
    padding: 0 var(--space-lg);
    min-height: 100dvh;
  }

  .stepsOverlay {
    margin-top: -80vh;
  }

  .footer {
    padding: var(--space-lg);
  }

  .footerBottom {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-lg);
  }

  .fallback {
    padding: var(--space-lg);
    max-width: none;
  }

  .fallbackStory {
    max-width: none;
  }
}
```

Note: the `.stepsOverlay` margin-top must match `.step` min-height (80vh).

**Step 3: Make TypographicMoment responsive**

Append to `src/components/TypographicMoment.module.css`:

```css
@media (max-width: 768px) {
  .section {
    min-height: 80vh;
    padding: 0 var(--space-lg);
  }

  .context {
    max-width: none;
  }

  .divider {
    margin: 24px 0;
  }
}
```

**Step 4: Verify desktop — no visual changes at 1440px**

**Step 5: Verify mobile at 390px — text readable, cards not cramped, footer stacks**

**Step 6: Commit**

```bash
git add src/components/StoryBeat.module.css src/components/StoryPanel.module.css src/components/TypographicMoment.module.css
git commit -m "feat: responsive story beats, hero, and typographic moments for mobile"
```

---

## Task 5: StoryViz + IntersectionObserver — Mobile Viewport + Scroll Tuning

**Files:**
- Modify: `src/components/StoryViz.module.css:1-5`
- Modify: `src/components/StoryBeat.tsx:15-18` (IntersectionObserver margin)

**What changes:** Viz panel uses `100dvh`. On mobile, the IntersectionObserver margin widens so beats trigger earlier (momentum scroll compensation). Snowfall is reduced on mobile for perf.

**Step 1: Update StoryViz CSS**

Change line 5 in `src/components/StoryViz.module.css`:

```css
/* Before */
height: 100vh;

/* After */
height: 100dvh;
```

Add fallback + mobile rules at end of file:

```css
@supports not (height: 100dvh) {
  .vizPanel {
    height: 100vh;
  }
}

@media (max-width: 768px) {
  .vizPanel::before,
  .vizPanel::after {
    animation-duration: 30s;
    opacity: 0.6;
  }
}
```

**Step 2: Adjust IntersectionObserver margin for mobile**

In `src/components/StoryBeat.tsx`, import the hook and adjust margin:

```tsx
import { useIsMobile } from "../hooks/useIsMobile";

// Inside the component:
const isMobile = useIsMobile();

const isInView = useInView(cardRef, {
  root: scrollerRef,
  margin: isMobile ? "-5% 0px -5% 0px" : "-15% 0px -15% 0px",
  amount: "some",
});
```

The smaller margin on mobile means beats activate sooner — compensating for fast momentum scrolling.

**Step 3: Verify desktop — scroll behavior unchanged**

**Step 4: Verify mobile — beats trigger reliably during touch scroll**

**Step 5: Commit**

```bash
git add src/components/StoryViz.module.css src/components/StoryBeat.tsx
git commit -m "feat: mobile-optimized viz panel height and scroll thresholds"
```

---

## Task 6: Viz Renderer Container Pattern — Responsive Shared Styles

**Files:**
- Modify: `src/components/viz/renderers/ChoiVizRenderer.module.css`
- Modify: `src/components/viz/renderers/KlaeboVizRenderer.module.css`
- Modify: `src/components/viz/renderers/MeyersTaylorVizRenderer.module.css`
- Modify: `src/components/viz/renderers/BraathenVizRenderer.module.css`
- Modify: `src/components/viz/renderers/HughesVizRenderer.module.css`
- Modify: `src/components/viz/renderers/LiuVizRenderer.module.css`

**What changes:** All 6 renderers share the same container pattern: `max-width: 680px; padding: 0 32px`. On mobile, we remove max-width constraint and reduce padding. Fixed-width label columns (120-140px) shrink. This is a batch CSS-only change — no TSX modifications.

**Step 1: Add mobile rules to each renderer's CSS**

All 6 renderers need the same container fix. Append this block to each `.module.css` file:

```css
@media (max-width: 768px) {
  .container {
    max-width: none;
    padding: 0 16px;
    gap: 32px;
  }
}
```

**Step 2: Fix renderer-specific layout issues**

Each renderer has fixed-width label columns and some unique layout elements. Append these per-renderer mobile rules:

**ChoiVizRenderer.module.css:**
```css
@media (max-width: 768px) {
  .comparison {
    max-width: none;
  }
  .compName {
    width: 80px;
    font-size: 11px;
  }
  .runDot {
    width: 40px;
    height: 40px;
  }
  .runLine {
    width: 40px;
  }
}
```

**KlaeboVizRenderer.module.css:**
```css
@media (max-width: 768px) {
  .eventSlots {
    max-width: none;
  }
  .eventSlot {
    width: 60px;
  }
  .eventMedal {
    width: 28px;
    height: 28px;
  }
  .eventName {
    font-size: 8px;
  }
  .leaderName {
    width: 90px;
    font-size: 11px;
  }
}
```

**MeyersTaylorVizRenderer.module.css:**
```css
@media (max-width: 768px) {
  .timeline {
    max-width: none;
    gap: 4px;
  }
  .leaderName {
    width: 90px;
    font-size: 11px;
  }
}
```

**BraathenVizRenderer.module.css:**
```css
@media (max-width: 768px) {
  .runBars {
    max-width: none;
  }
  .runBarName {
    width: 80px;
    font-size: 11px;
  }
  .compName {
    width: 90px;
    font-size: 11px;
  }
}
```

**HughesVizRenderer.module.css:**
```css
@media (max-width: 768px) {
  .teamBlock {
    width: 70px;
  }
  .scoreNumber {
    font-size: 40px;
  }
  .saveGaugeWrap {
    max-width: none;
  }
}
```

**LiuVizRenderer.module.css:**
```css
@media (max-width: 768px) {
  .standingsTrack {
    width: 220px;
    height: 130px;
  }
  .compName {
    width: 80px;
    font-size: 11px;
  }
}
```

**Step 3: Verify desktop at 1440px — all 6 athletes' viz renders unchanged**

Visit each athlete's story and confirm no visual regression.

**Step 4: Verify mobile at 390px — viz containers fill width, labels don't overflow**

**Step 5: Commit**

```bash
git add src/components/viz/renderers/*.module.css
git commit -m "feat: responsive viz renderer containers and labels for mobile"
```

---

## Task 7: Remaining Small Components — MiniHub, StatCard, HistoricCounter, MedalBadge, SourceAttribution

**Files:**
- Modify: `src/components/MiniHub.module.css`
- Modify: `src/components/StatCard.module.css`
- Modify: `src/components/HistoricCounter.module.css`
- Modify: `src/components/MedalBadge.module.css`
- Modify: `src/components/SourceAttribution.module.css`

**What changes:** These smaller components get mobile-safe font sizes and touch targets. MiniHub is hidden on mobile (Task 2), but we still add responsive rules for potential future use.

**Step 1: Add mobile rules to each**

**MiniHub.module.css:**
```css
@media (max-width: 768px) {
  .miniHub {
    padding: 24px 16px;
  }
  .title {
    font-size: 18px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
```

**StatCard.module.css:**
```css
@media (max-width: 768px) {
  .card {
    padding: 12px 16px;
  }
  .value {
    font-size: 24px;
  }
}
```

**HistoricCounter.module.css:**
```css
@media (max-width: 768px) {
  .number {
    font-size: clamp(48px, 12vw, 72px);
  }
}
```

**MedalBadge.module.css — fix touch target:**
```css
@media (max-width: 768px) {
  .icon {
    width: 44px;
    height: 44px;
  }
}
```

**SourceAttribution.module.css:**
```css
@media (max-width: 768px) {
  .trigger {
    font-size: 13px;
    padding: 8px 0;
    min-height: 44px;
    display: flex;
    align-items: center;
  }
}
```

**Step 2: Verify desktop — no changes**

**Step 3: Verify mobile — text readable, medal badge tappable**

**Step 4: Commit**

```bash
git add src/components/MiniHub.module.css src/components/StatCard.module.css src/components/HistoricCounter.module.css src/components/MedalBadge.module.css src/components/SourceAttribution.module.css
git commit -m "feat: responsive small components with mobile touch targets"
```

---

## Task 8: Accessibility — `prefers-reduced-motion` for Framer Motion Animations

**Files:**
- Modify: `src/components/StoryBeat.tsx`
- Modify: `src/components/StoryPanel.tsx` (hero parallax)
- Modify: `src/components/AlpineLandscape.module.css`

**What changes:** Framer Motion animations in StoryBeat and StoryPanel hero respect `prefers-reduced-motion`. CSS animations in additional components get the media query.

**Step 1: Add reduced-motion support to StoryBeat**

In `src/components/StoryBeat.tsx`, import `useReducedMotion` from Framer Motion:

```tsx
import { motion, useInView, useReducedMotion } from "framer-motion";

// Inside the component:
const prefersReducedMotion = useReducedMotion();

// Replace all animate props with reduced-motion-aware versions:
// Card: always visible if reduced motion
animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}

// Accent line:
animate={isInView || prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}

// Text:
animate={isInView || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}

// Subtext:
animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
```

**Step 2: Add reduced-motion support to StoryPanel hero parallax**

In `src/components/StoryPanel.tsx`, check for reduced motion and disable parallax:

```tsx
import { useReducedMotion } from "framer-motion";

// Inside the component:
const prefersReducedMotion = useReducedMotion();

// For the hero motion.div, conditionally disable parallax:
style={{
  y: prefersReducedMotion ? 0 : heroY,
  opacity: prefersReducedMotion ? 1 : heroOpacity,
}}
```

**Step 3: Verify with browser's "Emulate CSS media: prefers-reduced-motion" in DevTools**

All animations should be disabled. Content should still be visible and correctly laid out.

**Step 4: Commit**

```bash
git add src/components/StoryBeat.tsx src/components/StoryPanel.tsx
git commit -m "feat: respect prefers-reduced-motion in scroll animations"
```

---

## Task 9: Full Integration Verification

**Files:** None (testing only)

**Step 1: Run existing tests**

```bash
npx vitest run
```

All tests should pass.

**Step 2: Manual verification at desktop (1440px)**

- Open hub view → click each athlete → scroll through story → verify no visual regressions
- Check: MiniHub sidebar present, 30/70 split, parallax hero, viz renders, particle effects

**Step 3: Manual verification at mobile (390px)**

Use browser DevTools responsive mode at 390×844 (iPhone 14):
- Hub: avatars visible, title readable, click an athlete
- Story: full-width panel, back button visible, beat text readable
- Scroll: beats trigger correctly, viz updates, sticky panel works
- Footer: stacks vertically, no overflow

**Step 4: Check intermediate widths (768px, 600px)**

Verify the breakpoint transition is smooth — no layout jumps or content cut-off.

**Step 5: Test reduced-motion**

In DevTools → Rendering → Emulate CSS media `prefers-reduced-motion: reduce`:
- Snowfall stops
- Beat cards appear without fade
- Hero has no parallax

**Step 6: Final commit if any fixups needed**

```bash
git add -A
git commit -m "fix: integration fixups from mobile verification"
```

---

## Summary

| Task | What | Files | Depends On |
|------|------|-------|------------|
| 1 | Foundation: `useIsMobile` hook + `dvh` viewport fix | tokens.css, new hook | — |
| 2 | StoryView: full-width on mobile, hide sidebar | StoryView.tsx/css | Task 1 |
| 3 | HubView: responsive orbit + title | HubView, TitleLockup css | — |
| 4 | StoryPanel + StoryBeat: responsive text + spacing | StoryPanel, StoryBeat, TypographicMoment css | — |
| 5 | StoryViz: dvh + scroll threshold tuning | StoryViz css, StoryBeat.tsx | Task 1 |
| 6 | Viz Renderers: responsive containers + labels | All 6 renderer css files | — |
| 7 | Small components: touch targets + font scaling | 5 small component css files | — |
| 8 | Accessibility: prefers-reduced-motion | StoryBeat.tsx, StoryPanel.tsx | — |
| 9 | Integration verification | None (testing only) | All |

**Parallelizable:** Tasks 3, 4, 6, 7 are independent and can be dispatched as parallel agents. Tasks 2 and 5 depend on Task 1. Task 8 is independent. Task 9 must be last.
