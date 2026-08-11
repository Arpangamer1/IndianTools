import * as pdfjsLib from 'pdfjs-dist';

const pdfjs = pdfjsLib.default || pdfjsLib;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function pdfToText(file) {
  const arrayBuffer = await file.arrayBuffer();
  let pdf;
  try {
    pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  } catch (err) {
    throw new Error('Could not read PDF document.');
  }

  let fullText = '';
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const tokenContent = await page.getTextContent();
    const pageText = tokenContent.items.map((item) => item.str).join(' ');
    fullText += `--- Page ${i} ---\n${pageText}\n\n`;
  }

  const cleanText = fullText.trim();
  if (cleanText.replace(/--- Page \d+ ---/g, '').trim().length < 5) {
    throw new Error('This PDF appears to be a scanned document or image-only file. Raw text extraction requires OCR, which is not supported in v1.');
  }

  const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
  const baseName = file.name.replace(/\.pdf$/i, '');
  return { text: cleanText, blob, filename: `${baseName}-extracted-text.txt` };
}
