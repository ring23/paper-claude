import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { Athlete } from "../../../data/athletes";
import type { MeyersTaylorVizState, MeyersTaylorCenterDisplay } from "../../../types/story";
import styles from "./MeyersTaylorVizRenderer.module.css";

interface Props {
  state: MeyersTaylorVizState;
  athlete: Athlete;
}

// Career medal data: 5 Olympic stops, Beijing has 2 medals
const CAREER_STOPS: {
  year: number;
  city: string;
  medals: { type: "gold" | "silver" | "bronze"; event: string }[];
  age: number;
}[] = [
  { year: 2010, city: "Vancouver", medals: [{ type: "bronze", event: "Two-woman" }], age: 25 },
  { year: 2014, city: "Sochi", medals: [{ type: "silver", event: "Two-woman" }], age: 28 },
  { year: 2018, city: "PyeongChang", medals: [{ type: "silver", event: "Two-woman" }], age: 32 },
  {
    year: 2022,
    city: "Beijing",
    medals: [
      { type: "silver", event: "Monobob" },
      { type: "bronze", event: "Two-woman" },
    ],
    age: 37,
  },
  { year: 2026, city: "Milano Cortina", medals: [{ type: "gold", event: "Monobob" }], age: 41 },
];

const MEDAL_COLORS: Record<string, string> = {
  gold: "#C6982B",
  silver: "#B0B0B0",
  bronze: "#8B6914",
};

const MEDAL_BORDER: Record<string, string> = {
  gold: "#E4C45A",
  silver: "#D0D0D0",
  bronze: "#A67C28",
};

// Map centerDisplay to the age shown
const DISPLAY_AGE: Partial<Record<MeyersTaylorCenterDisplay, number>> = {
  vancouver: 25,
  sochi: 28,
  pyeongchang: 32,
  beijing: 37,
  gap: 40,
  "milano-tension": 41,
  gold: 41,
};

function spawnParticles(container: HTMLDivElement, colors: string[]) {
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
    p.style.background = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(p);
  }
}

/**
 * Given careerDotsLit (0-6), compute how many medals are lit per stop.
 * Medals are ordered chronologically: Vancouver(1), Sochi(1), PyeongChang(1), Beijing(2), Milano(1) = 6 total
 */
function getMedalCountsByStop(dotsLit: number): number[] {
  const stopMedalCounts = CAREER_STOPS.map((s) => s.medals.length); // [1,1,1,2,1]
  const result: number[] = [];
  let remaining = dotsLit;
  for (const count of stopMedalCounts) {
    const lit = Math.min(remaining, count);
    result.push(lit);
    remaining -= lit;
  }
  return result;
}

export default function MeyersTaylorVizRenderer({ state, athlete }: Props) {
  const particlesRef = useRef<HTMLDivElement>(null);
  const prevDisplayRef = useRef<string | null>(null);
  const prevBurstRef = useRef(false);

  // Framer Motion animated time counter for gold state
  const timeMotion = useMotionValue(60.0);
  const timeDisplay = useTransform(timeMotion, (v) => v.toFixed(2));

  // DOM refs for center display states
  const introRef = useRef<HTMLDivElement>(null);
  const vancouverRef = useRef<HTMLDivElement>(null);
  const sochiRef = useRef<HTMLDivElement>(null);
  const pyeongchangRef = useRef<HTMLDivElement>(null);
  const beijingRef = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLDivElement>(null);
  const tensionRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);

  // DOM refs for timeline medal dots (flattened: up to 7 elements for 6 medals across 5 stops)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Age counter ref
  const ageRef = useRef<HTMLDivElement>(null);
  const ageValueRef = useRef<HTMLSpanElement>(null);

  // Imperative state transitions
  useEffect(() => {
    const stateEls: Record<string, HTMLDivElement | null> = {
      intro: introRef.current,
      vancouver: vancouverRef.current,
      sochi: sochiRef.current,
      pyeongchang: pyeongchangRef.current,
      beijing: beijingRef.current,
      gap: gapRef.current,
      "milano-tension": tensionRef.current,
      gold: goldRef.current,
    };

    if (state.centerDisplay === prevDisplayRef.current) return;
    prevDisplayRef.current = state.centerDisplay;

    // Hide all center display states
    Object.values(stateEls).forEach((el) => {
      if (el) el.style.opacity = "0";
    });

    // Show active center display
    const activeEl = stateEls[state.centerDisplay];
    if (activeEl) activeEl.style.opacity = "1";

    // Gold state: animate time counter
    if (state.centerDisplay === "gold") {
      timeMotion.set(60.5);
      animate(timeMotion, 59.51, { duration: 2, ease: "easeOut" });
    }

    // Age counter
    const age = DISPLAY_AGE[state.centerDisplay];
    if (ageRef.current) {
      ageRef.current.style.opacity = age ? "1" : "0";
    }
    if (ageValueRef.current && age) {
      ageValueRef.current.textContent = String(age);
      if (state.centerDisplay === "gold") {
        ageValueRef.current.style.color = "var(--gold, #C6982B)";
      } else {
        ageValueRef.current.style.color = "#B31942";
      }
    }
  }, [state.centerDisplay, timeMotion]);

  // Timeline dot updates
  useEffect(() => {
    const litByStop = getMedalCountsByStop(state.careerDotsLit);
    let flatIndex = 0;

    for (let stopIdx = 0; stopIdx < CAREER_STOPS.length; stopIdx++) {
      const stop = CAREER_STOPS[stopIdx];
      const litCount = litByStop[stopIdx];

      for (let medalIdx = 0; medalIdx < stop.medals.length; medalIdx++) {
        const dot = dotRefs.current[flatIndex];
        const inner = innerRefs.current[flatIndex];
        const isLit = medalIdx < litCount;
        const medal = stop.medals[medalIdx];

        if (dot) {
          if (isLit) {
            dot.style.borderColor = MEDAL_BORDER[medal.type];
            dot.style.transform = "scale(1)";
            dot.style.opacity = "1";
            if (medal.type === "gold") {
              dot.style.boxShadow = `0 0 20px rgba(198, 152, 43, 0.4)`;
            } else {
              dot.style.boxShadow = "none";
            }
          } else {
            dot.style.borderColor = "rgba(255, 255, 255, 0.12)";
            dot.style.transform = "scale(0.7)";
            dot.style.opacity = "0.3";
            dot.style.boxShadow = "none";
          }
        }
        if (inner) {
          if (isLit) {
            inner.style.opacity = "1";
            inner.style.background = MEDAL_COLORS[medal.type];
          } else {
            inner.style.opacity = "0";
          }
        }
        flatIndex++;
      }

      // Year label
      const yearEl = yearRefs.current[stopIdx];
      if (yearEl) {
        const anyLit = litByStop[stopIdx] > 0;
        yearEl.style.color = anyLit ? "#E8E2D8" : "#6B7D8D";
      }
    }
  }, [state.careerDotsLit]);

  // Particle burst
  useEffect(() => {
    if (state.particleBurst && !prevBurstRef.current && particlesRef.current) {
      spawnParticles(particlesRef.current, [athlete.colors.primary, athlete.colors.secondary, "#E4C45A", "#FFFFFF"]);
    }
    prevBurstRef.current = state.particleBurst;
  }, [state.particleBurst, athlete.colors.primary, athlete.colors.secondary]);

  // Build flat index for medal dot refs
  let flatIdx = 0;

  return (
    <div className={styles.container}>
      <div ref={particlesRef} className={styles.particlesContainer} />

      {/* Career timeline */}
      <div className={styles.timeline}>
        {CAREER_STOPS.map((stop, stopIdx) => {
          const hasTwoMedals = stop.medals.length > 1;
          const nodes = stop.medals.map((_medal, medalIdx) => {
            const idx = flatIdx++;
            return (
              <div
                key={`${stop.year}-${medalIdx}`}
                ref={(el) => { dotRefs.current[idx] = el; }}
                className={styles.medalDot}
              >
                <div
                  ref={(el) => { innerRefs.current[idx] = el; }}
                  className={styles.medalInner}
                />
              </div>
            );
          });

          return (
            <div key={stop.year} style={{ display: "contents" }}>
              {stopIdx > 0 && <div className={styles.timelineLine} />}
              <div className={styles.timelineNode}>
                {hasTwoMedals ? (
                  <div className={styles.medalStack}>{nodes}</div>
                ) : (
                  nodes
                )}
                <span
                  ref={(el) => { yearRefs.current[stopIdx] = el; }}
                  className={styles.timelineYear}
                >
                  {stop.year}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center display */}
      <div className={styles.centerDisplay}>
        {/* Intro */}
        <div ref={introRef} className={`${styles.displayState} ${styles.introState}`}>
          <span className={styles.introBig}>5 OLYMPICS</span>
          <span className={styles.introSub}>Sixteen years of sliding</span>
        </div>

        {/* Vancouver 2010 */}
        <div ref={vancouverRef} className={`${styles.displayState} ${styles.olympicsState}`}>
          <span className={styles.olympicsYear}>2010</span>
          <span className={styles.olympicsCity}>Vancouver</span>
          <span className={styles.olympicsMedal}>
            <span className={styles.medalIcon} style={{ background: MEDAL_COLORS.bronze }} />
            <span style={{ color: MEDAL_COLORS.bronze }}>Bronze</span>
          </span>
        </div>

        {/* Sochi 2014 */}
        <div ref={sochiRef} className={`${styles.displayState} ${styles.olympicsState}`}>
          <span className={styles.olympicsYear}>2014</span>
          <span className={styles.olympicsCity}>Sochi</span>
          <span className={styles.olympicsMedal}>
            <span className={styles.medalIcon} style={{ background: MEDAL_COLORS.silver }} />
            <span style={{ color: MEDAL_COLORS.silver }}>Silver</span>
          </span>
        </div>

        {/* PyeongChang 2018 */}
        <div ref={pyeongchangRef} className={`${styles.displayState} ${styles.olympicsState}`}>
          <span className={styles.olympicsYear}>2018</span>
          <span className={styles.olympicsCity}>PyeongChang</span>
          <span className={styles.olympicsMedal}>
            <span className={styles.medalIcon} style={{ background: MEDAL_COLORS.silver }} />
            <span style={{ color: MEDAL_COLORS.silver }}>Silver</span>
          </span>
        </div>

        {/* Beijing 2022 */}
        <div ref={beijingRef} className={`${styles.displayState} ${styles.olympicsState}`}>
          <span className={styles.olympicsYear}>2022</span>
          <span className={styles.olympicsCity}>Beijing</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <span className={styles.olympicsMedal}>
              <span className={styles.medalIcon} style={{ background: MEDAL_COLORS.silver }} />
              <span style={{ color: MEDAL_COLORS.silver }}>Silver</span>
            </span>
            <span className={styles.olympicsMedal}>
              <span className={styles.medalIcon} style={{ background: MEDAL_COLORS.bronze }} />
              <span style={{ color: MEDAL_COLORS.bronze }}>Bronze</span>
            </span>
          </div>
        </div>

        {/* Gap */}
        <div ref={gapRef} className={`${styles.displayState} ${styles.gapState}`}>
          <span className={styles.gapText}>
            A baby. The pandemic.<br />A comeback at 40.
          </span>
          <span className={styles.gapAge}>Five medals &middot; zero gold</span>
        </div>

        {/* Milano tension */}
        <div ref={tensionRef} className={`${styles.displayState} ${styles.tensionState}`}>
          <div className={styles.marginDisplay}>
            <span className={styles.marginValue}>-0.04</span>
            <span className={styles.marginLabel}>Trailing Nolte through 3 heats</span>
          </div>
          <div className={styles.heatPulse}>
            <div className={styles.pulseRing} />
            <span className={styles.heatLabel}>Heat 4</span>
          </div>
        </div>

        {/* Gold */}
        <div ref={goldRef} className={`${styles.displayState} ${styles.goldState}`}>
          <motion.span className={styles.goldTime}>{timeDisplay}</motion.span>
          <span className={styles.goldLabel}>Fastest final heat &middot; Gold</span>
        </div>
      </div>

      {/* Age counter */}
      <div ref={ageRef} className={styles.ageCounter}>
        <span className={styles.ageLabel}>Age</span>
        <span ref={ageValueRef} className={styles.ageValue}>25</span>
      </div>
    </div>
  );
}
