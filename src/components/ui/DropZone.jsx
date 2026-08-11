import React, { useRef, useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

export default function DropZone({ accept = '*', multiple = false, onFilesSelected, files = [], onRemoveFile }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      if (multiple) {
        onFilesSelected([...files, ...droppedFiles]);
      } else {
        onFilesSelected([droppedFiles[0]]);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      if (multiple) {
        onFilesSelected([...files, ...selectedFiles]);
      } else {
        onFilesSelected([selectedFiles[0]]);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Drop Target Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-saffron bg-saffron-50/50 scale-[1.01]'
            : 'border-gray-300 hover:border-saffron bg-white hover:bg-gray-50/60 shadow-2xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-saffron-50 text-saffron flex items-center justify-center shadow-inner">
            <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.75]" />
          </div>

          <div>
            <p className="text-sm sm:text-base font-bold text-charcoal-800">
              Drag & Drop your file{multiple ? 's' : ''} here, or <span className="text-saffron underline">Browse</span>
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
              100% Client-Side Processing • Files stay in your browser
            </p>
          </div>
        </div>
      </div>

      {/* Selected File List */}
      {files && files.length > 0 && (
        <div className="mt-4 sm:mt-6 space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Selected File{files.length > 1 ? 's' : ''} ({files.length})
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-white border border-gray-200/80 rounded-xl shadow-2xs"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div className="p-2 bg-gray-100 rounded-lg text-charcoal-700 flex-shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-semibold text-charcoal-800 truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(index);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
