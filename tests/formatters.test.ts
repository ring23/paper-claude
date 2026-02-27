import { describe, expect, test } from "vitest";
import {
  formatDrought,
  formatRecordComparison,
  formatAgeRecord,
  CURRENT_GAMES_YEAR,
} from "../src/utils/formatters";
import { athletes } from "../src/data/athletes";

describe("CURRENT_GAMES_YEAR", () => {
  test("is 2026", () => {
    expect(CURRENT_GAMES_YEAR).toBe(2026);
  });
});

describe("formatDrought", () => {
  test("produces correct string for Braathen (102-year drought, no last year)", () => {
    const result = formatDrought({
      droughtYears: 102,
      subject: "South American Winter Olympic medal",
    });
    expect(result).toBe(
      "102 years since last South American Winter Olympic medal",
    );
  });

  test("produces correct string for Hughes (46-year drought, no last year)", () => {
    const result = formatDrought({
      droughtYears: 46,
      subject: "US hockey gold",
    });
    expect(result).toBe("46 years since last US hockey gold");
  });

  test("produces correct string for Liu (24-year drought with last year)", () => {
    const result = formatDrought({
      droughtYears: 24,
      droughtLastYear: 2002,
      subject: "US women's skating gold",
    });
    expect(result).toBe(
      "24 years since last US women's skating gold in 2002",
    );
  });

  test("handles missing optional droughtLastYear", () => {
    const result = formatDrought({
      droughtYears: 50,
      subject: "test event",
    });
    expect(result).toBe("50 years since last test event");
  });

  test("handles droughtLastYear of 0 by omitting it", () => {
    const result = formatDrought({
      droughtYears: 50,
      droughtLastYear: 0,
      subject: "test event",
    });
    // 0 is falsy, so should omit year
    expect(result).toBe("50 years since last test event");
  });
});

describe("formatRecordComparison", () => {
  test("produces correct string for Klaebo career golds record", () => {
    const result = formatRecordComparison({
      value: 11,
      unit: "career golds",
      context: "most ever in Winter Olympics",
    });
    expect(result).toBe("11 career golds — most ever in Winter Olympics");
  });

  test("produces correct string for Klaebo single-Games golds record", () => {
    const result = formatRecordComparison({
      value: 6,
      unit: "golds",
      context: "most by one athlete at a single Winter Games",
    });
    expect(result).toBe(
      "6 golds — most by one athlete at a single Winter Games",
    );
  });
});

describe("formatAgeRecord", () => {
  test("produces correct string for Meyers Taylor", () => {
    const result = formatAgeRecord({
      age: 41,
      context: "oldest individual Winter gold medalist",
    });
    expect(result).toBe("41 — oldest individual Winter gold medalist");
  });

  test("produces correct string for Choi", () => {
    const result = formatAgeRecord({
      age: 17,
      context: "youngest halfpipe Olympic champion",
    });
    expect(result).toBe("17 — youngest halfpipe Olympic champion");
  });
});

describe("formatters integrate with athlete data", () => {
  test("formatDrought works with all drought-breaker athletes", () => {
    const droughtAthletes = athletes.filter(
      (a) => "droughtYears" in a.vizData,
    );
    expect(droughtAthletes.length).toBeGreaterThan(0);

    for (const athlete of droughtAthletes) {
      const vizData = athlete.vizData as { droughtYears: number };
      const result = formatDrought({
        droughtYears: vizData.droughtYears,
        subject: athlete.sport,
      });
      expect(result).toContain(String(vizData.droughtYears));
    }
  });
});
