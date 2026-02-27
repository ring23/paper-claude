import React from "react";
import { AbsoluteFill } from "remotion";
import { VideoClip } from "../components/VideoClip";

export const WowScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <VideoClip
        src="hughes-scroll.webm"
        playbackRate={0.5}
        startFrom={150} // skip to an interesting section (~5s into the source)
      />
    </AbsoluteFill>
  );
};
