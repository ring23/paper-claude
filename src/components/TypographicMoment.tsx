import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { TypographicMomentData } from "../types/story";
import styles from "./TypographicMoment.module.css";

interface Props {
  detail: TypographicMomentData;
  scrollerRef: React.RefObject<HTMLElement | null>;
}

export default function TypographicMoment({ detail, scrollerRef }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bigRef = useRef<HTMLSpanElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !scrollerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: scrollerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(bigRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0)
        .from(bigRef.current, { y: 30 }, 0)
        .to(unitRef.current, { opacity: 1, duration: 0.6 }, 0.3)
        .to(dividerRef.current, { opacity: 1, width: 48, duration: 0.5 }, 0.5)
        .to(contextRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.7)
        .from(contextRef.current, { y: 16 }, 0.7);
    },
    { dependencies: [detail, scrollerRef], scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className={styles.section}>
      <span ref={bigRef} className={styles.bigNumber}>
        {detail.bigNumber}
      </span>
      <span ref={unitRef} className={styles.unit}>
        {detail.unit}
      </span>
      <div ref={dividerRef} className={styles.divider} />
      <p
        ref={contextRef}
        className={styles.context}
        dangerouslySetInnerHTML={{ __html: detail.context }}
      />
    </div>
  );
}
