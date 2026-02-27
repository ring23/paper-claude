import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { TypographicMomentData } from "../types/story";
import styles from "./TypographicMoment.module.css";

interface Props {
  detail: TypographicMomentData;
  scrollerRef: React.RefObject<HTMLElement | null>;
}

const variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
} as const;
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};
const widthGrow = {
  hidden: { opacity: 0, width: 0 },
  visible: { opacity: 1, width: 48, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function TypographicMoment({ detail, scrollerRef }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    root: scrollerRef,
    margin: "-40% 0px 0px 0px",
    once: true,
  });

  return (
    <motion.div
      ref={sectionRef}
      className={styles.section}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.span variants={fadeUp} className={styles.bigNumber}>
        {detail.bigNumber}
      </motion.span>
      <motion.span variants={fadeIn} className={styles.unit}>
        {detail.unit}
      </motion.span>
      <motion.div variants={widthGrow} className={styles.divider} />
      <motion.p
        variants={fadeUp}
        className={styles.context}
        dangerouslySetInnerHTML={{ __html: detail.context }}
      />
    </motion.div>
  );
}
