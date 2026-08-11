# SEO.md — Instructions for the AI Coding Assistant

This file exists because SEO rules are easy to follow once and forget on the
next prompt. Every rule below includes the *why*, not just the *what*, so
whichever AI is vibe-coding a page understands the reasoning and applies it
consistently — including to new tools added after v1.

## 1. Every Tool Page Needs Real Content, Not Just a Widget

**Rule:** Each `/tools/:slug` page must include: an H1 with the tool name, a
2-4 sentence intro paragraph, a "How it works" section (3-4 sentences), and
a 2-3 item FAQ block — all unique per tool, not copy-pasted with the tool
name swapped in.

**Why:** Google's ranking systems treat a page that's just an upload box with
no surrounding text as "thin content" — it has nothing to index, so it has
nothing to rank for. A page with genuine unique text about that specific
tool (e.g. why nothing is uploaded, what the compression trade-offs are)
gives Google actual signal to match against real search queries. Copy-pasted
boilerplate across all 24 pages looks templated/spammy and can hurt the
whole domain, not just that page.

## 2. Meta Title & Description — Unique, Per Page, Query-Matched

**Rule:** Every route needs its own `<title>` and `<meta name="description">`,
written the way a person actually searches (e.g. "Convert JPG to PDF Free —
No Upload Needed | IndianTools"), not generic templates like "{Tool} |
IndianTools" with nothing else.

**Why:** Title tags are one of the strongest on-page ranking signals, and
they're also the blue link text a user sees in search results — a generic
title gets ignored, a specific one matches intent and gets clicked, and
click-through rate itself feeds back into ranking.

## 3. Heading Hierarchy — One H1, Logical H2/H3 Nesting

**Rule:** Exactly one `<h1>` per page (the tool name). "How it works" and
"FAQ" are `<h2>`. Never skip levels (no `<h3>` directly under `<h1>` with no
`<h2>` between), and never use heading tags purely for visual font-size —
use CSS for that.

**Why:** Search engines use heading structure to understand page hierarchy
and topic relationships. Multiple H1s or skipped levels create ambiguity
about what the page is actually about, diluting relevance signal.

## 4. Internal Linking — Every Page Links to 2-3 Related Tools

**Rule:** Every tool page includes a "Related tools" block linking to 2-3
logically related tools (e.g. JPG-to-PDF links to PDF-to-JPG and PNG-to-PDF).

**Why:** Search engines discover and rank pages partly by following internal
links, and pages with more internal links pointing to them are treated as
more important within the site. This also keeps real users on-site longer,
which improves engagement signals.

## 5. Structured Data (JSON-LD) on Every Tool Page

**Rule:** Every tool page includes a `SoftwareApplication` JSON-LD block
(name, applicationCategory, offers: price 0) in the `<head>`.

**Why:** Structured data doesn't directly boost rankings, but it makes the
page eligible for rich results (star ratings, price, etc. in search
results), which increases click-through rate — and CTR is a real ranking
input.

## 6. Sitemap & Robots.txt Stay in Sync With the Tool List

**Rule:** `sitemap.xml` must include `/`, every `/tools/:slug` route, `/about`,
and `/privacy` — and must be regenerated any time a tool is added or
removed. `robots.txt` disallows `/admin` and `/account` only; everything
else is crawlable.

**Why:** A stale sitemap missing new tools means Google may take much longer
to discover and index them. Blocking `/admin` and `/account` prevents
low-value/private pages from being indexed and diluting the site's overall
topical focus.

## 7. Core Web Vitals Are Non-Negotiable, Not "Nice to Have"

**Rule:** Every new tool's heavy library (`pdf-lib`, `pdfjs-dist`, etc.) must
be dynamically imported inside that tool's widget only — never added to the
main bundle. Any decorative image (like the homepage hero icon) must have
its width/height reserved in CSS before load.

**Why:** Google explicitly uses Core Web Vitals (loading speed, layout
stability, interactivity) as a ranking factor. A slow home page because
every tool's JS loaded upfront directly hurts ranking for every page on the
site, not just the slow one — this is a site-wide risk, not a one-page issue.

## 8. Target Long-Tail Phrases First, Not Just the Head Term

**Rule:** When writing the intro/FAQ content for a tool page, include
natural long-tail phrases the tool actually solves — e.g. for PDF Compressor:
"compress pdf without losing quality", "reduce pdf file size online free",
"pdf compressor no email required" — worked into real sentences, never
stuffed as a bare keyword list.

**Why:** Head terms ("pdf to jpg") are dominated by sites with years of
authority. Long-tail, specific phrases have far less competition and are
realistic to rank for early — and they compound into head-term rankings
over time as the domain builds authority.

## 9. Trust Signals Must Be Real, Not Decorative

**Rule:** `/about` and `/privacy` must contain genuine, specific content
(not filler placeholder text) — what the site does, who built it, how data
is (not) handled. Every claim made in marketing copy ("nothing is
uploaded") must be verifiably true in the actual code.

**Why:** Google's quality systems and human quality raters evaluate
trustworthiness (part of what Google calls E-E-A-T) partly through these
exact pages. A thin or fake-sounding About/Privacy page is a negative signal
for a site that's also asking users to trust it with their files.

## 10. Don't Regress These Rules When Adding Tool #25+

**Rule:** Any time a new tool is added after v1, it must ship with: unique
title/meta, unique intro/FAQ content, JSON-LD, related-tools links, a
sitemap update, and a code-split widget — the same checklist as the
original 24, not a shortcut because "it's just one more tool."

**Why:** SEO debt compounds quietly — a site that did this right for 24
pages and skipped it for the next 10 ends up with a mixed-quality site that
Google evaluates as a whole, not page-by-page. Consistency is what protects
the ranking gains already earned.
