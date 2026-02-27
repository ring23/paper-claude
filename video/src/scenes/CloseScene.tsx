import React from "react";
import { AbsoluteFill } from "remotion";
import { VideoClip } from "../components/VideoClip";
import { TextOverlay } from "../components/TextOverlay";
import { playfairDisplay } from "../fonts";

export const CloseScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <VideoClip src="hub-view.webm" />
      <TextOverlay
        text="Now I do. And so do you."
        fontFamily={playfairDisplay}
        fontSize={56}
        fontWeight={900}
        delay={15}
      />
    </AbsoluteFill>
  );
};
