import { PDFDocument } from 'pdf-lib';

export async function deletePdfPages(file, pagesToDelete = []) {
  const arrayBuffer = await file.arrayBuffer();
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer);
  } catch (err) {
    throw new Error('Failed to load PDF file.');
  }

  const totalPages = pdfDoc.getPageCount();
  if (pagesToDelete.length >= totalPages) {
    throw new Error('You cannot delete all pages in a PDF. At least one page must remain.');
  }

  // Sort indices in descending order so removal doesn't shift indices during loop
  const sortedIndices = [...pagesToDelete].sort((a, b) => b - a);

  sortedIndices.forEach((index) => {
    if (index >= 0 && index < pdfDoc.getPageCount()) {
      pdfDoc.removePage(index);
    }
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.pdf$/i, '');
  return { blob, filename: `${baseName}-pages-removed.pdf` };
}
