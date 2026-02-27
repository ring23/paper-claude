import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import type { StoryBeatData } from "../types/story";
import { useIsMobile } from "../hooks/useIsMobile";
import styles from "./StoryBeat.module.css";

interface Props {
  beat: StoryBeatData;
  index: number;
  onActivate: (beat: StoryBeatData) => void;
  scrollerRef: React.RefObject<HTMLElement | null>;
}

export default function StoryBeat({ beat, onActivate, scrollerRef }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isInView = useInView(cardRef, {
    root: scrollerRef,
    margin: isMobile ? "-5% 0px -5% 0px" : "-15% 0px -15% 0px",
    amount: "some",
  });

  useEffect(() => {
    if (isInView) {
      onActivate(beat);
    }
  }, [isInView, beat, onActivate]);

  return (
    <div className={styles.step}>
      <motion.div
        ref={cardRef}
        className={styles.card}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className={styles.accent}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        />
        {beat.narration.label && (
          <p className={styles.label}>{beat.narration.label}</p>
        )}
        <motion.p
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: beat.narration.text }}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        />
        {beat.narration.subtext && (
          <motion.p
            className={styles.subtext}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {beat.narration.subtext}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
