import { motion } from "framer-motion";
import type { Athlete } from "../data/athletes";
import AvatarCard from "./AvatarCard";
import styles from "./AthleteOrbit.module.css";

// 6 avatars evenly spaced on an ellipse
// Wider and taller to avoid label/circle overlap between rows
const RX = 320;
const RY = 170;
const startAngle = -90;
const ellipsePositions = Array.from({ length: 6 }, (_, i) => {
  const angle = ((startAngle + i * 60) * Math.PI) / 180;
  return { x: Math.round(RX * Math.cos(angle)), y: Math.round(RY * Math.sin(angle)) };
});
// [0]=top, [1]=upper-right, [2]=lower-right, [3]=bottom, [4]=lower-left, [5]=upper-left

// Map data array order → ellipse position index
// Data: [Braathen, Hughes, Liu, Meyers-Taylor, Klaebo, Choi]
const orbitOrder = [0, 5, 1, 4, 3, 2];

// Prime-number-based periods to avoid synchronisation between avatars
const periods = [
  { yDur: 3.7, xDur: 7.1, rotDur: 5.3, yAmp: 6, xAmp: 2 },
  { yDur: 4.1, xDur: 6.7, rotDur: 4.7, yAmp: 5, xAmp: 1.5 },
  { yDur: 3.3, xDur: 7.9, rotDur: 5.9, yAmp: 7, xAmp: 2.5 },
  { yDur: 4.3, xDur: 6.3, rotDur: 5.1, yAmp: 4, xAmp: 1.8 },
  { yDur: 3.9, xDur: 7.3, rotDur: 4.3, yAmp: 5.5, xAmp: 2.2 },
  { yDur: 4.7, xDur: 6.1, rotDur: 5.7, yAmp: 6.5, xAmp: 1.6 },
];

interface Props {
  athletes: Athlete[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

export default function AthleteOrbit({ athletes, selectedId, onSelect }: Props) {
  return (
    <div className={styles.orbit}>
      {athletes.map((athlete, i) => {
        const pos = ellipsePositions[orbitOrder[i]];
        const p = periods[i];
        // Upper row gets higher z-index so labels aren't hidden behind lower row circles
        const zIndex = 10 - Math.round(pos.y / 50);

        const isSelected = selectedId === athlete.id;
        const hasSelection = selectedId != null;

        // Calculate outward drift direction for non-selected scatter
        const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y) || 1;
        const driftX = (pos.x / dist) * 20;
        const driftY = (pos.y / dist) * 20;

        const scatterAnimate = isSelected
          ? { scale: 1, opacity: 1, x: pos.x, y: pos.y, rotate: 0 }
          : {
              scale: 0.9,
              opacity: 0.4,
              x: pos.x + driftX,
              y: pos.y + driftY,
              rotate: 0,
            };

        const floatAnimate = {
          scale: 1,
          opacity: 1,
          y: [pos.y, pos.y - p.yAmp, pos.y],
          x: [pos.x - p.xAmp, pos.x + p.xAmp, pos.x - p.xAmp],
          rotate: [0, 1.5, 0, -1.5, 0],
        };

        const scatterTransition = {
          type: "spring" as const,
          stiffness: 200,
          damping: 20,
        };

        const floatTransition = {
          scale: { delay: 0.4 + i * 0.08, type: "spring", stiffness: 200, damping: 15 },
          opacity: { delay: 0.4 + i * 0.08, duration: 0.3 },
          y: { delay: 1 + i * 0.3, duration: p.yDur, repeat: Infinity, ease: "easeInOut" },
          x: { delay: 1 + i * 0.3, duration: p.xDur, repeat: Infinity, ease: "easeInOut" },
          rotate: { delay: 1 + i * 0.3, duration: p.rotDur, repeat: Infinity, ease: "easeInOut" },
        };

        return (
          <motion.div
            key={athlete.id}
            className={styles.slot}
            style={{ zIndex }}
            initial={{ scale: 0, opacity: 0, x: pos.x, y: pos.y }}
            animate={hasSelection ? scatterAnimate : floatAnimate}
            transition={hasSelection ? scatterTransition : floatTransition}
          >
            {/* Inner wrapper centers the card on the position point */}
            <div className={styles.slotCenter}>
              <AvatarCard
                athlete={athlete}
                size="lg"
                onClick={() => onSelect(athlete.id)}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
