import React from "react";
import { AbsoluteFill } from "remotion";
import { VideoClip } from "../components/VideoClip";
import { TextOverlay } from "../components/TextOverlay";
import { archivoBlack } from "../fonts";

export const AthleteScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <VideoClip src="choi-scroll.webm" />
      <TextOverlay
        text="Choi Gaon"
        fontFamily={archivoBlack}
        fontSize={72}
        fontWeight={400}
        delay={20}
      />
    </AbsoluteFill>
  );
};
