import type { Athlete } from "../data/athletes";
import type { VizState } from "../types/story";
import ChoiVizRenderer from "./viz/renderers/ChoiVizRenderer";
import styles from "./StoryViz.module.css";

interface Props {
  athlete: Athlete;
  vizState: VizState | null;
}

export default function StoryViz({ athlete, vizState }: Props) {
  const hasBgGlow = vizState && "bgGlow" in vizState && vizState.bgGlow;

  return (
    <div className={styles.vizPanel}>
      <div
        className={`${styles.bgGlow} ${hasBgGlow ? styles.bgGlowActive : ""}`}
      />
      {vizState?.type === "choi" && (
        <ChoiVizRenderer state={vizState} athlete={athlete} />
      )}
      {/* Phase 2 agents add cases here */}
    </div>
  );
}
