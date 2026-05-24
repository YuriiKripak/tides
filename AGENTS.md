# Agent Instructions

This repository is intended to be public. Treat every committed file and every pushed commit as public internet content.

## Security Rules

- Never commit personal data, account identifiers, API tokens, Cloudflare credentials, GitHub tokens, passwords, SSH/private keys, local `.env` files, `.dev.vars`, `.npmrc`, or assistant/tooling state.
- Do not commit generated screenshots, local browser/debug logs, zip packages, old local build archives, or files from `.claude/`, `.playwright-mcp/`, `.wrangler/`, `.cloudflare/`, `node_modules/`, or `tide_widget_png_v3/`.
- Keep Cloudflare deployment credentials out of the repository. Use Cloudflare Workers Builds Git integration by default. If an API token is ever needed, store it only in GitHub Secrets or Cloudflare-managed secret storage.
- Before every commit or push, run:

```sh
npm run check
npm run security:check
```

- Check `git status --short --ignored` before staging files. Ignored local files may remain on disk, but must not be force-added.
- If a secret or private file is accidentally committed, stop and ask before rewriting history or force-pushing.
- Future commits should use the repository-local GitHub noreply email. Do not change the local repo author email back to a personal address.

## Deployment Files

- `tide-deploy/` is the Cloudflare Workers static assets directory.
- `tide-redesign.html` is the current editable standalone source.
- `tide-deploy.zip` is generated and ignored.
- `tide_widget_png_v3/` is a local archive of an older implementation and is ignored.
