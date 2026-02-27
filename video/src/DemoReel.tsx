import React from "react";
import { Series } from "remotion";
import { HookScene } from "./scenes/HookScene";
import { RevealScene } from "./scenes/RevealScene";
import { AthleteScene } from "./scenes/AthleteScene";
import { WowScene } from "./scenes/WowScene";
import { PunchScene } from "./scenes/PunchScene";
import { CloseScene } from "./scenes/CloseScene";

// Beat durations in frames (at 30fps)
export const BEATS = {
  hook: 90, //  3s — hub-view + "I don't know how to code."
  reveal: 300, // 10s — hughes-scroll + "So I built this."
  secondAthlete: 300, // 10s — choi-scroll + "Choi Gaon"
  wowMoment: 210, //  7s — slow-motion best viz moment
  punch: 90, //  3s — cut to black + "Two hours."
  close: 120, //  4s — hub-view + "Now I do. And so do you."
} as const;

export const TOTAL_FRAMES =
  BEATS.hook +
  BEATS.reveal +
  BEATS.secondAthlete +
  BEATS.wowMoment +
  BEATS.punch +
  BEATS.close; // = 1110 frames = 37s

export const DemoReel: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={BEATS.hook}>
        <HookScene />
      </Series.Sequence>

      <Series.Sequence durationInFrames={BEATS.reveal}>
        <RevealScene />
      </Series.Sequence>

      <Series.Sequence durationInFrames={BEATS.secondAthlete}>
        <AthleteScene />
      </Series.Sequence>

      <Series.Sequence durationInFrames={BEATS.wowMoment}>
        <WowScene />
      </Series.Sequence>

      <Series.Sequence durationInFrames={BEATS.punch}>
        <PunchScene />
      </Series.Sequence>

      <Series.Sequence durationInFrames={BEATS.close}>
        <CloseScene />
      </Series.Sequence>
    </Series>
  );
};
