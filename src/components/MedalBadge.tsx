import styles from "./MedalBadge.module.css";

export default function MedalBadge({ medal }: { medal: string }) {
  return (
    <div className={styles.badge}>
      <div className={styles.icon}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 1l2.47 5.01L17 6.87l-4 3.9.94 5.5L9 13.77l-4.94 2.5.94-5.5-4-3.9 5.53-.86L9 1z"
            fill="var(--gold)"
          />
        </svg>
      </div>
      <span className={styles.label}>{medal.toUpperCase()} MEDAL</span>
    </div>
  );
}
