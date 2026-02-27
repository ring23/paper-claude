## Demo Reel

LinkedIn demo reel for the Olympic scrollytelling app (1920x1080, 30fps, ~37s).

### Beats

| Beat | Duration | Content |
|------|----------|---------|
| Hook | 3s | Hub view + "I don't know how to code." |
| Reveal | 10s | Hughes scroll + "So I built this." |
| SecondAthlete | 10s | Choi scroll + "Choi Gaon" |
| WowMoment | 7s | Slow-motion viz highlight |
| Punch | 3s | Alpine navy bg + "Two hours." |
| Close | 4s | Hub view + "Now I do. And so do you." |

### Setup

1. Run Playwright captures first: `cd .. && npx playwright test capture/`
2. Install: `npm install`
3. Preview: `npx remotion studio`
4. Render: `npx remotion render DemoReel out/demo-reel.mp4`
