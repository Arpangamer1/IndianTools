import { PDFDocument, PageSizes } from 'pdf-lib';

export async function imagesToPdf(files, options = { fitPage: 'original' }) {
  const fileList = Array.isArray(files) ? files : [files];
  if (fileList.length === 0) throw new Error('Please select at least one image file.');

  const pdfDoc = await PDFDocument.create();

  for (const file of fileList) {
    const arrayBuffer = await file.arrayBuffer();
    let image;

    // Check image format and embed accordingly
    if (file.type.includes('png')) {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      // For JPG / WebP or canvas fallback, convert to JPG stream if needed
      try {
        image = await pdfDoc.embedJpg(arrayBuffer);
      } catch (err) {
        // Render via canvas as JPEG fallback
        const jpegBlob = await convertImageToJpegBlob(file);
        const jpegBuffer = await jpegBlob.arrayBuffer();
        image = await pdfDoc.embedJpg(jpegBuffer);
      }
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
  return { blob, filename: `${baseName}-images-to-pdf.pdf` };
}

function convertImageToJpegBlob(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to decode image ${file.name}`));
    };
    img.src = url;
  });
}
