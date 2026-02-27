/**
 * record-scroll.ts
 *
 * Playwright script (NOT a test) that captures smooth screen recordings
 * of the Olympic scrollytelling app for use in a demo video.
 *
 * Usage:  npx tsx video/capture/record-scroll.ts
 *
 * Output:
 *   video/public/hub-view.webm
 *   video/public/hughes-scroll.webm
 *   video/public/choi-scroll.webm
 */

import { chromium, type Page, type BrowserContext } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const APP_URL = "https://paper-claude-9s43.vercel.app/";
const OUTPUT_DIR = path.resolve(__dirname, "..", "public");
const VIEWPORT = { width: 1920, height: 1080 };

// Timing constants (ms)
const PAGE_LOAD_SETTLE = 3000; // wait for orbit animation to settle
const HUB_CAPTURE_DURATION = 4000;
const TRANSITION_WAIT = 2000; // AnimatePresence enter
const SCROLL_DURATION = 15000; // cinematic scroll per athlete

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Sleep for the given number of milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Create a fresh BrowserContext configured for video recording.
 * Playwright assigns a random filename; we rename it afterward.
 */
async function createRecordingContext(
  browser: Awaited<ReturnType<typeof chromium.launch>>
): Promise<BrowserContext> {
  return browser.newContext({
    viewport: VIEWPORT,
    recordVideo: {
      dir: OUTPUT_DIR,
      size: VIEWPORT,
    },
    // Disable reduced-motion so all animations play
    reducedMotion: "no-preference",
  });
}

/**
 * Finalize a recording: close the context (which flushes the video),
 * then rename the temp file to the desired filename.
 */
async function saveRecording(
  context: BrowserContext,
  page: Page,
  desiredName: string
): Promise<void> {
  const videoHandle = page.video();
  if (!videoHandle) {
    console.error(`  [!] No video handle found for "${desiredName}". Skipping.`);
    return;
  }

  // Closing the context finalizes the video file
  await context.close();

  const tempPath = await videoHandle.path();
  if (!tempPath) {
    console.error(`  [!] Video path is null for "${desiredName}". Skipping.`);
    return;
  }

  const finalPath = path.join(OUTPUT_DIR, desiredName);

  // Rename temp file to desired name (overwrite if exists)
  if (fs.existsSync(finalPath)) {
    fs.unlinkSync(finalPath);
  }
  fs.renameSync(tempPath, finalPath);
  console.log(`  -> Saved ${finalPath}`);
}

/**
 * Smooth-scroll the story panel over the given duration using eased
 * cubic-bezier interpolation.  Executes entirely inside the browser
 * via page.evaluate.
 */
async function smoothScrollStory(page: Page, durationMs: number): Promise<void> {
  // Use string-based evaluate to avoid tsx __name injection into browser context
  await page.evaluate(`(async () => {
    var duration = ${durationMs};
    var container = document.documentElement;
    var candidates = document.querySelectorAll("*");
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var style = getComputedStyle(el);
      if (
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight + 50
      ) {
        container = el;
        break;
      }
    }
    var totalScroll = container.scrollHeight - container.clientHeight;
    if (totalScroll <= 0) return;
    var startTime = performance.now();
    await new Promise(function(resolve) {
      function step() {
        var elapsed = performance.now() - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        container.scrollTo(0, eased * totalScroll);
        if (progress < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  })()`);
}

/**
 * Click an athlete card in the orbit by matching the displayed last name.
 * The AvatarCard component renders the last name of the athlete.
 */
async function clickAthleteCard(page: Page, lastName: string): Promise<void> {
  console.log(`  Clicking athlete card: ${lastName}`);

  // The AvatarCard renders the last name in a <span> with class containing "name".
  // Click the span directly — the click bubbles up to the motion.div onClick handler.
  const nameSpan = page.locator("span").filter({ hasText: new RegExp(`^${lastName}$`) }).first();

  // Wait for the card to be visible (orbit may still be animating in)
  await nameSpan.waitFor({ state: "visible", timeout: 10000 });
  // Force click — the orbit cards float infinitely so they're never "stable"
  await nameSpan.click({ force: true });
}

// ---------------------------------------------------------------------------
// Main recording sequence
// ---------------------------------------------------------------------------

async function main() {
  ensureDir(OUTPUT_DIR);

  console.log("Launching Chromium...");
  const browser = await chromium.launch({
    headless: false, // headed mode gives smoother animations for recording
  });

  try {
    // -----------------------------------------------------------------------
    // 1. Hub view capture
    // -----------------------------------------------------------------------
    console.log("\n[1/3] Capturing hub view...");
    const hubCtx = await createRecordingContext(browser);
    const hubPage = await hubCtx.newPage();

    await hubPage.goto(APP_URL, { waitUntil: "networkidle" });
    console.log("  Waiting for page to settle...");
    await sleep(PAGE_LOAD_SETTLE);

    console.log(`  Recording hub view for ${HUB_CAPTURE_DURATION / 1000}s...`);
    await sleep(HUB_CAPTURE_DURATION);

    await saveRecording(hubCtx, hubPage, "hub-view.webm");

    // -----------------------------------------------------------------------
    // 2. Hughes scroll capture
    // -----------------------------------------------------------------------
    console.log("\n[2/3] Capturing Jack Hughes scroll...");
    const hughesCtx = await createRecordingContext(browser);
    const hughesPage = await hughesCtx.newPage();

    await hughesPage.goto(APP_URL, { waitUntil: "networkidle" });
    await sleep(PAGE_LOAD_SETTLE);

    await clickAthleteCard(hughesPage, "Hughes");
    console.log("  Waiting for story view transition...");
    await sleep(TRANSITION_WAIT);

    console.log(`  Smooth-scrolling for ${SCROLL_DURATION / 1000}s...`);
    await smoothScrollStory(hughesPage, SCROLL_DURATION);

    // Small pause at the end
    await sleep(500);

    await saveRecording(hughesCtx, hughesPage, "hughes-scroll.webm");

    // -----------------------------------------------------------------------
    // 3. Choi Gaon scroll capture
    // -----------------------------------------------------------------------
    console.log("\n[3/3] Capturing Choi Gaon scroll...");
    const choiCtx = await createRecordingContext(browser);
    const choiPage = await choiCtx.newPage();

    await choiPage.goto(APP_URL, { waitUntil: "networkidle" });
    await sleep(PAGE_LOAD_SETTLE);

    await clickAthleteCard(choiPage, "Gaon");
    console.log("  Waiting for story view transition...");
    await sleep(TRANSITION_WAIT);

    console.log(`  Smooth-scrolling for ${SCROLL_DURATION / 1000}s...`);
    await smoothScrollStory(choiPage, SCROLL_DURATION);

    // Small pause at the end
    await sleep(500);

    await saveRecording(choiCtx, choiPage, "choi-scroll.webm");

    // -----------------------------------------------------------------------
    // Done
    // -----------------------------------------------------------------------
    console.log("\nAll recordings saved to:", OUTPUT_DIR);
    console.log("Files:");
    for (const f of ["hub-view.webm", "hughes-scroll.webm", "choi-scroll.webm"]) {
      const fp = path.join(OUTPUT_DIR, f);
      if (fs.existsSync(fp)) {
        const stat = fs.statSync(fp);
        console.log(`  ${f}  (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
      } else {
        console.log(`  ${f}  [MISSING]`);
      }
    }
  } catch (err) {
    console.error("\nRecording failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
