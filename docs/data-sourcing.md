# Data Sourcing & Editorial Guidelines

This document outlines the sourcing hierarchy, data-integrity rules, and review process for all athlete data in the Milano Cortina 2026 visualization project.

---

## 1. Source Hierarchy

All data points must be traceable to at least one cited source. Sources are ranked by reliability:

### Primary (authoritative)
- **Olympics.com** official results and athlete profiles
- **ISU** (International Skating Union) — figure skating and short track
- **IBU** (International Biathlon Union) — biathlon results
- **FIS** (International Ski and Snowboard Federation) — alpine, cross-country, freestyle, snowboard
- **IIHF** — ice hockey tournament results and statistics
- **IBSF** — bobsled and skeleton official results

### Secondary (major outlets with editorial standards)
- NBC Olympics / NBC Sports
- ESPN / ESPN Olympics
- BBC Sport
- NHL.com (for hockey-specific statistics)
- Reuters, AP (wire services)

### Tertiary (reference only, never sole source)
- Wikipedia
- Fan sites and blogs
- Social media posts

**Rule:** Every `sources` entry on an athlete must include at least one Primary or Secondary source. Tertiary sources may supplement but must never be the only citation.

---

## 2. Tie-Breaking Rules

When sources disagree on a data point:

1. **Prefer official Olympic results databases** (Olympics.com timing/scoring systems) for competition results (times, scores, margins).
2. **Prefer the sport's governing body** (FIS, ISU, IIHF, IBSF) for career statistics and records.
3. **Prefer wire services** (Reuters, AP) for factual context (ages, nationalities, historical records) when official sources are silent.
4. **Document the disagreement** by adding a `note` field to the relevant `DataSource` entry explaining which value was chosen and why.

---

## 3. Handling Approximations

Some data points involve rounding or estimation:

- **Save percentages** (e.g., Hellebuyck's 97.6%) — store the raw `saves` and `shotsAgainst` alongside the computed `savePercentage`. The test suite verifies consistency within a 0.2% epsilon.
- **Time margins** — store exact strings from official results (e.g., "+0.58") rather than computing them from individual times, to avoid floating-point drift.
- **Ages** — compute from birth date to competition date. Store both `ageYears` and `ageDays` where precision matters (e.g., Choi at 17 years 101 days).
- **Drought years** — compute as `CURRENT_GAMES_YEAR - lastWinYear`. When `droughtLastYear` is present, the test suite verifies this arithmetic.

When a number is rounded, note the rounding method in a comment or `note` field.

---

## 4. Review Checklist for Data Changes

Before merging any change to `src/data/athletes.ts` or related data files:

- [ ] **Run the test suite:** `npx vitest run` — all tests must pass.
- [ ] **Verify numeric fields** match at least one cited source. Cross-reference the `sources` array.
- [ ] **Check narrative alignment:** Ensure `story`, `headline`, and `achievement` text aligns with canonical numeric fields in `vizData` and `historicStat`.
- [ ] **Theme vocabulary check:** Confirm any `themes` values are from the controlled vocabulary defined in `AthleteTheme` (`src/types/viz.ts`).
- [ ] **Cross-field consistency:** Verify related fields agree:
  - Medal counts sum correctly (`totalMedalCount` vs `careerMedals.length`)
  - Drought years match `CURRENT_GAMES_YEAR - droughtLastYear` where applicable
  - Save percentage is consistent with saves/shotsAgainst
  - Events list length matches golds count for the same year
  - Winner's score exceeds runner-up's score
- [ ] **Source presence:** Every athlete has at least one source entry.

---

## 5. Theme Vocabulary Reference

All athletes must be tagged with one or more themes from this controlled vocabulary:

| Theme             | Definition                                                                 | Athletes                        |
|-------------------|----------------------------------------------------------------------------|----------------------------------|
| `drought_breaker` | Ended a multi-year/multi-edition winning drought for a country or program  | Braathen, Hughes, Liu            |
| `record_breaker`  | Set a new Olympic record (career golds, single-Games golds, etc.)          | Klaebo                           |
| `age_outlier`     | Notably old or young for Olympic gold (outside typical age range)           | Meyers Taylor (41), Choi (17)    |
| `first_ever`      | First athlete from a country or region to achieve a specific Olympic feat  | Braathen, Choi                   |
| `comeback`        | Won despite a significant deficit or setback during competition             | Liu (3rd after SP), Choi (2 crashes) |
| `longevity`       | Career spanning many Games with sustained medal-winning performance         | Meyers Taylor (5 Games, 6 medals)|

New themes may be added to the `AthleteTheme` union type in `src/types/viz.ts`. When adding a new theme:
1. Add the string literal to the `AthleteTheme` type
2. Add a row to this table
3. Add a test in `tests/athletes_data.test.ts` verifying the new theme's data requirements
4. Run `npx vitest run` to confirm all tests pass
