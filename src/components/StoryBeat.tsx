import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StoryBeatData } from "../types/story";
import styles from "./StoryBeat.module.css";

interface Props {
  beat: StoryBeatData;
  index: number;
  onActivate: (beat: StoryBeatData) => void;
  scrollerRef: React.RefObject<HTMLElement | null>;
}

export default function StoryBeat({ beat, onActivate, scrollerRef }: Props) {
  const stepRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stepRef.current || !scrollerRef.current) return;

      ScrollTrigger.create({
        trigger: stepRef.current,
        scroller: scrollerRef.current,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => onActivate(beat),
        onEnterBack: () => onActivate(beat),
      });
    },
    { dependencies: [beat, scrollerRef], scope: stepRef },
  );

  return (
    <div ref={stepRef} className={styles.step}>
      <div className={styles.card}>
        {beat.narration.label && (
          <p className={styles.label}>{beat.narration.label}</p>
        )}
        <p
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: beat.narration.text }}
        />
        {beat.narration.subtext && (
          <p className={styles.subtext}>{beat.narration.subtext}</p>
        )}
      </div>
    </div>
  );
}
