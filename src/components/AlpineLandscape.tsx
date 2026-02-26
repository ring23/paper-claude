import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import type { SkyTheme } from "../types/viz";
import Snowfall from "./Snowfall";
import styles from "./AlpineLandscape.module.css";

interface Props {
  skyTheme?: SkyTheme | null;
  snowSpeed?: number;
}

export default function AlpineLandscape({ skyTheme, snowSpeed = 1 }: Props) {
  const mouseX = useMotionValue(0.5);

  useEffect(() => {
    const handler = (e: MouseEvent) =>
      mouseX.set(e.clientX / window.innerWidth);
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX]);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });

  const farX = useTransform(smoothX, [0, 1], [5, -5]);
  const midX = useTransform(smoothX, [0, 1], [12, -12]);
  const nearX = useTransform(smoothX, [0, 1], [20, -20]);

  return (
    <div
      className={styles.landscape}
      style={
        skyTheme
          ? ({
              "--sky-deep": skyTheme.deep,
              "--sky-mid": skyTheme.mid,
              "--sky-pale": skyTheme.pale,
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Sky gradient */}
      <div className={styles.sky} />

      {/* Aurora light sweep */}
      <div className={styles.aurora} />

      {/* Mountain layers — back to front, each in parallax wrapper */}
      <motion.div className={styles.mountainLayer} style={{ x: farX }}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
          <polygon
            points="0,620 80,560 160,590 240,530 320,570 400,500 480,540 560,480 640,520 720,460 800,510 880,470 960,520 1040,480 1120,530 1200,490 1280,540 1360,510 1440,560 1440,700 0,700"
            fill="var(--mountain-far)"
          />
        </svg>
      </motion.div>

      <motion.div className={styles.mountainLayer} style={{ x: midX }}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
          <polygon
            points="0,660 60,620 140,650 220,580 300,630 380,560 460,610 540,550 620,600 700,540 780,590 860,530 940,580 1020,520 1100,570 1180,530 1260,590 1340,550 1440,610 1440,700 0,700"
            fill="var(--mountain-mid)"
          />
        </svg>
      </motion.div>

      <motion.div className={styles.mountainLayer} style={{ x: nearX }}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
          <g className={styles.mountainNear}>
            <polygon
              points="0,690 100,640 180,670 260,620 340,660 420,600 500,650 580,610 660,660 740,610 820,650 900,600 980,650 1060,610 1140,650 1220,620 1300,660 1380,630 1440,660 1440,700 0,700"
              fill="var(--mountain-near)"
            />
          </g>
        </svg>
      </motion.div>

      {/* Snow field */}
      <div className={styles.snowField} />

      {/* Snowfall particles — key forces remount on speed change */}
      <Snowfall key={snowSpeed} speed={snowSpeed} />
    </div>
  );
}
