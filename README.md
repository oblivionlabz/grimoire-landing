# Operator's Grimoire — landing page

Single-page marketing site for **The Claude Code Operator's Grimoire** — a $99
one-time-purchase bundle of 14 Claude Code skills.

Stack: **Next.js 16 (App Router) · TypeScript · Tailwind v4 · Bun · Turbopack**.
Pure static — no database, no auth, no analytics. Deploy anywhere that serves
HTML + JS.

---

## Develop

```bash
bun install      # already installed by the scaffold
bun run dev      # http://localhost:3000  (or 3001/3002 if 3000 is busy)
```

Edits hot-reload via Turbopack. Page lives at `src/app/page.tsx`, design
tokens at `src/app/globals.css`, fonts + metadata at `src/app/layout.tsx`.

## Build

```bash
bun run build    # static export — fully prerendered
bun run start    # serve the production build locally
```

The build is fully static (`○ Static`) — every byte can be served from a CDN
or pushed to S3 / R2 / Pages with no Node runtime.

## Deploy

Two easy paths:

1. **Vercel** — one command from the project root:
   ```bash
   bunx vercel
   ```
   No `vercel.json` needed. Set `NEXT_PUBLIC_GUMROAD_URL` in the project's
   environment variables tab if you want to override the default.

2. **Drag-and-drop static host** (Cloudflare Pages, Netlify drop, S3+CloudFront,
   any web server). Run `bun run build`, then upload the contents of
   `.next/static` plus the rendered HTML — or use Next's static export adapter
   if you need a flat directory of files (`output: "export"` in
   `next.config.ts`, then `bun run build`, then upload `out/`).

## Environment variables

Only one is read by the page, and it has a sane default:

| Var | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_GUMROAD_URL` | `https://gumroad.com/l/operators-grimoire` | Where both CTAs link. Replace once the real Gumroad listing is live. |

Set it inline for a one-off dev run:

```bash
NEXT_PUBLIC_GUMROAD_URL="https://yourstore.gumroad.com/l/your-slug" bun run dev
```

Or persist it in `.env.local` (already gitignored by the scaffold).

## Customizing copy

- **Brand name / pricing / CTA text** — `src/app/page.tsx` (top of the file).
- **The 14 skill entries** — `SKILLS` array in `src/app/page.tsx`.
- **Email / footer line** — search for `your-email@example.com` in
  `src/app/page.tsx`.
- **Domain placeholder for OG metadata** — `SITE_URL` constant in
  `src/app/layout.tsx`.

## Demo video

The hero `<video>` tag points to `/demo.mp4`, which **is not committed**.
Record a short screencast (Asciinema → mp4, or OBS) and drop it at
`public/demo.mp4`. Until then, the poster image (`public/demo-poster.png`,
generated with ImageMagick) shows a static terminal frame.

## Design system

OBSIDIAN COURT — strict dark-operator. All tokens live in the `@theme` block
at the top of `src/app/globals.css`. Colors are OKLCH so they survive
gamut-mapping cleanly on wide-color displays. Chamfered corners are a
`clip-path` polygon utility (`.chamfer`, `.chamfer-sm`) used only on the
primary CTA and the feature cards.

Typography: **Geist Sans** (body + display) and **JetBrains Mono** (mono),
both loaded via `next/font/google`.

## What's NOT here

- No analytics. Wire Plausible / Umami / GA later if you want.
- No A/B framework. Edit copy in `page.tsx`, redeploy.
- No auth, no database, no API routes. It's a static brochure.
- No UI library. Every component is hand-rolled in this file.

That's the whole product. Have fun.
