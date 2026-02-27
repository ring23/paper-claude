---
name: data-trustworthiness-and-accuracy
overview: Design a lightweight but robust workflow to keep athlete/source data accurate, well-sourced, and internally consistent for a historically accurate 2026 snapshot app.
todos:
  - id: audit-current-data
    content: Audit existing athlete data and identify which fields are raw facts vs derived presentation details
    status: completed
  - id: add-provenance-metadata
    content: Extend athlete/source structures with light provenance metadata (retrieved dates, notes) where useful
    status: completed
  - id: define-formatters
    content: Design shared formatting helpers for droughts, records, and similar narrative strings
    status: completed
  - id: write-data-invariant-tests
    content: Add tests that enforce key numeric/text invariants and source requirements for athletes data
    status: completed
  - id: document-data-workflow
    content: Create concise documentation for data sourcing, verification, and review workflow
    status: completed
  - id: align-interactive-features
    content: Ensure any new interactive features (what-if, missions, dashboards) pull from canonical data and mark hypotheticals clearly
    status: completed
isProject: false
---

# Data Trustworthiness & Accuracy Plan

## Goals

- **Single source of truth** for all athlete stats and narrative facts about the 2026 Games.
- **Clear provenance**: every non-obvious number or claim is traceable to an external source.
- **Internal consistency**: text, charts, badges, and missions never disagree.
- **Snapshot semantics**: data reflects a historically accurate view of the 2026 Games, not live updates.

## 1. Data model and structure

- **Centralize athlete data**
  - Keep all athlete facts in `[src/data/athletes.ts](src/data/athletes.ts)` (or split into smaller files but keep a single export surface).
  - Distinguish between:
    - **Raw factual fields** (times, scores, ages, years, event names, medal counts).
    - **Derived fields** used only for presentation (e.g., copy strings, formatted labels) – reduce these over time or generate them.
- **Add light metadata for provenance**
  - Extend each athlete’s `sources` entries to optionally include `retrievedAt` and `note` fields.
  - For facts that come from different articles than the main story link, allow multiple `sources` and annotate which field depends on which source in comments or doc.

## 2. Canonical facts and derivations

- **Canonical numeric fields**
  - Treat these as the only source of truth for important metrics:
    - Drought metrics (e.g., `droughtYears`, `droughtLastYear`).
    - Career medal counts (`careerMedals`, `totalMedalCount`).
    - Game scores, save percentages, shot counts.
  - Ensure all visualizations and UI elements read these fields directly.
- **Derive narrative-friendly strings from helpers**
  - Introduce formatter utilities (e.g., `formatDrought`, `formatRecordComparison`, `formatAgeRecord`) in a small module like `[src/utils/formatters.ts](src/utils/formatters.ts)`.
  - Use these helpers consistently in UI components (`StoryPanel`, dashboards, missions) to avoid retyping numbers in prose.

## 3. Accuracy checks and tests

- **Unit tests for invariants**
  - Add a test file (e.g., `[tests/athletes_data.test.ts](tests/athletes_data.test.ts)`) that imports the `athletes` array and asserts:
    - Textual numbers match data (e.g., “46 years” in `historicStat.context` aligns with `droughtYears`).
    - Percentages match underlying counts within a small epsilon (e.g., `savePercentage ≈ saves / shotsAgainst * 100`).
    - Medal tallies (`totalMedalCount`) equal `careerMedals.length` and match story phrasing.
    - All `id` fields are unique and referenced consistently across components.
- **Cross-field consistency checks**
  - Add tests that ensure derived values are self-consistent, for example:
    - `droughtYears === currentGamesYear - droughtLastYear` where applicable.
    - `vizData` structures conform to the discriminated union in `[src/types/viz.ts](src/types/viz.ts)`.
- **Source presence checks**
  - Tests that each athlete has at least one `sources` entry.
  - Optionally, enforce that particular sensitive stats (world records, all-time highs) list at least one primary source (e.g., `Olympics.com`).

## 4. Source link and freshness validation

- **Automated link validation (non-blocking in CI)**
  - Add a small script (e.g., `scripts/check_sources.ts`) that:
    - Loads all `sources` URLs.
    - Performs `HEAD` or lightweight `GET` requests to check for 2xx/3xx responses.
    - Outputs a report of broken or redirected URLs.
  - Mark this as an optional/slow check separate from the main test suite.
- **Manual re-verification workflow**
  - Document a simple checklist in `[docs/data-sourcing.md](docs/data-sourcing.md)`:
    - For any change to `athletes.ts`, confirm numbers against at least one primary source.
    - Run tests + (optionally) the source checker.
    - Record any known discrepancies with a short note and source link.

## 5. Aligning interactive features with truth

- **What-if sliders and dashboards**
  - Ensure all what-if logic starts from canonical values in `athletes.ts` and uses pure functions to create hypothetical scenarios.
  - Visually separate “hypothetical” values from “actual” ones (style and labels) so users can distinguish data from play.
- **Hover/click states and missions**
  - Store mission answers and tooltip content as structured queries against the same fields used by charts.
  - Avoid hardcoding numeric answers in mission definitions; instead, reference paths like `vizData.droughtYears` or derived helpers.

## 6. Editorial process and documentation

- **Editing guidelines**
  - In `[docs/data-sourcing.md](docs/data-sourcing.md)`, clarify:
    - Preferred kinds of sources (primary > secondary > tertiary).
    - How to handle disagreements between sources (e.g., use official Olympics site when in doubt).
    - How to annotate edge cases (rounded times, approximate shot counts, narrative embellishments that don’t change core stats).
- **Change review checklist**
  - For any PR that touches `src/data/`:
    - Reviewer confirms: tests pass, numbers match sources, and narrative/text still matches numeric fields.
    - If a key fact changes (e.g., drought length), ensure it’s used consistently in any timeline/dashboard logic.

## 7. Future-ready extension (optional)

- **Room for API-backed data later**
  - Keep the `Athlete` and `vizData` types decoupled from React components so they can be populated either from static data or an API layer in the future.
  - If you eventually add an ingestion script or API adapter, route it through a normalization step that outputs the same typed structures your tests already validate.

