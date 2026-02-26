import { motion } from "framer-motion";
import { useMemo } from "react";

interface Flake {
  id: number;
  x: number;
  depth: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
  blur: number;
}

function generateFlakes(count: number): Flake[] {
  return Array.from({ length: count }, (_, i) => {
    // Distribute depth: ~60% background (0-0.3), ~30% mid (0.3-0.7), ~10% foreground (0.7-1.0)
    const roll = Math.random();
    let depth: number;
    if (roll < 0.6) {
      depth = Math.random() * 0.3;
    } else if (roll < 0.9) {
      depth = 0.3 + Math.random() * 0.4;
    } else {
      depth = 0.7 + Math.random() * 0.3;
    }

    return {
      id: i,
      x: Math.random() * 100,
      depth,
      size: 1 + depth * 4,
      opacity: 0.15 + depth * 0.6,
      duration: 18 - depth * 12,
      delay: Math.random() * 10,
      drift: (-20 + Math.random() * 40) * (0.5 + depth * 0.5),
      blur: depth < 0.3 ? 1 : 0,
    };
  });
}

interface SnowfallProps {
  speed?: number;
}

export default function Snowfall({ speed = 1 }: SnowfallProps) {
  const flakes = useMemo(() => generateFlakes(40), []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {flakes.map((f) => (
        <motion.div
          key={f.id}
          style={{
            position: "absolute",
            left: `${f.x}%`,
            top: -10,
            width: f.size,
            height: f.size,
            borderRadius: "50%",
            background: "white",
            opacity: f.opacity,
            ...(f.blur > 0 ? { filter: `blur(${f.blur}px)` } : {}),
          }}
          animate={{
            y: [0, window.innerHeight + 20],
            x: [0, f.drift],
          }}
          transition={{
            duration: f.duration / speed,
            delay: f.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
