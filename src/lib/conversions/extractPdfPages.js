import { PDFDocument } from 'pdf-lib';

export async function extractPdfPages(file, selectedPageIndices = []) {
  if (!selectedPageIndices || selectedPageIndices.length === 0) {
    throw new Error('Please select at least one page to extract.');
  }

  const arrayBuffer = await file.arrayBuffer();
  let srcPdf;
  try {
    srcPdf = await PDFDocument.load(arrayBuffer);
  } catch (err) {
    throw new Error('Failed to load PDF file.');
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, selectedPageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.pdf$/i, '');
  return { blob, filename: `${baseName}-extracted.pdf` };
}
