import styles from "./OlympicRings.module.css";

export default function OlympicRings({ size = "lg" }: { size?: "lg" | "sm" }) {
  const scale = size === "sm" ? 0.45 : 1;
  const w = 200 * scale;
  const h = 95 * scale;

  return (
    <div className={styles.wrapper}>
      <div className={styles.glow} style={{ width: w * 1.5, height: h * 1.5 }} />
      <svg width={w} height={h} viewBox="0 0 200 95">
        <circle cx="65" cy="37" r="25" fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.5" />
        <circle cx="100" cy="37" r="25" fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.5" />
        <circle cx="135" cy="37" r="25" fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.5" />
        <circle cx="82" cy="57" r="25" fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.5" />
        <circle cx="117" cy="57" r="25" fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  );
}
