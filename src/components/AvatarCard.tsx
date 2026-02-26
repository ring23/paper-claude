import { motion } from "framer-motion";
import type { Athlete } from "../data/athletes";
import styles from "./AvatarCard.module.css";

interface Props {
  athlete: Athlete;
  size?: "lg" | "sm";
  isActive?: boolean;
  isDimmed?: boolean;
  hideLabels?: boolean;
  onClick?: () => void;
}

export default function AvatarCard({
  athlete,
  size = "lg",
  isActive = false,
  isDimmed = false,
  hideLabels = false,
  onClick,
}: Props) {
  const circlePx = size === "lg" ? 120 : 56;
  const innerPx = size === "lg" ? 114 : 52;
  const fontSize = size === "lg" ? 44 : 20;
  const ringWidth = size === "lg" ? 3 : 2;

  const ringBg = isActive
    ? `linear-gradient(135deg, var(--gold), var(--gold-light))`
    : `linear-gradient(135deg, ${athlete.colors.primary}, ${athlete.colors.secondary})`;

  return (
    <motion.div
      className={styles.card}
      style={{ opacity: isDimmed ? 0.4 : 1, cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.08 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        layoutId={`avatar-${athlete.id}`}
        layout
        transition={{
          layout: { type: "spring", stiffness: 280, damping: 30, mass: 0.8 },
        }}
        className={styles.ring}
        style={{
          width: circlePx,
          height: circlePx,
          borderRadius: circlePx / 2,
          background: ringBg,
          padding: ringWidth,
        }}
      >
        <div
          className={styles.inner}
          style={{
            width: innerPx,
            height: innerPx,
            borderRadius: innerPx / 2,
          }}
        >
          {athlete.avatar ? (
            <img
              src={athlete.avatar}
              alt={athlete.name}
              className={styles.avatarImg}
              style={{ width: innerPx, height: innerPx, borderRadius: innerPx / 2 }}
            />
          ) : (
            <span
              className={styles.initial}
              style={{ fontSize }}
            >
              {athlete.initial}
            </span>
          )}
        </div>
      </motion.div>
      {!hideLabels && size === "lg" && (
        <div className={styles.labels}>
          <span className={styles.name}>{athlete.name.split(" ").pop()}</span>
          <span className={styles.sport}>{athlete.sport}</span>
        </div>
      )}
      {!hideLabels && size === "sm" && (
        <span className={styles.miniName}>
          {athlete.name.split(" ").pop()}
        </span>
      )}
    </motion.div>
  );
}
