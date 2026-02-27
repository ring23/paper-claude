import React from "react";
import { AbsoluteFill } from "remotion";
import { VideoClip } from "../components/VideoClip";
import { TextOverlay } from "../components/TextOverlay";
import { spaceGrotesk } from "../fonts";

export const RevealScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <VideoClip src="hughes-scroll.webm" />
      <TextOverlay
        text="So I built this."
        fontFamily={spaceGrotesk}
        fontSize={56}
        fontWeight={700}
        delay={60} // appears ~2s in
      />
    </AbsoluteFill>
  );
};
