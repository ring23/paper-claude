import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Athlete } from "../data/athletes";
import { getStoryBeats } from "../data/storyBeats";
import { useIsMobile } from "../hooks/useIsMobile";
import MiniHub from "./MiniHub";
import StoryPanel from "./StoryPanel";
import styles from "./StoryView.module.css";

interface Props {
  athlete: Athlete;
  athletes: Athlete[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function StoryView({ athlete, athletes, onSelect, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when switching athletes
  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [athlete.id]);
  const isMobile = useIsMobile();
  const hasBeats = getStoryBeats(athlete.id).length > 0;
  const panelClass = `${styles.panel} ${hasBeats ? styles.panelDark : ""}`;

  return (
    <motion.div
      className={styles.storyView}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.left}>
        <MiniHub
          athletes={athletes}
          activeId={athlete.id}
          onSelect={onSelect}
          onClose={onClose}
        />
      </div>

      {/* Persistent frosted glass panel — stays mounted between athlete switches */}
      <motion.div
        className={panelClass}
        ref={panelRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%", transition: { type: "spring", stiffness: 200, damping: 28, delay: 0.2 } }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
      >
        {isMobile && (
          <button
            className={styles.mobileBack}
            onClick={onClose}
            aria-label="Back to hub"
          >
            ←
          </button>
        )}
        <AnimatePresence mode="wait">
          <StoryPanel key={athlete.id} athlete={athlete} scrollerRef={panelRef} />
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
