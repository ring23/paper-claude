import type { Athlete } from "../data/athletes";
import AvatarCard from "./AvatarCard";
import OlympicRings from "./OlympicRings";
import styles from "./MiniHub.module.css";

interface Props {
  athletes: Athlete[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function MiniHub({ athletes, activeId, onSelect, onClose }: Props) {
  return (
    <div className={styles.miniHub} onClick={onClose}>
      <div className={styles.header} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>FIRST LIGHT</h2>
        <p className={styles.subtitle}>THE PODIUM</p>
      </div>

      <OlympicRings size="sm" />

      <div className={styles.grid} onClick={(e) => e.stopPropagation()}>
        {athletes.map((athlete) => (
          <AvatarCard
            key={athlete.id}
            athlete={athlete}
            size="sm"
            isActive={athlete.id === activeId}
            isDimmed={athlete.id !== activeId}
            onClick={() => onSelect(athlete.id)}
          />
        ))}
      </div>
    </div>
  );
}
