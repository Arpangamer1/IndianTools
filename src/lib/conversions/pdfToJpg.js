import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

const pdfjs = pdfjsLib.default || pdfjsLib;
// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function pdfToJpg(file, options = { quality: 0.85, scale: 2.0, onProgress: null }) {
  const arrayBuffer = await file.arrayBuffer();
  let pdf;
  try {
    pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  } catch (err) {
    if (err && err.name === 'PasswordException') {
      throw new Error('This PDF is password-protected and cannot be processed.');
    }
    throw new Error('Could not load PDF document. File may be corrupted.');
  }

  const numPages = pdf.numPages;
  const imageBlobs = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: options.scale || 2.0 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', options.quality || 0.85);
    });

    imageBlobs.push({ pageNum: i, blob });

    if (options.onProgress) {
      options.onProgress(Math.round((i / numPages) * 100));
    }
  }

  if (imageBlobs.length === 1) {
    return { isZip: false, blob: imageBlobs[0].blob, filename: `${file.name.replace(/\.pdf$/i, '')}-page-1.jpg` };
  }

  const zip = new JSZip();
  const baseName = file.name.replace(/\.pdf$/i, '');
  imageBlobs.forEach((item) => {
    zip.file(`${baseName}-page-${item.pageNum}.jpg`, item.blob);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { isZip: true, blob: zipBlob, filename: `${baseName}-jpg-pages.zip` };
}
