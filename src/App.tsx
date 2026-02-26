import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { athletes } from "./data/athletes";
import AlpineLandscape from "./components/AlpineLandscape";
import HubView from "./components/HubView";
import StoryView from "./components/StoryView";

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedAthlete = selectedId
    ? athletes.find((a) => a.id === selectedId) ?? null
    : null;

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AlpineLandscape
        skyTheme={selectedAthlete?.skyTheme ?? null}
        snowSpeed={selectedAthlete ? 0.3 : 1}
      />
      <AnimatePresence mode="wait">
        {selectedAthlete ? (
          <StoryView
            key="story"
            athlete={selectedAthlete}
            athletes={athletes}
            onSelect={handleSelect}
            onClose={handleClose}
          />
        ) : (
          <HubView
            key="hub"
            athletes={athletes}
            onSelect={handleSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
