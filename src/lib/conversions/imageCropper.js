export async function imageCropper(file, croppedAreaPixels) {
  return new Promise((resolve, reject) => {
    if (!croppedAreaPixels || !croppedAreaPixels.width || !croppedAreaPixels.height) {
      reject(new Error('Invalid crop area specified.'));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const mimeType = file.type || 'image/jpeg';
      const ext = file.name.split('.').pop() || 'jpg';
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to crop image.'));
          return;
        }
        resolve({ blob, filename: `${baseName}-cropped.${ext}` });
      }, mimeType, 0.95);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for cropping.'));
    };

    img.src = url;
  });
}
