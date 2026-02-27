import React from "react";
import { OffthreadVideo, staticFile, Sequence } from "remotion";

interface VideoClipProps {
  src: string; // filename in public/, e.g. "hub-view.webm"
  playbackRate?: number; // defaults to 1, use 0.5 for slow-motion
  startFrom?: number; // frame offset into the source video to begin playing
  style?: React.CSSProperties;
}

export const VideoClip: React.FC<VideoClipProps> = ({
  src,
  playbackRate = 1,
  startFrom = 0,
  style,
}) => {
  const video = (
    <OffthreadVideo
      src={staticFile(src)}
      playbackRate={playbackRate}
      style={{
        width: 1920,
        height: 1080,
        objectFit: "cover",
        ...style,
      }}
    />
  );

  // Use a Sequence with negative `from` to skip into the source video
  if (startFrom > 0) {
    return (
      <Sequence from={-startFrom} layout="none">
        {video}
      </Sequence>
    );
  }

  return video;
};
