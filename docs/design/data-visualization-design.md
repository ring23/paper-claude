# Data Visualization Design — First Light: The Podium

> Enhancing athlete story panels with D3.js-powered visualizations using verified Olympic data.

## Principles

1. **Accuracy over spectacle** — Every data point must be sourced and verifiable. No fabricated data.
2. **Serve the story** — Each athlete gets a visualization tailored to their narrative, not a one-size-fits-all chart.
3. **Less is more** — Where data is thin, keep the viz simple. A single powerful number beats a busy chart.
4. **Source everything** — All data sources cited in-app with links to original reporting.

## Library

**D3.js** — Maximum creative control for bespoke visualizations that match the alpine design system. Hand-crafted SVG with animated transitions.

**Framer Motion** — Already in the project. Used for entrance animations and number counters.

---

## Athlete Data Inventory & Visualization Mapping

### 1. Lucas Pinheiro Braathen — Alpine Skiing, Giant Slalom

**Story:** First South American to win a Winter Olympic medal in 102 years of the Games.

#### Verified Data

| Data Point | Value | Source |
|---|---|---|
| Run 1 time | 1:13.92 | [Ski Racing](https://skiracing.com/lucas-pinheiro-braathen-olympic-gold-brazil-first-winter-medal-mens-gs-bormio-2026/) |
| Run 1 lead over Odermatt | +0.95s (largest Run 1 GS margin since 1988) | [Ski Racing](https://skiracing.com/brazils-pinheiro-braathen-massive-lead-olympic-giant-slalom-run-1/) |
| Combined time | 2:25.00 | [Ski Racing](https://skiracing.com/lucas-pinheiro-braathen-olympic-gold-brazil-first-winter-medal-mens-gs-bormio-2026/) |
| Final margin over Odermatt (silver) | +0.58s | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/lucas-pinheiro-braathen-wins-giant-slalom-gold-brazil-s-first-ever-winter-olympics-medal) |
| 3rd place: Loic Meillard | +1.17s | [Ski Racing](https://skiracing.com/lucas-pinheiro-braathen-olympic-gold-brazil-first-winter-medal-mens-gs-bormio-2026/) |
| Historic context | 102 years / 26 editions — 0 South American medals before this | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/lucas-pinheiro-braathen-wins-giant-slalom-gold-brazil-s-first-ever-winter-olympics-medal) |

#### Visualization: Horizontal Bar Chart (Time Gaps)

**Primary viz:** Horizontal bar chart showing Braathen vs Odermatt (+0.58s) vs Meillard (+1.17s). Bars animate outward from Braathen's baseline, making his dominance tangible.

**Secondary element:** A stark timeline showing 102 years (1924–2026) of zero South American medals, ending with a single gold marker. The emptiness *is* the visualization.

**Data gaps:** No gate-by-gate split data available. Run 2 individual time not sourced separately. Keep to what's verified.

---

### 2. Jack Hughes — Ice Hockey, USA vs Canada Gold Medal Game

**Story:** First US men's hockey gold since the 1980 Miracle on Ice — 46 years.

#### Verified Data

| Data Point | Value | Source |
|---|---|---|
| Final score | USA 2 – Canada 1 (OT) | [NHL.com](https://www.nhl.com/news/united-states-canada-2026-olympics-gold-medal-game-recap-february-22-2026) |
| P1 | 1-0 USA (Boldy, ~6 min) | [ESPN](https://www.espn.com/olympics/story/_/id/48005562/jack-hughes-connor-hellebuyck-lift-us-olympic-hockey-gold) |
| P2 | 1-1 (Makar tied it late) | [ESPN](https://www.espn.com/olympics/story/_/id/48005562/jack-hughes-connor-hellebuyck-lift-us-olympic-hockey-gold) |
| OT | 2-1 (Hughes at 1:41, ast. Werenski) | [ESPN](https://www.espn.com/olympics/story/_/id/48005562/jack-hughes-connor-hellebuyck-lift-us-olympic-hockey-gold) |
| Total shots | USA 28, Canada 42 | [ESPN](https://www.espn.com/olympics/story/_/id/48005562/jack-hughes-connor-hellebuyck-lift-us-olympic-hockey-gold) |
| P2 shots | USA 8, Canada 19 | [ESPN](https://www.espn.com/olympics/story/_/id/48005562/jack-hughes-connor-hellebuyck-lift-us-olympic-hockey-gold) |
| Hellebuyck saves | 41/42 (97.6%) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-2026-united-states-defeat-canada-overtime) |
| Hellebuyck slot saves | 27 from slot, 17 from inner slot | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-2026-united-states-defeat-canada-overtime) |
| USA penalty kill (tournament) | 18/18 (100%) | [ESPN](https://www.espn.com/olympics/story/_/id/48005562/jack-hughes-connor-hellebuyck-lift-us-olympic-hockey-gold) |
| Canada 5-on-3 power play (P2) | 93 seconds — killed | [ESPN](https://www.espn.com/olympics/story/_/id/48005562/jack-hughes-connor-hellebuyck-lift-us-olympic-hockey-gold) |
| Hughes tournament stats | 4G, 3A, 7P in 6 games | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-ice-hockey-men-jack-hughes-missing-teeth-overtime-goal-gold-medal) |
| Drought | 46 years (1980 → 2026) | [NHL.com](https://www.nhl.com/news/united-states-canada-2026-olympics-gold-medal-game-recap-february-22-2026) |

#### Visualization: Radial Gauge + Period Shot Chart

**Primary viz:** Radial gauge for Hellebuyck's 97.6% save rate (41/42). Nearly complete ring — one sliver missing. The near-perfection tells the story.

**Secondary viz:** Period-by-period shot comparison (stacked or grouped bars). P2's 19-8 Canada advantage is the dramatic peak — shows how much Hellebuyck carried.

**Tertiary element:** 46-year timeline (1980 → 2026) as a horizontal span. Sparse, editorial. The emptiness between the two endpoints is the point.

**Data gaps:** P1 and P3 individual shot counts not explicitly sourced (only P2: 19-8 and total: 42-28). We can derive P1+P3+OT combined but not individual periods. Flag this — use only what's confirmed.

**Note on derivable data:** P1 shots after regulation: Canada had 42 total, 19 in P2, so P1+P3+OT = 23 for Canada. USA had 28 total, 8 in P2, so P1+P3+OT = 20 for USA. We know P1 shots were 8-7 (Canada-USA) from CBC source. That leaves P3+OT = 15 Canada, 13 USA. But P3 specifically: Hellebuyck stopped all 14 shots in P3 per ESPN — so Canada P3 = 14, OT = 1 for Canada. USA P3+OT = 13 (not individually split). This is derivable but should be noted as calculated, not directly reported.

---

### 3. Alysa Liu — Figure Skating, Women's Singles

**Story:** First US women's figure skating gold in 24 years. Surged from 3rd after short program.

#### Verified Data

| Data Point | Value | Source |
|---|---|---|
| Total score | 226.79 (gold) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-figure-skating-women-alysa-liu-first-american-woman-gold-24-years) |
| Silver: Sakamoto Kaori | 224.90 | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-figure-skating-women-alysa-liu-first-american-woman-gold-24-years) |
| Bronze: Nakai Ami | Not sourced (mentioned but score not found) | — |
| Standing after short program | 3rd | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-figure-skating-women-alysa-liu-first-american-woman-gold-24-years) |
| Final standing | 1st | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-figure-skating-women-alysa-liu-first-american-woman-gold-24-years) |
| Key elements | Triple Axel opener + 6 more triples | [NBC Olympics](https://www.nbcolympics.com/news/live/2026-olympics-figure-skating-live-updates-highlights-scores-womens-free-skate-final-thurs-feb-19) |
| Second gold (team event) | Yes | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-figure-skating-women-alysa-liu-first-american-woman-gold-24-years) |
| Drought | 24 years (Sarah Hughes, 2002 Salt Lake City) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-figure-skating-women-alysa-liu-first-american-woman-gold-24-years) |

#### Visualization: Position Swap + Score Lollipop

**Primary viz:** Animated position swap — three dots (1st, 2nd, 3rd) after short program, then positions rearrange to show Liu rising from 3rd to 1st. Simple, dramatic, immediate.

**Secondary viz:** Lollipop chart — Liu 226.79 vs Sakamoto 224.90. The 1.89-point gap. Clean and minimal.

**Data gaps:** No SP/FS individual score breakdown (TES + PCS). No bronze medalist score. No element-by-element scoring. Keep it to total scores and the comeback narrative. Do not fabricate sub-scores.

---

### 4. Elana Meyers Taylor — Bobsled, Women's Monobob

**Story:** At 41, oldest individual Winter Olympic gold medalist. Won on a blistering final run after trailing for 3 heats. Gold on her 5th Olympics after 16 years of near-misses.

#### Verified Data

| Data Point | Value | Source |
|---|---|---|
| Total time | 3:57.93 (gold) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-bobsleigh-monobob-women-usa-meyers-taylor-gold) |
| Silver: Laura Nolte | 3:57.97 (+0.04) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-bobsleigh-monobob-women-usa-meyers-taylor-gold) |
| Bronze: Kaillie Humphries | 3:58.05 (+0.12) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-bobsleigh-monobob-women-usa-meyers-taylor-gold) |
| Heat 4 time | 59.51s | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-bobsleigh-monobob-women-usa-meyers-taylor-gold) |
| Heats 1-3 | Trailed Nolte (exact times not sourced) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-bobsleigh-monobob-women-usa-meyers-taylor-gold) |
| Age at competition | 41 | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/elana-meyers-taylor-bobsleigh-mother-winter-olympics) |
| Career Olympic medals | 6 total (1G, 3S, 2B) | [NBC Olympics](https://www.nbcolympics.com/news/elana-meyers-taylor-meet-athlete) |
| 2010 Vancouver | Bronze (two-woman) | [NBC Olympics](https://www.nbcolympics.com/news/elana-meyers-taylor-meet-athlete) |
| 2014 Sochi | Silver (two-woman) | [NBC Olympics](https://www.nbcolympics.com/news/elana-meyers-taylor-meet-athlete) |
| 2018 PyeongChang | Silver (two-woman) | [NBC Olympics](https://www.nbcolympics.com/news/elana-meyers-taylor-meet-athlete) |
| 2022 Beijing | Silver (monobob) + Bronze (two-woman) | [NBC Olympics](https://www.nbcolympics.com/news/elana-meyers-taylor-meet-athlete) |
| 2026 Milano Cortina | Gold (monobob) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-bobsleigh-monobob-women-usa-meyers-taylor-gold) |
| Record | Oldest individual Winter Olympic gold medalist | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/elana-meyers-taylor-bobsleigh-mother-winter-olympics) |
| Ties Bonnie Blair | Most Winter Olympic medals by a US woman | [NCAA.org](https://www.ncaa.org/news/2026/2/16/2026-olympics-elana-meyers-taylor-wins-6th-olympic-medal-ties-bonnie-blairs-us-winter-medal-mark.aspx) |

#### Visualization: Career Timeline + Final Run Highlight

**Primary viz:** Career journey timeline — 5 Olympic rings (2010–2026), medal earned at each. Bronze → Silver → Silver → Silver+Bronze → **Gold**. The long arc from near-miss to triumph. Animate medals appearing one by one.

**Secondary viz:** Simple highlight of Heat 4 (59.51s) as a standout bar or callout vs "trailed through heats 1-3" narrative text. We don't have individual heat 1-3 times, so we keep it editorial rather than charting fake data.

**Data gaps:** Individual heat 1-3 times not sourced. Do not fabricate. The narrative "trailed for 3 heats, then won on the final run" is told through text + the single verified 59.51 data point.

---

### 5. Johannes Hoesflot Klaebo — Cross-Country Skiing

**Story:** 6 golds at a single Olympics — the most ever. 11 career golds — the most in Winter Olympic history.

#### Verified Data

| Data Point | Value | Source |
|---|---|---|
| 2026 Gold #1 | Skiathlon (20km) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-cross-country-skiing-men-norway-johannes-hosflot-klaebo-six-golds-no-limits) |
| 2026 Gold #2 | Sprint Classic | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-cross-country-skiing-men-norway-johannes-hosflot-klaebo-six-golds-no-limits) |
| 2026 Gold #3 | 10km Free | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/johannes-hosflot-kl%C3%A6bo-equals-winter-olympic-record-eight-golds-cross-country-skiing-mens-10km-milano-cortina-2026) |
| 2026 Gold #4 | 4x7.5km Relay | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/johannes-hosflot-kl%C3%A6bo-wins-historic-ninth-olympic-gold-norway-cross-country-skiing-relay-milano-cortina-2026) |
| 2026 Gold #5 | Team Sprint Free | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-cross-country-skiing-men-norway-johannes-hosflot-klaebo-six-golds-no-limits) |
| 2026 Gold #6 | 50km Mass Start Classical | [NBC Olympics](https://www.nbcolympics.com/news/klaebo-endures-50km-achieves-historic-6-6-gold-medal-games) |
| 50km margin | +8.9s over Nyenget | [NBC Olympics](https://www.nbcolympics.com/news/klaebo-endures-50km-achieves-historic-6-6-gold-medal-games) |
| 50km 3rd place | Iversen, +30.7s | [NBC Olympics](https://www.nbcolympics.com/news/klaebo-endures-50km-achieves-historic-6-6-gold-medal-games) |
| 2018 PyeongChang golds | 3 (Sprint, Relay, Team Sprint) | [ESPN](https://www.espn.com/olympics/story/_/id/47993781/klaebo-becomes-1st-athlete-win-6-golds-winter-games) |
| 2022 Beijing golds | 2 (+ 1 silver, 1 bronze) | [ESPN](https://www.espn.com/olympics/story/_/id/47993781/klaebo-becomes-1st-athlete-win-6-golds-winter-games) |
| Career Olympic golds | 11 | [ESPN](https://www.espn.com/olympics/story/_/id/47993781/klaebo-becomes-1st-athlete-win-6-golds-winter-games) |
| Previous single-Games record | Eric Heiden, 5 golds (1980) | [NBC Olympics](https://www.nbcolympics.com/news/klaebo-endures-50km-achieves-historic-6-6-gold-medal-games) |
| All-time Winter golds shared record | 8 (Dæhlie, Bjørgen, Bjørndalen) — surpassed | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/kl%C3%A6bo-equals-all-time-winter-olympics-gold-record-breaking-down-medals-and-stats-of-norwegian-superstar) |
| Only trails | Michael Phelps (23 golds) among all Olympians | [ESPN](https://www.espn.com/olympics/story/_/id/47993781/klaebo-becomes-1st-athlete-win-6-golds-winter-games) |

#### Visualization: 6-Segment Radial Sweep + All-Time Leaderboard

**Primary viz:** Radial chart with 6 segments, each representing one event. All 6 fill gold, one by one, with event labels. The perfect sweep. This is the most satisfying visualization in the app.

**Secondary viz:** Horizontal bar chart — all-time Winter Olympic gold leaders. Klaebo (11), Bjørgen (8), Dæhlie (8), Bjørndalen (8). His bar extends far beyond the pack.

**Data gaps:** Individual event times/margins not sourced except 50km. That's fine — the 6/6 sweep and career totals are the story. Don't need granular race data.

---

### 6. Choi Gaon — Snowboard Halfpipe

**Story:** 17-year-old crashes hard, gets back up, wins gold on final run. Defeats mentor Chloe Kim. South Korea's first Olympic snow-sports gold.

#### Verified Data

| Data Point | Value | Source |
|---|---|---|
| Run 1 | Crashed (clipped lip) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-2026-choi-gaon-recovers-fall-win-women-snowboard-halfpipe-gold) |
| Run 2 | Fell again (washed out on first hit) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-2026-choi-gaon-recovers-fall-win-women-snowboard-halfpipe-gold) |
| Run 3 | 90.25 (gold-winning) | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-2026-choi-gaon-recovers-fall-win-women-snowboard-halfpipe-gold) |
| Silver: Chloe Kim | 88.00 (Run 1 score; fell on Run 3) | [NBC Olympics](https://www.nbcolympics.com/news/three-peat-denied-gaon-choi-stuns-halfpipe-gold-over-defending-champ-chloe-kim) |
| Kim Run 1 highlight | Switch frontside double cork 1080 | [NBC Olympics](https://www.nbcolympics.com/news/three-peat-denied-gaon-choi-stuns-halfpipe-gold-over-defending-champ-chloe-kim) |
| Kim Run 3 | Fell on cab double cork 1080 | [NBC Olympics](https://www.nbcolympics.com/news/three-peat-denied-gaon-choi-stuns-halfpipe-gold-over-defending-champ-chloe-kim) |
| Bronze: Mitsuki Ono | 85.00 | [NBC Olympics](https://www.nbcolympics.com/news/three-peat-denied-gaon-choi-stuns-halfpipe-gold-over-defending-champ-chloe-kim) |
| Age | 17 years, 101 days | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/choi-gaon-korea-teenage-snowboard-sensation-facing-idol-chloe-kim-milano-cortina-2026) |
| Historic | South Korea's first Olympic snow-sports gold | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-2026-choi-gaon-recovers-fall-win-women-snowboard-halfpipe-gold) |
| Historic | Youngest Olympic snowboarding champion ever | [Olympics.com](https://www.olympics.com/en/milano-cortina-2026/news/choi-gaon-korea-teenage-snowboard-sensation-facing-idol-chloe-kim-milano-cortina-2026) |

#### Visualization: 3-Run Arc + Score Lollipop

**Primary viz:** 3-point sparkline arc — Run 1 (crash/0), Run 2 (crash/0), Run 3 (90.25). The dramatic upswing from nothing to gold. Possibly the most emotionally compelling chart in the app. Animate the third point shooting upward.

**Secondary viz:** Score lollipop — Choi 90.25 vs Kim 88.00 vs Ono 85.00. Clean, simple comparison.

**Data gaps:** Run 1 and Run 2 have no numeric scores (crashes). Represent as zero or as X marks. Chloe Kim's Run 2 score not sourced. Keep to verified data only.

---

## In-App Source Attribution

All visualizations will include source attribution. Approach:

- Each story panel gets a small "Sources" link/icon that expands to show the data sources
- Sources displayed as publication name + link (e.g. "Olympics.com", "ESPN", "NHL.com")
- Styled subtly — muted text, small font — so it doesn't compete with the narrative but is always accessible
- Consider a global "About the data" section accessible from the hub view

## Design Integration Notes

- All visualizations inherit the existing design system: frost glass surfaces, alpine navy text, gold accents
- Charts render inside the story panel, replacing or augmenting the current 3-stat-card layout
- D3.js renders to SVG, which integrates cleanly with the existing React + CSS Modules architecture
- Framer Motion handles entrance animations; D3 handles data-driven transitions
- Responsive to the 1440x900 fixed viewport — no need for mobile breakpoints
- Consider a "data view" toggle on each panel if both narrative text and charts feel crowded

## Data Accuracy Protocol

1. Every numeric value in a visualization must have a verified source URL
2. Derived/calculated values must be clearly marked as such in the code and this document
3. When data is unavailable, show narrative text instead of fabricating chart data
4. Sources are checked against official Olympic reporting (olympics.com) as primary, with ESPN, NHL.com, NBC Olympics, and Ski Racing as secondary
5. If a value cannot be independently verified, it is excluded from visualizations
