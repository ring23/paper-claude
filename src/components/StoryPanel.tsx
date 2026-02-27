import { useState, useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Athlete } from "../data/athletes";
import type { VizState, StoryBeatData } from "../types/story";
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
  const [vizState, setVizState] = useState<VizState | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const beats = getStoryBeats(athlete.id);
  const hasBeats = beats.length > 0;

  // Find the first humanDetail in beats (for the typographic moment)
  const humanDetail = beats.find((b) => b.humanDetail)?.humanDetail ?? null;

  const handleBeatActivate = useCallback((beat: StoryBeatData) => {
    setVizState(beat.vizState);
  }, []);

  // Hero parallax — fades up and out on scroll
  useGSAP(
    () => {
      if (!heroRef.current || !scrollerRef.current) return;

      gsap.to(heroRef.current, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          scroller: scrollerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { dependencies: [scrollerRef] },
  );

  // Refresh ScrollTrigger when scroller is ready
  useGSAP(
    () => {
      if (!scrollerRef.current) return;
      // Small delay to let DOM settle after mount
      const timer = setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => clearTimeout(timer);
    },
    { dependencies: [scrollerRef, athlete.id] },
  );

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
        <div ref={heroRef} className={styles.heroContent}>
          <p className={styles.heroEyebrow}>
            {athlete.flag} {athlete.country} &middot; {athlete.sport}
          </p>
          <h1 className={styles.heroName}>{athlete.name.toUpperCase()}</h1>
          <p className={styles.heroHeadline}>{athlete.headline}</p>
        </div>
        <div className={styles.scrollHint}>
          <span>Scroll</span>
          <div className={styles.scrollArrow} />
        </div>
      </div>

      {/* Scrollytelling section */}
      <div className={styles.scrolly}>
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
  );
}
