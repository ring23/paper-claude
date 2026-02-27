import type { StoryBeatData, KlaeboVizState } from "../../types/story";

export const klaeboStoryBeats: StoryBeatData<KlaeboVizState>[] = [
  // Beat 1 — Intro
  {
    id: "klaebo-intro",
    narration: {
      label: "Milano Cortina 2026",
      text: "Six events. No one has ever done this.",
      subtext: "Cross-country skiing's ultimate test.",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "intro",
      fuseProgress: 0,
      milanoGoldsLit: 0,
      showLeaderboard: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "neutral",
  },

  // Beat 2 — PyeongChang 2018
  {
    id: "klaebo-pyeongchang",
    narration: {
      label: "PyeongChang 2018",
      text: "The fuse was lit at twenty-one.",
      subtext: "3 golds. Sprint, team sprint, relay.",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "pyeongchang",
      fuseProgress: 1,
      milanoGoldsLit: 0,
      showLeaderboard: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "momentum",
  },

  // Beat 3 — Beijing 2022
  {
    id: "klaebo-beijing",
    narration: {
      label: "Beijing 2022",
      text: "Two more golds. Five total.",
      subtext: "Sprint and team sprint. Already a dynasty.",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "beijing",
      fuseProgress: 2,
      milanoGoldsLit: 0,
      showLeaderboard: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "momentum",
  },

  // Beat 4 — Milano begins
  {
    id: "klaebo-milano-begins",
    narration: {
      label: "Milano Cortina 2026",
      text: "The fuse reaches Milano.",
      subtext: "Six events. One man. Everything to prove.",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "milano-progress",
      fuseProgress: 3,
      milanoGoldsLit: 0,
      showLeaderboard: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "tension",
  },

  // Beat 5 — Golds 1-2
  {
    id: "klaebo-golds-1-2",
    narration: {
      label: "Events 1 & 2",
      text: "Skiathlon. Sprint Classic. <em>Gold. Gold.</em>",
      subtext: "Two down, four to go.",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "milano-progress",
      fuseProgress: 3,
      milanoGoldsLit: 2,
      showLeaderboard: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "triumph",
  },

  // Beat 6 — Golds 3-4
  {
    id: "klaebo-golds-3-4",
    narration: {
      label: "Events 3 & 4",
      text: "10km Free. Relay. <em>Gold. Gold.</em>",
      subtext: "Four golds. The whispers start.",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "milano-progress",
      fuseProgress: 3,
      milanoGoldsLit: 4,
      showLeaderboard: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "triumph",
  },

  // Beat 7 — Gold 5, Heiden record tied
  {
    id: "klaebo-gold-5",
    narration: {
      label: "Event 5 \u00B7 Team Sprint Free",
      text: "Five golds. Heiden\u2019s record \u2014 <em>tied.</em>",
      subtext: "A mark that stood for 46 years.",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "record-tie",
      fuseProgress: 3,
      milanoGoldsLit: 5,
      showLeaderboard: false,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "reverence",
  },

  // Beat 8 — Gold 6, 50km, record broken (TypographicMoment)
  {
    id: "klaebo-gold-6",
    narration: {
      label: "Event 6 \u00B7 50km Mass Start",
      text: "Fifty kilometers. Plus 8.9 seconds. <em>All alone.</em>",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "record-break",
      fuseProgress: 3,
      milanoGoldsLit: 6,
      showLeaderboard: false,
      particleBurst: true,
      bgGlow: true,
    },
    emotion: "triumph",
    humanDetail: {
      bigNumber: "6/6",
      unit: "events \u00B7 six golds",
      context:
        "The greatest single Winter Olympics performance <strong>in history</strong>.",
    },
  },

  // Beat 9 — Career total leaderboard
  {
    id: "klaebo-career-total",
    narration: {
      text: "Eleven career golds.",
      subtext:
        "D\u00E6hlie, Bj\u00F8rgen, Bj\u00F8rndalen \u2014 all had eight. Klaebo has eleven.",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "career-total",
      fuseProgress: 3,
      milanoGoldsLit: 6,
      showLeaderboard: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "triumph",
  },

  // Beat 10 — Coda
  {
    id: "klaebo-coda",
    narration: {
      text: "Only Phelps has more. <em>Ever.</em>",
      subtext: "The greatest Winter Olympian who ever lived.",
    },
    vizState: {
      type: "klaebo",
      centerDisplay: "career-total",
      fuseProgress: 3,
      milanoGoldsLit: 6,
      showLeaderboard: true,
      particleBurst: false,
      bgGlow: false,
    },
    emotion: "reverence",
  },
];
