import type { StoryBeatData } from "../../types/story";
import { choiStoryBeats } from "./choi";
import { klaeboStoryBeats } from "./klaebo";
import { meyersTaylorStoryBeats } from "./meyers-taylor";
import { braathenStoryBeats } from "./braathen";
import { hughesStoryBeats } from "./hughes";
import { liuStoryBeats } from "./liu";

const beatsByAthlete: Record<string, StoryBeatData[]> = {
  choi: choiStoryBeats,
  klaebo: klaeboStoryBeats,
  "meyers-taylor": meyersTaylorStoryBeats,
  braathen: braathenStoryBeats,
  hughes: hughesStoryBeats,
  liu: liuStoryBeats,
  // Phase 2 agents add entries here
};

export function getStoryBeats(athleteId: string): StoryBeatData[] {
  return beatsByAthlete[athleteId] ?? [];
}
