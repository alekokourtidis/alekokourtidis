<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Load-bearing invariants — don't regress these

Everything below was painfully debugged over multiple sessions. Each rule
exists because violating it caused a visible bug. If a refactor looks
cleaner by breaking one, the refactor is wrong.

## Homepage + /tools rendering

- `app/page.js` and `app/tools/page.js` MUST render `<DesignMount>`. Do
  not re-introduce an `<iframe>`. The iframe swallowed mouse-wheel events
  on macOS and forced the user to scroll via the far-right scrollbar only.
- `app/components/DesignMount.js` is a client component that loads React,
  ReactDOM, Babel Standalone (`type: "text/babel"` does NOT guarantee
  order), then fetches each JSX file, runs `Babel.transform({ presets:
  ['env', 'react'] })` manually, and injects the compiled code as an
  inline `<script>`. The inline-script trick is the only way to guarantee
  `shared.jsx → demos.jsx → app.jsx` execute in order. Do not "simplify"
  this into dynamic `<script type="text/babel">` tags.
- DesignMount's inline `<style>` MUST keep `body { overflow: visible
  !important; height: auto !important }`. Without this, both `<html>` and
  `<body>` become scroll containers and macOS routes wheel events to the
  outer one only — the "scroll only on far right" bug.
- `.noise { display: none !important }` in DesignMount's style block
  hides the grain overlay that used to show through once the iframe was
  removed. Leave it hidden unless explicitly asked to restore.

## Tool directory (`tool_library` Supabase table)

- `public/design/app.jsx` and `public/design/tools.jsx` fetch the live
  list from `tool_library` via `useToolLibrarySupabase` in `shared.jsx`.
  `SEED_TOOLS` is a FALLBACK for when Supabase is unreachable — do not
  treat it as the source of truth. Never add a new tool by editing
  SEED_TOOLS; add it to `tool_library` instead.
- The Postgres trigger `tool_library_sync_from_built_projects` on
  `built_projects` auto-inserts new rows when a project flips to
  `status='deployed'`. It titlecases `project_name` and infers `cat` from
  tagline keywords. `ON CONFLICT DO NOTHING` so curated rows are never
  overwritten.
- Tool rows in `tool_library` MUST set `url` to the actual deploy URL
  (e.g. `https://foo.vercel.app` or `/essaycloner`). Do NOT set it to a
  synthesized `/slug` path unless a matching Next.js route exists on
  alekotools.com — otherwise clicking the card sends users to a broken
  Next 404.
- The homepage row layout uses a 4-column grid (`10px 1fr auto auto` =
  dot, title, cat badge, Visit). Users/price render in the expanded
  detail, not the row head. Don't re-add them to the header without
  rebalancing the grid.

## Blog categorization

- `scripts/generate-blog-json.mjs` builds `public/blog-posts.json` on
  every Vercel deploy. It MUST fetch `tool_library` from Supabase at
  build time and derive a post's `cat` from the matching tool's `cat`
  field, keyed by normalized slug. The `HARDCODED_CAT` map is a
  safety net only.
- The fallback category is `"General"`. Do NOT change it back to
  `"Writing"` — writing is a medium, not a topic, and "Writing" labels
  on every blog card is what the user called out as broken.

## Analytics (`/api/track`)

- `app/api/track/route.js` MUST `decodeURIComponent` the `x-vercel-ip-city`
  / `country` / `region` headers before bot-matching and storing. Vercel
  URL-encodes city names ("Council%20Bluffs"), and the lowercase bot list
  uses plain spaces — without decoding, the bot filter silently lets every
  Council Bluffs visit through.
- Bare-country rows (when Vercel has no city for an IP) get the
  visitor's browser timezone appended so the dashboard shows
  `US · America/Los_Angeles` instead of a useless `US`.

## Geo

- `middleware.ts` blocks Pakistan via `x-vercel-ip-country === 'PK'` and
  rewrites to `/blocked`. The matcher excludes Next internals, favicon,
  robots, sitemap, and the `/blocked` page itself. Adding a country =
  edit `BLOCKED_COUNTRIES`.
- `/blocked/page.tsx` must NOT display any personal email. This was a
  specific user correction — keep the page minimal.

## Outer Next.js layout

- `app/layout.js` renders a `<nav class="nav">` and `<footer
  class="footer">` as direct children of `<body>`. DesignMount's style
  block hides these specifically via `body > nav.nav, body > footer.footer
  { display: none }`. Don't drop the `body > ` selector — without it you
  also hide the design app's own inner nav/footer.
