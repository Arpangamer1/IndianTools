import imageCompression from 'browser-image-compression';

export async function imageCompressor(file, options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, quality: 0.7 }) {
  const compOptions = {
    maxSizeMB: parseFloat(options.maxSizeMB) || 0.5,
    maxWidthOrHeight: parseInt(options.maxWidthOrHeight, 10) || 1920,
    initialQuality: parseFloat(options.quality) || 0.7,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, compOptions);
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const ext = file.name.split('.').pop();
    return {
      blob: compressedFile,
      filename: `${baseName}-compressed.${ext}`,
      originalSize: file.size,
      compressedSize: compressedFile.size,
    };
  } catch (err) {
    throw new Error('Image compression failed. Please try a different quality target.');
  }
}
