import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export async function splitPdf(file, options = { mode: 'all', rangeStr: '' }) {
  const arrayBuffer = await file.arrayBuffer();
  let srcPdf;
  try {
    srcPdf = await PDFDocument.load(arrayBuffer);
  } catch (err) {
    throw new Error('Failed to load PDF file. File might be encrypted or corrupted.');
  }

  const totalPages = srcPdf.getPageCount();
  const baseName = file.name.replace(/\.pdf$/i, '');

  if (options.mode === 'range' && options.rangeStr) {
    // Parse range string e.g. "1-3, 5, 7-10"
    const pageIndicesToKeep = new Set();
    const parts = options.rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
        if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
          throw new Error(`Invalid page range "${trimmed}". Total pages: ${totalPages}.`);
        }
        for (let i = start; i <= end; i++) pageIndicesToKeep.add(i - 1);
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
          throw new Error(`Invalid page number "${trimmed}". Total pages: ${totalPages}.`);
        }
        pageIndicesToKeep.add(pageNum - 1);
      }
    }

    if (pageIndicesToKeep.size === 0) {
      throw new Error('No valid pages specified for extraction.');
    }

    const newPdf = await PDFDocument.create();
    const indices = Array.from(pageIndicesToKeep).sort((a, b) => a - b);
    const copiedPages = await newPdf.copyPages(srcPdf, indices);
    copiedPages.forEach((p) => newPdf.addPage(p));

    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return { isZip: false, blob, filename: `${baseName}-split-range.pdf` };
  }

  // Default: Split every page into its own single-page PDF
  const zip = new JSZip();
  for (let i = 0; i < totalPages; i++) {
    const singlePdf = await PDFDocument.create();
    const [copiedPage] = await singlePdf.copyPages(srcPdf, [i]);
    singlePdf.addPage(copiedPage);

    const pdfBytes = await singlePdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    zip.file(`${baseName}-page-${i + 1}.pdf`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { isZip: true, blob: zipBlob, filename: `${baseName}-split-pages.zip` };
}
