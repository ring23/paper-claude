import type { StoryBeatData, MeyersTaylorVizState } from "../../types/story";

export const meyersTaylorStoryBeats: StoryBeatData<MeyersTaylorVizState>[] = [
  {
    id: "mt-intro",
    narration: {
      label: "Monobob Final",
      text: "Five Olympics. Sixteen years.",
      subtext: "One medal missing.",
    },
    vizState: {
      type: "meyers-taylor",
      centerDisplay: "intro",
      careerDotsLit: 0,
      showTimeMargin: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "neutral",
  },
  {
    id: "mt-vancouver",
    narration: {
      label: "Vancouver 2010",
      text: "A 25-year-old softball player turned bobsledder.",
      subtext: "Two-woman bronze — her first Olympic medal.",
    },
    vizState: {
      type: "meyers-taylor",
      centerDisplay: "vancouver",
      careerDotsLit: 1,
      showTimeMargin: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "neutral",
  },
  {
    id: "mt-sochi",
    narration: {
      label: "Sochi 2014",
      text: "Silver in the two-woman.",
      subtext: "Closer — but not close enough.",
    },
    vizState: {
      type: "meyers-taylor",
      centerDisplay: "sochi",
      careerDotsLit: 2,
      showTimeMargin: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "momentum",
  },
  {
    id: "mt-pyeongchang",
    narration: {
      label: "PyeongChang 2018",
      text: "Another silver.",
      subtext: "Three Games. Three medals. Zero gold.",
    },
    vizState: {
      type: "meyers-taylor",
      centerDisplay: "pyeongchang",
      careerDotsLit: 3,
      showTimeMargin: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "momentum",
  },
  {
    id: "mt-beijing",
    narration: {
      label: "Beijing 2022",
      text: "She carried the American flag. Won silver and bronze.",
      subtext: "Five Olympic medals — still no gold.",
    },
    vizState: {
      type: "meyers-taylor",
      centerDisplay: "beijing",
      careerDotsLit: 5,
      showTimeMargin: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "momentum",
  },
  {
    id: "mt-gap",
    narration: {
      text: "A baby. The pandemic. A comeback at 40.",
      subtext: "Most athletes would have retired years ago.",
    },
    vizState: {
      type: "meyers-taylor",
      centerDisplay: "gap",
      careerDotsLit: 5,
      showTimeMargin: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "longing",
  },
  {
    id: "mt-tension",
    narration: {
      label: "Milano Cortina 2026",
      text: "Trailing Laura Nolte by <em>0.04 seconds</em> through three heats.",
      subtext: "One run left.",
    },
    vizState: {
      type: "meyers-taylor",
      centerDisplay: "milano-tension",
      careerDotsLit: 5,
      showTimeMargin: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },
  {
    id: "mt-gold",
    narration: {
      label: "Heat 4",
      text: "She drops in.",
    },
    vizState: {
      type: "meyers-taylor",
      centerDisplay: "gold",
      careerDotsLit: 6,
      showTimeMargin: false,
      particleBurst: true,
      bgGlow: true,
    },
    emotion: "triumph",
    humanDetail: {
      bigNumber: "41",
      unit: "years old",
      context:
        "The oldest individual Winter Olympic gold medalist <strong>in history</strong>.",
    },
  },
];
