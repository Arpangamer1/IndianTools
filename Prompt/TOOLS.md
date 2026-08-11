# TOOLS.md — How Each Tool Actually Works

This is the functional spec for all 24 tools — the exact client-side logic,
library, options, and edge cases for each one. PAGE_STRUCTURE.md covers
layout, INSTRUCTIONS.md covers global dev/SEO rules; this doc covers what
happens when the user actually clicks "Convert."

## 0. Shared Pattern (applies to every tool)

Every `ToolWidget` follows the same shape, regardless of what it converts:

1. Drop zone / file picker → file(s) held in React state, never uploaded anywhere
2. Tool-specific options (if any) — sensible defaults pre-filled, nothing required to touch
3. "Convert" button → runs the pure function from `lib/conversions/<slug>.js`
4. Progress indicator while processing (some of these, like PDF-to-JPG on a
   50-page file, take real seconds — never let the UI look frozen)
5. On success: fire the `tool_usage` log (fire-and-forget), show a preview +
   Download button
6. Downloaded filename convention: `{original-name}-{slug}.{ext}` (e.g.
   `report-pdf-to-jpg.zip`) — predictable and never silently overwrites
   the user's original file name
7. On failure: plain inline error message near the drop zone (never a raw
   console error) — e.g. "This file doesn't look like a valid PDF."

**One note on libraries, since it came up with the homepage graphic:** the
"no extra libraries" rule was specifically about decorative 3D/animation —
it does not apply here. A few of these tools (Image Cropper especially)
genuinely need a small, focused utility library to work correctly and
aren't worth reinventing by hand. Keep them tiny and code-split per tool
page, same as `pdf-lib`/`pdfjs-dist`, so they never touch the main bundle.

---

## PDF Tools

### 1. PDF to JPG (`pdf-to-jpg`)
- **Library:** `pdfjs-dist`
- **Logic:** load the PDF via `getDocument()`, iterate every page, render
  each to an offscreen `<canvas>` at the chosen scale/DPI, export via
  `canvas.toBlob('image/jpeg', quality)`.
- **Options:** JPEG quality slider, page range (default: all pages)
- **Output:** single JPG if 1 page; a `.zip` (via `jszip`) if multiple
- **Edge cases:** password-protected PDF → catch the load error, show
  "This PDF is password-protected and can't be processed"; very large page
  counts → process and show progress per page, don't block the UI thread
  for the whole batch at once (chunk with `requestAnimationFrame` or a small
  delay between pages)

### 2. JPG to PDF (`jpg-to-pdf`)
- **Library:** `pdf-lib`
- **Logic:** read image as `ArrayBuffer`, `pdfDoc.embedJpg()`, create a page
  sized to the image's natural dimensions (or a chosen fit), draw the image,
  `pdfDoc.save()`.
- **Options:** page size (fit-to-image / A4-fit-with-margins)
- **Edge cases:** reject non-JPEG files at the drop zone with a clear message
  pointing to PNG-to-PDF instead

### 3. PDF to PNG (`pdf-to-png`)
- Identical pipeline to PDF to JPG, using `canvas.toBlob('image/png')` — no
  quality slider needed since PNG is lossless; DPI/scale option instead.

### 4. PNG to PDF (`png-to-pdf`)
- Identical pipeline to JPG to PDF using `pdfDoc.embedPng()`.

### 5. Merge PDF (`merge-pdf`)
- **Library:** `pdf-lib`
- **Logic:** create a new empty `PDFDocument`; for each uploaded file, load
  it and `copyPages()` all of its pages into the new doc, in the order the
  user arranged them.
- **Options:** drag-to-reorder list of uploaded files before merging
- **Edge cases:** an encrypted source PDF fails to load — surface which
  specific file failed, not just a generic error

### 6. Split PDF (`split-pdf`)
- **Library:** `pdf-lib` + `jszip`
- **Logic:** load source PDF; depending on mode, either copy a page range
  into one new PDF, or copy every page into its own single-page PDF and zip
  them together.
- **Options:** split by custom range / split every N pages / split into
  individual pages
- **Edge cases:** validate the range input against actual page count before
  running

### 7. Compress PDF (`compress-pdf`)
- **Library:** `pdf-lib` (+ `pdfjs-dist` for the aggressive mode)
- **Logic — two honest modes, not one fake "compress" button:**
  - **Safe mode:** re-save with `useObjectStreams: true` and strip unused
    metadata/objects. Modest size reduction, text stays selectable, nothing
    visually changes.
  - **Aggressive mode:** render each page to a canvas via `pdfjs-dist`,
    re-export as a compressed JPEG per page, rebuild the PDF from those
    images via `pdf-lib`. Much smaller file, but **text is no longer
    selectable/searchable** — the UI must clearly warn about this trade-off
    before running it.
- **Options:** mode toggle (Safe / Aggressive), quality slider (aggressive
  mode only)
- **Edge cases:** already-scanned/image-based PDFs benefit most from
  aggressive mode; text-heavy PDFs should default to Safe mode

### 8. Rotate PDF (`rotate-pdf`)
- **Library:** `pdf-lib`, `page.setRotation(degrees)`
- **Options:** rotate all pages or a selected subset, angle 90°/180°/270°
- **Edge cases:** add to existing rotation rather than overwrite, so
  repeated rotation calls behave predictably

### 9. Delete PDF Pages (`delete-pdf-pages`)
- **Library:** `pdf-lib` (`removePage`) + `pdfjs-dist` for page thumbnails
- **Logic:** render a thumbnail grid, user taps pages to mark for deletion,
  remove those indices, save
- **Edge cases:** block the action if it would delete every page (must keep
  at least one)

### 10. Reorder PDF Pages (`reorder-pdf-pages`)
- **Library:** `pdf-lib` (`copyPages` in new order) + `pdfjs-dist` thumbnails
- **Logic:** drag-and-drop thumbnail grid, on confirm copy pages into the
  new order into a fresh `PDFDocument`
- **Edge cases:** for very high page counts, virtualize the thumbnail list
  so the browser doesn't choke rendering 200 canvases at once

### 11. Extract PDF Pages (`extract-pdf-pages`)
- **Library:** `pdf-lib`
- **Logic:** user selects a range or specific pages (thumbnail multi-select),
  `copyPages()` just those into a new document
- **Edge cases:** block submit if zero pages are selected

### 12. PDF to Text (`pdf-to-text`)
- **Library:** `pdfjs-dist`
- **Logic:** iterate pages, call `page.getTextContent()`, join the text
  items, separate pages with a line break, offer as a `.txt` download
- **Edge cases:** scanned/image-only PDFs return empty text — detect this
  (near-zero extracted characters) and show "This PDF appears to be
  scanned; text extraction needs OCR, which isn't supported yet" rather than
  silently returning a blank file. (OCR via `tesseract.js` is a real option
  for a future phase, but it's a heavy client-side library — worth its own
  cost/benefit decision later, not bundled into v1.)

### 13. Watermark PDF (`watermark-pdf`)
- **Library:** `pdf-lib`
- **Logic:** loop through pages, `page.drawText()` (or `drawImage()` for an
  image watermark) with configurable opacity, rotation, and position
- **Options:** text or image watermark, opacity slider, position preset
  (center / diagonal / corner)

---

## Image Tools

### 14. JPG to PNG (`jpg-to-png`)
- Canvas: draw the image, `canvas.toBlob('image/png')`. No transparency
  concerns since source JPG has none.

### 15. PNG to JPG (`png-to-jpg`)
- Canvas: **must** composite the PNG over a solid background first (JPEG
  has no alpha channel) — default white, with a background color picker
  option — then `toBlob('image/jpeg', quality)`.
- **Edge case:** skipping the composite step turns transparent areas black;
  this is the single most common bug in this exact conversion, worth a
  code comment flagging it.

### 16. WebP to JPG (`webp-to-jpg`)
- Canvas: draw the WebP (natively decodable in an `<img>`/canvas in all
  current major browsers), export as JPEG.

### 17. JPG to WebP (`jpg-to-webp`)
- Canvas: `canvas.toBlob('image/webp', quality)`.

### 18. PNG to WebP (`png-to-webp`)
- Same as above — WebP supports alpha, so no background compositing needed
  here (unlike PNG to JPG).

### 19. Image Compressor (`image-compressor`)
- **Library:** `browser-image-compression`
- **Options:** target max file size (KB), quality slider, max
  width/height cap
- **Edge cases:** if the file is already smaller than the target, skip
  re-compressing it and say so, rather than potentially making it larger

### 20. Image Resizer (`image-resizer`)
- Canvas: draw scaled to the requested width/height
- **Options:** width/height inputs, lock-aspect-ratio toggle, mode
  (fit / crop-to-fill / stretch)
- **Edge cases:** warn when the requested size is an upscale (quality loss
  is expected and not a bug)

### 21. Image Cropper (`image-cropper`)
- **Library:** a small focused cropping utility (e.g. `react-easy-crop`,
  a few KB, code-split onto this page only) rather than hand-rolling drag
  math — this is the one tool where a helper library is worth it
- **Options:** free-form crop or aspect ratio presets (1:1, 4:3, 16:9)
- **Logic:** on confirm, draw only the selected region onto a new canvas at
  the selection's pixel size, export

### 22. Image to Base64 (`image-to-base64`)
- `FileReader.readAsDataURL(file)` → display the resulting string with a
  copy-to-clipboard button
- Include the reverse direction on the same page: paste a base64 string,
  render it via an `<img>` tag, offer it as a downloadable file
- **Edge cases:** very large images produce huge strings — show a rough
  size warning rather than silently freezing the textarea

### 23. Rotate / Flip Image (`rotate-flip-image`)
- Canvas: `ctx.rotate()` for 90°/180°/270°, `ctx.scale(-1, 1)` or
  `ctx.scale(1, -1)` for horizontal/vertical flip — these can combine (e.g.
  rotate 90° and flip)

### 24. Multiple Images to PDF (`images-to-pdf`)
- **Library:** `pdf-lib`
- **Logic:** same embed approach as JPG-to-PDF/PNG-to-PDF, but looped over
  every uploaded image, each on its own page, in the order the user arranges
  via a drag-to-reorder thumbnail list
- **Options:** uniform page size (all pages A4) vs. fit-to-each-image,
  margin size

---

## Build Order Note

Tools 14-18 (the plain format conversions) share almost identical canvas
logic and are the fastest to build first to prove the `ToolWidget` pattern
end to end — this matches the build order already set in INSTRUCTIONS.md
§8 (start with 2-3 tools, e.g. an image conversion + the compressor, before
tackling the PDF-heavy ones).
