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

// Stubs for Phase 2 agents to extend:
export interface KlaeboVizState {
  type: "klaebo";
  [key: string]: unknown;
}

export interface MeyersTaylorVizState {
  type: "meyers-taylor";
  [key: string]: unknown;
}

export interface BraathenVizState {
  type: "braathen";
  [key: string]: unknown;
}

export interface HughesVizState {
  type: "hughes";
  [key: string]: unknown;
}

export interface LiuVizState {
  type: "liu";
  [key: string]: unknown;
}

/** Union of all athlete viz states. Phase 2 agents replace stubs with full types. */
export type VizState =
  | ChoiVizState
  | KlaeboVizState
  | MeyersTaylorVizState
  | BraathenVizState
  | HughesVizState
  | LiuVizState;
