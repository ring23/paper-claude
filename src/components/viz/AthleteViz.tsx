import type { Athlete } from "../../data/athletes";
import { TimeGapChart } from "./TimeGapChart";
import SaveGauge from "./SaveGauge";
import ShotChart from "./ShotChart";
import { ScoreLollipop } from "./ScoreLollipop";
import { PositionSwap } from "./PositionSwap";
import { CareerTimeline } from "./CareerTimeline";
import RadialSweep from "./RadialSweep";
import GoldLeaderboard from "./GoldLeaderboard";
import { RunArc } from "./RunArc";
import styles from "./AthleteViz.module.css";

export default function AthleteViz({ athlete }: { athlete: Athlete }) {
  const { vizData } = athlete;

  switch (vizData.type) {
    case "braathen":
      return <TimeGapChart data={vizData} />;

    case "hughes":
      return (
        <div className={styles.row}>
          <SaveGauge
            saves={vizData.hellebuyck.saves}
            shotsAgainst={vizData.hellebuyck.shotsAgainst}
            savePercentage={vizData.hellebuyck.savePercentage}
          />
          <ShotChart shots={vizData.shots} />
        </div>
      );

    case "liu":
      return (
        <div className={styles.row}>
          <ScoreLollipop data={vizData} />
          <PositionSwap data={vizData} />
        </div>
      );

    case "meyers-taylor":
      return <CareerTimeline data={vizData} />;

    case "klaebo":
      return (
        <div className={styles.row}>
          <RadialSweep events={vizData.events2026} />
          <GoldLeaderboard
            careerGolds={vizData.careerGolds}
            previousRecord={{
              holders: [vizData.previousRecord.holder],
              golds: vizData.previousRecord.golds,
            }}
          />
        </div>
      );

    case "choi":
      return <RunArc data={vizData} />;
  }
}
