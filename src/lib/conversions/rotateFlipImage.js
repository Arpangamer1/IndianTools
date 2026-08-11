export async function rotateFlipImage(file, options = { angle: 90, flipH: false, flipV: false }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const angle = parseInt(options.angle, 10) || 0;
      const flipH = !!options.flipH;
      const flipV = !!options.flipV;

      const isQuarterRotated = angle === 90 || angle === 270;
      const canvasWidth = isQuarterRotated ? img.height : img.width;
      const canvasHeight = isQuarterRotated ? img.width : img.height;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';

      // Move context origin to center of canvas
      ctx.translate(canvasWidth / 2, canvasHeight / 2);

      // Rotate
      if (angle !== 0) {
        ctx.rotate((angle * Math.PI) / 180);
      }

      // Flip
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Draw image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const mimeType = file.type || 'image/jpeg';
      const ext = file.name.split('.').pop() || 'jpg';
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to process image rotation/flip.'));
          return;
        }
        resolve({ blob, filename: `${baseName}-edited.${ext}` });
      }, mimeType, 0.95);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for editing.'));
    };

    img.src = url;
  });
}
