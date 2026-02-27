import { test, expect } from "@playwright/test";

test.describe("Choi Scrollytelling Animations", () => {
  test("diagnose why ScrollTrigger callbacks don't fire", async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    await page.goto("/");
    await page.waitForTimeout(2000);

    // Click Choi
    await page.getByText("Gaon").first().click();
    await page.waitForTimeout(2000);

    // Check if useGSAP / useEffect ran in StoryBeat by checking for GSAP inline styles
    const cardDiag = await page.evaluate(() => {
      // Find all elements with backdrop-filter (these are the beat cards)
      const cards: Array<{
        text: string;
        inlineStyle: string;
        computedOpacity: string;
        hasGsapTransform: boolean;
      }> = [];

      document.querySelectorAll("div").forEach((div) => {
        const style = window.getComputedStyle(div);
        if (style.backdropFilter && style.backdropFilter !== "none") {
          const text = div.innerText?.substring(0, 40) || "";
          if (text.length > 5) {
            cards.push({
              text,
              inlineStyle: div.getAttribute("style") || "NONE",
              computedOpacity: style.opacity,
              hasGsapTransform: (div.getAttribute("style") || "").includes("translate"),
            });
          }
        }
      });

      return cards;
    });
    console.log("=== CARD INLINE STYLES ===");
    console.log(JSON.stringify(cardDiag, null, 2));

    // Check ScrollTrigger instance count by looking at GSAP's internal state
    const gsapDiag = await page.evaluate(() => {
      // Try to access GSAP from the module scope via a hack:
      // Look for elements that have data-scroll-trigger attributes (GSAP adds these)
      const scrollTriggerPins: string[] = [];
      document.querySelectorAll("[data-scroll-trigger-id]").forEach((el) => {
        scrollTriggerPins.push(el.className.substring(0, 50));
      });

      // Check for .pin-spacer elements (GSAP creates these for pinned ScrollTriggers)
      const pinSpacers = document.querySelectorAll(".pin-spacer");

      // Check for any elements with gsap-related data attributes
      const gsapAttrs: string[] = [];
      document.querySelectorAll("*").forEach((el) => {
        const attrs = el.attributes;
        for (let i = 0; i < attrs.length; i++) {
          if (attrs[i].name.startsWith("data-") && attrs[i].name.includes("scroll")) {
            gsapAttrs.push(`${el.tagName}.${el.className.substring(0, 30)}: ${attrs[i].name}=${attrs[i].value}`);
          }
        }
      });

      // Check if any element has transform set via inline style (GSAP signature)
      const gsapTransforms: string[] = [];
      document.querySelectorAll("*").forEach((el) => {
        const inlineStyle = el.getAttribute("style");
        if (inlineStyle && (inlineStyle.includes("translate") || inlineStyle.includes("opacity"))) {
          const text = (el as HTMLElement).innerText?.substring(0, 30) || "";
          gsapTransforms.push(
            `${el.tagName} text="${text}" style="${inlineStyle.substring(0, 100)}"`,
          );
        }
      });

      return {
        scrollTriggerPins,
        pinSpacerCount: pinSpacers.length,
        gsapAttrs,
        gsapTransforms: gsapTransforms.slice(0, 20),
      };
    });
    console.log("\n=== GSAP DIAGNOSTICS ===");
    console.log(JSON.stringify(gsapDiag, null, 2));

    // Now check the scrollerRef situation — is it actually accessible?
    const scrollerDiag = await page.evaluate(() => {
      // The scroller is the element with overflow-y: auto
      const allEls = document.querySelectorAll("*");
      let scroller: Element | null = null;
      for (const el of allEls) {
        const style = window.getComputedStyle(el);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight + 10
        ) {
          scroller = el;
          break;
        }
      }
      if (!scroller) return { found: false };

      // Check if it has the Framer Motion transform
      const transform = window.getComputedStyle(scroller).transform;
      const position = window.getComputedStyle(scroller).position;

      return {
        found: true,
        className: scroller.className.substring(0, 80),
        transform,
        position,
        scrollTop: scroller.scrollTop,
        scrollHeight: scroller.scrollHeight,
        clientHeight: scroller.clientHeight,
        childCount: scroller.children.length,
      };
    });
    console.log("\n=== SCROLLER DIAGNOSTICS ===");
    console.log(JSON.stringify(scrollerDiag, null, 2));

    // Scroll down and check if scroll events actually fire
    const scrollEventTest = await page.evaluate(() => {
      const allEls = document.querySelectorAll("*");
      let scroller: Element | null = null;
      for (const el of allEls) {
        const style = window.getComputedStyle(el);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight + 10
        ) {
          scroller = el;
          break;
        }
      }
      if (!scroller) return { scrollerFound: false };

      let scrollEventFired = false;
      scroller.addEventListener("scroll", () => {
        scrollEventFired = true;
      });

      // Programmatically scroll
      scroller.scrollTop = 1000;

      // Check immediately (sync)
      const immediateCheck = scrollEventFired;

      return {
        scrollerFound: true,
        scrollTop: scroller.scrollTop,
        scrollEventFiredSync: immediateCheck,
      };
    });
    console.log("\n=== SCROLL EVENT TEST ===");
    console.log(JSON.stringify(scrollEventTest, null, 2));

    // Wait for async scroll event
    await page.waitForTimeout(500);

    const asyncScrollCheck = await page.evaluate(() => {
      const allEls = document.querySelectorAll("*");
      let scroller: Element | null = null;
      for (const el of allEls) {
        const style = window.getComputedStyle(el);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight + 10
        ) {
          scroller = el;
          break;
        }
      }
      if (!scroller) return {};

      // Check inline styles again after scroll
      const cards: Array<{ text: string; style: string }> = [];
      scroller.querySelectorAll("div").forEach((div) => {
        const cs = window.getComputedStyle(div);
        if (cs.backdropFilter && cs.backdropFilter !== "none") {
          const text = div.innerText?.substring(0, 30) || "";
          if (text.length > 5) {
            cards.push({
              text,
              style: div.getAttribute("style") || "NONE",
            });
          }
        }
      });

      // Also check the display states
      const displays: Array<{ text: string; opacity: string }> = [];
      document.querySelectorAll("div").forEach((div) => {
        const style = window.getComputedStyle(div);
        if (style.position === "absolute" && style.textAlign === "center") {
          const text = div.innerText?.substring(0, 30) || "";
          if (text.length > 0) {
            displays.push({ text, opacity: style.opacity });
          }
        }
      });

      return { cards, displays, scrollTop: scroller.scrollTop };
    });
    console.log("\n=== AFTER PROGRAMMATIC SCROLL ===");
    console.log(JSON.stringify(asyncScrollCheck, null, 2));

    // Screenshot after programmatic scroll
    await page.screenshot({ path: "tests/e2e/screenshots/06-after-scroll-test.png" });

    // Print page console logs
    console.log("\n=== PAGE CONSOLE LOGS ===");
    consoleLogs.forEach((l) => console.log(`  ${l}`));

    expect(true).toBe(true);
  });
});
