import { motion, type Target, type Variants } from "framer-motion";
import type { Athlete } from "../data/athletes";
import AvatarCard from "./AvatarCard";
import AthleteViz from "./viz/AthleteViz";
import HistoricCounter from "./HistoricCounter";
import MedalBadge from "./MedalBadge";
import SourceAttribution from "./SourceAttribution";
import styles from "./StoryPanel.module.css";

interface Props {
  athlete: Athlete;
}

const staggerDelays = {
  name: 0,
  headline: 0.1,
  achievement: 0.2,
  stats: 0.32,
  story: 0.5,
  counter: 0.6,
  sources: 0.7,
};

const fadeUpEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (custom: number, _current: Target, _velocity: Target) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: custom, ease: fadeUpEase },
  }),
};

export default function StoryPanel({ athlete }: Props) {
  return (
    <motion.div
      className={styles.content}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
    >
      {/* Athlete header */}
      <motion.div className={styles.header} variants={fadeUp} custom={staggerDelays.name}>
        <AvatarCard athlete={athlete} size="lg" isActive hideLabels />
        <div className={styles.nameBlock}>
          <h2 className={styles.athleteName}>{athlete.name.toUpperCase()}</h2>
          <p className={styles.meta}>
            {athlete.country} &middot; {athlete.sport}
          </p>
        </div>
      </motion.div>

      {/* Gold headline */}
      <motion.div variants={fadeUp} custom={staggerDelays.headline}>
        <h3 className={styles.headline}>{athlete.headline}</h3>
      </motion.div>

      {/* Achievement */}
      <motion.div variants={fadeUp} custom={staggerDelays.achievement}>
        <p className={styles.achievement}>{athlete.achievement}</p>
      </motion.div>

      {/* Per-athlete visualization */}
      <motion.div className={styles.statsRow} variants={fadeUp} custom={staggerDelays.stats}>
        <AthleteViz athlete={athlete} />
      </motion.div>

      {/* Story text */}
      <motion.p className={styles.story} variants={fadeUp} custom={staggerDelays.story}>
        {athlete.story}
      </motion.p>

      {/* Historic counter + medal */}
      <motion.div className={styles.bottom} variants={fadeUp} custom={staggerDelays.counter}>
        <HistoricCounter
          value={athlete.historicStat.value}
          unit={athlete.historicStat.unit}
          context={athlete.historicStat.context}
        />
        <MedalBadge medal={athlete.medal} />
      </motion.div>

      {/* Source attribution */}
      <motion.div variants={fadeUp} custom={staggerDelays.sources}>
        <SourceAttribution sources={athlete.sources} />
      </motion.div>
    </motion.div>
  );
}
