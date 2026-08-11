# MASTER_PROMPT.md — Multi-Tool Utility Website

## 1. What This Is

A single-page-app style website offering 24 file conversion / PDF utility tools
(PDF↔JPG, PNG↔JPG, compress, merge, split, etc). Every tool runs **entirely in
the browser** — no file is ever uploaded to a server. This is the core selling
point: instant, private, free.

Optional login lets a user save their conversion history. An admin panel at
`/admin` shows which tools get used most, so Arpan (the owner) can decide what
to build next.

## 2. Non-Goals (explicitly out of scope for v1)

- No file upload to any server/storage bucket. Nothing touches Supabase Storage.
- No AI-powered anything (no "AI PDF summarizer", no chatbot). This is a
  utility tool site, not an AI product.
- No paid tiers / payments in v1.
- No OCR-heavy or ML-heavy tools in v1 (e.g. PDF-to-Word, PDF-to-Excel) —
  these need real backend processing and are deferred to a later phase.
- No mobile app. Responsive web only.

## 3. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS (utility-first, keeps bundle small, no heavy UI kit) |
| Routing | React Router |
| Backend/DB | Supabase (Postgres + Auth only — no Storage, no Edge Functions for v1) |
| Auth | Supabase Auth, email/password or magic link, **optional** |
| Hosting | Netlify or Vercel free tier |
| Conversion engine | Runs 100% client-side, see §5 |

## 4. Design Philosophy — "Not Another AI Slop Site"

This is the most important section. The person building this explicitly does
not want the generic AI-generated SaaS look. Concretely avoid:

- Purple-to-blue gradient blobs floating behind a hero section
- Glassmorphism cards stacked everywhere
- Generic rocket-ship / sparkle / lightning-bolt icon sets
- Over-rounded corners + soft drop-shadow on every single element
- A wall of "Feature" cards with the same 3-word heading + 1-sentence body pattern
- Default Inter font with no typographic personality

Instead:

- **Minimalist.** Mostly white/near-black neutral palette, one accent color
  used sparingly (for buttons/links/active states only).
- **Functional-first UI.** The tool itself (drop zone, convert button, result)
  is the visual centerpiece of every tool page — not marketing copy.
- **Typography does the work.** Pick one distinctive but readable font pairing
  (e.g. a slightly geometric sans for headings + a neutral sans for body) —
  not just system-default everywhere.
- **Generous whitespace** over dense card grids.
- **No stock illustration.** Use simple line icons (e.g. Lucide) only where
  functionally necessary (file type icons, drag-drop icon).

## 5. Conversion Engine (client-side libraries)

All processing happens in-browser via these libraries — no server round-trip:

- `pdf-lib` — create/merge/split/rotate/reorder/delete/extract pages, add
  watermark, basic PDF compression
- `pdfjs-dist` (pdf.js) — render PDF pages to canvas (needed for PDF→JPG/PNG),
  and extract text (PDF→Text)
- Native Canvas API — image format conversion (JPG/PNG/WebP), resize, crop,
  rotate/flip
- `browser-image-compression` — image compression tool
- `file-saver` — trigger downloads of the converted output
- `jszip` — bundle multi-page outputs (e.g. Split PDF → zip of images/pages)

Each tool is code-split (`React.lazy`) so the home page bundle stays tiny even
as more tools get added later.

## 6. Monetization — Google AdSense (Manual Ad Units)

The site is monetized via Google AdSense using **manually placed ad units**
(not Auto ads) so ad placement stays deliberate and doesn't undercut the
minimalist design goal from §4.

Guiding rules:
- **Max 2 ad units per page.** More than that turns a minimalist tool site
  into exactly the cluttered look this project is avoiding.
- **Never place an ad near the drop zone, convert button, or download
  button.** This isn't just a design preference — Google AdSense policy
  prohibits placements that risk accidental clicks near interactive
  elements, and violating it can get the whole account suspended.
- Ads sit in clearly separated zones: below the tool result, or in the
  content/footer area — never interleaved with the tool UI itself.
- Ad slots are visually quiet: no colored borders or "Advertisement"
  gimmicks beyond the required label, blend with the neutral palette.
- Ad script loads asynchronously and never blocks the tool from becoming
  interactive (conversion speed is the product; ads must never slow it down).

See PAGE_STRUCTURE.md §3/§7 for exact slot placement and INSTRUCTIONS.md
§8 for AdSense setup, policy compliance, and consent requirements.

## 7. The 24 Tools (v1 scope)

**PDF tools (13)**
1. PDF to JPG
2. JPG to PDF
3. PDF to PNG
4. PNG to PDF
5. Merge PDF
6. Split PDF
7. Compress PDF
8. Rotate PDF
9. Delete PDF Pages
10. Reorder PDF Pages
11. Extract PDF Pages
12. PDF to Text
13. Watermark PDF

**Image tools (11)**
14. JPG to PNG
15. PNG to JPG
16. WebP to JPG
17. JPG to WebP
18. PNG to WebP
19. Image Compressor
20. Image Resizer
21. Image Cropper
22. Image to Base64
23. Rotate / Flip Image
24. Multiple Images to PDF

More tools can be added later without changing the architecture — each tool is
just a new route + a new conversion function.

## 8. Analytics & Admin Panel

Every conversion (successful attempt) logs one row to Supabase:
`tool_usage(id, tool_slug, user_id nullable, created_at)`.

No file content, filename, or file data is ever sent to Supabase — only the
tool name and timestamp. This preserves the "nothing leaves your browser"
privacy claim while still letting the admin see usage patterns.

`/admin` is a single password-gated page (env var, same pattern as your
ExamDo teacher login) showing:
- Most-used tools (bar chart, all-time and last 7 days)
- Total conversions over time (line chart)
- Unique visitors (rough, via anonymous session id) vs logged-in users

## 9. Optional Login

- Users can use every tool fully anonymously — login is never required to
  convert a file.
- If logged in, each conversion also writes to
  `user_conversions(id, user_id, tool_slug, created_at)` so the user sees a
  "Recent activity" list on their account page. No files are stored — just a
  log of "you used PDF to JPG on [date]".

## 10. SEO Priority

Every one of the 24 tools needs to be independently discoverable in Google
search (people search "convert jpg to pdf online free" directly). See
INSTRUCTIONS.md §SEO for the concrete implementation rules.
