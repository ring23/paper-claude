import React from "react";
import { Composition } from "remotion";
import { DemoReel, TOTAL_FRAMES } from "./DemoReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoReel"
        component={DemoReel}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
