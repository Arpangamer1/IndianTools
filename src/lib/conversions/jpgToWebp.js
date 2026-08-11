export async function jpgToWebp(file, options = { quality: 0.85 }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert JPG to WebP.'));
            return;
          }
          const baseName = file.name.replace(/\.[^/.]+$/, '');
          resolve({ blob, filename: `${baseName}-jpg-to-webp.webp` });
        },
        'image/webp',
        options.quality || 0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file.'));
    };

    img.src = url;
  });
}
