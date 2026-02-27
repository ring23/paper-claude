---
name: interactive-experiences-and-data-accuracy
overview: Consolidated plan to keep Olympic athlete data accurate and trustworthy while adding six interactive, data-driven features to the app.
todos:
  - id: data-audit-and-metadata
    content: Audit existing athlete data, distinguish raw vs derived fields, and add provenance metadata where helpful
    status: completed
  - id: create-formatters-and-invariants
    content: Implement shared formatter utilities and tests enforcing data invariants and narrative alignment
    status: completed
  - id: implement-hover-and-microinteractions
    content: Add data-driven hover/click states and micro-interactions that read from canonical fields
    status: completed
  - id: design-and-build-missions
    content: Define mission model per athlete and build guided missions powered by canonical data
    status: completed
  - id: implement-what-if-sliders
    content: Create baseline/hypothetical models and UI for what-if sliders without altering canonical stats
    status: completed
  - id: build-timeline-view
    content: Define timeline dataset and implement the global 1924–2026 scrubber view wired to athlete data
    status: completed
  - id: build-themed-dashboards
    content: Tag athletes with themes and build interactive dashboards that compare them across shared metrics
    status: completed
  - id: document-editorial-workflow
    content: Write and maintain concise documentation for data sourcing, verification, and review procedures
    status: completed
isProject: false
---

# Interactive Features & Data Accuracy Plan

## 1. Objectives

- **Data trustworthiness**: Ensure all athlete stats and narratives about the 2026 Games are accurate, well-sourced, and internally consistent.
- **Engagement**: Implement six interactive experiences that remain grounded in those trusted facts:
  1. Explorable what-if sliders
  2. Rich hover & click states
  3. Guided missions per athlete
  4. Micro-interactions & delightful feedback
  5. Global 1924–2026 timeline view
  6. Interactive dashboards around themes

## 2. Data foundations (single source of truth)

- **Centralize and type data**
  - Keep all athlete facts in `[src/data/athletes.ts](src/data/athletes.ts)` and related typed modules like `[src/types/viz.ts](src/types/viz.ts)`.
  - Separate **raw factual fields** (scores, times, ages, years, medal counts, event names) from **derived presentation fields** (labels, summary strings) and aim to derive the latter.
- **Provenance metadata**
  - Extend `DataSource` to optionally include `retrievedAt` and `note`, and keep at least one primary/official source per athlete.
  - Document in `[docs/data-sourcing.md](docs/data-sourcing.md)` which fields rely on which sources (e.g., drought years from Olympics.com vs. medal history from NBC/Others).
- **Formatter utilities**
  - Add a small utility module, e.g. `[src/utils/formatters.ts](src/utils/formatters.ts)`, for functions like `formatDrought`, `formatRecordComparison`, `formatAgeRecord`, and reuse them across `StoryPanel`, timelines, and dashboards.

## 3. Data validation & tests

- **Invariants on numeric data**
  - Create tests (e.g., `[tests/athletes_data.test.ts](tests/athletes_data.test.ts)`) that assert:
    - Consistency between `droughtYears`, `droughtLastYear`, and the 2026 games year.
    - Percentages (e.g., save percentage) align with underlying counts within a small epsilon.
    - Medal tallies (`totalMedalCount`) match `careerMedals` arrays and narrative text.
    - All `Athlete.id` values are unique and match the IDs used in components.
- **Narrative vs data alignment**
  - Tests that narrative fields like `historicStat.context` and key story phrases (e.g., "46 years") match the canonical numeric fields.
- **Source presence and link health (optional)**
  - Script to scan `sources` URLs and check for HTTP 2xx/3xx responses, surfacing broken or redirected links as a report.

## 4. Feature 1 – Explorable what‑if sliders

- **Design**
  - For each athlete with numeric outcomes (e.g., Braathen margins, Hughes shots/saves, Liu scores), define a `baseline` object built directly from `athletes.ts`.
  - Implement pure transformer functions (e.g., `computeHypotheticalOutcome(baseline, controls)`) that output **hypothetical** stats for visualization.
- **UX and trust**
  - Clearly label what-if interfaces (e.g., "What if Braathen had skied 0.3s slower?") and visually distinguish hypothetical lines/bars from actual ones (dashed, faded, different color family).
  - Never overwrite canonical stats in the primary story area; hypotheticals live in an adjacent or layered panel.
- **Testing**
  - Unit tests for transformer functions to ensure they are reversible or bounded and never corrupt baseline data.
  - Snapshot tests for representative slider states to guard against regressions in chart wiring.

## 5. Feature 2 – Rich hover & click states

- **Data-driven tooltips**
  - Represent tooltip content as structured data within `vizData` (e.g., events with `event`, `margin`, `note` fields) rather than free-form strings in components.
  - Charts consume the same structures for geometry and tooltip content, eliminating duplication.
- **Interactions**
  - On hover: show micro-stories (e.g., "Largest Run 1 margin since 1988") derived from metadata.
  - On click: lock selection, dim other traces, and surface an extended explanation panel that reads from canonical data/formatters.
- **Testing**
  - Storybook or visual examples verifying that hover/click states correctly display the factual values from `vizData`.

## 6. Feature 3 – Guided missions per athlete

- **Mission model**
  - Define a `Mission` type (e.g., `id`, `prompt`, `answerPath`, `check`, `rewardTag`).
  - Instead of hardcoding answers ("46 years"), missions reference paths into `Athlete` data (e.g., `['vizData', 'droughtYears']`).
  - Optional `check` function allows composite answers (e.g., sum of medals, ratio calculations) using canonical data.
- **Gameplay**
  - Present 2–4 missions per athlete that encourage exploring their charts/text.
  - When an answer is correct, highlight the related chart element or text section and record completion for a small badge/indicator.
- **Accuracy alignment**
  - Because missions resolve against canonical data, updating `athletes.ts` automatically updates mission answers.

## 7. Feature 4 – Micro‑interactions & delightful feedback

- **Trigger conditions**
  - Define animation triggers as predicates over canonical data (e.g., `isRecordBreaker(athlete)` when `careerGolds > previousRecord.golds`).
  - Use these triggers both for micro-interactions (e.g., subtle medal shimmer) and bigger effects (e.g., confetti for all-time feats).
- **Implementation focus**
  - Use `framer-motion` to add:
    - Small hover scales/rotations on avatars and medals.
    - Entrance/exit transitions for story panels and dashboard cards.
    - Occasional celebratory animations tied to data milestones (not random).
- **Testing**
  - Unit tests on trigger predicates; interactive/visual testing via Storybook or manual QA for animation feel.

## 8. Feature 5 – Global 1924–2026 timeline

- **Timeline data model**
  - Introduce a dedicated timeline dataset, e.g. `[src/data/timeline.ts](src/data/timeline.ts)`, capturing Winter Games years, host cities, and key events.
  - Link `Athlete` stories to this data by year and descriptors instead of re-encoding timeline facts in free text.
- **UI/interaction**
  - Create a horizontal scrubber/scrollable timeline where selecting a year:
    - Updates the background/sky theme.
    - Shows any key moments at that Games.
    - Highlights when and how each featured athlete fits into the broader history (e.g., drought breaker, record setter).
- **Consistency**
  - Compute droughts and record statements by combining `timeline` data with `Athlete` data; ensure tests enforce these relationships.

## 9. Feature 6 – Interactive dashboards around themes

- **Theme tagging**
  - Add a `themes` field to `Athlete` (e.g., `['drought_breaker', 'record_breaker', 'age_outlier']`).
  - Define a controlled vocabulary of theme IDs documented in `[docs/data-sourcing.md](docs/data-sourcing.md)`.
- **Dashboards**
  - Build one or more dashboard views that group athletes by theme and render small-multiple charts (e.g., drought length comparison, age vs performance, medal counts).
  - All metrics should be read directly from canonical fields and formatted with shared helpers.
- **Navigation**
  - Allow quick transitions between hub, story view, timeline, and dashboards so users can move from a single story to a comparative perspective.

## 10. Editorial & review workflow

- **Guidelines**
  - In `[docs/data-sourcing.md](docs/data-sourcing.md)`, capture:
    - Preferred sources and tie-breaking rules when numbers disagree.
    - How to handle approximate or rounded numbers.
    - Required steps before merging data or copy changes (run tests, optional source check script, quick manual verification of key charts).
- **Review checklist for PRs touching data/UX**
  - Confirm tests pass, including data invariants.
  - Verify that any new missions, tooltips, or dashboard metrics are wired to canonical fields.
  - Manually spot-check at least one athlete end-to-end (story text, charts, missions, timeline presence, dashboard entries) for consistency.

## 11. Phased implementation

- **Phase 1 – Data hardening**
  - Audit current `athletes.ts`, add provenance metadata, create formatters, and implement the invariant tests.
- **Phase 2 – Low-risk interactivity**
  - Implement rich hover/click states and micro-interactions, ensuring they are read-only views over existing data.
- **Phase 3 – Missions & what-if**
  - Add mission system and what-if sliders for 1–2 flagship athletes; refine UX and guardrails for hypothetical vs actual.
- **Phase 4 – Timeline & dashboards**
  - Introduce `timeline` data, build the scrubber view, and then derive thematic dashboards from the combined data.

