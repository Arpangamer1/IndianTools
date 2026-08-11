import { PDFDocument, degrees } from 'pdf-lib';

export async function rotatePdf(file, options = { angle: 90, pageRange: 'all' }) {
  const arrayBuffer = await file.arrayBuffer();
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer);
  } catch (err) {
    throw new Error('Failed to load PDF file.');
  }

  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  const rotationAngle = parseInt(options.angle, 10) || 90;

  let pagesToRotate = [];
  if (options.pageRange === 'all' || !options.pageRange) {
    pagesToRotate = pages.map((_, idx) => idx);
  } else {
    // Parse range e.g. "1, 3-5"
    const parts = options.pageRange.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= totalPages) pagesToRotate.push(i - 1);
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages) pagesToRotate.push(p - 1);
      }
    }
  }

  pagesToRotate.forEach((idx) => {
    const page = pages[idx];
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationAngle) % 360));
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.pdf$/i, '');
  return { blob, filename: `${baseName}-rotated.pdf` };
}
