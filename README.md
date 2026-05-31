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
