import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { spaceGrotesk } from "../fonts";

const ALPINE_NAVY = "#0B1D3A";

export const PunchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for dramatic text entrance
  const scaleSpring = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 120,
      mass: 0.6,
    },
  });

  const opacity = interpolate(scaleSpring, [0, 1], [0, 1]);
  const scale = interpolate(scaleSpring, [0, 1], [0.85, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ALPINE_NAVY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: spaceGrotesk,
          fontSize: 80,
          fontWeight: 700,
          color: "#FFFFFF",
          opacity,
          transform: `scale(${scale})`,
          letterSpacing: "-0.02em",
        }}
      >
        Two hours.
      </div>
    </AbsoluteFill>
  );
};
