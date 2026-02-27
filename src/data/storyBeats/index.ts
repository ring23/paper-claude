import type { StoryBeatData } from "../../types/story";
import { choiStoryBeats } from "./choi";

const beatsByAthlete: Record<string, StoryBeatData[]> = {
  choi: choiStoryBeats,
  // Phase 2 agents add entries here
};

export function getStoryBeats(athleteId: string): StoryBeatData[] {
  return beatsByAthlete[athleteId] ?? [];
}
