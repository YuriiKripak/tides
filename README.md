# Myrtle Beach Tide Widget

A compact tide, beach-condition, and weather widget for Myrtle Beach.

The current deployable site is in `tide-deploy/`. It is deployed as Cloudflare Workers static assets with no backend and no private API keys.

## Why This Exists

Most weather widgets show temperature, wind, and rain, but they do not make tide timing obvious. That misses a practical problem for visitors in Myrtle Beach: beach walking is much better around low tide.

At low tide, the exposed sand is firmer, easier to walk on, and gives people more room to move without disturbing others who are relaxing closer to the dunes. At high tide, the beach can be narrower and the loose sand makes longer walks less comfortable.

This widget is built for that specific use case: helping tourists, visitors, and locals quickly decide when beach conditions are best for a walk. It combines tide context with weather and beach-condition details in one compact screen.

## Features

- Tide clock with walk/suffer context
- Low-tide walking window
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
