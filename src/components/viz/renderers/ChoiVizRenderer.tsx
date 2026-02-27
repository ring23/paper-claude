import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { Athlete } from "../../../data/athletes";
import type { ChoiVizState, RunDotState } from "../../../types/story";
import styles from "./ChoiVizRenderer.module.css";

interface Props {
  state: ChoiVizState;
  athlete: Athlete;
}

const DOT_STYLES: Record<
  RunDotState,
  { border: string; bg: string; shadow: string; xOpacity: number; numOpacity: number; numColor: string }
> = {
  pending: {
    border: "var(--slate, #3D5A73)",
    bg: "transparent",
    shadow: "none",
    xOpacity: 0,
    numOpacity: 1,
    numColor: "var(--slate, #3D5A73)",
  },
  crashed: {
    border: "#CD2E3A",
    bg: "rgba(205, 46, 58, 0.25)",
    shadow: "none",
    xOpacity: 1,
    numOpacity: 0,
    numColor: "var(--slate, #3D5A73)",
  },
  "crashed-dim": {
    border: "rgba(205, 46, 58, 0.2)",
    bg: "transparent",
    shadow: "none",
    xOpacity: 0.2,
    numOpacity: 0,
    numColor: "var(--slate, #3D5A73)",
  },
  active: {
    border: "var(--gold, #C6982B)",
    bg: "transparent",
    shadow: "0 0 20px rgba(198, 152, 43, 0.35)",
    xOpacity: 0,
    numOpacity: 1,
    numColor: "var(--gold, #C6982B)",
  },
  gold: {
    border: "var(--gold, #C6982B)",
    bg: "var(--gold, #C6982B)",
    shadow: "0 0 30px rgba(198, 152, 43, 0.35)",
    xOpacity: 0,
    numOpacity: 0,
    numColor: "var(--gold, #C6982B)",
  },
};

function spawnParticles(container: HTMLDivElement, primary: string, secondary: string) {
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
    p.style.background = Math.random() > 0.5 ? primary : secondary;

    container.appendChild(p);
  }
}

export default function ChoiVizRenderer({ state, athlete }: Props) {
  const particlesRef = useRef<HTMLDivElement>(null);
  const prevDisplayRef = useRef<string | null>(null);
  const prevBurstRef = useRef(false);

  // Framer Motion animated score counter
  const scoreMotion = useMotionValue(0);
  const scoreDisplay = useTransform(scoreMotion, (v) => v.toFixed(2));

  // Refs for DOM-targeted elements
  const dot1Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLDivElement>(null);
  const dot3Ref = useRef<HTMLDivElement>(null);
  const x1Ref = useRef<HTMLSpanElement>(null);
  const x2Ref = useRef<HTMLSpanElement>(null);
  const x3Ref = useRef<HTMLSpanElement>(null);
  const num1Ref = useRef<HTMLSpanElement>(null);
  const num2Ref = useRef<HTMLSpanElement>(null);
  const num3Ref = useRef<HTMLSpanElement>(null);
  const setupRef = useRef<HTMLDivElement>(null);
  const crash1Ref = useRef<HTMLDivElement>(null);
  const crash2Ref = useRef<HTMLDivElement>(null);
  const tensionRef = useRef<HTMLDivElement>(null);
  const scoreStateRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);
  const barChoiRef = useRef<HTMLDivElement>(null);
  const barKimRef = useRef<HTMLDivElement>(null);
  const barOnoRef = useRef<HTMLDivElement>(null);

  // Imperative state transitions — CSS transitions handle interpolation
  useEffect(() => {
    const stateEls = {
      setup: setupRef.current,
      crash1: crash1Ref.current,
      crash2: crash2Ref.current,
      tension: tensionRef.current,
      score: scoreStateRef.current,
    };

    // Skip if this is the same display state (avoid re-running identical animations)
    if (state.centerDisplay === prevDisplayRef.current) return;
    prevDisplayRef.current = state.centerDisplay;

    // Hide all center display states (CSS transition handles the fade)
    Object.values(stateEls).forEach((el) => {
      if (el) el.style.opacity = "0";
    });

    // Apply run dot states (CSS transitions handle interpolation)
    const dotRefs = [dot1Ref, dot2Ref, dot3Ref];
    const xRefs = [x1Ref, x2Ref, x3Ref];
    const numRefs = [num1Ref, num2Ref, num3Ref];

    state.runDots.forEach((dotState, i) => {
      const s = DOT_STYLES[dotState];
      const dot = dotRefs[i].current;
      const x = xRefs[i].current;
      const num = numRefs[i].current;
      if (!dot || !x || !num) return;

      dot.style.borderColor = s.border;
      dot.style.background = s.bg;
      dot.style.boxShadow = s.shadow;
      x.style.opacity = String(s.xOpacity);
      num.style.opacity = String(s.numOpacity);
      num.style.color = s.numColor;
    });

    // Show active center display
    switch (state.centerDisplay) {
      case "setup":
        if (stateEls.setup) stateEls.setup.style.opacity = "1";
        break;
      case "crash1":
        if (stateEls.crash1) stateEls.crash1.style.opacity = "1";
        break;
      case "crash2":
        if (stateEls.crash2) stateEls.crash2.style.opacity = "1";
        break;
      case "tension":
        if (stateEls.tension) stateEls.tension.style.opacity = "1";
        break;
      case "gold":
        if (stateEls.score) stateEls.score.style.opacity = "1";
        scoreMotion.set(0);
        animate(scoreMotion, 90.25, { duration: 2, ease: "easeOut" });
        break;
      case "podium":
        if (stateEls.score) stateEls.score.style.opacity = "1";
        if (compRef.current) compRef.current.style.opacity = "1";
        // Bar widths are set with a small delay via setTimeout for stagger effect
        // CSS transition on .compBarFill handles the animation
        setTimeout(() => {
          if (barChoiRef.current) barChoiRef.current.style.width = "82.5%";
        }, 400);
        setTimeout(() => {
          if (barKimRef.current) barKimRef.current.style.width = "60%";
        }, 550);
        setTimeout(() => {
          if (barOnoRef.current) barOnoRef.current.style.width = "30%";
        }, 700);
        break;
    }

    // Reset comparison when not in podium
    if (state.centerDisplay !== "podium" && compRef.current) {
      compRef.current.style.opacity = "0";
      if (barChoiRef.current) barChoiRef.current.style.width = "0";
      if (barKimRef.current) barKimRef.current.style.width = "0";
      if (barOnoRef.current) barOnoRef.current.style.width = "0";
    }
  }, [state.centerDisplay, state.runDots, scoreMotion]);

  // Particle burst — fire only on transition to true
  useEffect(() => {
    if (state.particleBurst && !prevBurstRef.current && particlesRef.current) {
      spawnParticles(particlesRef.current, athlete.colors.primary, athlete.colors.secondary);
    }
    prevBurstRef.current = state.particleBurst;
  }, [state.particleBurst, athlete.colors.primary, athlete.colors.secondary]);

  return (
    <div className={styles.container}>
      <div ref={particlesRef} className={styles.particlesContainer} />

      {/* Run tracker */}
      <div className={styles.runTracker}>
        <div className={styles.runNode}>
          <div ref={dot1Ref} className={styles.runDot}>
            <span ref={num1Ref} className={styles.dotNum}>1</span>
            <span ref={x1Ref} className={styles.dotX}>&#10005;</span>
          </div>
          <span className={styles.runLabel}>Run 1</span>
        </div>
        <div className={styles.runLine} />
        <div className={styles.runNode}>
          <div ref={dot2Ref} className={styles.runDot}>
            <span ref={num2Ref} className={styles.dotNum}>2</span>
            <span ref={x2Ref} className={styles.dotX}>&#10005;</span>
          </div>
          <span className={styles.runLabel}>Run 2</span>
        </div>
        <div className={styles.runLine} />
        <div className={styles.runNode}>
          <div ref={dot3Ref} className={styles.runDot}>
            <span ref={num3Ref} className={styles.dotNum}>3</span>
            <span ref={x3Ref} className={styles.dotX}>&#10005;</span>
          </div>
          <span className={styles.runLabel}>Run 3</span>
        </div>
      </div>

      {/* Center display */}
      <div className={styles.centerDisplay}>
        <div ref={setupRef} className={`${styles.displayState} ${styles.displaySetup}`}>
          <span className={styles.setupBig}>3 RUNS</span>
          <span className={styles.setupSub}>Halfpipe Final &middot; Milano Cortina</span>
        </div>
        <div ref={crash1Ref} className={`${styles.displayState} ${styles.displayCrash}`}>
          &#10005;
        </div>
        <div ref={crash2Ref} className={`${styles.displayState} ${styles.displayCrash}`}>
          &#10005; &#10005;
        </div>
        <div ref={tensionRef} className={`${styles.displayState} ${styles.displayTension}`}>
          <div className={styles.pulseRing} />
          <span className={styles.tensionText}>One run left</span>
        </div>
        <div ref={scoreStateRef} className={`${styles.displayState} ${styles.displayScore}`}>
          <motion.span className={styles.scoreNumber}>{scoreDisplay}</motion.span>
          <span className={styles.scoreLabel}>Run 3 &middot; Gold</span>
        </div>
      </div>

      {/* Comparison bars */}
      <div ref={compRef} className={styles.comparison}>
        <div className={styles.compRow}>
          <span className={styles.compName}>Choi Gaon</span>
          <div className={styles.compBarTrack}>
            <div ref={barChoiRef} className={`${styles.compBarFill} ${styles.barGold}`}>
              <span className={styles.compScore}>90.25</span>
            </div>
          </div>
        </div>
        <div className={styles.compRow}>
          <span className={styles.compName}>Chloe Kim</span>
          <div className={styles.compBarTrack}>
            <div ref={barKimRef} className={`${styles.compBarFill} ${styles.barSilver}`}>
              <span className={styles.compScore}>88.00</span>
            </div>
          </div>
        </div>
        <div className={styles.compRow}>
          <span className={styles.compName}>Mitsuki Ono</span>
          <div className={styles.compBarTrack}>
            <div ref={barOnoRef} className={`${styles.compBarFill} ${styles.barBronze}`}>
              <span className={styles.compScore}>85.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
