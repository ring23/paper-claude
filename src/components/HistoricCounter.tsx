import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import styles from "./HistoricCounter.module.css";

interface Props {
  value: string;
  unit: string;
  context: string;
}

function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

export default function HistoricCounter({ value, unit, context }: Props) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const numeric = isNumeric(value);

  useEffect(() => {
    if (numeric) {
      const target = parseInt(value, 10);
      motionVal.set(0);
      const controls = animate(motionVal, target, {
        duration: 1.5,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [value, numeric, motionVal]);

  return (
    <div className={styles.counter}>
      <div className={styles.row}>
        {numeric ? (
          <motion.span className={styles.number}>{rounded}</motion.span>
        ) : (
          <span className={styles.number}>{value}</span>
        )}
        <div className={styles.unitBlock}>
          <span className={styles.unit}>{unit}</span>
          <span className={styles.context}>{context}</span>
        </div>
      </div>
    </div>
  );
}
