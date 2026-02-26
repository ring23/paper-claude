import { motion } from "framer-motion";
import styles from "./TitleLockup.module.css";

export default function TitleLockup() {
  return (
    <motion.div
      className={styles.lockup}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className={styles.title}>FIRST LIGHT</h1>
      <p className={styles.subtitle}>THE PODIUM</p>
      <p className={styles.location}>Milano Cortina 2026</p>
    </motion.div>
  );
}
