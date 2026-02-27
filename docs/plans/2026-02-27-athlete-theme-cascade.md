# Athlete Theme Cascade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Thread each athlete's country colors and avatar identity throughout the entire story experience — from hero section through scrollytelling beats, viz panel, typographic moment, and footer.

**Architecture:** Add CSS custom properties `--athlete-primary` and `--athlete-secondary` to the StoryView root, set from `athlete.colors`. All child components reference these tokens instead of hardcoded gold/navy. A persistent floating avatar anchors the athlete's identity in the story view. Particle burst colors in VizRenderers are parameterized from the athlete data.

**Tech Stack:** React, CSS Modules, CSS custom properties, Framer Motion

---

### Task 1: Add athlete color CSS custom properties to StoryView

**Files:**
- Modify: `src/components/StoryView.tsx:46` (the motion.div panel)
- Modify: `src/styles/tokens.css:39-42` (add default fallback values)

**Step 1: Add fallback custom properties to tokens.css**

In `src/styles/tokens.css`, inside the `:root` block, after the existing accent section (line 42), add:

```css
  /* Athlete identity (overridden per-athlete in StoryView) */
  --athlete-primary: #C6982B;
  --athlete-secondary: #E4C45A;
```

**Step 2: Set custom properties on the StoryView panel**

In `src/components/StoryView.tsx`, add a `style` prop to the `motion.div` panel element (line 46) that sets the CSS custom properties from the athlete data:

```tsx
<motion.div
  className={panelClass}
  ref={panelRef}
  style={{
    '--athlete-primary': athlete.colors.primary,
    '--athlete-secondary': athlete.colors.secondary,
  } as React.CSSProperties}
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  // ... rest unchanged
>
```

**Step 3: Verify the app still compiles and renders**

Run: `npm run dev`
Expected: App loads without errors. No visual changes yet (no consumers of the new properties).

**Step 4: Commit**

```bash
git add src/components/StoryView.tsx src/styles/tokens.css
git commit -m "feat: add --athlete-primary/secondary CSS custom properties to StoryView"
```

---

### Task 2: Thread athlete colors into StoryBeat accent line and emphasis text

**Files:**
- Modify: `src/components/StoryBeat.module.css:32-36` (accent line)
- Modify: `src/components/StoryBeat.module.css:59-63` (em/emphasis text)

**Step 1: Update the accent line gradient**

In `src/components/StoryBeat.module.css`, change the `.accent` rule (line 34-36):

From:
```css
background: linear-gradient(90deg, var(--gold, #C6982B) 0%, rgba(228, 196, 90, 0.6) 60%, transparent 100%);
```

To:
```css
background: linear-gradient(90deg, var(--athlete-primary, var(--gold)) 0%, var(--athlete-secondary, var(--gold-light)) 60%, transparent 100%);
```

**Step 2: Update emphasis text color in narration**

In `src/components/StoryBeat.module.css`, change `.text em` (line 60):

From:
```css
color: var(--gold, #C6982B);
```

To:
```css
color: var(--athlete-primary, var(--gold));
```

**Step 3: Verify visually**

Run: `npm run dev`
Navigate to an athlete story. The accent line and bold text in story beats should now use the athlete's country primary color (e.g., green for Braathen, red for Hughes).

**Step 4: Commit**

```bash
git add src/components/StoryBeat.module.css
git commit -m "feat: thread athlete colors into story beat accent line and emphasis text"
```

---

### Task 3: Thread athlete colors into HistoricCounter and MedalBadge

**Files:**
- Modify: `src/components/HistoricCounter.module.css:17` (number color)
- Modify: `src/components/MedalBadge.module.css:18,36` (icon bg and label color)

**Step 1: Update HistoricCounter number color**

In `src/components/HistoricCounter.module.css`, change `.number` color (line 17):

From:
```css
color: var(--gold);
```

To:
```css
color: var(--athlete-primary, var(--gold));
```

**Step 2: Update MedalBadge icon background and label color**

In `src/components/MedalBadge.module.css`, change `.icon` background (line 18):

From:
```css
background: var(--gold);
```

To:
```css
background: var(--athlete-primary, var(--gold));
```

Change `.label` color (line 36):

From:
```css
color: var(--gold);
```

To:
```css
color: var(--athlete-primary, var(--gold));
```

**Step 3: Verify visually**

Scroll to the footer of any athlete story. The historic counter number and medal badge should now use the athlete's primary color.

**Step 4: Commit**

```bash
git add src/components/HistoricCounter.module.css src/components/MedalBadge.module.css
git commit -m "feat: thread athlete colors into HistoricCounter and MedalBadge"
```

---

### Task 4: Thread athlete colors into TypographicMoment

**Files:**
- Modify: `src/components/TypographicMoment.module.css:44-47` (strong text)
- Modify: `src/components/TypographicMoment.module.css:30-31` (divider)

**Step 1: Update strong text color**

In `src/components/TypographicMoment.module.css`, change `.context :global(strong)` (line 45):

From:
```css
color: var(--gold, #C6982B);
```

To:
```css
color: var(--athlete-primary, var(--gold));
```

**Step 2: Update divider color**

In `src/components/TypographicMoment.module.css`, change `.divider` background (line 31):

From:
```css
background: var(--slate, #3D5A73);
```

To:
```css
background: var(--athlete-primary, var(--slate));
```

**Step 3: Verify visually**

Scroll to the typographic moment section. The bold numbers and divider line should use athlete colors.

**Step 4: Commit**

```bash
git add src/components/TypographicMoment.module.css
git commit -m "feat: thread athlete colors into TypographicMoment divider and emphasis"
```

---

### Task 5: Thread athlete colors into hero headline

**Files:**
- Modify: `src/components/StoryPanel.module.css:88` (heroHeadline color)

**Step 1: Update heroHeadline color**

In `src/components/StoryPanel.module.css`, change `.heroHeadline` color (line 88):

From:
```css
color: var(--gold);
```

To:
```css
color: var(--athlete-primary, var(--gold));
```

**Step 2: Verify visually**

Load any athlete's story. The headline subtitle (e.g., "Snow Meets Samba") should use the athlete's primary color.

**Step 3: Commit**

```bash
git add src/components/StoryPanel.module.css
git commit -m "feat: thread athlete color into hero headline"
```

---

### Task 6: Add persistent floating avatar to StoryView

**Files:**
- Modify: `src/components/StoryView.tsx` (add avatar element)
- Modify: `src/components/StoryView.module.css` (add styles)

**Step 1: Add a floating avatar element to StoryView**

In `src/components/StoryView.tsx`, inside the `motion.div` panel, just before the `AnimatePresence`, add:

```tsx
{/* Persistent floating avatar */}
<motion.div
  className={styles.floatingAvatar}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
  key={`avatar-float-${athlete.id}`}
>
  <div
    className={styles.floatingAvatarRing}
    style={{
      background: `linear-gradient(135deg, ${athlete.colors.primary}, ${athlete.colors.secondary})`,
    }}
  >
    {athlete.avatar ? (
      <img
        src={athlete.avatar}
        alt={athlete.name}
        className={styles.floatingAvatarImg}
      />
    ) : (
      <span className={styles.floatingAvatarInitial}>{athlete.initial}</span>
    )}
  </div>
</motion.div>
```

**Step 2: Add CSS for the floating avatar**

In `src/components/StoryView.module.css`, add before the mobile media query:

```css
/* Persistent floating athlete avatar — top-left of story panel */
.floatingAvatar {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 50;
  pointer-events: none;
}

.floatingAvatarRing {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.floatingAvatarImg {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: block;
}

.floatingAvatarInitial {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #0B1726;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo Black', sans-serif;
  font-size: 18px;
  color: #E8E4DE;
}
```

In the existing `@media (max-width: 768px)` block, add:

```css
.floatingAvatar {
  top: 16px;
  right: 16px;
}

.floatingAvatarRing {
  width: 40px;
  height: 40px;
}

.floatingAvatarImg {
  width: 36px;
  height: 36px;
}

.floatingAvatarInitial {
  width: 36px;
  height: 36px;
  font-size: 15px;
}
```

**Step 3: Verify visually**

Load any athlete's story. A small avatar with their country-colored ring should appear fixed in the top-right corner, persisting as you scroll through their story.

**Step 4: Commit**

```bash
git add src/components/StoryView.tsx src/components/StoryView.module.css
git commit -m "feat: add persistent floating avatar with athlete colors in StoryView"
```

---

### Task 7: Parameterize VizRenderer particle colors from athlete data

**Files:**
- Modify: `src/components/viz/renderers/HughesVizRenderer.tsx:14` (PARTICLE_COLORS)
- Modify: `src/components/viz/renderers/ChoiVizRenderer.tsx:75` (inline particle color)
- Modify: `src/components/viz/renderers/BraathenVizRenderer.tsx` (particle colors)
- Modify: `src/components/viz/renderers/KlaeboVizRenderer.tsx` (particle colors)
- Modify: `src/components/viz/renderers/LiuVizRenderer.tsx` (particle colors)
- Modify: `src/components/viz/renderers/MeyersTaylorVizRenderer.tsx` (particle colors)

**Step 1: Update HughesVizRenderer**

In `src/components/viz/renderers/HughesVizRenderer.tsx`:

Remove the hardcoded constant (line 14):
```tsx
const PARTICLE_COLORS = ["#E4C45A", "#C6982B", "#B31942", "#0A3161", "#FFFFFF"];
```

Update the `spawnParticles` function to accept colors:
```tsx
function spawnParticles(container: HTMLDivElement, colors: string[]) {
```

And in the particle background assignment (line 37):
```tsx
p.style.background = colors[Math.floor(Math.random() * colors.length)];
```

In the component, build the colors array from the athlete prop:
```tsx
const particleColors = [athlete.colors.primary, athlete.colors.secondary, "#E4C45A", "#C6982B", "#FFFFFF"];
```

And update the `spawnParticles` call:
```tsx
spawnParticles(particlesRef.current, particleColors);
```

**Step 2: Update ChoiVizRenderer**

In `src/components/viz/renderers/ChoiVizRenderer.tsx`, update the inline particle color (line 75):

From:
```tsx
p.style.background = Math.random() > 0.5 ? "#E4C45A" : "#C6982B";
```

To:
```tsx
p.style.background = Math.random() > 0.5 ? athlete.colors.primary : athlete.colors.secondary;
```

The function `spawnParticles` needs access to `athlete` — either pass it as a parameter or extract the colors. Update the function signature to accept colors:
```tsx
function spawnParticles(container: HTMLDivElement, primary: string, secondary: string) {
```

And update the call in the effect:
```tsx
spawnParticles(particlesRef.current, athlete.colors.primary, athlete.colors.secondary);
```

**Step 3: Repeat for remaining 4 renderers**

Apply the same pattern: find hardcoded particle color arrays, replace with `athlete.colors.primary` and `athlete.colors.secondary` mixed with gold accents. Each renderer already receives the `athlete` prop.

**Step 4: Verify visually**

Navigate to each athlete's story. When particle bursts fire during "triumph" moments, they should use that athlete's country colors instead of generic gold.

**Step 5: Commit**

```bash
git add src/components/viz/renderers/*.tsx
git commit -m "feat: parameterize VizRenderer particle colors from athlete data"
```

---

### Task 8: Add athlete-colored glow to StoryViz panel

**Files:**
- Modify: `src/components/StoryViz.module.css:73-84` (bgGlow gradient)

**Step 1: Update bgGlow to use athlete color**

In `src/components/StoryViz.module.css`, change `.bgGlow` (line 76):

From:
```css
background: radial-gradient(circle at center, rgba(198, 152, 43, 0.15) 0%, transparent 70%);
```

To:
```css
background: radial-gradient(circle at center, var(--athlete-primary, rgba(198, 152, 43, 0.15)) 0%, transparent 70%);
```

Note: Since `var()` won't apply opacity, we need a different approach. Instead, use the CSS custom property with a low-opacity overlay:

```css
.bgGlow {
  position: absolute;
  inset: 0;
  background: var(--athlete-primary, #C6982B);
  opacity: 0;
  mix-blend-mode: soft-light;
  transition: opacity 1s;
  pointer-events: none;
}

.bgGlowActive {
  opacity: 0.15;
}
```

**Step 2: Verify visually**

Navigate to an athlete's triumph beat. The viz panel background glow should tint with the athlete's primary color.

**Step 3: Commit**

```bash
git add src/components/StoryViz.module.css
git commit -m "feat: tint StoryViz glow with athlete primary color"
```

---

### Task 9: Visual QA across all 6 athletes

**Step 1: Test each athlete end-to-end**

Run: `npm run dev`

For each athlete (Braathen, Hughes, Liu, Meyers-Taylor, Klaebo, Choi), verify:
- [ ] Hero headline uses athlete primary color
- [ ] Story beat accent line uses athlete primary → secondary gradient
- [ ] Story beat emphasis text uses athlete primary color
- [ ] Typographic moment divider and strong text use athlete color
- [ ] HistoricCounter number uses athlete primary color
- [ ] MedalBadge icon and label use athlete primary color
- [ ] Floating avatar appears with country-colored ring
- [ ] Floating avatar doesn't overlap mobile back button
- [ ] Particle bursts use athlete colors
- [ ] Viz panel glow tints with athlete color
- [ ] Sky still transitions per-athlete (existing behavior preserved)

**Step 2: Check contrast**

Verify that all athlete primary colors have sufficient contrast against their backgrounds:
- Braathen green (#009B3A) on dark navy bg — should be fine
- Hughes/Liu/Meyers-Taylor red (#B31942) on dark navy bg — should be fine
- Klaebo red (#BA0C2F) on dark navy bg — should be fine
- Choi red (#CD2E3A) on dark navy bg — should be fine

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete athlete theme cascade — colors, avatar, and identity threading"
```
