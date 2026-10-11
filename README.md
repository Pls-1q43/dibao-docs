# Dibao Docs

Public documentation site for Dibao at `https://docs.dibao.app`.

## Stack

- Astro
- Starlight
- Cloudflare Workers Static Assets

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Docker image examples in the quick-install and backup-upgrade pages must always use
`ghcr.io/pls-1q43/dibao:latest`, not a version-pinned tag. Keep this rule when updating
release documentation. The build checks all three languages before generating the site.

## Deploy

Production deploys should be connected to Cloudflare Workers GitHub integration:

- Repository: `Pls-1q43/dibao-docs`
- Production branch: `main`
- Build command: `npm ci && npm run build`
- Deploy command: `npx wrangler deploy`
- Output directory: `dist`
- Custom domain: `docs.dibao.app`

Manual deploy, when authenticated with Wrangler:

```bash
npm run deploy
```
