import type { AthleteTheme, DataSource, SkyTheme } from "../types/viz";

// --- Per-athlete visualization data (discriminated union) ---

interface BraathenVizData {
  type: "braathen";
  run1Time: string;
  combinedTime: string;
  competitors: { name: string; margin: string }[];
  run1MarginNote: string;
  droughtYears: number;
  droughtEditions: number;
}

interface HughesVizData {
  type: "hughes";
  finalScore: { usa: number; canada: number; overtime: boolean };
  goals: {
    period: string;
    scorer: string;
    team: "USA" | "CAN";
    time?: string;
    assist?: string;
  }[];
  shots: {
    total: { usa: number; canada: number };
    p2: { usa: number; canada: number };
  };
  hellebuyck: {
    saves: number;
    shotsAgainst: number;
    savePercentage: number;
    slotSaves: number;
  };
  penaltyKill: { successful: number; total: number };
  hughesTournament: {
    goals: number;
    assists: number;
    points: number;
    games: number;
  };
  droughtYears: number;
}

interface LiuVizData {
  type: "liu";
  totalScore: number;
  silverScore: number;
  silverName: string;
  afterShortProgram: number;
  finalPosition: number;
  droughtYears: number;
  droughtLastWinner: string;
  droughtLastYear: number;
}

interface MeyersTaylorVizData {
  type: "meyers-taylor";
  totalTime: string;
  silverMargin: string;
  bronzeMargin: string;
  heat4Time: string;
  trailedThrough: string;
  age: number;
  careerMedals: {
    year: number;
    city: string;
    event: string;
    medal: "gold" | "silver" | "bronze";
  }[];
  totalMedalCount: { gold: number; silver: number; bronze: number };
}

interface KlaeboVizData {
  type: "klaebo";
  events2026: { event: string; margin?: string; marginNote?: string }[];
  goldsByGames: { year: number; city: string; golds: number }[];
  careerGolds: number;
  previousRecord: { holder: string; golds: number; year: number };
  allTimeWinterRecord: { holders: string[]; golds: number };
}

interface ChoiVizData {
  type: "choi";
  runs: { run: number; score: number | null; note?: string }[];
  competitors: {
    name: string;
    bestScore: number;
    medal: "gold" | "silver" | "bronze";
  }[];
  ageYears: number;
  ageDays: number;
}

export type AthleteVizData =
  | BraathenVizData
  | HughesVizData
  | LiuVizData
  | MeyersTaylorVizData
  | KlaeboVizData
  | ChoiVizData;

// --- Main Athlete interface ---

export interface Athlete {
  id: string;
  name: string;
  country: string;
  flag: string;
  sport: string;
  colors: { primary: string; secondary: string };
  avatar: string | null;
  initial: string;
  headline: string;
  achievement: string;
  stats: { label: string; value: string }[];
  story: string;
  medal: "gold" | "silver" | "bronze";
  historicStat: { value: string; unit: string; context: string };
  themes?: AthleteTheme[];
  vizData: AthleteVizData;
  skyTheme: SkyTheme;
  sources: DataSource[];
}

// --- Athlete data ---

export const athletes: Athlete[] = [
  {
    id: "braathen",
    name: "Lucas Pinheiro Braathen",
    country: "Brazil",
    flag: "\u{1F1E7}\u{1F1F7}",
    sport: "Alpine Skiing",
    colors: { primary: "#009B3A", secondary: "#FFDF00" },
    avatar: "/images/avatars/lucas-pinheiro-braathen.png",
    initial: "L",
    headline: "Snow Meets Samba",
    achievement:
      "First South American to win a Winter Olympic medal \u2014 ever. And it was gold.",
    stats: [
      { label: "Event", value: "GS" },
      { label: "Margin", value: "+0.58s" },
      { label: "Historic", value: "1st" },
    ],
    story: "In 102 years and 26 editions of the Winter Olympics, no South American had ever won a medal. Lucas Pinheiro Braathen \u2014 born in Brazil, raised in Norway \u2014 changed that forever, charging to giant slalom gold and beating defending champion Marco Odermatt by over half a second.",
    medal: "gold",
    historicStat: {
      value: "1st",
      unit: "ever",
      context: "South American Winter Olympic medalist",
    },
    themes: ["drought_breaker", "first_ever"],
    vizData: {
      type: "braathen",
      run1Time: "1:13.92",
      combinedTime: "2:25.00",
      competitors: [
        { name: "Marco Odermatt", margin: "+0.58" },
        { name: "Loic Meillard", margin: "+1.17" },
      ],
      run1MarginNote: "Largest Run 1 margin since 1988",
      droughtYears: 102,
      droughtEditions: 26,
    },
    skyTheme: { deep: "#2A3D52", mid: "#5A8A6A", pale: "#E8D5A0" },
    sources: [
      {
        label: "Olympics.com",
        url: "https://www.olympics.com/en/milano-cortina-2026/news/lucas-pinheiro-braathen-wins-giant-slalom-gold-brazil-s-first-ever-winter-olympics-medal",
      },
      {
        label: "Ski Racing",
        url: "https://skiracing.com/lucas-pinheiro-braathen-olympic-gold-brazil-first-winter-medal-mens-gs-bormio-2026/",
      },
    ],
  },
  {
    id: "hughes",
    name: "Jack Hughes",
    country: "USA",
    flag: "\u{1F1FA}\u{1F1F8}",
    sport: "Ice Hockey",
    colors: { primary: "#B31942", secondary: "#0A3161" },
    avatar: "/images/avatars/jack-hughes-avatar.png",
    initial: "J",
    headline: "46 Years in the Making",
    achievement: "First US men\u2019s hockey gold since the 1980 Miracle on Ice",
    stats: [
      { label: "Final", value: "2-1" },
      { label: "GWG", value: "OT" },
      { label: "Saves", value: "41" },
    ],
    story: "The last time the United States won Olympic hockey gold, it was called a miracle. Jack Hughes buried the overtime winner in 3-on-3 OT against Canada while Connor Hellebuyck stopped 41 shots. This time, it wasn\u2019t a miracle \u2014 it was inevitable.",
    medal: "gold",
    historicStat: {
      value: "46",
      unit: "years",
      context: "since last US hockey gold",
    },
    themes: ["drought_breaker"],
    vizData: {
      type: "hughes",
      finalScore: { usa: 2, canada: 1, overtime: true },
      goals: [
        { period: "P1", scorer: "Boldy", team: "USA", time: "~6:00" },
        { period: "P2", scorer: "Makar", team: "CAN", time: "late" },
        {
          period: "OT",
          scorer: "Hughes",
          team: "USA",
          time: "1:41",
          assist: "Werenski",
        },
      ],
      shots: {
        total: { usa: 28, canada: 42 },
        p2: { usa: 8, canada: 19 },
      },
      hellebuyck: {
        saves: 41,
        shotsAgainst: 42,
        savePercentage: 97.6,
        slotSaves: 27,
      },
      penaltyKill: { successful: 18, total: 18 },
      hughesTournament: { goals: 4, assists: 3, points: 7, games: 6 },
      droughtYears: 46,
    },
    skyTheme: { deep: "#152840", mid: "#3A6890", pale: "#B0C8D8" },
    sources: [
      {
        label: "NHL.com",
        url: "https://www.nhl.com/news/united-states-canada-2026-olympics-gold-medal-game-recap-february-22-2026",
      },
      {
        label: "ESPN",
        url: "https://www.espn.com/olympics/story/_/id/48005562/jack-hughes-connor-hellebuyck-lift-us-olympic-hockey-gold",
      },
      {
        label: "Olympics.com",
        url: "https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-2026-united-states-defeat-canada-overtime",
      },
    ],
  },
  {
    id: "liu",
    name: "Alysa Liu",
    country: "USA",
    flag: "\u{1F1FA}\u{1F1F8}",
    sport: "Figure Skating",
    colors: { primary: "#B31942", secondary: "#0A3161" },
    avatar: "/images/avatars/alysa-liu.png",
    initial: "A",
    headline: "Grace Under Pressure",
    achievement: "First US women\u2019s figure skating gold in 24 years",
    stats: [
      { label: "Score", value: "226.79" },
      { label: "After SP", value: "3rd" },
      { label: "Golds", value: "2" },
    ],
    story: "Not since Sarah Hughes in 2002 had an American woman stood atop the Olympic figure skating podium. Sitting third after the short program, Alysa Liu delivered a career-best free skate to surge past Japan\u2019s Sakamoto and Nakai for gold \u2014 her second of these Games after the team event.",
    medal: "gold",
    historicStat: {
      value: "24",
      unit: "years",
      context: "since last US women\u2019s skating gold",
    },
    themes: ["drought_breaker", "comeback"],
    vizData: {
      type: "liu",
      totalScore: 226.79,
      silverScore: 224.9,
      silverName: "Sakamoto Kaori",
      afterShortProgram: 3,
      finalPosition: 1,
      droughtYears: 24,
      droughtLastWinner: "Sarah Hughes",
      droughtLastYear: 2002,
    },
    skyTheme: { deep: "#1E3050", mid: "#4A7898", pale: "#D8C0C8" },
    sources: [
      {
        label: "Olympics.com",
        url: "https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-figure-skating-women-alysa-liu-first-american-woman-gold-24-years",
      },
      {
        label: "NBC Olympics",
        url: "https://www.nbcolympics.com/news/live/2026-olympics-figure-skating-live-updates-highlights-scores-womens-free-skate-final-thurs-feb-19",
      },
    ],
  },
  {
    id: "meyers-taylor",
    name: "Elana Meyers Taylor",
    country: "USA",
    flag: "\u{1F1FA}\u{1F1F8}",
    sport: "Bobsled",
    colors: { primary: "#B31942", secondary: "#0A3161" },
    avatar: "/images/avatars/elana-meyers-taylor.png",
    initial: "E",
    headline: "Age Is Just a Number",
    achievement: "Oldest individual Winter Olympic gold medalist at 41",
    stats: [
      { label: "Age", value: "41" },
      { label: "Olympics", value: "5th" },
      { label: "Career Medals", value: "6" },
    ],
    story: "At 41, most athletes are long retired. Elana Meyers Taylor trailed Germany\u2019s Laura Nolte through three runs, then unleashed a blistering 59.51-second final heat to steal gold by four hundredths of a second. The oldest individual Winter Olympic champion ever \u2014 proof that grit outlasts gravity.",
    medal: "gold",
    historicStat: {
      value: "41",
      unit: "years old",
      context: "oldest individual Winter gold medalist",
    },
    themes: ["age_outlier", "longevity"],
    vizData: {
      type: "meyers-taylor",
      totalTime: "3:57.93",
      silverMargin: "+0.04",
      bronzeMargin: "+0.12",
      heat4Time: "59.51",
      trailedThrough: "Heats 1-3",
      age: 41,
      careerMedals: [
        {
          year: 2010,
          city: "Vancouver",
          event: "Two-woman",
          medal: "bronze",
        },
        { year: 2014, city: "Sochi", event: "Two-woman", medal: "silver" },
        {
          year: 2018,
          city: "PyeongChang",
          event: "Two-woman",
          medal: "silver",
        },
        { year: 2022, city: "Beijing", event: "Monobob", medal: "silver" },
        { year: 2022, city: "Beijing", event: "Two-woman", medal: "bronze" },
        {
          year: 2026,
          city: "Milano Cortina",
          event: "Monobob",
          medal: "gold",
        },
      ],
      totalMedalCount: { gold: 1, silver: 3, bronze: 2 },
    },
    skyTheme: { deep: "#2A3040", mid: "#5A7A70", pale: "#D8C8A0" },
    sources: [
      {
        label: "Olympics.com",
        url: "https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-bobsleigh-monobob-women-usa-meyers-taylor-gold",
      },
      {
        label: "NBC Olympics",
        url: "https://www.nbcolympics.com/news/elana-meyers-taylor-meet-athlete",
      },
    ],
  },
  {
    id: "klaebo",
    name: "Johannes Hoesflot Klaebo",
    country: "Norway",
    flag: "\u{1F1F3}\u{1F1F4}",
    sport: "X-Country Skiing",
    colors: { primary: "#BA0C2F", secondary: "#00205B" },
    avatar: "/images/avatars/johannes-klaebo.png",
    initial: "J",
    headline: "The Perfect Games",
    achievement:
      "6 gold medals \u2014 most ever by one athlete at a single Winter Olympics",
    stats: [
      { label: "Golds", value: "6" },
      { label: "Events", value: "6" },
      { label: "Career", value: "11" },
    ],
    story: "Six events. Six golds. Johannes Klaebo didn\u2019t just break Eric Heiden\u2019s 46-year-old record of five golds at a single Winter Games \u2014 he obliterated it. With 11 career Olympic golds, only Michael Phelps has more. Norway\u2019s king of the snow is the greatest Winter Olympian who ever lived.",
    medal: "gold",
    historicStat: {
      value: "6",
      unit: "golds",
      context: "most by one athlete at a single Winter Olympics",
    },
    themes: ["record_breaker"],
    vizData: {
      type: "klaebo",
      events2026: [
        { event: "Skiathlon (20km)" },
        { event: "Sprint Classic" },
        { event: "10km Free" },
        { event: "4x7.5km Relay" },
        { event: "Team Sprint Free" },
        {
          event: "50km Mass Start",
          margin: "+8.9s",
          marginNote: "over Nyenget",
        },
      ],
      goldsByGames: [
        { year: 2018, city: "PyeongChang", golds: 3 },
        { year: 2022, city: "Beijing", golds: 2 },
        { year: 2026, city: "Milano Cortina", golds: 6 },
      ],
      careerGolds: 11,
      previousRecord: { holder: "Eric Heiden", golds: 5, year: 1980 },
      allTimeWinterRecord: {
        holders: ["Dæhlie", "Bjørgen", "Bjørndalen"],
        golds: 8,
      },
    },
    skyTheme: { deep: "#101830", mid: "#305888", pale: "#A8C0D8" },
    sources: [
      {
        label: "Olympics.com",
        url: "https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-cross-country-skiing-men-norway-johannes-hosflot-klaebo-six-golds-no-limits",
      },
      {
        label: "ESPN",
        url: "https://www.espn.com/olympics/story/_/id/47993781/klaebo-becomes-1st-athlete-win-6-golds-winter-games",
      },
      {
        label: "NBC Olympics",
        url: "https://www.nbcolympics.com/news/klaebo-endures-50km-achieves-historic-6-6-gold-medal-games",
      },
    ],
  },
  {
    id: "choi",
    name: "Choi Gaon",
    country: "South Korea",
    flag: "\u{1F1F0}\u{1F1F7}",
    sport: "Snowboard Halfpipe",
    colors: { primary: "#CD2E3A", secondary: "#0047A0" },
    avatar: "/images/avatars/choi-gaon.png",
    initial: "G",
    headline: "The Student Becomes the Master",
    achievement: "17-year-old defeats mentor Chloe Kim for halfpipe gold",
    stats: [
      { label: "Age", value: "17" },
      { label: "Score", value: "90.25" },
      { label: "Run", value: "3rd" },
    ],
    story: "She crashed hard on her first run. Then Choi Gaon did what champions do \u2014 she got back up. Her third-run score of 90.25 dethroned two-time Olympic champion Chloe Kim and delivered South Korea\u2019s first-ever Olympic snow-sports gold. She was 17 years old.",
    medal: "gold",
    historicStat: {
      value: "17",
      unit: "years old",
      context: "youngest halfpipe Olympic champion",
    },
    themes: ["age_outlier", "first_ever", "comeback"],
    vizData: {
      type: "choi",
      runs: [
        { run: 1, score: null, note: "Crashed (clipped lip)" },
        { run: 2, score: null, note: "Fell (washed out on first hit)" },
        { run: 3, score: 90.25 },
      ],
      competitors: [
        { name: "Choi Gaon", bestScore: 90.25, medal: "gold" },
        { name: "Chloe Kim", bestScore: 88.0, medal: "silver" },
        { name: "Mitsuki Ono", bestScore: 85.0, medal: "bronze" },
      ],
      ageYears: 17,
      ageDays: 101,
    },
    skyTheme: { deep: "#201838", mid: "#4A6890", pale: "#D8B8C0" },
    sources: [
      {
        label: "Olympics.com",
        url: "https://www.olympics.com/en/milano-cortina-2026/news/winter-olympics-2026-choi-gaon-recovers-fall-win-women-snowboard-halfpipe-gold",
      },
      {
        label: "NBC Olympics",
        url: "https://www.nbcolympics.com/news/three-peat-denied-gaon-choi-stuns-halfpipe-gold-over-defending-champ-chloe-kim",
      },
    ],
  },
];
