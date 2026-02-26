import { motion } from "framer-motion";
import type { Athlete } from "../data/athletes";
import TitleLockup from "./TitleLockup";
import OlympicRings from "./OlympicRings";
import AthleteOrbit from "./AthleteOrbit";
import styles from "./HubView.module.css";

interface Props {
  athletes: Athlete[];
  onSelect: (id: string) => void;
}

export default function HubView({ athletes, onSelect }: Props) {
  return (
    <motion.div
      className={styles.hub}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <div className={styles.top}>
        <TitleLockup />
      </div>

      <div className={styles.center}>
        {/* Single anchor — rings and orbit share the exact same center */}
        <div className={styles.anchor}>
          <div className={styles.ringsLayer}>
            <OlympicRings />
          </div>
          <AthleteOrbit athletes={athletes} onSelect={onSelect} />
        </div>
      </div>

      <motion.p
        className={styles.prompt}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        Click an athlete to explore their story
      </motion.p>
    </motion.div>
  );
}
