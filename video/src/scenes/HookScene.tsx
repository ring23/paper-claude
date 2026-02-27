import React from "react";
import { AbsoluteFill } from "remotion";
import { VideoClip } from "../components/VideoClip";
import { TextOverlay } from "../components/TextOverlay";
import { playfairDisplay } from "../fonts";

export const HookScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <VideoClip src="hub-view.webm" />
      <TextOverlay
        text="I don't know how to code."
        fontFamily={playfairDisplay}
        fontSize={64}
        fontWeight={900}
        delay={10}
      />
    </AbsoluteFill>
  );
};
