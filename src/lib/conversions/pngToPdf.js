import { PDFDocument, PageSizes } from 'pdf-lib';

export async function pngToPdf(files, options = { fitPage: 'original' }) {
  const fileList = Array.isArray(files) ? files : [files];
  if (fileList.length === 0) throw new Error('Please select at least one PNG image.');

  const pdfDoc = await PDFDocument.create();

  for (const file of fileList) {
    const arrayBuffer = await file.arrayBuffer();
    let image;
    try {
      image = await pdfDoc.embedPng(arrayBuffer);
    } catch (err) {
      throw new Error(`Failed to embed PNG ${file.name}. Ensure it is a valid PNG image.`);
    }

    const imgWidth = image.width;
    const imgHeight = image.height;

    if (options.fitPage === 'a4') {
      const [a4Width, a4Height] = PageSizes.A4;
      const page = pdfDoc.addPage([a4Width, a4Height]);
      
      const margin = 20;
      const maxWidth = a4Width - margin * 2;
      const maxHeight = a4Height - margin * 2;
      
      const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      const x = (a4Width - scaledWidth) / 2;
      const y = (a4Height - scaledHeight) / 2;

      page.drawImage(image, { x, y, width: scaledWidth, height: scaledHeight });
    } else {
      const page = pdfDoc.addPage([imgWidth, imgHeight]);
      page.drawImage(image, { x: 0, y: 0, width: imgWidth, height: imgHeight });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = fileList[0].name.replace(/\.[^/.]+$/, '');
  return { blob, filename: `${baseName}-png-to-pdf.pdf` };
}
