import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export async function watermarkPdf(file, options = { text: 'CONFIDENTIAL', opacity: 0.3, size: 48, rotation: 45, color: '#1F2937' }) {
  if (!options.text || options.text.trim() === '') {
    throw new Error('Please provide watermark text.');
  }

  const arrayBuffer = await file.arrayBuffer();
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer);
  } catch (err) {
    throw new Error('Failed to load PDF file.');
  }

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  // Convert hex color to rgb
  const hex = (options.color || '#1F2937').replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255 || 0.12;
  const g = parseInt(hex.substring(2, 4), 16) / 255 || 0.16;
  const b = parseInt(hex.substring(4, 6), 16) / 255 || 0.21;

  const watermarkText = options.text.trim();
  const fontSize = parseInt(options.size, 10) || 48;
  const opacity = parseFloat(options.opacity) || 0.3;
  const rotationAngle = parseInt(options.rotation, 10) || 45;

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(watermarkText, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font: font,
      color: rgb(r, g, b),
      opacity: opacity,
      rotate: degrees(rotationAngle),
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.pdf$/i, '');
  return { blob, filename: `${baseName}-watermarked.pdf` };
}
