import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { Athlete } from "../../../data/athletes";
import type { KlaeboVizState } from "../../../types/story";
import styles from "./KlaeboVizRenderer.module.css";

interface Props {
  state: KlaeboVizState;
  athlete: Athlete;
}

const MILANO_EVENTS = [
  "Skiathlon",
  "Sprint Classic",
  "10km Free",
  "Relay",
  "Team Sprint",
  "50km Mass",
];

function spawnParticles(container: HTMLDivElement, colors: string[]) {
  container.innerHTML = "";

  for (let i = 0; i < 60; i++) {
    const p = document.createElement("div");
    p.className = styles.particle;

    const size = 3 + Math.random() * 6;
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 350;

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

export default function KlaeboVizRenderer({ state, athlete }: Props) {
  const particlesRef = useRef<HTMLDivElement>(null);
  const prevDisplayRef = useRef<string | null>(null);
  const prevBurstRef = useRef(false);

  // Framer Motion animated gold counter
  const goldMotion = useMotionValue(0);
  const goldDisplay = useTransform(goldMotion, (v) => Math.round(v).toString());

  // Fuse timeline refs
  const fuseNode1Ref = useRef<HTMLDivElement>(null);
  const fuseNode2Ref = useRef<HTMLDivElement>(null);
  const fuseNode3Ref = useRef<HTMLDivElement>(null);
  const fuseLabel1Ref = useRef<HTMLSpanElement>(null);
  const fuseLabel2Ref = useRef<HTMLSpanElement>(null);
  const fuseLabel3Ref = useRef<HTMLSpanElement>(null);
  const fuseFill1Ref = useRef<HTMLDivElement>(null);
  const fuseFill2Ref = useRef<HTMLDivElement>(null);

  // Event slot medal refs (6 slots)
  const medalRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const starRefs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ];
  const eventNameRefs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ];

  // Center display refs
  const introRef = useRef<HTMLDivElement>(null);
  const pyeongchangRef = useRef<HTMLDivElement>(null);
  const beijingRef = useRef<HTMLDivElement>(null);
  const milanoRef = useRef<HTMLDivElement>(null);
  const recordTieRef = useRef<HTMLDivElement>(null);
  const recordBreakRef = useRef<HTMLDivElement>(null);
  const careerTotalRef = useRef<HTMLDivElement>(null);

  // Leaderboard refs
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const barKlaeboRef = useRef<HTMLDivElement>(null);
  const barLegendRef = useRef<HTMLDivElement>(null);
  const barHeidenRef = useRef<HTMLDivElement>(null);

  // Imperative state transitions — CSS transitions handle interpolation
  useEffect(() => {
    const displayEls: Record<string, HTMLDivElement | null> = {
      intro: introRef.current,
      pyeongchang: pyeongchangRef.current,
      beijing: beijingRef.current,
      "milano-progress": milanoRef.current,
      "record-tie": recordTieRef.current,
      "record-break": recordBreakRef.current,
      "career-total": careerTotalRef.current,
    };

    // Skip if same display state
    if (state.centerDisplay === prevDisplayRef.current) {
      // Still update event slots and fuse even if center display hasn't changed
    } else {
      prevDisplayRef.current = state.centerDisplay;

      // Hide all center display states
      Object.values(displayEls).forEach((el) => {
        if (el) el.style.opacity = "0";
      });

      // Show the active display
      const activeEl = displayEls[state.centerDisplay];
      if (activeEl) activeEl.style.opacity = "1";

      // Animate gold counter for various display states
      switch (state.centerDisplay) {
        case "pyeongchang":
          goldMotion.set(0);
          animate(goldMotion, 3, { duration: 1.2, ease: "easeOut" });
          break;
        case "beijing":
          goldMotion.set(3);
          animate(goldMotion, 5, { duration: 1, ease: "easeOut" });
          break;
        case "milano-progress":
          goldMotion.set(0);
          animate(goldMotion, state.milanoGoldsLit, {
            duration: 1,
            ease: "easeOut",
          });
          break;
        case "record-tie":
          goldMotion.set(4);
          animate(goldMotion, 5, { duration: 0.8, ease: "easeOut" });
          break;
        case "record-break":
          goldMotion.set(5);
          animate(goldMotion, 6, { duration: 1.5, ease: "easeOut" });
          break;
        case "career-total":
          goldMotion.set(0);
          animate(goldMotion, 11, { duration: 2, ease: "easeOut" });
          break;
      }
    }

    // --- Fuse progress ---
    const fuseNodes = [fuseNode1Ref, fuseNode2Ref, fuseNode3Ref];
    const fuseLabels = [fuseLabel1Ref, fuseLabel2Ref, fuseLabel3Ref];
    const fuseFills = [fuseFill1Ref, fuseFill2Ref];

    fuseNodes.forEach((ref, i) => {
      const el = ref.current;
      const label = fuseLabels[i].current;
      if (!el || !label) return;

      const reachedIndex = i + 1; // node 1 = Olympics 1 (2018), etc.
      if (state.fuseProgress >= reachedIndex) {
        el.style.borderColor = "#C6982B";
        el.style.background = "linear-gradient(135deg, #C6982B 0%, #E4C45A 100%)";
        el.style.color = "#070D18";
        el.style.boxShadow = "0 0 20px rgba(198, 152, 43, 0.35)";
        label.style.color = "#E4C45A";
      } else {
        el.style.borderColor = "var(--slate, #3D5A73)";
        el.style.background = "transparent";
        el.style.color = "var(--slate, #3D5A73)";
        el.style.boxShadow = "none";
        label.style.color = "#6B7D8D";
      }
    });

    fuseFills.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;
      const needed = i + 1; // fill 0 connects node 1-2, fill 1 connects node 2-3
      el.style.width = state.fuseProgress > needed ? "100%" : "0%";
    });

    // --- Event slots ---
    medalRefs.forEach((ref, i) => {
      const el = ref.current;
      const star = starRefs[i].current;
      const name = eventNameRefs[i].current;
      if (!el || !star || !name) return;

      if (i < state.milanoGoldsLit) {
        el.style.borderColor = "#C6982B";
        el.style.background = "linear-gradient(135deg, #C6982B 0%, #E4C45A 100%)";
        el.style.boxShadow = "0 0 16px rgba(198, 152, 43, 0.4)";
        el.style.transform = "scale(1)";
        star.style.opacity = "1";
        name.style.color = "#E4C45A";
      } else {
        el.style.borderColor = "rgba(61, 90, 115, 0.3)";
        el.style.background = "transparent";
        el.style.boxShadow = "none";
        el.style.transform = "scale(1)";
        star.style.opacity = "0";
        name.style.color = "#6B7D8D";
      }
    });

    // --- Leaderboard ---
    if (state.showLeaderboard && leaderboardRef.current) {
      leaderboardRef.current.style.opacity = "1";
      // Stagger bar fills
      setTimeout(() => {
        if (barKlaeboRef.current) barKlaeboRef.current.style.width = "100%";
      }, 400);
      setTimeout(() => {
        if (barLegendRef.current) barLegendRef.current.style.width = "72.7%"; // 8/11
      }, 550);
      setTimeout(() => {
        if (barHeidenRef.current) barHeidenRef.current.style.width = "45.4%"; // 5/11
      }, 700);
    }

    if (!state.showLeaderboard && leaderboardRef.current) {
      leaderboardRef.current.style.opacity = "0";
      if (barKlaeboRef.current) barKlaeboRef.current.style.width = "0";
      if (barLegendRef.current) barLegendRef.current.style.width = "0";
      if (barHeidenRef.current) barHeidenRef.current.style.width = "0";
    }
  }, [
    state.centerDisplay,
    state.fuseProgress,
    state.milanoGoldsLit,
    state.showLeaderboard,
    goldMotion,
  ]);

  // Particle burst — fire only on transition to true
  useEffect(() => {
    if (state.particleBurst && !prevBurstRef.current && particlesRef.current) {
      spawnParticles(particlesRef.current, [athlete.colors.primary, athlete.colors.secondary, "#E4C45A", "#FFFFFF"]);
    }
    prevBurstRef.current = state.particleBurst;
  }, [state.particleBurst, athlete.colors.primary, athlete.colors.secondary]);

  return (
    <div className={styles.container}>
      <div ref={particlesRef} className={styles.particlesContainer} />

      {/* Fuse timeline */}
      <div className={styles.fuseTimeline}>
        <div className={styles.fuseNode}>
          <div ref={fuseNode1Ref} className={styles.fuseCircle}>
            3
          </div>
          <span ref={fuseLabel1Ref} className={styles.fuseLabel}>
            2018
          </span>
        </div>
        <div className={styles.fuseLineWrap}>
          <div ref={fuseFill1Ref} className={styles.fuseFill} />
        </div>
        <div className={styles.fuseNode}>
          <div ref={fuseNode2Ref} className={styles.fuseCircle}>
            2
          </div>
          <span ref={fuseLabel2Ref} className={styles.fuseLabel}>
            2022
          </span>
        </div>
        <div className={styles.fuseLineWrap}>
          <div ref={fuseFill2Ref} className={styles.fuseFill} />
        </div>
        <div className={styles.fuseNode}>
          <div ref={fuseNode3Ref} className={styles.fuseCircle}>
            6
          </div>
          <span ref={fuseLabel3Ref} className={styles.fuseLabel}>
            2026
          </span>
        </div>
      </div>

      {/* Event slots */}
      <div className={styles.eventSlots}>
        {MILANO_EVENTS.map((name, i) => (
          <div key={name} className={styles.eventSlot}>
            <div ref={medalRefs[i]} className={styles.eventMedal}>
              <span ref={starRefs[i]} className={styles.eventMedalStar}>
                &#9733;
              </span>
            </div>
            <span ref={eventNameRefs[i]} className={styles.eventName}>
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* Center display */}
      <div className={styles.centerDisplay}>
        {/* Intro */}
        <div
          ref={introRef}
          className={`${styles.displayState} ${styles.displayIntro}`}
        >
          <span className={styles.introBig}>6 EVENTS</span>
          <span className={styles.introSub}>
            Cross-country skiing &middot; Milano Cortina
          </span>
        </div>

        {/* PyeongChang */}
        <div
          ref={pyeongchangRef}
          className={`${styles.displayState} ${styles.displayGamesCount}`}
        >
          <motion.span className={styles.gamesCountNumber}>
            {goldDisplay}
          </motion.span>
          <span className={styles.gamesCountLabel}>
            Golds &middot; PyeongChang
          </span>
        </div>

        {/* Beijing */}
        <div
          ref={beijingRef}
          className={`${styles.displayState} ${styles.displayGamesCount}`}
        >
          <motion.span className={styles.gamesCountNumber}>
            {goldDisplay}
          </motion.span>
          <span className={styles.gamesCountLabel}>
            Career golds &middot; Beijing
          </span>
        </div>

        {/* Milano progress */}
        <div
          ref={milanoRef}
          className={`${styles.displayState} ${styles.displayMilano}`}
        >
          <motion.span className={styles.milanoGoldCount}>
            {goldDisplay}
          </motion.span>
          <span className={styles.milanoLabel}>Milano golds</span>
        </div>

        {/* Record tie */}
        <div
          ref={recordTieRef}
          className={`${styles.displayState} ${styles.displayRecordTie}`}
        >
          <motion.span className={styles.recordTieNumber}>
            {goldDisplay}
          </motion.span>
          <span className={styles.recordTieLabel}>
            Heiden&rsquo;s record &middot; Tied
          </span>
          <span className={styles.recordTieSub}>1980 Lake Placid</span>
        </div>

        {/* Record break */}
        <div
          ref={recordBreakRef}
          className={`${styles.displayState} ${styles.displayRecordBreak}`}
        >
          <motion.span className={styles.recordBreakNumber}>
            {goldDisplay}
          </motion.span>
          <span className={styles.recordBreakLabel}>
            New record &middot; Broken
          </span>
        </div>

        {/* Career total */}
        <div
          ref={careerTotalRef}
          className={`${styles.displayState} ${styles.displayCareerTotal}`}
        >
          <motion.span className={styles.careerTotalNumber}>
            {goldDisplay}
          </motion.span>
          <span className={styles.careerTotalLabel}>
            Career Olympic golds
          </span>
        </div>
      </div>

      {/* Leaderboard */}
      <div ref={leaderboardRef} className={styles.leaderboard}>
        <div className={styles.leaderRow}>
          <span className={styles.leaderName}>Klaebo</span>
          <div className={styles.leaderBarTrack}>
            <div
              ref={barKlaeboRef}
              className={`${styles.leaderBarFill} ${styles.barKlaebo}`}
            >
              <span className={styles.leaderCount}>11</span>
            </div>
          </div>
        </div>
        <div className={styles.leaderRow}>
          <span className={styles.leaderName}>
            D&aelig;hlie / Bj&oslash;rgen / Bj&oslash;rndalen
          </span>
          <div className={styles.leaderBarTrack}>
            <div
              ref={barLegendRef}
              className={`${styles.leaderBarFill} ${styles.barLegend}`}
            >
              <span className={styles.leaderCount}>8</span>
            </div>
          </div>
        </div>
        <div className={styles.leaderRow}>
          <span className={styles.leaderName}>Heiden</span>
          <div className={styles.leaderBarTrack}>
            <div
              ref={barHeidenRef}
              className={`${styles.leaderBarFill} ${styles.barHeiden}`}
            >
              <span className={styles.leaderCount}>5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
