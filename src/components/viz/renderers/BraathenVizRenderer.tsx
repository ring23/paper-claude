import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { Athlete } from "../../../data/athletes";
import type { BraathenVizState } from "../../../types/story";
import styles from "./BraathenVizRenderer.module.css";

interface Props {
  state: BraathenVizState;
  athlete: Athlete;
}

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
    // Athlete-themed particles
    p.style.background =
      Math.random() > 0.5 ? primary : Math.random() > 0.5 ? secondary : "#C6982B";

    container.appendChild(p);
  }
}

export default function BraathenVizRenderer({ state, athlete }: Props) {
  const particlesRef = useRef<HTMLDivElement>(null);
  const prevDisplayRef = useRef<string | null>(null);
  const prevBurstRef = useRef(false);
  const prevDroughtTargetRef = useRef(0);

  // Framer Motion animated drought counter
  const droughtMotion = useMotionValue(0);
  const droughtDisplay = useTransform(droughtMotion, (v) =>
    Math.round(v).toString()
  );

  // Refs for DOM-targeted elements
  const droughtRef = useRef<HTMLDivElement>(null);
  const droughtNumRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const runBarsRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);

  // Run bar refs
  const barBraathenRun1Ref = useRef<HTMLDivElement>(null);
  const barOdermattRun1Ref = useRef<HTMLDivElement>(null);
  const barBraathenRun2Ref = useRef<HTMLDivElement>(null);
  const barOdermattRun2Ref = useRef<HTMLDivElement>(null);

  // Podium bar refs
  const podiumBraathenRef = useRef<HTMLDivElement>(null);
  const podiumOdermattRef = useRef<HTMLDivElement>(null);
  const podiumMeillardRef = useRef<HTMLDivElement>(null);

  // Imperative state transitions — CSS transitions handle interpolation
  useEffect(() => {
    // Skip if this is the same display state
    if (state.centerDisplay === prevDisplayRef.current) return;
    prevDisplayRef.current = state.centerDisplay;

    const display = state.centerDisplay;

    // Hide all display states
    const allStates = [introRef, goldRef];
    allStates.forEach((ref) => {
      if (ref.current) ref.current.style.opacity = "0";
    });

    // Drought counter visibility
    const showDrought =
      display === "drought-start" ||
      display === "drought-running" ||
      display === "run1" ||
      display === "run2";
    if (droughtRef.current) {
      droughtRef.current.style.opacity = showDrought ? "1" : "0";
    }

    // Drought number tension styling
    if (droughtNumRef.current) {
      if (display === "drought-running") {
        droughtNumRef.current.classList.add(styles.droughtNumberTension);
      } else {
        droughtNumRef.current.classList.remove(styles.droughtNumberTension);
      }
    }

    // Run bars visibility
    const showRuns = display === "run1" || display === "run2";
    if (runBarsRef.current) {
      runBarsRef.current.style.opacity = showRuns ? "1" : "0";
    }

    // Reset run bar widths when hidden
    if (!showRuns) {
      if (barBraathenRun1Ref.current) barBraathenRun1Ref.current.style.width = "0";
      if (barOdermattRun1Ref.current) barOdermattRun1Ref.current.style.width = "0";
      if (barBraathenRun2Ref.current) barBraathenRun2Ref.current.style.width = "0";
      if (barOdermattRun2Ref.current) barOdermattRun2Ref.current.style.width = "0";
    }

    // Comparison visibility
    if (display !== "podium" && compRef.current) {
      compRef.current.style.opacity = "0";
      if (podiumBraathenRef.current) podiumBraathenRef.current.style.width = "0";
      if (podiumOdermattRef.current) podiumOdermattRef.current.style.width = "0";
      if (podiumMeillardRef.current) podiumMeillardRef.current.style.width = "0";
    }

    // Show active display
    switch (display) {
      case "intro":
        if (introRef.current) introRef.current.style.opacity = "1";
        break;

      case "drought-start":
        // Counter visible but at 0
        droughtMotion.set(0);
        break;

      case "drought-running":
        // Animate counter from current value to 102
        animate(droughtMotion, state.droughtCounterTarget, {
          duration: 2.5,
          ease: "easeOut",
        });
        break;

      case "run1":
        // Show Run 1 bars with stagger
        setTimeout(() => {
          if (barBraathenRun1Ref.current)
            barBraathenRun1Ref.current.style.width = "85%";
        }, 300);
        setTimeout(() => {
          if (barOdermattRun1Ref.current)
            barOdermattRun1Ref.current.style.width = "68%";
        }, 500);
        break;

      case "run2":
        // Show both runs
        setTimeout(() => {
          if (barBraathenRun1Ref.current)
            barBraathenRun1Ref.current.style.width = "85%";
        }, 100);
        setTimeout(() => {
          if (barOdermattRun1Ref.current)
            barOdermattRun1Ref.current.style.width = "68%";
        }, 200);
        setTimeout(() => {
          if (barBraathenRun2Ref.current)
            barBraathenRun2Ref.current.style.width = "80%";
        }, 400);
        setTimeout(() => {
          if (barOdermattRun2Ref.current)
            barOdermattRun2Ref.current.style.width = "72%";
        }, 550);
        break;

      case "gold":
        if (goldRef.current) goldRef.current.style.opacity = "1";
        break;

      case "podium":
        if (compRef.current) compRef.current.style.opacity = "1";
        // Stagger podium bars
        setTimeout(() => {
          if (podiumBraathenRef.current)
            podiumBraathenRef.current.style.width = "90%";
        }, 400);
        setTimeout(() => {
          if (podiumOdermattRef.current)
            podiumOdermattRef.current.style.width = "75%";
        }, 550);
        setTimeout(() => {
          if (podiumMeillardRef.current)
            podiumMeillardRef.current.style.width = "62%";
        }, 700);
        break;
    }

    prevDroughtTargetRef.current = state.droughtCounterTarget;
  }, [state.centerDisplay, state.droughtCounterTarget, state.showRunBars, droughtMotion]);

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

      {/* Drought counter */}
      <div ref={droughtRef} className={styles.droughtCounter}>
        <motion.div
          ref={droughtNumRef}
          className={styles.droughtNumber}
        >
          {droughtDisplay}
        </motion.div>
        <span className={styles.droughtUnit}>
          {state.droughtCounterTarget === 0 ? "medals" : "years"}
        </span>
        <span className={styles.droughtContext}>
          No South American Winter Olympic medal
        </span>
      </div>

      {/* Center display */}
      <div className={styles.centerDisplay}>
        <div
          ref={introRef}
          className={`${styles.displayState} ${styles.displayIntro}`}
        >
          <span className={styles.introBigYear}>1924</span>
          <span className={styles.introSub}>
            Chamonix, France &middot; First Winter Olympics
          </span>
        </div>
        <div
          ref={goldRef}
          className={`${styles.displayState} ${styles.displayGold}`}
        >
          <span className={styles.goldBigText}>GOLD</span>
          <span className={styles.goldTime}>2:25.00</span>
          <span className={styles.goldCountry}>Brazil</span>
        </div>
      </div>

      {/* Run bars */}
      <div ref={runBarsRef} className={styles.runBars}>
        {/* Run 1 */}
        <div className={styles.runBarGroup}>
          <span className={styles.runBarLabel}>Run 1</span>
          <div className={styles.runBarRow}>
            <span className={styles.runBarName}>Braathen</span>
            <div className={styles.runBarTrack}>
              <div
                ref={barBraathenRun1Ref}
                className={`${styles.runBarFill} ${styles.barBraathen}`}
              >
                <span className={styles.runBarTime}>1:13.92</span>
              </div>
            </div>
            <span className={styles.runBarMargin}>&mdash;</span>
          </div>
          <div className={styles.runBarRow}>
            <span className={styles.runBarName}>Odermatt</span>
            <div className={styles.runBarTrack}>
              <div
                ref={barOdermattRun1Ref}
                className={`${styles.runBarFill} ${styles.barOdermatt}`}
              >
                <span className={styles.runBarTime}>1:14.50</span>
              </div>
            </div>
            <span className={`${styles.runBarMargin} ${styles.runBarMarginSilver}`}>
              +0.58
            </span>
          </div>
          <span className={styles.marginNote}>
            Largest Run 1 margin since 1988
          </span>
        </div>

        {/* Run 2 */}
        <div className={styles.runBarGroup}>
          <span className={styles.runBarLabel}>Run 2</span>
          <div className={styles.runBarRow}>
            <span className={styles.runBarName}>Braathen</span>
            <div className={styles.runBarTrack}>
              <div
                ref={barBraathenRun2Ref}
                className={`${styles.runBarFill} ${styles.barBraathen}`}
              >
                <span className={styles.runBarTime}>1:11.08</span>
              </div>
            </div>
            <span className={styles.runBarMargin}>&mdash;</span>
          </div>
          <div className={styles.runBarRow}>
            <span className={styles.runBarName}>Odermatt</span>
            <div className={styles.runBarTrack}>
              <div
                ref={barOdermattRun2Ref}
                className={`${styles.runBarFill} ${styles.barOdermatt}`}
              >
                <span className={styles.runBarTime}>1:10.50</span>
              </div>
            </div>
            <span className={`${styles.runBarMargin} ${styles.runBarMarginSilver}`}>
              -0.58
            </span>
          </div>
        </div>
      </div>

      {/* Podium comparison */}
      <div ref={compRef} className={styles.comparison}>
        <div className={styles.compRow}>
          <span className={styles.compName}>Braathen (BRA)</span>
          <div className={styles.compBarTrack}>
            <div
              ref={podiumBraathenRef}
              className={`${styles.compBarFill} ${styles.compBarGold}`}
            >
              <span className={styles.compScore}>2:25.00</span>
            </div>
          </div>
          <span className={styles.compMargin}>&mdash;</span>
        </div>
        <div className={styles.compRow}>
          <span className={styles.compName}>Odermatt (SUI)</span>
          <div className={styles.compBarTrack}>
            <div
              ref={podiumOdermattRef}
              className={`${styles.compBarFill} ${styles.compBarSilver}`}
            >
              <span className={styles.compScore}>2:25.58</span>
            </div>
          </div>
          <span className={styles.compMargin}>+0.58</span>
        </div>
        <div className={styles.compRow}>
          <span className={styles.compName}>Meillard (SUI)</span>
          <div className={styles.compBarTrack}>
            <div
              ref={podiumMeillardRef}
              className={`${styles.compBarFill} ${styles.compBarBronze}`}
            >
              <span className={styles.compScore}>2:26.17</span>
            </div>
          </div>
          <span className={styles.compMargin}>+1.17</span>
        </div>
      </div>
    </div>
  );
}
