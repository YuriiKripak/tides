# Security Policy

This repository is intended to be public. Do not commit private tokens, personal data, local environment files, Cloudflare account identifiers, API keys, SSH keys, screenshots containing private information, or local assistant/tooling state.

## What Must Stay Private

- Cloudflare API tokens
- GitHub personal access tokens
- Personal email addresses, phone numbers, customer data, private account details, or local machine paths that reveal sensitive context
- `.env`, `.dev.vars`, and other local environment files
- `.npmrc` files containing registry tokens
- SSH/private keys such as `id_rsa`, `id_ed25519`, `*.pem`, or `*.key`
- Local assistant/tooling folders such as `.claude/`
- Local browser/debug logs such as `.playwright-mcp/`
- Generated screenshots, zip packages, and archived older local builds

## Before Publishing Changes

Run:

```sh
npm run check
npm run security:check
```

Also check:

```sh
git status --short --ignored
```

Ignored local files may remain on disk, but must not be force-added into git.

## Agent Safety

Agents working in this repository should read `AGENTS.md` before making changes. They must not add credentials, personal data, local assistant state, generated screenshots, local archives, or deployment tokens to commits.

If a secret or private file is accidentally committed, stop and ask before rewriting history or force-pushing.

Future commits should use the repository-local GitHub noreply email rather than a personal email address.

## GitHub Repository Settings

For a public repository, enable these in GitHub:

- Secret scanning
- Push protection
- Dependabot alerts
- Dependabot security updates
- Branch protection for `main`
- Require pull requests before merging into `main` when collaborators are added
- Require status checks before merging when CI is added
- Restrict who can push to `main`
- Disable force pushes on `main`

This repository includes `.github/dependabot.yml` for npm dependency update pull requests. GitHub security features such as secret scanning and push protection still need to be enabled in the GitHub web UI if they are not already active for the account.

The public GitHub API should report `"protected": true` for the `main` branch after branch protection is configured.

## Cloudflare

The recommended deployment is Cloudflare Workers Builds Git integration for the existing Worker. It does not require storing a Cloudflare API token in this repository.

If Wrangler or GitHub Actions deployment is added later, store Cloudflare credentials only in GitHub Secrets or Cloudflare-managed secret storage, never in tracked files.
