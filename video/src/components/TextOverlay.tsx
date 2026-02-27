import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";

interface TextOverlayProps {
  text: string;
  fontFamily: string;
  fontSize?: number;
  fontWeight?: number | string;
  delay?: number; // frames before text appears
  duration?: number; // frames the text is visible (defaults to remaining scene)
  color?: string;
  centered?: boolean; // if true, center on screen; otherwise bottom-center
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  fontFamily,
  fontSize = 56,
  fontWeight = 700,
  delay = 0,
  duration,
  color = "#FFFFFF",
  centered = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const effectiveDuration = duration ?? durationInFrames - delay;
  const localFrame = frame - delay;

  // Don't render before the delay
  if (localFrame < 0) return null;

  // Spring-based fade in
  const fadeIn = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 30,
      stiffness: 80,
      mass: 0.8,
    },
  });

  // Fade out near the end of the text's visible duration
  const fadeOutStart = effectiveDuration - 15; // start fading 15 frames before end
  const fadeOut = interpolate(
    localFrame,
    [fadeOutStart, effectiveDuration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const opacity = fadeIn * fadeOut;

  // Slight upward slide on entry
  const translateY = interpolate(fadeIn, [0, 1], [30, 0]);

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: centered ? undefined : 0,
        top: centered ? 0 : undefined,
        display: "flex",
        alignItems: centered ? "center" : "flex-end",
        justifyContent: "center",
        paddingBottom: centered ? 0 : 80,
        zIndex: 10,
        height: centered ? "100%" : undefined,
      }}
    >
      {/* Dark gradient backdrop */}
      {!centered && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 300,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          opacity,
          transform: `translateY(${translateY}px)`,
          fontFamily,
          fontSize,
          fontWeight,
          color,
          textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)",
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: "80%",
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </div>
    </div>
  );
};
