import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { Athlete } from "../../../data/athletes";
import type { LiuVizState } from "../../../types/story";
import styles from "./LiuVizRenderer.module.css";

interface Props {
  state: LiuVizState;
  athlete: Athlete;
}

/** Convert a 1-based position to a CSS top value within the 160px track */
function positionToTop(pos: number): number {
  // Position 1 = top (8px), Position 2 = middle (62px), Position 3 = bottom (116px)
  return 8 + (pos - 1) * 54;
}

const SKATER_NAMES = ["Liu", "Sakamoto", "Nakai"];

function spawnParticles(container: HTMLDivElement) {
  container.innerHTML = "";

  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = styles.particle;

    const size = 3 + Math.random() * 5;
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 300;

    p.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    p.style.setProperty("--delay", `${Math.random() * 0.3}s`);
    p.style.setProperty("--duration", `${1.2 + Math.random() * 0.8}s`);
    p.style.width = size + "px";
    p.style.height = size + "px";
    // Mix gold and rose-pink particles for figure skating elegance
    const colors = ["#E4C45A", "#C6982B", "#D8C0C8", "#B31942"];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(p);
  }
}

export default function LiuVizRenderer({ state }: Props) {
  const particlesRef = useRef<HTMLDivElement>(null);
  const prevDisplayRef = useRef<string | null>(null);
  const prevBurstRef = useRef(false);

  // Framer Motion animated counters
  const droughtMotion = useMotionValue(0);
  const droughtDisplay = useTransform(droughtMotion, (v) => String(Math.round(v)));

  const scoreMotion = useMotionValue(0);
  const scoreDisplay = useTransform(scoreMotion, (v) => v.toFixed(2));

  // Refs for DOM-targeted elements (imperative style)
  const dot0Ref = useRef<HTMLDivElement>(null); // Liu
  const dot1Ref = useRef<HTMLDivElement>(null); // Sakamoto
  const dot2Ref = useRef<HTMLDivElement>(null); // Nakai
  const circle0Ref = useRef<HTMLDivElement>(null);
  const label0Ref = useRef<HTMLSpanElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  // Center display state refs
  const droughtIntroRef = useRef<HTMLDivElement>(null);
  const droughtCountingRef = useRef<HTMLDivElement>(null);
  const shortProgramRef = useRef<HTMLDivElement>(null);
  const freeStartRef = useRef<HTMLDivElement>(null);
  const risingRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);

  // Comparison bar refs
  const barLiuRef = useRef<HTMLDivElement>(null);
  const barSakamotoRef = useRef<HTMLDivElement>(null);

  // Imperative state transitions
  useEffect(() => {
    const stateEls: Record<string, HTMLDivElement | null> = {
      "drought-intro": droughtIntroRef.current,
      "drought-counting": droughtCountingRef.current,
      "short-program": shortProgramRef.current,
      "free-start": freeStartRef.current,
      "rising": risingRef.current,
      "gold": goldRef.current,
    };

    // Skip if same display state
    if (state.centerDisplay === prevDisplayRef.current) return;
    prevDisplayRef.current = state.centerDisplay;

    // Hide all center display states
    Object.values(stateEls).forEach((el) => {
      if (el) el.style.opacity = "0";
    });

    // Apply standings positions (CSS transition on `top` handles animation)
    const dotRefs = [dot0Ref, dot1Ref, dot2Ref];
    state.standingsPositions.forEach((pos, i) => {
      const dot = dotRefs[i].current;
      if (dot) {
        dot.style.top = `${positionToTop(pos)}px`;
      }
    });

    // Liu dot styling based on state
    if (circle0Ref.current && label0Ref.current) {
      if (state.centerDisplay === "gold" || state.centerDisplay === "margin") {
        circle0Ref.current.className = `${styles.dotCircle} ${styles.dotCircleGold}`;
        label0Ref.current.className = `${styles.dotLabel} ${styles.dotLabelGold}`;
      } else if (state.highlightLiu) {
        circle0Ref.current.className = `${styles.dotCircle} ${styles.dotCircleLiuHighlight}`;
        label0Ref.current.className = `${styles.dotLabel} ${styles.dotLabelLiu}`;
      } else {
        circle0Ref.current.className = `${styles.dotCircle} ${styles.dotCircleLiu}`;
        label0Ref.current.className = `${styles.dotLabel} ${styles.dotLabelLiu}`;
      }
    }

    // Motion trail on rising
    if (trailRef.current) {
      if (state.centerDisplay === "rising") {
        trailRef.current.className = `${styles.motionTrail} ${styles.motionTrailVisible}`;
        // Position trail where Liu's dot was (position 3) before it moves
        trailRef.current.style.top = `${positionToTop(3)}px`;
      } else {
        trailRef.current.className = styles.motionTrail;
      }
    }

    // Show active center display
    switch (state.centerDisplay) {
      case "drought-intro":
        if (stateEls["drought-intro"]) stateEls["drought-intro"]!.style.opacity = "1";
        break;

      case "drought-counting":
        if (stateEls["drought-counting"]) stateEls["drought-counting"]!.style.opacity = "1";
        droughtMotion.set(0);
        animate(droughtMotion, state.droughtCounterTarget, {
          duration: 2,
          ease: "easeOut",
        });
        break;

      case "short-program":
        if (stateEls["short-program"]) stateEls["short-program"]!.style.opacity = "1";
        break;

      case "free-start":
        if (stateEls["free-start"]) stateEls["free-start"]!.style.opacity = "1";
        break;

      case "rising":
        if (stateEls["rising"]) stateEls["rising"]!.style.opacity = "1";
        break;

      case "gold":
        if (stateEls["gold"]) stateEls["gold"]!.style.opacity = "1";
        scoreMotion.set(0);
        animate(scoreMotion, 226.79, { duration: 2, ease: "easeOut" });
        break;

      case "margin":
        // Re-show gold score (keep visible)
        if (stateEls["gold"]) stateEls["gold"]!.style.opacity = "1";
        // Show comparison bars
        if (compRef.current) compRef.current.style.opacity = "1";
        setTimeout(() => {
          if (barLiuRef.current) barLiuRef.current.style.width = "95%";
        }, 400);
        setTimeout(() => {
          if (barSakamotoRef.current) barSakamotoRef.current.style.width = "92%";
        }, 550);
        break;
    }

    // Reset comparison when not in margin
    if (state.centerDisplay !== "margin" && compRef.current) {
      compRef.current.style.opacity = "0";
      if (barLiuRef.current) barLiuRef.current.style.width = "0";
      if (barSakamotoRef.current) barSakamotoRef.current.style.width = "0";
    }
  }, [state.centerDisplay, state.standingsPositions, state.highlightLiu, state.droughtCounterTarget, droughtMotion, scoreMotion]);

  // Particle burst — fire only on transition to true
  useEffect(() => {
    if (state.particleBurst && !prevBurstRef.current && particlesRef.current) {
      spawnParticles(particlesRef.current);
    }
    prevBurstRef.current = state.particleBurst;
  }, [state.particleBurst]);

  return (
    <div className={styles.container}>
      <div ref={particlesRef} className={styles.particlesContainer} />

      {/* Standings track */}
      <div className={styles.standingsTrack}>
        {/* Position labels */}
        <span className={styles.positionLabel} style={{ top: `${positionToTop(1) + 8}px` }}>1st</span>
        <span className={styles.positionLabel} style={{ top: `${positionToTop(2) + 8}px` }}>2nd</span>
        <span className={styles.positionLabel} style={{ top: `${positionToTop(3) + 8}px` }}>3rd</span>

        {/* Motion trail (for rising) */}
        <div ref={trailRef} className={styles.motionTrail} />

        {/* Liu dot */}
        <div
          ref={dot0Ref}
          className={styles.standingsDot}
          style={{ top: `${positionToTop(state.standingsPositions[0])}px` }}
        >
          <div ref={circle0Ref} className={`${styles.dotCircle} ${styles.dotCircleLiu}`}>
            A
          </div>
          <span ref={label0Ref} className={`${styles.dotLabel} ${styles.dotLabelLiu}`}>
            {SKATER_NAMES[0]}
          </span>
        </div>

        {/* Sakamoto dot */}
        <div
          ref={dot1Ref}
          className={styles.standingsDot}
          style={{ top: `${positionToTop(state.standingsPositions[1])}px` }}
        >
          <div className={styles.dotCircle}>S</div>
          <span className={styles.dotLabel}>{SKATER_NAMES[1]}</span>
        </div>

        {/* Nakai dot */}
        <div
          ref={dot2Ref}
          className={styles.standingsDot}
          style={{ top: `${positionToTop(state.standingsPositions[2])}px` }}
        >
          <div className={styles.dotCircle}>N</div>
          <span className={styles.dotLabel}>{SKATER_NAMES[2]}</span>
        </div>
      </div>

      {/* Center display */}
      <div className={styles.centerDisplay}>
        {/* drought-intro */}
        <div ref={droughtIntroRef} className={`${styles.displayState} ${styles.displayDroughtIntro}`}>
          <span className={styles.droughtYear}>2002</span>
          <span className={styles.droughtName}>Sarah Hughes, Salt Lake City</span>
        </div>

        {/* drought-counting */}
        <div ref={droughtCountingRef} className={`${styles.displayState} ${styles.displayDroughtCounting}`}>
          <motion.span className={styles.droughtNumber}>{droughtDisplay}</motion.span>
          <span className={styles.droughtUnit}>years without gold</span>
        </div>

        {/* short-program */}
        <div ref={shortProgramRef} className={`${styles.displayState} ${styles.displayShortProgram}`}>
          <span className={styles.phaseLabel}>Short Program</span>
          <span className={styles.positionBig}>
            3<span className={styles.positionOrdinal}>rd</span>
          </span>
        </div>

        {/* free-start */}
        <div ref={freeStartRef} className={`${styles.displayState} ${styles.displayFreeStart}`}>
          <div className={styles.tensionPulse} />
          <span className={styles.freeLabel}>Free Skate</span>
        </div>

        {/* rising */}
        <div ref={risingRef} className={`${styles.displayState} ${styles.displayRising}`}>
          <span className={styles.risingArrow}>&uarr;</span>
          <span className={styles.risingLabel}>Moving up</span>
        </div>

        {/* gold */}
        <div ref={goldRef} className={`${styles.displayState} ${styles.displayGold}`}>
          <motion.span className={styles.goldScore}>{scoreDisplay}</motion.span>
          <span className={styles.goldLabel}>Final Score &middot; Gold</span>
        </div>
      </div>

      {/* Comparison bars (margin state) */}
      <div ref={compRef} className={styles.comparison}>
        <div className={styles.compRow}>
          <span className={styles.compName}>Alysa Liu</span>
          <div className={styles.compBarTrack}>
            <div ref={barLiuRef} className={`${styles.compBarFill} ${styles.barGold}`}>
              <span className={styles.compScore}>226.79</span>
            </div>
          </div>
        </div>
        <div className={styles.compRow}>
          <span className={styles.compName}>Sakamoto Kaori</span>
          <div className={styles.compBarTrack}>
            <div ref={barSakamotoRef} className={`${styles.compBarFill} ${styles.barSilver}`}>
              <span className={styles.compScore}>224.90</span>
            </div>
          </div>
        </div>
        <div className={styles.marginRow}>
          <span className={styles.marginLabel}>Margin</span>
          <span className={styles.marginValue}>+1.89</span>
        </div>
      </div>
    </div>
  );
}
