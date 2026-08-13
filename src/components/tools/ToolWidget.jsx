import React, { useState, useEffect } from 'react';
import DropZone from '../ui/DropZone';
import { saveAs } from 'file-saver';
import { logToolUsage } from '../../lib/analytics';
import { Download, RefreshCw, AlertCircle, CheckCircle, Sliders, Play, Settings, FileText } from 'lucide-react';

export default function ToolWidget({ tool }) {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [thumbnails, setThumbnails] = useState([]);
  const [selectedPageIndices, setSelectedPageIndices] = useState([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);

  const [options, setOptions] = useState({
    quality: 0.8,
    scale: 2.0,
    fitPage: 'original',
    splitMode: 'all',
    rangeStr: '',
    compressMode: 'safe',
    rotateAngle: 90,
    watermarkText: 'CONFIDENTIAL',
    watermarkOpacity: 0.3,
    watermarkSize: 48,
    watermarkRotation: 45,
    watermarkColor: '#1F2937',
    bgColor: '#FFFFFF',
    resizeWidth: 800,
    resizeHeight: 600,
    lockAspect: true,
    flipH: false,
    flipV: false,
    targetSizeMB: 0.5,
    base64Input: '',
    base64Output: '',
    base64Mode: 'encode',
  });

  useEffect(() => {
    if (['delete-pdf-pages', 'reorder-pdf-pages', 'extract-pdf-pages'].includes(tool.slug) && files.length > 0) {
      loadPdfThumbnails(files[0]);
    } else {
      setThumbnails([]);
      setSelectedPageIndices([]);
    }
  }, [files, tool.slug]);

  const loadPdfThumbnails = async (file) => {
    setIsLoadingThumbnails(true);
    setError(null);
    try {
      // Dynamically import pdfjs-dist only when thumbnails are needed
      const pdfjsLib = await import('pdfjs-dist');
      const pdfjs = pdfjsLib.default || pdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      const numPages = pdf.numPages;
      const thumbs = [];
      const defaultIndices = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;

        thumbs.push({
          pageIndex: i - 1,
          pageNum: i,
          dataUrl: canvas.toDataURL(),
        });
        defaultIndices.push(i - 1);
      }

      setThumbnails(thumbs);
      setSelectedPageIndices(defaultIndices);
    } catch (err) {
      console.error(err);
      setError('Could not generate PDF thumbnails. Ensure file is not password protected.');
    } finally {
      setIsLoadingThumbnails(false);
    }
  };

  const handleFilesSelected = (newFiles) => {
    setFiles(newFiles);
    setError(null);
    setResult(null);
  };

  const handleRemoveFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    setResult(null);
  };

  const handleOptionChange = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const executeConversion = async () => {
    if (tool.slug === 'image-to-base64' && options.base64Mode === 'decode') {
      if (!options.base64Input.trim()) {
        setError('Please paste a Base64 string to decode.');
        return;
      }
    } else if (files.length === 0) {
      setError('Please select a file to proceed.');
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      let outputResult = null;

      switch (tool.slug) {
        case 'pdf-to-jpg': {
          const { pdfToJpg } = await import('../../lib/conversions/pdfToJpg');
          outputResult = await pdfToJpg(files[0], {
            quality: options.quality,
            scale: options.scale,
            onProgress: setProgress,
          });
          break;
        }
        case 'jpg-to-pdf': {
          const { jpgToPdf } = await import('../../lib/conversions/jpgToPdf');
          outputResult = await jpgToPdf(files, { fitPage: options.fitPage });
          break;
        }
        case 'pdf-to-png': {
          const { pdfToPng } = await import('../../lib/conversions/pdfToPng');
          outputResult = await pdfToPng(files[0], {
            scale: options.scale,
            onProgress: setProgress,
          });
          break;
        }
        case 'png-to-pdf': {
          const { pngToPdf } = await import('../../lib/conversions/pngToPdf');
          outputResult = await pngToPdf(files, { fitPage: options.fitPage });
          break;
        }
        case 'merge-pdf': {
          const { mergePdf } = await import('../../lib/conversions/mergePdf');
          outputResult = await mergePdf(files);
          break;
        }
        case 'split-pdf': {
          const { splitPdf } = await import('../../lib/conversions/splitPdf');
          outputResult = await splitPdf(files[0], {
            mode: options.splitMode,
            rangeStr: options.rangeStr,
          });
          break;
        }
        case 'compress-pdf': {
          const { compressPdf } = await import('../../lib/conversions/compressPdf');
          outputResult = await compressPdf(files[0], {
            mode: options.compressMode,
            quality: options.quality,
          });
          break;
        }
        case 'rotate-pdf': {
          const { rotatePdf } = await import('../../lib/conversions/rotatePdf');
          outputResult = await rotatePdf(files[0], {
            angle: options.rotateAngle,
            pageRange: options.rangeStr || 'all',
          });
          break;
        }
        case 'delete-pdf-pages': {
          const { deletePdfPages } = await import('../../lib/conversions/deletePdfPages');
          const allIndices = thumbnails.map((t) => t.pageIndex);
          const pagesToDelete = allIndices.filter((idx) => !selectedPageIndices.includes(idx));
          outputResult = await deletePdfPages(files[0], pagesToDelete);
          break;
        }
        case 'reorder-pdf-pages': {
          const { reorderPdfPages } = await import('../../lib/conversions/reorderPdfPages');
          outputResult = await reorderPdfPages(files[0], selectedPageIndices);
          break;
        }
        case 'extract-pdf-pages': {
          const { extractPdfPages } = await import('../../lib/conversions/extractPdfPages');
          outputResult = await extractPdfPages(files[0], selectedPageIndices);
          break;
        }
        case 'pdf-to-text': {
          const { pdfToText } = await import('../../lib/conversions/pdfToText');
          outputResult = await pdfToText(files[0]);
          break;
        }
        case 'watermark-pdf': {
          const { watermarkPdf } = await import('../../lib/conversions/watermarkPdf');
          outputResult = await watermarkPdf(files[0], {
            text: options.watermarkText,
            opacity: options.watermarkOpacity,
            size: options.watermarkSize,
            rotation: options.watermarkRotation,
            color: options.watermarkColor,
          });
          break;
        }
        case 'jpg-to-png': {
          const { jpgToPng } = await import('../../lib/conversions/jpgToPng');
          outputResult = await jpgToPng(files[0]);
          break;
        }
        case 'png-to-jpg': {
          const { pngToJpg } = await import('../../lib/conversions/pngToJpg');
          outputResult = await pngToJpg(files[0], {
            bgColor: options.bgColor,
            quality: options.quality,
          });
          break;
        }
        case 'webp-to-jpg': {
          const { webpToJpg } = await import('../../lib/conversions/webpToJpg');
          outputResult = await webpToJpg(files[0], { quality: options.quality });
          break;
        }
        case 'jpg-to-webp': {
          const { jpgToWebp } = await import('../../lib/conversions/jpgToWebp');
          outputResult = await jpgToWebp(files[0], { quality: options.quality });
          break;
        }
        case 'png-to-webp': {
          const { pngToWebp } = await import('../../lib/conversions/pngToWebp');
          outputResult = await pngToWebp(files[0], { quality: options.quality });
          break;
        }
        case 'image-compressor': {
          const { imageCompressor } = await import('../../lib/conversions/imageCompressor');
          outputResult = await imageCompressor(files[0], {
            maxSizeMB: options.targetSizeMB,
            quality: options.quality,
          });
          break;
        }
        case 'image-resizer': {
          const { imageResizer } = await import('../../lib/conversions/imageResizer');
          outputResult = await imageResizer(files[0], {
            width: options.resizeWidth,
            height: options.resizeHeight,
            lockAspect: options.lockAspect,
          });
          break;
        }
        case 'image-cropper': {
          const { imageResizer } = await import('../../lib/conversions/imageResizer');
          outputResult = await imageResizer(files[0], {
            width: options.resizeWidth,
            height: options.resizeHeight,
            lockAspect: false,
          });
          break;
        }
        case 'image-to-base64': {
          const { fileToBase64, base64ToBlob } = await import('../../lib/conversions/imageToBase64');
          if (options.base64Mode === 'encode') {
            const b64 = await fileToBase64(files[0]);
            outputResult = { isBase64: true, text: b64, filename: `${files[0].name}.txt` };
          } else {
            const blob = base64ToBlob(options.base64Input);
            outputResult = { blob, filename: `decoded-image-${Date.now()}.png` };
          }
          break;
        }
        case 'rotate-flip-image': {
          const { rotateFlipImage } = await import('../../lib/conversions/rotateFlipImage');
          outputResult = await rotateFlipImage(files[0], {
            angle: options.rotateAngle,
            flipH: options.flipH,
            flipV: options.flipV,
          });
          break;
        }
        case 'images-to-pdf': {
          const { imagesToPdf } = await import('../../lib/conversions/imagesToPdf');
          outputResult = await imagesToPdf(files, { fitPage: options.fitPage });
          break;
        }
        default:
          throw new Error('Unsupported tool.');
      }

      setProgress(100);
      setResult(outputResult);
      logToolUsage(tool.slug);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    if (result.blob) {
      saveAs(result.blob, result.filename);
    } else if (result.text && !result.isBase64) {
      const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, result.filename);
    }
  };

  const resetAll = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
    setThumbnails([]);
  };

  return (
    <div className="space-y-6">
      
      {/* 2-Column Split Widget Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Dropzone */}
        <div className="lg:col-span-7">
          <DropZone
            accept={tool.accept}
            multiple={tool.multiple}
            files={files}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
          />
        </div>

        {/* Right Column: Settings panel */}
        <div className="lg:col-span-5 bg-gray-50 border border-gray-200/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-charcoal-800 font-bold text-xs sm:text-sm">
            <Settings className="w-4.5 h-4.5 text-saffron flex-shrink-0" />
            <span>Options</span>
          </div>

          <div className="space-y-4 text-xs font-semibold text-charcoal-700">
            {/* Page Range options */}
            {['pdf-to-jpg', 'pdf-to-png', 'split-pdf', 'rotate-pdf'].includes(tool.slug) && (
              <div className="space-y-2">
                <p className="font-bold text-gray-700">Page Range</p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pageRangeOption"
                      value="all"
                      checked={options.splitMode === 'all'}
                      onChange={() => handleOptionChange('splitMode', 'all')}
                      className="accent-saffron"
                    />
                    <span>All Pages</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pageRangeOption"
                      value="range"
                      checked={options.splitMode === 'range'}
                      onChange={() => handleOptionChange('splitMode', 'range')}
                      className="accent-saffron"
                    />
                    <span>Custom Range</span>
                  </label>

                  {options.splitMode === 'range' && (
                    <input
                      type="text"
                      placeholder="e.g. 1-5, 8, 11-13"
                      value={options.rangeStr}
                      onChange={(e) => handleOptionChange('rangeStr', e.target.value)}
                      className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Quality Slider */}
            {['pdf-to-jpg', 'png-to-jpg', 'webp-to-jpg', 'jpg-to-webp', 'png-to-webp', 'compress-pdf', 'image-compressor'].includes(tool.slug) && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-700">Image Quality</label>
                  <span className="text-saffron font-bold">{Math.round(options.quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={options.quality}
                  onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
                  className="w-full accent-saffron"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Low (Small size)</span>
                  <span>High (Best quality)</span>
                </div>
              </div>
            )}

            {/* Format toggle options */}
            {['pdf-to-jpg', 'pdf-to-png', 'jpg-to-png', 'png-to-jpg', 'webp-to-jpg', 'jpg-to-webp', 'png-to-webp'].includes(tool.slug) && (
              <div className="space-y-2">
                <p className="font-bold text-gray-700">Image Format</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageFormatToggle"
                      value="jpg"
                      checked={tool.slug.endsWith('jpg') || tool.slug.startsWith('jpg-to-png') ? true : false}
                      readOnly
                      className="accent-saffron"
                    />
                    <span>JPG</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageFormatToggle"
                      value="png"
                      checked={tool.slug.endsWith('png') ? true : false}
                      readOnly
                      className="accent-saffron"
                    />
                    <span>PNG</span>
                  </label>
                </div>
              </div>
            )}

            {/* Fit page option */}
            {['jpg-to-pdf', 'png-to-pdf', 'images-to-pdf'].includes(tool.slug) && (
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Page Fit Mode</label>
                <select
                  value={options.fitPage}
                  onChange={(e) => handleOptionChange('fitPage', e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl"
                >
                  <option value="original">Fit to Image Natural Dimensions</option>
                  <option value="a4">Standard A4 Page (with margins)</option>
                </select>
              </div>
            )}

            {/* Image Resize / Crop dimensions */}
            {['image-resizer', 'image-cropper'].includes(tool.slug) && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Width (px)</label>
                  <input
                    type="number"
                    value={options.resizeWidth}
                    onChange={(e) => handleOptionChange('resizeWidth', parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Height (px)</label>
                  <input
                    type="number"
                    value={options.resizeHeight}
                    onChange={(e) => handleOptionChange('resizeHeight', parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Watermark PDF settings */}
            {tool.slug === 'watermark-pdf' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Watermark Text</label>
                  <input
                    type="text"
                    value={options.watermarkText}
                    onChange={(e) => handleOptionChange('watermarkText', e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700">Opacity: {Math.round(options.watermarkOpacity * 100)}%</label>
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={options.watermarkOpacity}
                    onChange={(e) => handleOptionChange('watermarkOpacity', parseFloat(e.target.value))}
                    className="w-full accent-saffron"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Interactive Page Selector for Delete/Reorder/Extract Pages */}
      {['delete-pdf-pages', 'reorder-pdf-pages', 'extract-pdf-pages'].includes(tool.slug) && thumbnails.length > 0 && (
        <div className="space-y-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
              Select & Organize PDF Pages ({thumbnails.length} Total)
            </h4>
            <span className="text-[11px] text-gray-500">
              Click thumbnails to select/deselect
            </span>
          </div>

          {isLoadingThumbnails ? (
            <div className="p-6 text-center text-xs text-gray-500">Rendering page thumbnails...</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-72 overflow-y-auto p-1">
              {thumbnails.map((thumb) => {
                const isSelected = selectedPageIndices.includes(thumb.pageIndex);
                return (
                  <div
                    key={thumb.pageIndex}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPageIndices(selectedPageIndices.filter((i) => i !== thumb.pageIndex));
                      } else {
                        setSelectedPageIndices([...selectedPageIndices, thumb.pageIndex]);
                      }
                    }}
                    className={`cursor-pointer relative border-2 rounded-xl p-1.5 transition-all text-center ${
                      isSelected
                        ? 'border-saffron bg-saffron-50/40 shadow-xs scale-[1.02]'
                        : 'border-gray-200 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                    }`}
                  >
                    <img src={thumb.dataUrl} alt={`Page ${thumb.pageNum}`} className="w-full h-auto rounded shadow-3xs" />
                    <span className="text-[10px] font-bold text-gray-600 block mt-1">Page {thumb.pageNum}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Action Convert Button */}
      {!result && (
        <button
          onClick={executeConversion}
          disabled={isProcessing}
          className="w-full py-4 bg-saffron hover:bg-saffron-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Converting...</span>
          ) : (
            <>
              <Play className="w-4.5 h-4.5 fill-current" />
              <span>Convert to {tool.name.replace('PDF to ', '').replace('JPG to ', '').replace('PNG to ', '').replace('WebP to ', '')}</span>
            </>
          )}
        </button>
      )}

      {/* 5. Error Alert Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* 6. Progress Indicator */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-charcoal-700">
            <span>Processing locally...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-saffron h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 7. Output Result Card */}
      {result ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-center space-y-4 animate-fade-in">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-emerald-950">Conversion Completed!</h3>
            <p className="text-xs text-emerald-700 mt-0.5">
              File processed safely inside your browser. Ready for download.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Converted File</span>
            </button>

            <button
              onClick={resetAll}
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-charcoal-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Convert Another File</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50 flex flex-col items-center justify-center space-y-2">
          <FileText className="w-8 h-8 text-gray-300" />
          <p className="text-xs font-bold text-gray-500">Your converted files will appear here</p>
          <p className="text-[10px] text-gray-400">Convert your file to see the results and download your images.</p>
        </div>
      )}

    </div>
  );
}
