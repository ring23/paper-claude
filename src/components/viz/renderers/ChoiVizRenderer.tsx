import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
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

function spawnParticles(container: HTMLDivElement) {
  container.innerHTML = "";

  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = styles.particle;
    p.style.left = "50%";
    p.style.top = "45%";

    const size = 3 + Math.random() * 5;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.background = Math.random() > 0.5 ? "#E4C45A" : "#C6982B";

    container.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 300;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    gsap.fromTo(
      p,
      { opacity: 1, x: 0, y: 0, scale: 1 },
      {
        x: dx,
        y: dy,
        opacity: 0,
        scale: 0,
        duration: 1.2 + Math.random() * 0.8,
        delay: Math.random() * 0.3,
        ease: "power2.out",
      },
    );
  }
}

export default function ChoiVizRenderer({ state }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const prevBurstRef = useRef(false);

  // Refs for GSAP-targeted elements
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

  // Animate state transitions
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const stateEls = {
        setup: setupRef.current,
        crash1: crash1Ref.current,
        crash2: crash2Ref.current,
        tension: tensionRef.current,
        score: scoreStateRef.current,
      };

      // Hide all center display states
      Object.values(stateEls).forEach((el) => {
        if (el) gsap.to(el, { opacity: 0, duration: 0.2 });
      });

      // Apply run dot states
      const dotRefs = [dot1Ref, dot2Ref, dot3Ref];
      const xRefs = [x1Ref, x2Ref, x3Ref];
      const numRefs = [num1Ref, num2Ref, num3Ref];

      state.runDots.forEach((dotState, i) => {
        const s = DOT_STYLES[dotState];
        const dot = dotRefs[i].current;
        const x = xRefs[i].current;
        const num = numRefs[i].current;
        if (!dot || !x || !num) return;

        gsap.to(dot, {
          borderColor: s.border,
          background: s.bg,
          boxShadow: s.shadow,
          duration: 0.3,
        });
        gsap.to(x, { opacity: s.xOpacity, duration: 0.3 });
        gsap.to(num, { opacity: s.numOpacity, color: s.numColor, duration: 0.3 });
      });

      // Show active center display
      switch (state.centerDisplay) {
        case "setup":
          gsap.to(stateEls.setup, { opacity: 1, duration: 0.5 });
          break;
        case "crash1":
          gsap.to(stateEls.crash1, { opacity: 1, duration: 0.4 });
          break;
        case "crash2":
          gsap.to(stateEls.crash2, { opacity: 1, duration: 0.4 });
          break;
        case "tension":
          gsap.to(stateEls.tension, { opacity: 1, duration: 0.5 });
          break;
        case "gold":
          gsap.to(stateEls.score, { opacity: 1, duration: 0.6 });
          if (scoreRef.current) {
            gsap.fromTo(
              scoreRef.current,
              { innerText: "0" },
              {
                innerText: "90.25",
                duration: 2,
                ease: "power2.out",
                snap: { innerText: 0.01 },
                onUpdate() {
                  if (scoreRef.current) {
                    scoreRef.current.textContent = parseFloat(
                      scoreRef.current.innerText || "0",
                    ).toFixed(2);
                  }
                },
              },
            );
          }
          break;
        case "podium":
          gsap.to(stateEls.score, { opacity: 1, duration: 0.3 });
          if (scoreRef.current) scoreRef.current.textContent = "90.25";
          if (compRef.current) {
            gsap.to(compRef.current, { opacity: 1, duration: 0.5, delay: 0.2 });
          }
          if (barChoiRef.current) {
            gsap.to(barChoiRef.current, { width: "82.5%", duration: 1, delay: 0.4, ease: "power2.out" });
          }
          if (barKimRef.current) {
            gsap.to(barKimRef.current, { width: "60%", duration: 1, delay: 0.55, ease: "power2.out" });
          }
          if (barOnoRef.current) {
            gsap.to(barOnoRef.current, { width: "30%", duration: 1, delay: 0.7, ease: "power2.out" });
          }
          break;
      }

      // Reset comparison when not in podium
      if (state.centerDisplay !== "podium" && compRef.current) {
        gsap.to(compRef.current, { opacity: 0, duration: 0.2 });
        if (barChoiRef.current) gsap.set(barChoiRef.current, { width: 0 });
        if (barKimRef.current) gsap.set(barKimRef.current, { width: 0 });
        if (barOnoRef.current) gsap.set(barOnoRef.current, { width: 0 });
      }
    },
    { dependencies: [state], scope: containerRef },
  );

  // Particle burst — fire only on transition to true
  useEffect(() => {
    if (state.particleBurst && !prevBurstRef.current && particlesRef.current) {
      spawnParticles(particlesRef.current);
    }
    prevBurstRef.current = state.particleBurst;
  }, [state.particleBurst]);

  return (
    <div ref={containerRef} className={styles.container}>
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
          <span ref={scoreRef} className={styles.scoreNumber}>0</span>
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
