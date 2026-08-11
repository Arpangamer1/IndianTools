import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

const pdfjs = pdfjsLib.default || pdfjsLib;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function compressPdf(file, options = { mode: 'safe', quality: 0.6 }) {
  const arrayBuffer = await file.arrayBuffer();
  const baseName = file.name.replace(/\.pdf$/i, '');

  if (options.mode === 'safe') {
    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(arrayBuffer);
    } catch (err) {
      throw new Error('Failed to load PDF file. File may be encrypted or corrupt.');
    }

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true, objectsPerTick: 50 });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return { blob, filename: `${baseName}-compressed-safe.pdf` };
  }

  // Aggressive mode: Render pages to canvas, re-encode as JPEG, rebuild PDF
  let pdf;
  try {
    pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  } catch (err) {
    throw new Error('Failed to load PDF document for aggressive compression.');
  }

  const numPages = pdf.numPages;
  const newPdfDoc = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const jpegBlob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', options.quality || 0.6);
    });

    const jpegBytes = await jpegBlob.arrayBuffer();
    const embeddedJpg = await newPdfDoc.embedJpg(jpegBytes);

    const pdfPage = newPdfDoc.addPage([viewport.width, viewport.height]);
    pdfPage.drawImage(embeddedJpg, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
  }

  const pdfBytes = await newPdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return { blob, filename: `${baseName}-compressed-aggressive.pdf` };
}
