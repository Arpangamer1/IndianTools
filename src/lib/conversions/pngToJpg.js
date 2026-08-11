export async function pngToJpg(file, options = { bgColor: '#FFFFFF', quality: 0.9 }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Fill background color first (prevents transparent PNG regions from turning black in JPEG)
      ctx.fillStyle = options.bgColor || '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw PNG image over background
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create JPG blob.'));
            return;
          }
          const baseName = file.name.replace(/\.[^/.]+$/, '');
          resolve({ blob, filename: `${baseName}-png-to-jpg.jpg` });
        },
        'image/jpeg',
        options.quality || 0.9
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load PNG image file.'));
    };

    img.src = url;
  });
}
