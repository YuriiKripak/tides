# Tide Walk Score

A compact tide-walking score, beach-condition, and weather widget for Myrtle Beach.

The current deployable site is in `tide-deploy/`. It is deployed as Cloudflare Workers static assets with no backend and no private API keys.

## Why This Exists

Most weather widgets show temperature, wind, and rain, but they do not answer a more practical beach question: is now a good time to walk near the water?

At low tide, the exposed sand is firmer, easier to walk on, and gives people more room to move without disturbing others who are relaxing closer to the dunes. At high tide, the beach can be narrower and the loose sand makes longer walks less comfortable.

Tide Walk Score is built for that specific use case: helping tourists, visitors, and locals quickly decide when beach conditions are best for a walk. It combines tide timing, current weather, wind, surf, UV, water temperature, and tide comfort context into one compact screen.

## Tide Walk Score

The Tide Walk Score is a 0-100 rating for current beach-walking conditions:

- 85-100: excellent
- 70-84: good
- 50-69: fair
- 30-49: poor
- 0-29: avoid

The score is tide-first, but not tide-only. Rain, storms, wind, surf height, UV index, water temperature, and tide level context can all raise or lower the current rating. Dangerous weather can cap the score even when the tide timing is otherwise good.

## Color System

Cards and the small beacon on the tide dial use the same condition language:

- Green: the factor supports a beach walk.
- Yellow: the factor is usable but not ideal.
- Orange/red: the factor makes walking less comfortable or less safe.
- Teal: key timing information, such as the best walk window.

## Features

- Tide clock with walk/suffer context and score beacon
- Tide Walk Score from 0 to 100
- Low-tide walking window
- Weather-aware score penalties for rain and storms
- Weather background states
- English, Russian, Ukrainian, and Spanish labels
- Imperial units for English
- Metric units for Russian, Ukrainian, and Spanish
- Cloudflare Workers deployment setup

## Deploy on Cloudflare Workers

1. Fork or clone this repository.
2. In Cloudflare Workers, connect the repository to a Worker.
3. Make sure the Cloudflare Worker name matches `name = "myrtle-beach-tides"` in `wrangler.toml`.
4. Use these build settings:
   - Build command: `npm run check`
   - Deploy command: `npx wrangler deploy`
   - Production branch: `main`

Cloudflare will deploy the static files from `tide-deploy/`.

## Local Check

```sh
npm run check
```

## Manual Deploy With Wrangler

```sh
npm install
npm run deploy:cloudflare
```

## License

MIT
