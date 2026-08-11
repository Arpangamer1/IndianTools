export async function imageResizer(file, options = { width: 800, height: 600, lockAspect: true }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let targetWidth = parseInt(options.width, 10);
      let targetHeight = parseInt(options.height, 10);

      if (options.lockAspect) {
        const aspect = img.width / img.height;
        if (targetWidth && !targetHeight) {
          targetHeight = Math.round(targetWidth / aspect);
        } else if (targetHeight && !targetWidth) {
          targetWidth = Math.round(targetHeight * aspect);
        } else if (targetWidth && targetHeight) {
          targetHeight = Math.round(targetWidth / aspect);
        }
      }

      targetWidth = targetWidth || img.width;
      targetHeight = targetHeight || img.height;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = file.type || 'image/jpeg';
      const ext = file.name.split('.').pop() || 'jpg';
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to resize image.'));
          return;
        }
        resolve({ blob, filename: `${baseName}-resized-${targetWidth}x${targetHeight}.${ext}` });
      }, mimeType, 0.92);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file.'));
    };

    img.src = url;
  });
}
