# iOS Animation Energy Optimization Design

## Objective

Keep the weather animation visually recognizable while preventing the page from continuously driving the iPhone CPU/GPU at the display refresh rate. The production artifact must be the optimized implementation, not a stale copy.

## Confirmed Baseline

- Cloudflare serves `tide-deploy/index.html`.
- `tide-redesign.html` is the editable source but differs from production.
- Production creates 80 animated star elements, moves filtered SVG groups, and keeps animation work alive outside the visible scene.
- The source performance patch removes several costs but introduces two full-rate `requestAnimationFrame` loops: `RainEngine` and `MotionGovernor`.
- On a 120 Hz test display the two source loops produced about 240 callbacks per second while rain was drawn only 24 times per second.

## Selected Architecture

Use one energy-budgeted weather runtime:

1. CSS owns only a small number of compositor-friendly scene animations.
2. Canvas owns rain and runs only for `rain` or `storm`.
3. A central runtime synchronizer evaluates user intent, page visibility, scene intersection, reduced-motion preference, quality tier, and weather state.
4. Rain schedules `setTimeout` followed by one `requestAnimationFrame` at the configured tier rate. It never polls at the hardware refresh rate.
5. Performance adaptation is sampled inside the existing rain draw cycle. There is no independent governor loop.
6. `tide-redesign.html` and `tide-deploy/index.html` must be byte-identical before deployment.

## Quality Budgets

| Tier | Rain FPS | Canvas DPR | Storm drop scale | Scene budget |
|---|---:|---:|---:|---|
| high | 30 | 1.5 | 1.0 | Desktop/full scene |
| medium | 20 | 1.0 | 0.30 | Mobile default: two moving clouds, one wave, no bubbles or beacon pulse |
| low | 12 | 1.0 | 0.20 | Static clouds, one slow wave, no secondary effects |
| static | 0 | 1.0 | 0 | No continuous animation |

Mobile and coarse-pointer devices default to `medium`. Reduced-motion always selects `static`.

## Runtime State

The runtime maintains:

- `motionEnabled`: user pressed Play;
- `pageVisible`: current page lifecycle state;
- `appVisible`: `IntersectionObserver` state;
- `motionAllowed`: reduced-motion and quality permit animation;
- current weather intensity.

The derived predicates are:

```js
shouldAnimate = motionEnabled && pageVisible && appVisible && motionAllowed();
shouldRunRain = shouldAnimate() && (weather === 'rain' || weather === 'storm');
```

`syncRuntime()` is the only coordinator that starts/stops Canvas and pauses/resumes CSS. All lifecycle, weather, quality, and button events call this function.

## Rendering Changes

- Remove `cloudBlur` from moving SVG cloud groups.
- Remove the dial-wide drop shadow and animated beacon glow/stroke width.
- Remove animated blur from sunny rays and breeze.
- Keep the single CSS star background; do not generate star DOM nodes.
- Do not animate clouds when their weather state is invisible.
- Limit medium mobile mode to two cloud groups and one wave; disable bubbles and continuous beacon pulse.
- Remove persistent `will-change` from inactive and disabled elements.

## Deployment Contract

`scripts/validate-deploy.mjs` will fail when:

- source and deploy HTML differ;
- the old 80-star generator returns;
- an independent `MotionGovernor` returns;
- moving clouds use `cloudBlur`;
- central `shouldAnimate` / `shouldRunRain` predicates are missing;
- the deployment version is not the optimized release;
- an inline script has a JavaScript syntax error.

## Acceptance Criteria

- Motion off: zero continuous RAF callbacks after initial load.
- Sunny/cloudy/clear-night motion: zero rain Canvas frames and clears.
- Storm/rain medium tier: approximately 20 Canvas frames per second, not display-rate polling.
- `pagehide`, hidden state, reduced-motion, and offscreen state stop Canvas and pause CSS.
- Mobile Canvas is DPR 1.0.
- Source and deploy are byte-identical.
- `npm run check` and `npm run security:check` pass.
- Browser console has no page errors in storm, sunny, or clear-night.
- Production HTML after push matches the committed deploy artifact.

## Explicit Non-Goals

- No WebGL rewrite.
- No video-background replacement.
- No visual redesign or data/score algorithm changes.
- No new third-party dependency.
