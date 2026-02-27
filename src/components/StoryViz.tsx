import type { Athlete } from "../data/athletes";
import type { VizState } from "../types/story";
import ChoiVizRenderer from "./viz/renderers/ChoiVizRenderer";
import KlaeboVizRenderer from "./viz/renderers/KlaeboVizRenderer";
import MeyersTaylorVizRenderer from "./viz/renderers/MeyersTaylorVizRenderer";
import BraathenVizRenderer from "./viz/renderers/BraathenVizRenderer";
import HughesVizRenderer from "./viz/renderers/HughesVizRenderer";
import LiuVizRenderer from "./viz/renderers/LiuVizRenderer";
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
      {vizState?.type === "klaebo" && (
        <KlaeboVizRenderer state={vizState} athlete={athlete} />
      )}
      {vizState?.type === "meyers-taylor" && (
        <MeyersTaylorVizRenderer state={vizState} athlete={athlete} />
      )}
      {vizState?.type === "braathen" && (
        <BraathenVizRenderer state={vizState} athlete={athlete} />
      )}
      {vizState?.type === "hughes" && (
        <HughesVizRenderer state={vizState} athlete={athlete} />
      )}
      {vizState?.type === "liu" && (
        <LiuVizRenderer state={vizState} athlete={athlete} />
      )}
      {/* Phase 2 agents add cases here */}
    </div>
  );
}
