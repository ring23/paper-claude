// --- Emotions ---
export type StoryEmotion =
  | "neutral"
  | "tension"
  | "crash"
  | "triumph"
  | "reverence"
  | "momentum"
  | "longing";

// --- Beat narration ---
export interface BeatNarration {
  /** Eyebrow label above text, e.g. "Run 1" */
  label?: string;
  /** Main narration text — supports <em> (gold accent) and <span class="accent-red"> */
  text: string;
  /** Smaller secondary line */
  subtext?: string;
}

// --- Typographic moment ---
export interface TypographicMomentData {
  bigNumber: string;
  unit: string;
  /** Supports <strong> for gold accent */
  context: string;
}

// --- Story beat ---
export interface StoryBeatData<TVizState = VizState> {
  id: string;
  narration: BeatNarration;
  vizState: TVizState;
  emotion: StoryEmotion;
  humanDetail?: TypographicMomentData;
}

// --- Per-athlete viz states (discriminated union) ---

export type RunDotState = "pending" | "crashed" | "crashed-dim" | "active" | "gold";
export type ChoiCenterDisplay = "setup" | "crash1" | "crash2" | "tension" | "gold" | "podium";

export interface ChoiVizState {
  type: "choi";
  centerDisplay: ChoiCenterDisplay;
  runDots: [RunDotState, RunDotState, RunDotState];
  showComparison: boolean;
  particleBurst: boolean;
  bgGlow: boolean;
}

// --- Klaebo viz state ---
export type KlaeboCenterDisplay =
  | "intro"
  | "pyeongchang"
  | "beijing"
  | "milano-progress"
  | "record-tie"
  | "record-break"
  | "career-total";

export interface KlaeboVizState {
  type: "klaebo";
  centerDisplay: KlaeboCenterDisplay;
  fuseProgress: number; // 0-3 (which Olympics the fuse has reached)
  milanoGoldsLit: number; // 0-6 (how many 2026 event slots are gold)
  showLeaderboard: boolean;
  particleBurst: boolean;
  bgGlow: boolean;
}

export type MeyersTaylorCenterDisplay =
  | "intro"
  | "vancouver"
  | "sochi"
  | "pyeongchang"
  | "beijing"
  | "gap"
  | "milano-tension"
  | "gold";

export interface MeyersTaylorVizState {
  type: "meyers-taylor";
  centerDisplay: MeyersTaylorCenterDisplay;
  careerDotsLit: number; // 0-6 (which career medals are shown)
  showTimeMargin: boolean;
  particleBurst: boolean;
  bgGlow: boolean;
}

export type BraathenCenterDisplay =
  | "intro"
  | "drought-start"
  | "drought-running"
  | "run1"
  | "run2"
  | "gold"
  | "podium";

export interface BraathenVizState {
  type: "braathen";
  centerDisplay: BraathenCenterDisplay;
  droughtCounterTarget: number; // 0-102 (years to animate to)
  showRunBars: boolean;
  particleBurst: boolean;
  bgGlow: boolean;
}

export type HughesCenterDisplay =
  | "miracle"
  | "drought"
  | "pregame"
  | "p1-goal"
  | "p2-wall"
  | "ot-setup"
  | "ot-goal"
  | "coda";

export interface HughesVizState {
  type: "hughes";
  centerDisplay: HughesCenterDisplay;
  droughtCounterTarget: number; // 0-46
  scoreUSA: number;
  scoreCAN: number;
  showSaveGauge: boolean;
  saveGaugeFill: number; // 0-41
  particleBurst: boolean;
  bgGlow: boolean;
}

export type LiuCenterDisplay =
  | "drought-intro"
  | "drought-counting"
  | "short-program"
  | "free-start"
  | "rising"
  | "gold"
  | "margin";

export interface LiuVizState {
  type: "liu";
  centerDisplay: LiuCenterDisplay;
  droughtCounterTarget: number; // 0-24
  standingsPositions: [number, number, number]; // [Liu, Sakamoto, Nakai] positions (1-3)
  highlightLiu: boolean;
  particleBurst: boolean;
  bgGlow: boolean;
}

/** Union of all athlete viz states. Phase 2 agents replace stubs with full types. */
export type VizState =
  | ChoiVizState
  | KlaeboVizState
  | MeyersTaylorVizState
  | BraathenVizState
  | HughesVizState
  | LiuVizState;
