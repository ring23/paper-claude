import { describe, expect, test } from "vitest";
import { athletes } from "../src/data/athletes";
import type { AthleteTheme } from "../src/types/viz";
import { CURRENT_GAMES_YEAR } from "../src/utils/formatters";

const VALID_THEMES: AthleteTheme[] = [
  "drought_breaker",
  "record_breaker",
  "age_outlier",
  "first_ever",
  "comeback",
  "longevity",
];

describe("athletes data invariants", () => {
  test("athlete ids are unique", () => {
    const ids = athletes.map((a) => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("historic drought years align with vizData where explicitly referenced", () => {
    for (const athlete of athletes) {
      const { vizData, historicStat } = athlete;

      if ("droughtYears" in vizData) {
        const lowerContext = historicStat.context.toLowerCase();
        const mentionsYears =
          lowerContext.includes("years since") ||
          lowerContext.includes("years old");

        if (mentionsYears) {
          expect(lowerContext).toContain(String(vizData.droughtYears));
        }
      }

      if ("droughtLastYear" in vizData) {
        const expectedYears = CURRENT_GAMES_YEAR - vizData.droughtLastYear;
        expect(vizData.droughtYears).toBe(expectedYears);
      }
    }
  });

  test("meyers-taylor total medal count matches careerMedals length", () => {
    const meyersTaylor = athletes.find((a) => a.id === "meyers-taylor");
    expect(meyersTaylor).toBeDefined();
    if (!meyersTaylor || meyersTaylor.vizData.type !== "meyers-taylor") return;

    const { careerMedals, totalMedalCount } = meyersTaylor.vizData;
    const counted = careerMedals.reduce(
      (acc, medal) => {
        acc[medal.medal] += 1;
        return acc;
      },
      { gold: 0, silver: 0, bronze: 0 },
    );

    expect(counted).toEqual(totalMedalCount);
  });

  test("hughes save percentage is consistent with shots and saves", () => {
    const hughes = athletes.find((a) => a.id === "hughes");
    expect(hughes).toBeDefined();
    if (!hughes || hughes.vizData.type !== "hughes") return;

    const { saves, shotsAgainst, savePercentage } = hughes.vizData.hellebuyck;
    const computed = (saves / shotsAgainst) * 100;
    const epsilon = 0.2;
    expect(Math.abs(computed - savePercentage)).toBeLessThanOrEqual(epsilon);
  });

  test("each athlete has at least one data source", () => {
    for (const athlete of athletes) {
      expect(athlete.sources.length).toBeGreaterThan(0);
    }
  });
});

// --- NEW: Theme consistency tests ---

describe("theme consistency", () => {
  test("every athlete has at least one theme", () => {
    for (const athlete of athletes) {
      expect(athlete.themes).toBeDefined();
      expect(athlete.themes!.length).toBeGreaterThan(0);
    }
  });

  test("all theme values are from the controlled vocabulary", () => {
    for (const athlete of athletes) {
      if (!athlete.themes) continue;
      for (const theme of athlete.themes) {
        expect(VALID_THEMES).toContain(theme);
      }
    }
  });

  test("athletes tagged drought_breaker have droughtYears in vizData", () => {
    const droughtBreakers = athletes.filter(
      (a) => a.themes && a.themes.includes("drought_breaker"),
    );
    expect(droughtBreakers.length).toBeGreaterThan(0);

    for (const athlete of droughtBreakers) {
      expect("droughtYears" in athlete.vizData).toBe(true);
    }
  });

  test("athletes tagged age_outlier have age-related data in vizData", () => {
    const ageOutliers = athletes.filter(
      (a) => a.themes && a.themes.includes("age_outlier"),
    );
    expect(ageOutliers.length).toBeGreaterThan(0);

    for (const athlete of ageOutliers) {
      const hasAge = "age" in athlete.vizData || "ageYears" in athlete.vizData;
      expect(hasAge).toBe(true);
    }
  });

  test("athletes tagged record_breaker have record comparison data in vizData", () => {
    const recordBreakers = athletes.filter(
      (a) => a.themes && a.themes.includes("record_breaker"),
    );
    expect(recordBreakers.length).toBeGreaterThan(0);

    for (const athlete of recordBreakers) {
      const hasRecord =
        "previousRecord" in athlete.vizData ||
        "allTimeWinterRecord" in athlete.vizData;
      expect(hasRecord).toBe(true);
    }
  });
});

// --- NEW: Enhanced cross-field consistency ---

describe("enhanced cross-field consistency", () => {
  test("klaebo events2026 length matches 2026 golds in goldsByGames", () => {
    const klaebo = athletes.find((a) => a.id === "klaebo");
    expect(klaebo).toBeDefined();
    if (!klaebo || klaebo.vizData.type !== "klaebo") return;

    const { events2026, goldsByGames } = klaebo.vizData;
    const golds2026 = goldsByGames.find((g) => g.year === 2026);
    expect(golds2026).toBeDefined();
    expect(events2026.length).toBe(golds2026!.golds);
  });

  test("liu totalScore > silverScore (winner must outscore silver)", () => {
    const liu = athletes.find((a) => a.id === "liu");
    expect(liu).toBeDefined();
    if (!liu || liu.vizData.type !== "liu") return;

    expect(liu.vizData.totalScore).toBeGreaterThan(liu.vizData.silverScore);
  });

  test("choi winning run score > all competitor bestScores (except her own)", () => {
    const choi = athletes.find((a) => a.id === "choi");
    expect(choi).toBeDefined();
    if (!choi || choi.vizData.type !== "choi") return;

    const winningRun = choi.vizData.runs.find((r) => r.score !== null);
    expect(winningRun).toBeDefined();

    // Get the highest non-null run score
    const scores = choi.vizData.runs
      .filter((r) => r.score !== null)
      .map((r) => r.score!);
    const bestRunScore = Math.max(...scores);

    // Compare against other competitors (not Choi herself)
    const otherCompetitors = choi.vizData.competitors.filter(
      (c) => c.medal !== "gold",
    );
    for (const comp of otherCompetitors) {
      expect(bestRunScore).toBeGreaterThan(comp.bestScore);
    }
  });

  test("all historicStat.value fields can be parsed as numbers or have valid format", () => {
    for (const athlete of athletes) {
      const { value } = athlete.historicStat;
      // Value should either parse as a number or be a well-known format like "1st"
      const asNumber = Number(value);
      const isOrdinal = /^\d+(st|nd|rd|th)$/i.test(value);
      const isValidFormat = !isNaN(asNumber) || isOrdinal;
      expect(isValidFormat).toBe(true);
    }
  });
});
