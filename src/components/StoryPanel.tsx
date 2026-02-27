import { useState, useCallback, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Athlete } from "../data/athletes";
import type { VizState, StoryBeatData, StoryEmotion } from "../types/story";
import { getStoryBeats } from "../data/storyBeats";
import StoryBeat from "./StoryBeat";
import StoryViz from "./StoryViz";
import TypographicMoment from "./TypographicMoment";
import HistoricCounter from "./HistoricCounter";
import MedalBadge from "./MedalBadge";
import SourceAttribution from "./SourceAttribution";
import styles from "./StoryPanel.module.css";

interface Props {
  athlete: Athlete;
  scrollerRef: React.RefObject<HTMLElement | null>;
}

export default function StoryPanel({ athlete, scrollerRef }: Props) {
  const beats = getStoryBeats(athlete.id);
  const hasBeats = beats.length > 0;
  const prefersReducedMotion = useReducedMotion();

  // Initialize viz with first beat so the renderer mounts immediately
  const [vizState, setVizState] = useState<VizState | null>(
    hasBeats ? beats[0].vizState : null,
  );
  const [emotion, setEmotion] = useState<StoryEmotion>(
    hasBeats ? beats[0].emotion : "neutral",
  );
  const heroRef = useRef<HTMLDivElement>(null);

  // Find the first humanDetail in beats (for the typographic moment)
  const humanDetail = beats.find((b) => b.humanDetail)?.humanDetail ?? null;

  const handleBeatActivate = useCallback((beat: StoryBeatData) => {
    setVizState(beat.vizState);
    setEmotion(beat.emotion);
  }, []);

  // Map emotion to CSS class
  const emotionClass =
    emotion === "crash" ? styles.emotionCrash
    : emotion === "tension" ? styles.emotionTension
    : emotion === "triumph" ? styles.emotionTriumph
    : styles.emotionNeutral;

  // Hero parallax — fades up and out on scroll
  const { scrollYProgress } = useScroll({
    container: scrollerRef,
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // If no beats, render the fallback (non-scrollytelling athletes)
  if (!hasBeats) {
    return (
      <div className={styles.fallback}>
        <div className={styles.fallbackHero}>
          <p className={styles.heroEyebrow}>
            {athlete.flag} {athlete.country} &middot; {athlete.sport}
          </p>
          <h1 className={styles.heroName}>{athlete.name.toUpperCase()}</h1>
          <p className={styles.heroHeadline}>{athlete.headline}</p>
        </div>
        <div className={styles.fallbackBody}>
          <p className={styles.fallbackAchievement}>{athlete.achievement}</p>
          <p className={styles.fallbackStory}>{athlete.story}</p>
          <div className={styles.footer}>
            <HistoricCounter
              value={athlete.historicStat.value}
              unit={athlete.historicStat.unit}
              context={athlete.historicStat.context}
            />
            <div className={styles.footerBottom}>
              <MedalBadge medal={athlete.medal} />
              <SourceAttribution sources={athlete.sources} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {/* Hero section */}
      <div className={styles.hero}>
        <motion.div
          ref={heroRef}
          className={styles.heroContent}
          style={{
            y: prefersReducedMotion ? 0 : heroY,
            opacity: prefersReducedMotion ? 1 : heroOpacity,
          }}
        >
          <span className={styles.heroFlag}>{athlete.flag}</span>
          <p className={styles.heroEyebrow}>
            {athlete.country} &middot; {athlete.sport}
          </p>
          <h1 className={styles.heroName}>
            {athlete.name.split(" ").map((word, i) => (
              <span key={i}>
                {word.toUpperCase()}
                {i < athlete.name.split(" ").length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className={styles.heroHeadline}>{athlete.headline}</p>
        </motion.div>
        <div className={styles.scrollHint}>
          <span>Scroll</span>
          <div className={styles.scrollArrow} />
        </div>
      </div>

      {/* Scrollytelling section */}
      <div className={styles.scrolly}>
        <div className={`${styles.emotionOverlay} ${emotionClass}`} />
        <StoryViz athlete={athlete} vizState={vizState} />
        <div className={styles.stepsOverlay}>
          {beats.map((beat, i) => (
            <StoryBeat
              key={beat.id}
              beat={beat}
              index={i}
              onActivate={handleBeatActivate}
              scrollerRef={scrollerRef}
            />
          ))}
        </div>
      </div>

      {/* Typographic moment */}
      {humanDetail && (
        <TypographicMoment detail={humanDetail} scrollerRef={scrollerRef} />
      )}

      {/* Footer */}
      <div className={`${styles.footer} ${styles.darkTheme}`}>
        <HistoricCounter
          value={athlete.historicStat.value}
          unit={athlete.historicStat.unit}
          context={athlete.historicStat.context}
        />
        <div className={styles.footerBottom}>
          <MedalBadge medal={athlete.medal} />
          <SourceAttribution sources={athlete.sources} />
        </div>
      </div>
    </div>
  );
}
