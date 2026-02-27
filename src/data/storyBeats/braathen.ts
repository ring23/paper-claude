import type { StoryBeatData, BraathenVizState } from "../../types/story";

export const braathenStoryBeats: StoryBeatData<BraathenVizState>[] = [
  {
    id: "braathen-intro",
    narration: {
      label: "Giant Slalom Final",
      text: "1924. The first Winter Olympics.",
      subtext: "Chamonix, France.",
    },
    vizState: {
      type: "braathen",
      centerDisplay: "intro",
      droughtCounterTarget: 0,
      showRunBars: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "neutral",
  },
  {
    id: "braathen-drought-start",
    narration: {
      text: "No South American has ever won a Winter Olympic medal.",
      subtext: "Not once. Not in any sport.",
    },
    vizState: {
      type: "braathen",
      centerDisplay: "drought-start",
      droughtCounterTarget: 0,
      showRunBars: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },
  {
    id: "braathen-drought-running",
    narration: {
      text: "26 editions. 102 years. <em>Zero medals.</em>",
      subtext: "The longest continental drought in Winter Olympic history.",
    },
    vizState: {
      type: "braathen",
      centerDisplay: "drought-running",
      droughtCounterTarget: 102,
      showRunBars: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },
  {
    id: "braathen-run1",
    narration: {
      label: "Run 1",
      text: "Braathen leads by <em>0.58 seconds</em>.",
      subtext: "The largest Run 1 margin since 1988.",
    },
    vizState: {
      type: "braathen",
      centerDisplay: "run1",
      droughtCounterTarget: 102,
      showRunBars: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "momentum",
  },
  {
    id: "braathen-run2",
    narration: {
      label: "Run 2",
      text: "Combined time locked.",
      subtext: "Hold the lead. Hold it.",
    },
    vizState: {
      type: "braathen",
      centerDisplay: "run2",
      droughtCounterTarget: 102,
      showRunBars: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },
  {
    id: "braathen-gold",
    narration: {
      label: "Gold",
      text: "102 years of waiting. <em>Over.</em>",
    },
    vizState: {
      type: "braathen",
      centerDisplay: "gold",
      droughtCounterTarget: 102,
      showRunBars: false,
      particleBurst: true,
      bgGlow: true,
    },
    emotion: "triumph",
    humanDetail: {
      bigNumber: "102",
      unit: "years",
      context:
        "Zero South American medals. Until <strong>now</strong>.",
    },
  },
  {
    id: "braathen-podium",
    narration: {
      text: "He beat defending champion Marco Odermatt by over half a second.",
      subtext: "Brazil's first Winter Olympic medal — and it was gold.",
    },
    vizState: {
      type: "braathen",
      centerDisplay: "podium",
      droughtCounterTarget: 102,
      showRunBars: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "triumph",
  },
];
