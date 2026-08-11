# PAGE_STRUCTURE.md — Routes & Components

## 1. Route Map

```
/                          Home — hero + searchable/filterable grid of all 24 tools
/tools/:slug               Individual tool page (dynamic, one component per tool)
/login                     Optional login (email/password or magic link)
/signup                    Optional signup
/account                   Logged-in user's recent activity ("Recent conversions")
/admin                     Password-gated admin dashboard
/about                     Short about page (builds trust/SEO, explains "runs in your browser")
/privacy                   Privacy policy (important — explicitly state no files are uploaded)
*                          404 page
```

Tool slugs (used in both routing and Supabase `tool_slug` column):

```
pdf-to-jpg, jpg-to-pdf, pdf-to-png, png-to-pdf, merge-pdf, split-pdf,
compress-pdf, rotate-pdf, delete-pdf-pages, reorder-pdf-pages,
extract-pdf-pages, pdf-to-text, watermark-pdf,
jpg-to-png, png-to-jpg, webp-to-jpg, jpg-to-webp, png-to-webp,
image-compressor, image-resizer, image-cropper, image-to-base64,
rotate-flip-image, images-to-pdf
```

## 2. Home Page (`/`)

- Header: logo/name (left), nav links (Tools, About), optional Login/Account
  button (right)
- Hero: one line stating what the site does + a search box to filter the 24
  tools by name (no gradient hero, no illustration — just clean type + search)
- Tool grid: grouped into two sections — "PDF Tools" and "Image Tools" — each
  tool is a simple card: icon + name, links to `/tools/:slug`
- **Ad slot #1**: between the "PDF Tools" and "Image Tools" sections — a
  single horizontal ad unit, clearly spaced from the cards above/below
- Footer: About, Privacy, GitHub/contact (if desired), small note: "All
  processing happens in your browser. Files are never uploaded."
- **Ad slot #2**: just above the footer, below all tool cards — never in
  the footer itself

Home page total: 2 ad units, both well clear of any clickable tool card.

## 3. Tool Page (`/tools/:slug`)

Every tool page shares one layout shell, with the tool-specific logic swapped
in via `React.lazy`:

```
ToolPageLayout
 ├── Breadcrumb (Home / [Category] / [Tool Name])  — good for SEO
 ├── H1: Tool name (e.g. "PDF to JPG Converter")
 ├── 1-line description
 ├── <ToolWidget /> — lazy-loaded, tool-specific:
 │     ├── Drop zone / file picker
 │     ├── Options (if any — e.g. quality slider for compress, page range for split)
 │     ├── Convert button
 │     ├── Progress indicator (client-side processing, can take a few seconds)
 │     └── Result: preview + Download button (+ "Convert another" reset)
 │     ── (nothing else goes inside this box — keeps ads away from clickable UI)
 ├── — gap —
 ├── **Ad slot #1** (below the whole widget, clearly separated by spacing —
 │     never touching the Download button)
 ├── Short "How it works" text block (2-3 sentences, good for SEO content depth)
 ├── Related tools (e.g. on "JPG to PDF" show "PDF to JPG", "PNG to PDF")
 └── **Ad slot #2** (bottom of page, below related tools, above footer)
```

Tool page total: 2 ad units, both below the interactive widget — a user has
to finish or abandon the conversion before ever scrolling near an ad.

On successful conversion, fire one `tool_usage` insert (fire-and-forget, don't
block the download on it).

## 4. Account Page (`/account`) — only reachable if logged in

- "Recent activity": list of `tool_slug` + `created_at` from `user_conversions`,
  most recent first, each row links back to that tool
- Logout button
- No file data shown/stored — just a usage log

## 5. Admin Page (`/admin`)

- Password gate first (matches ExamDo pattern: single password stored in env
  var, simple session flag after correct entry — no need for full Supabase
  Auth roles for a single-admin site)
- Dashboard sections:
  - **Top tools (all time)** — horizontal bar chart, tool name vs count
  - **Top tools (last 7 days)** — same, filtered
  - **Usage over time** — line chart, conversions per day, last 30 days
  - **Totals row**: total conversions, unique sessions, logged-in users count
- No file names, no user PII beyond count of logged-in vs anonymous usage

## 6. Component Structure (suggested folder layout)

```
src/
 ├── components/
 │    ├── layout/          (Header, Footer, ToolPageLayout)
 │    ├── ads/              (AdSlot.jsx — single reusable component, takes a slot id prop)
 │    ├── ui/               (Button, Card, Spinner, Chart wrappers — minimal, no big UI kit)
 │    └── tools/
 │         ├── pdf-to-jpg/ToolWidget.jsx
 │         ├── jpg-to-pdf/ToolWidget.jsx
 │         └── ... (one folder per tool)
 ├── lib/
 │    ├── supabaseClient.js
 │    ├── conversions/       (pure functions: pdfToJpg.js, jpgToPdf.js, etc — no UI)
 │    └── analytics.js       (logToolUsage(slug) helper)
 ├── pages/
 │    ├── Home.jsx
 │    ├── ToolPage.jsx        (reads :slug, lazy-loads the right widget)
 │    ├── Login.jsx / Signup.jsx / Account.jsx
 │    ├── Admin.jsx
 │    └── About.jsx / Privacy.jsx / NotFound.jsx
 ├── data/
 │    └── tools.js            (single source of truth: array of {slug, name, category, description})
 └── App.jsx (routes)
```

Keeping `data/tools.js` as the single source of truth for the tool list means
adding tool #25 later is: add one entry here + one widget folder + one
conversion function. Nothing else changes.
