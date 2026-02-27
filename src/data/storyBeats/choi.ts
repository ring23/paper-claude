import type { StoryBeatData, ChoiVizState } from "../../types/story";

export const choiStoryBeats: StoryBeatData<ChoiVizState>[] = [
  {
    id: "choi-setup",
    narration: {
      label: "Halfpipe Final",
      text: "Three runs. Ninety seconds each.",
      subtext: "Only the best score counts.",
    },
    vizState: {
      type: "choi",
      centerDisplay: "setup",
      runDots: ["pending", "pending", "pending"],
      showComparison: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "neutral",
  },
  {
    id: "choi-crash1",
    narration: {
      label: "Run 1",
      text: 'She clips the lip. <span class="accent-red">Crash.</span>',
      subtext: "Score: DNF",
    },
    vizState: {
      type: "choi",
      centerDisplay: "crash1",
      runDots: ["crashed", "pending", "pending"],
      showComparison: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "crash",
  },
  {
    id: "choi-crash2",
    narration: {
      label: "Run 2",
      text: 'Washed out on the first hit. <span class="accent-red">Another crash.</span>',
      subtext: "Score: DNF",
    },
    vizState: {
      type: "choi",
      centerDisplay: "crash2",
      runDots: ["crashed-dim", "crashed", "pending"],
      showComparison: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "crash",
  },
  {
    id: "choi-tension",
    narration: {
      text: "<em>One run left.</em>",
      subtext: "Everything on this.",
    },
    vizState: {
      type: "choi",
      centerDisplay: "tension",
      runDots: ["crashed-dim", "crashed-dim", "active"],
      showComparison: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },
  {
    id: "choi-gold",
    narration: {
      label: "Run 3",
      text: "She drops in.",
    },
    vizState: {
      type: "choi",
      centerDisplay: "gold",
      runDots: ["crashed-dim", "crashed-dim", "gold"],
      showComparison: false,
      particleBurst: true,
      bgGlow: true,
    },
    emotion: "triumph",
    humanDetail: {
      bigNumber: "17",
      unit: "years, 101 days",
      context:
        "South Korea's <strong>first-ever</strong> Olympic snow-sport gold medalist.",
    },
  },
  {
    id: "choi-podium",
    narration: {
      text: "She dethroned Chloe Kim.",
      subtext: "The youngest halfpipe champion in Olympic history.",
    },
    vizState: {
      type: "choi",
      centerDisplay: "podium",
      runDots: ["crashed-dim", "crashed-dim", "gold"],
      showComparison: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "triumph",
  },
];
