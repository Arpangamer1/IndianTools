# INSTRUCTIONS.md — Dev Rules, Schema, SEO

## 1. General Coding Rules

- No file ever leaves the browser for conversion. If a tool cannot be done
  client-side well, it does not belong in v1 — flag it instead of quietly
  routing it through a server.
- Every tool's conversion logic lives in `lib/conversions/*.js` as a **pure
  function** (input: File/Blob, output: Blob) — fully decoupled from UI. This
  makes each one independently testable.
- Every tool page and its conversion function must be `React.lazy` /
  dynamically imported — never bundle all 24 tools' libraries into the main
  chunk. `pdf-lib` and `pdfjs-dist` are large; only load them on pages that
  need them.
- Large libraries (`pdfjs-dist`, `browser-image-compression`) should be
  dynamically `import()`-ed inside the widget component itself, not at the
  top of a shared file.
- Keep Tailwind config minimal — one accent color variable, restrained
  font-size scale, no extra plugins unless needed.
- No `useEffect` chains for things that can be plain event handlers (convert
  button onClick, not effect-triggered).
- All conversion errors (corrupt file, unsupported format) show a plain
  inline error message near the drop zone — never a raw console error to the
  user.

## 2. Supabase Schema

```sql
-- Usage analytics (no file data, ever)
create table tool_usage (
  id uuid primary key default gen_random_uuid(),
  tool_slug text not null,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Optional per-user history (only written if logged in)
create table user_conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  tool_slug text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table tool_usage enable row level security;
alter table user_conversions enable row level security;

-- Anyone (including anon) can insert a usage log, nobody can read except admin (service role / admin page uses service key or a secured RPC)
create policy "anyone can insert usage" on tool_usage
  for insert to anon, authenticated with check (true);

-- Users can only see/insert their own conversion history
create policy "users insert own history" on user_conversions
  for insert to authenticated with check (auth.uid() = user_id);
create policy "users read own history" on user_conversions
  for select to authenticated using (auth.uid() = user_id);
```

The `/admin` page reads `tool_usage` aggregates via a Supabase server-side
call using the service role key (kept in an env var, never exposed to the
client bundle) — or, simpler for a free-tier single-admin site, a small
Netlify Function that runs the aggregate query server-side and returns JSON
to the already-password-gated `/admin` page.

## 3. Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server-side only, never exposed to client
ADMIN_PASSWORD=                  # simple gate for /admin, same pattern as ExamDo
VITE_ADSENSE_CLIENT_ID=          # e.g. ca-pub-XXXXXXXXXXXXXXXX, safe to expose (it's public)
```

## 4. Admin Auth Pattern

Same lightweight approach as ExamDo: a single password checked against
`ADMIN_PASSWORD` (server-side, e.g. via a Netlify Function so the password
never ships in the client bundle), setting a short-lived session flag on
success. This is intentionally simple — appropriate for a single-owner admin
panel, not a multi-admin enterprise system.

## 5. SEO Rules (critical — this is a search-traffic-driven product)

- **Every tool page needs a unique `<title>` and meta description**, written
  around how people actually search (e.g. "Convert JPG to PDF Free Online —
  No Upload, Runs in Your Browser").
- Use one `<h1>` per tool page matching the tool name.
- Add a 2-4 sentence **"How it works"** content block per tool page — thin
  content (just a drop zone, no text) hurts ranking. This also reinforces the
  privacy angle ("your file never leaves your device").
- Add JSON-LD structured data using `SoftwareApplication` schema per tool
  page (name, applicationCategory, offers: free).
- Generate a `sitemap.xml` covering `/`, all 24 `/tools/:slug` routes,
  `/about`, `/privacy` — regenerate it whenever a tool is added.
- `robots.txt` should allow everything except `/admin` and `/account`.
- Add Open Graph + Twitter card tags (title, description, a simple static
  og-image — not one per tool, one shared brand image is fine for v1).
- Internal linking: every tool page links to 2-3 "related tools" — this
  spreads link equity and keeps users on-site.
- Core Web Vitals matter here more than most sites because of the heavy
  client-side libraries — hence the strict code-splitting rule in §1. Test
  with Lighthouse before shipping; home page JS should stay small even though
  individual tool pages may be heavier.
- Use descriptive, human-readable URLs — the `/tools/:slug` pattern already
  does this (`/tools/jpg-to-pdf`, not `/tools/1`).

## 6. Google AdSense — Setup & Policy Compliance

**Before applying for AdSense:**
- The site needs real, working tools (not placeholders) and genuine content
  per tool page (the "How it works" blocks from PAGE_STRUCTURE.md §3 count
  toward this) — Google manually/automatically reviews for "sufficient
  original content" before approving a site.
- Must have a real Privacy Policy page (already in the route map) disclosing
  that Google AdSense uses cookies to serve ads based on prior visits — this
  is a hard AdSense requirement, not optional.
- Add `ads.txt` at the domain root (e.g. `public/ads.txt` in Vite so it's
  served at `/ads.txt`) with the line Google gives you after signup:
  `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`

**`AdSlot` component:**
- One reusable component, e.g. `<AdSlot id="home-mid" />`, that renders the
  AdSense `<ins class="adsbygoogle">` tag with the right `data-ad-slot` per
  placement.
- Load the AdSense script (`pagead2.googlesyndication.com`) once, in
  `index.html`, with `async` — never render-blocking.
- Call `(adsbygoogle = window.adsbygoogle || []).push({})` per slot only
  after the component mounts (`useEffect`), not on initial render, so it
  never delays the tool becoming interactive.

**Placement rules (enforced in code, not just convention):**
- No ad slot may render inside `ToolWidget` — enforce this by never importing
  `AdSlot` inside any `components/tools/*` folder. Ads only live in the
  shared `ToolPageLayout` and `Home` page, outside the widget boundary.
- Minimum visual gap (e.g. `mt-12` / `mb-12` in Tailwind) between an ad slot
  and any button — reduces accidental-click risk and keeps the AdSense
  "no placements near interactive elements" policy satisfied by construction.
- Max 2 ad units per page, per MASTER_PROMPT.md §6 — don't add a 3rd later
  without revisiting that decision deliberately.

**Cookie/consent banner (required if you'll have EU/UK visitors, and good
practice regardless):**
- Add a simple consent banner (e.g. using Google's own "Funding Choices" /
  Google-certified CMP, or a lightweight library like `vanilla-cookieconsent`)
  that asks for consent before the AdSense script loads personalized ads.
- Without this, personalized ads to EU visitors violate GDPR and can also
  violate AdSense's own policies for those regions.
- Update the Privacy Policy page to mention this consent mechanism.

**Performance:**
- Reserve fixed height/width for each ad slot in CSS before the ad loads
  (prevents Cumulative Layout Shift — a Core Web Vitals metric Google
  explicitly measures, and bad CLS also hurts SEO ranking).
- Never let an unfilled ad slot collapse to 0px then pop in — reserve the
  space up front.

## 7. Deployment Notes

- Netlify or Vercel free tier — this is a static React/Vite build with no
  server runtime needed except the one small Netlify Function for admin auth
  + admin aggregate queries.
- Supabase free tier is more than enough — usage rows are tiny (no file data),
  so the DB will stay well within limits even at meaningful traffic.

## 8. Build Order (suggested)

1. Scaffold app shell: routing, layout, `data/tools.js`, Home page grid (no
   real conversions yet — just navigation working end to end)
2. Build 2-3 tools fully (e.g. JPG↔PNG, Image Compressor) to nail the
   `ToolWidget` pattern and conversion function structure
3. Wire up `tool_usage` logging on those 2-3 tools
4. Build out the remaining 21 tools, reusing the established pattern
5. Add optional login + `/account` history
6. Build `/admin` (password gate + charts)
7. SEO pass: titles, meta, structured data, sitemap, robots.txt
8. Apply for AdSense once the site has real content on every tool page (see
   §6) — approval can take days, so apply early even if ads go live later
9. Once approved: add `ads.txt`, `AdSlot` component, consent banner, wire up
   the 4 ad placements from PAGE_STRUCTURE.md
10. Lighthouse pass (re-check CLS/LCP after ads are live) + deploy
