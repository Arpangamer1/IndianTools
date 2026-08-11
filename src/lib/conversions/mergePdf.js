import { PDFDocument } from 'pdf-lib';

export async function mergePdf(files) {
  const fileList = Array.isArray(files) ? files : [files];
  if (fileList.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (err) {
      throw new Error(`Could not process PDF "${file.name}". File might be encrypted or corrupted.`);
    }
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return { blob, filename: `merged-document-${Date.now()}.pdf` };
}
