import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadArchivoBlack } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: playfairDisplay } = loadPlayfairDisplay("normal", {
  weights: ["900"],
});

export const { fontFamily: archivoBlack } = loadArchivoBlack("normal", {
  weights: ["400"],
});

export const { fontFamily: spaceGrotesk } = loadSpaceGrotesk("normal", {
  weights: ["300", "700"],
});

export const { fontFamily: inter } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
});
