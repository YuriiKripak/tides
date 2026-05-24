# Deployment

This project is prepared for Cloudflare Workers static assets and the existing Worker:

`https://myrtle-beach-tides.groshi-us.workers.dev/`

## Files

- `tide-deploy/` is the static assets directory Cloudflare deploys.
- `tide-redesign.html` is the working standalone HTML source.
- `tide_widget_png_v3/` is a local archive of the previous implementation and is ignored by git.
- `tide-deploy.zip` is a generated manual-upload package and is ignored by git.

## Recommended Setup: Existing Worker Builds

The repository is connected to:

- GitHub: `YuriiKripak/tides`
- Cloudflare Worker name: `myrtle-beach-tides`

To automate deployment for the existing Worker:

1. Open Cloudflare Dashboard.
2. Go to **Workers & Pages**.
3. Open the existing Worker **myrtle-beach-tides**.
4. Go to **Settings** -> **Builds**.
5. Select **Connect**.
6. Connect GitHub repository `YuriiKripak/tides`.
7. Use branch `main`.
8. Use these build settings:
   - Build command: `npm run check`
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/`

The Worker name in Cloudflare must match `name = "myrtle-beach-tides"` in `wrangler.toml`.

After that, every push to `main` deploys automatically to the existing `workers.dev` URL.

## Local Manual Deploy

After authenticating Wrangler locally:

```sh
npm install
npm run deploy:cloudflare
```

## Security Check

Before pushing public changes:

```sh
npm run check
npm run security:check
```

Do not commit Cloudflare tokens, GitHub tokens, `.env` files, `.dev.vars`, `.npmrc`, SSH/private keys, `.claude/`, generated zip packages, or archived local builds.

## Public Repository Settings

Before relying on automatic public deployment, check GitHub repository settings:

- The repository can stay public, but `main` should be protected.
- Secret scanning and push protection should be enabled.
- Dependabot alerts and Dependabot security updates should be enabled.
- Direct pushes to `main` should be limited to the owner/admin workflow.
- If collaborators are added later, require pull requests and passing checks before merging.
- Do not add repository secrets unless a deployment method explicitly needs them.

Cloudflare Workers Builds should use the GitHub integration and should not require Cloudflare API tokens in tracked files.

To create a manual upload zip:

```sh
npm run zip
```
