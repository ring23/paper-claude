import { describe, it, expect } from "vitest";
import { choiStoryBeats } from "../src/data/storyBeats/choi";
import { getStoryBeats } from "../src/data/storyBeats/index";

describe("Choi story beats", () => {
  it("has 6 beats", () => {
    expect(choiStoryBeats).toHaveLength(6);
  });

  it("each beat has unique id", () => {
    const ids = choiStoryBeats.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each beat has narration text", () => {
    for (const beat of choiStoryBeats) {
      expect(beat.narration.text).toBeTruthy();
    }
  });

  it("first beat is setup, last is podium", () => {
    expect(choiStoryBeats[0].vizState.centerDisplay).toBe("setup");
    expect(choiStoryBeats[5].vizState.centerDisplay).toBe("podium");
  });

  it("gold beat has particle burst and bg glow", () => {
    const goldBeat = choiStoryBeats.find(
      (b) => b.vizState.centerDisplay === "gold",
    );
    expect(goldBeat?.vizState.particleBurst).toBe(true);
    expect(goldBeat?.vizState.bgGlow).toBe(true);
  });

  it("gold beat has human detail", () => {
    const goldBeat = choiStoryBeats.find(
      (b) => b.vizState.centerDisplay === "gold",
    );
    expect(goldBeat?.humanDetail).toBeDefined();
    expect(goldBeat?.humanDetail?.bigNumber).toBe("17");
  });
});

describe("getStoryBeats", () => {
  it("returns choi beats for 'choi'", () => {
    expect(getStoryBeats("choi")).toBe(choiStoryBeats);
  });

  it("returns empty array for unknown athlete", () => {
    expect(getStoryBeats("unknown")).toEqual([]);
  });
});
