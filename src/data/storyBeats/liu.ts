import type { StoryBeatData, LiuVizState } from "../../types/story";

export const liuStoryBeats: StoryBeatData<LiuVizState>[] = [
  {
    id: "liu-drought-intro",
    narration: {
      label: "Figure Skating",
      text: "Sarah Hughes. Salt Lake City, 2002.",
      subtext: "The last time an American woman won Olympic gold.",
    },
    vizState: {
      type: "liu",
      centerDisplay: "drought-intro",
      droughtCounterTarget: 0,
      standingsPositions: [3, 1, 2],
      highlightLiu: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "reverence",
  },
  {
    id: "liu-24-years",
    narration: {
      text: "Twenty-four years since an American woman stood here.",
      subtext: "Six Olympics. Zero golds.",
    },
    vizState: {
      type: "liu",
      centerDisplay: "drought-counting",
      droughtCounterTarget: 24,
      standingsPositions: [3, 1, 2],
      highlightLiu: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },
  {
    id: "liu-short-program",
    narration: {
      label: "Short Program",
      text: "After the short program: Liu sits third.",
      subtext: "Behind Sakamoto and Nakai.",
    },
    vizState: {
      type: "liu",
      centerDisplay: "short-program",
      droughtCounterTarget: 24,
      standingsPositions: [3, 1, 2],
      highlightLiu: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },
  {
    id: "liu-free-start",
    narration: {
      text: "<em>The free skate. Everything changes.</em>",
      subtext: "One program to rewrite history.",
    },
    vizState: {
      type: "liu",
      centerDisplay: "free-start",
      droughtCounterTarget: 24,
      standingsPositions: [3, 1, 2],
      highlightLiu: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },
  {
    id: "liu-rising",
    narration: {
      text: "She lands the triple axel. Then the quad.",
      subtext: "Liu surges past Nakai into second.",
    },
    vizState: {
      type: "liu",
      centerDisplay: "rising",
      droughtCounterTarget: 24,
      standingsPositions: [2, 1, 3],
      highlightLiu: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "momentum",
  },
  {
    id: "liu-gold",
    narration: {
      label: "Final Score",
      text: "226.79. First place.",
      subtext: "The drought is over.",
    },
    vizState: {
      type: "liu",
      centerDisplay: "gold",
      droughtCounterTarget: 24,
      standingsPositions: [1, 2, 3],
      highlightLiu: true,
      particleBurst: true,
      bgGlow: true,
    },
    emotion: "triumph",
    humanDetail: {
      bigNumber: "24",
      unit: "years",
      context: "Last American: <strong>Sarah Hughes, 2002</strong>.",
    },
  },
  {
    id: "liu-margin",
    narration: {
      text: "She dethroned Sakamoto by 1.89 points.",
      subtext: "A career-best free skate when it mattered most.",
    },
    vizState: {
      type: "liu",
      centerDisplay: "margin",
      droughtCounterTarget: 24,
      standingsPositions: [1, 2, 3],
      highlightLiu: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "triumph",
  },
];
