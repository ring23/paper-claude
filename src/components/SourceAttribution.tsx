import { useState } from "react";
import type { DataSource } from "../types/viz";
import styles from "./SourceAttribution.module.css";

interface Props {
  sources: DataSource[];
}

export default function SourceAttribution({ sources }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.trigger}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Hide sources" : "Sources"}
      </button>
      {expanded && (
        <div className={styles.list}>
          {sources.map((s) => (
            <a
              key={s.url}
              className={styles.link}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
