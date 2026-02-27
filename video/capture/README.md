## Recording App Footage

Captures smooth screen recordings of the Olympic scrollytelling app for use in a demo video.

### Prerequisites

- Playwright installed in parent project (`@playwright/test` in devDependencies)
- `tsx` available via npx (ships with most Node setups)

### Run

```bash
npx tsx video/capture/record-scroll.ts
```

The script launches a headed Chromium browser, navigates to the deployed app, and records three clips with smooth eased scrolling.

### Output

| File | Content | Duration |
|------|---------|----------|
| `video/public/hub-view.webm` | Hub view with orbiting athlete cards | ~4s |
| `video/public/hughes-scroll.webm` | Jack Hughes story scroll | ~15s |
| `video/public/choi-scroll.webm` | Choi Gaon story scroll | ~15s |

### Adjusting

Edit the constants at the top of `record-scroll.ts` to change:

- `SCROLL_DURATION` — how long the cinematic scroll takes (default 15s)
- `HUB_CAPTURE_DURATION` — how long to record the hub (default 4s)
- `APP_URL` — the target URL (default: Vercel deployment)
