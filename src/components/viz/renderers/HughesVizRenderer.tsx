import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { Athlete } from "../../../data/athletes";
import type { HughesVizState } from "../../../types/story";
import styles from "./HughesVizRenderer.module.css";

interface Props {
  state: HughesVizState;
  athlete: Athlete;
}

function spawnParticles(container: HTMLDivElement, colors: string[]) {
  container.innerHTML = "";

  for (let i = 0; i < 50; i++) {
    const p = document.createElement("div");
    const isStar = Math.random() > 0.6;
    p.className = isStar
      ? `${styles.particle} ${styles.particleStar}`
      : styles.particle;

    const size = 3 + Math.random() * 6;
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 350;

    p.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    p.style.setProperty("--delay", `${Math.random() * 0.35}s`);
    p.style.setProperty("--duration", `${1.0 + Math.random() * 1.0}s`);
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(p);
  }
}

function getPeriodLabel(display: HughesVizState["centerDisplay"]): string {
  switch (display) {
    case "miracle":
    case "drought":
      return "";
    case "pregame":
      return "PUCK DROP";
    case "p1-goal":
      return "P1";
    case "p2-wall":
      return "P2";
    case "ot-setup":
    case "ot-goal":
      return "OT";
    case "coda":
      return "FINAL";
    default:
      return "";
  }
}

export default function HughesVizRenderer({ state, athlete }: Props) {
  const particlesRef = useRef<HTMLDivElement>(null);
  const prevDisplayRef = useRef<string | null>(null);
  const prevBurstRef = useRef(false);

  // FM animated counters
  const droughtMotion = useMotionValue(0);
  const droughtDisplay = useTransform(droughtMotion, (v) =>
    Math.round(v).toString()
  );
  const saveMotion = useMotionValue(0);
  const saveDisplay = useTransform(saveMotion, (v) =>
    Math.round(v).toString()
  );

  // DOM refs — scoreboard
  const scoreboardRef = useRef<HTMLDivElement>(null);
  const scoreUSARef = useRef<HTMLSpanElement>(null);
  const scoreCAnRef = useRef<HTMLSpanElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);

  // DOM refs — center display states
  const miracleRef = useRef<HTMLDivElement>(null);
  const droughtRef = useRef<HTMLDivElement>(null);
  const pregameRef = useRef<HTMLDivElement>(null);
  const goalP1Ref = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const otSetupRef = useRef<HTMLDivElement>(null);
  const otGoalRef = useRef<HTMLDivElement>(null);
  const codaRef = useRef<HTMLDivElement>(null);

  // DOM refs — save gauge
  const saveGaugeRef = useRef<HTMLDivElement>(null);
  const saveGaugeFillRef = useRef<HTMLDivElement>(null);

  // DOM refs — drought counter display
  const droughtNumRef = useRef<HTMLDivElement>(null);

  // Imperative state transitions
  useEffect(() => {
    const stateEls: Record<string, HTMLDivElement | null> = {
      miracle: miracleRef.current,
      drought: droughtRef.current,
      pregame: pregameRef.current,
      "p1-goal": goalP1Ref.current,
      "p2-wall": wallRef.current,
      "ot-setup": otSetupRef.current,
      "ot-goal": otGoalRef.current,
      coda: codaRef.current,
    };

    // Skip if same display state
    if (state.centerDisplay === prevDisplayRef.current) return;
    prevDisplayRef.current = state.centerDisplay;

    // Hide all center display states
    Object.values(stateEls).forEach((el) => {
      if (el) el.style.opacity = "0";
    });

    // Scoreboard visibility — show from pregame onward
    const showScoreboard = ![
      "miracle",
      "drought",
    ].includes(state.centerDisplay);

    if (scoreboardRef.current) {
      scoreboardRef.current.style.opacity = showScoreboard ? "1" : "0";
    }

    // Update scores
    if (scoreUSARef.current) {
      scoreUSARef.current.textContent = String(state.scoreUSA);
      if (state.centerDisplay === "ot-goal") {
        scoreUSARef.current.classList.add(styles.scoreGlow);
      } else {
        scoreUSARef.current.classList.remove(styles.scoreGlow);
      }
    }
    if (scoreCAnRef.current) {
      scoreCAnRef.current.textContent = String(state.scoreCAN);
    }

    // Period label
    if (periodRef.current) {
      const label = getPeriodLabel(state.centerDisplay);
      periodRef.current.textContent = label;
      if (state.centerDisplay === "ot-setup" || state.centerDisplay === "ot-goal") {
        periodRef.current.classList.add(styles.periodHighlight);
      } else {
        periodRef.current.classList.remove(styles.periodHighlight);
      }
    }

    // Save gauge
    if (saveGaugeRef.current) {
      saveGaugeRef.current.style.opacity = state.showSaveGauge ? "1" : "0";
    }
    if (state.showSaveGauge && saveGaugeFillRef.current) {
      // Animate save gauge fill after a short delay
      const pct = (state.saveGaugeFill / 42) * 100;
      setTimeout(() => {
        if (saveGaugeFillRef.current) {
          saveGaugeFillRef.current.style.width = `${pct}%`;
        }
      }, 300);
      // Animate save counter
      saveMotion.set(0);
      animate(saveMotion, state.saveGaugeFill, {
        duration: 2,
        ease: "easeOut",
      });
    } else if (saveGaugeFillRef.current) {
      saveGaugeFillRef.current.style.width = "0%";
    }

    // Drought counter number styling
    if (droughtNumRef.current) {
      if (state.droughtCounterTarget > 0) {
        droughtNumRef.current.classList.add(styles.droughtNumberActive);
      } else {
        droughtNumRef.current.classList.remove(styles.droughtNumberActive);
      }
    }

    // Show active center display
    const activeEl = stateEls[state.centerDisplay];
    if (activeEl) activeEl.style.opacity = "1";

    // Animate drought counter if drought display
    if (
      state.centerDisplay === "drought" &&
      state.droughtCounterTarget > 0
    ) {
      droughtMotion.set(0);
      animate(droughtMotion, state.droughtCounterTarget, {
        duration: 2.2,
        ease: "easeOut",
      });
    }
  }, [state.centerDisplay, state.scoreUSA, state.scoreCAN, state.showSaveGauge, state.saveGaugeFill, state.droughtCounterTarget, droughtMotion, saveMotion]);

  // Particle burst — fire only on transition to true
  useEffect(() => {
    if (state.particleBurst && !prevBurstRef.current && particlesRef.current) {
      spawnParticles(particlesRef.current, [athlete.colors.primary, athlete.colors.secondary, "#E4C45A", "#C6982B", "#FFFFFF"]);
    }
    prevBurstRef.current = state.particleBurst;
  }, [state.particleBurst, athlete.colors.primary, athlete.colors.secondary]);

  return (
    <div className={styles.container}>
      <div ref={particlesRef} className={styles.particlesContainer} />

      {/* Scoreboard */}
      <div ref={scoreboardRef} className={styles.scoreboard}>
        <div className={styles.teamBlock}>
          <span className={`${styles.teamLabel} ${styles.teamLabelUSA}`}>
            USA
          </span>
          <span ref={scoreUSARef} className={styles.teamScore}>
            0
          </span>
        </div>
        <div className={styles.scoreDivider}>
          <span className={styles.scoreDash}>&ndash;</span>
          <span ref={periodRef} className={styles.periodLabel} />
        </div>
        <div className={styles.teamBlock}>
          <span className={`${styles.teamLabel} ${styles.teamLabelCAN}`}>
            CAN
          </span>
          <span ref={scoreCAnRef} className={styles.teamScore}>
            0
          </span>
        </div>
      </div>

      {/* Center display */}
      <div className={styles.centerDisplay}>
        {/* Miracle */}
        <div
          ref={miracleRef}
          className={`${styles.displayState} ${styles.displayMiracle}`}
        >
          <span className={styles.miracleYear}>1980</span>
          <span className={styles.miracleSub}>Miracle on Ice</span>
        </div>

        {/* Drought */}
        <div
          ref={droughtRef}
          className={`${styles.displayState} ${styles.displayDrought}`}
        >
          <div className={styles.droughtCounter}>
            <motion.div
              ref={droughtNumRef}
              className={styles.droughtNumber}
            >
              {droughtDisplay}
            </motion.div>
            <span className={styles.droughtLabel}>years</span>
          </div>
          <span className={styles.droughtSub}>
            No US men&rsquo;s hockey gold
          </span>
        </div>

        {/* Pregame */}
        <div
          ref={pregameRef}
          className={`${styles.displayState} ${styles.displayPregame}`}
        >
          <div className={styles.pregameFlags}>
            <span className={`${styles.pregameFlag} ${styles.pregameFlagUSA}`}>
              USA
            </span>
            <span className={styles.pregameVs}>vs</span>
            <span className={`${styles.pregameFlag} ${styles.pregameFlagCAN}`}>
              CAN
            </span>
          </div>
          <div className={styles.pregameRink} />
          <span className={styles.pregameEvent}>
            Gold Medal Game &middot; Milano
          </span>
        </div>

        {/* P1 Goal */}
        <div
          ref={goalP1Ref}
          className={`${styles.displayState} ${styles.displayGoal}`}
        >
          <span className={styles.goalScorer}>BOLDY</span>
          <span className={styles.goalLabel}>GOAL</span>
          <span className={styles.goalTime}>Period 1</span>
        </div>

        {/* P2 Wall / Hellebuyck */}
        <div
          ref={wallRef}
          className={`${styles.displayState} ${styles.displayWall}`}
        >
          <span className={styles.wallName}>HELLEBUYCK</span>
          <span className={styles.wallSub}>The Wall</span>
        </div>

        {/* OT Setup */}
        <div
          ref={otSetupRef}
          className={`${styles.displayState} ${styles.displayOT}`}
        >
          <span className={styles.otBig}>3v3 OVERTIME</span>
          <span className={styles.otSub}>Next goal wins</span>
        </div>

        {/* OT Goal */}
        <div
          ref={otGoalRef}
          className={`${styles.displayState} ${styles.displayGoal}`}
        >
          <span className={styles.goalScorer}>HUGHES</span>
          <span className={styles.goalLabel}>GOAL</span>
          <span className={styles.goalTime}>1:41 OT &middot; Gold</span>
        </div>

        {/* Coda */}
        <div
          ref={codaRef}
          className={`${styles.displayState} ${styles.displayCoda}`}
        >
          <span className={styles.codaText}>Not a miracle.</span>
          <span className={styles.codaText}>Inevitable.</span>
          <span className={styles.codaSub}>USA Gold &middot; 2026</span>
        </div>
      </div>

      {/* Save gauge */}
      <div ref={saveGaugeRef} className={styles.saveGaugeWrap}>
        <div className={styles.saveGaugeHeader}>
          <span className={styles.saveGaugeTitle}>Saves</span>
          <motion.span className={styles.saveGaugeNumber}>
            {saveDisplay}
          </motion.span>
        </div>
        <div className={styles.saveGaugeTrack}>
          <div ref={saveGaugeFillRef} className={styles.saveGaugeFill} />
        </div>
        <span className={styles.saveGaugeCaption}>
          41 of 42 shots stopped &middot; 97.6% save rate
        </span>
      </div>
    </div>
  );
}
