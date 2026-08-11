export const TOOLS = [
  // --- PDF TOOLS (13) ---
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    description: 'Convert PDF pages into high-quality JPG images instantly.',
    icon: 'FileImage',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'Convert PDF to JPG Free Online — No Upload Needed | IndianTools',
    seoDescription: 'Convert every PDF page to high quality JPG images directly inside your browser. 100% free, private, and secure with no file uploads.',
    howItWorks: 'This tool uses pdf.js to render each PDF page onto an in-memory HTML5 canvas at your chosen DPI resolution. The canvas content is then exported directly to JPEG format without sending a single byte to any external server. For multi-page documents, all output images are packaged into a downloadable ZIP file.',
    faqs: [
      { question: 'Is my PDF uploaded to any server?', answer: 'No. The entire conversion process runs locally inside your browser using JavaScript. Your files stay on your device.' },
      { question: 'What happens if my PDF has multiple pages?', answer: 'Each page will be converted into a separate JPG image and automatically bundled into a single ZIP file for easy download.' },
      { question: 'Can I convert password-protected PDFs?', answer: 'You will need to unlock the PDF first. Password-protected files cannot be read by the browser engine until unlocked.' }
    ],
    relatedSlugs: ['jpg-to-pdf', 'pdf-to-png', 'split-pdf']
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'pdf',
    description: 'Convert JPG images into a clean single or multi-page PDF document.',
    icon: 'FileText',
    accept: '.jpg,.jpeg,image/jpeg',
    multiple: true,
    seoTitle: 'Convert JPG to PDF Free Online — Fast & Private | IndianTools',
    seoDescription: 'Combine JPG images into a single PDF document in seconds. 100% client-side processing keeps your files completely private.',
    howItWorks: 'Your JPG images are embedded directly into a newly generated PDF document using pdf-lib. You can choose whether each page fits the image natural dimensions or adapts to standard A4 dimensions with clean margins.',
    faqs: [
      { question: 'Can I upload multiple JPG images at once?', answer: 'Yes! You can upload multiple JPGs, reorder them, and merge them into a single multi-page PDF document.' },
      { question: 'Are there file size or upload limits?', answer: 'Because all processing happens on your computer using browser memory, there are no strict artificial limits.' },
      { question: 'Does this compress or degrade my image quality?', answer: 'No quality loss occurs during PDF embedding; your images are rendered with original pixel resolution.' }
    ],
    relatedSlugs: ['pdf-to-jpg', 'png-to-pdf', 'images-to-pdf']
  },
  {
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'pdf',
    description: 'Extract PDF pages as crisp, lossless PNG images.',
    icon: 'Image',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'Convert PDF to PNG Online Free — Lossless Quality | IndianTools',
    seoDescription: 'Render PDF pages into clear PNG images right in your browser. Fast, free, and completely private with zero file transfers.',
    howItWorks: 'Our converter renders PDF pages onto an HTML5 canvas using pdf.js and outputs lossless PNG image blobs. PNG retains full detail without JPEG compression artifacts.',
    faqs: [
      { question: 'Why choose PNG over JPG for PDF conversion?', answer: 'PNG is a lossless format, making it ideal for diagrams, text documents, and high-contrast graphics where clear edges are required.' },
      { question: 'Are files saved on IndianTools servers?', answer: 'Never. Processing is done entirely in your browser window.' },
      { question: 'How do I download multiple converted pages?', answer: 'Multi-page PDFs are automatically converted and packed into a ZIP archive.' }
    ],
    relatedSlugs: ['pdf-to-jpg', 'png-to-pdf', 'pdf-to-text']
  },
  {
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    category: 'pdf',
    description: 'Turn PNG photos and screenshots into formatted PDF documents.',
    icon: 'FilePlus',
    accept: '.png,image/png',
    multiple: true,
    seoTitle: 'Convert PNG to PDF Online Free — Private & Fast | IndianTools',
    seoDescription: 'Combine PNG screenshots and graphics into PDF files easily. Works entirely in your browser with zero file upload required.',
    howItWorks: 'PNG images are embedded using pdf-lib into a fresh PDF stream. The pixel data is mapped into PDF image XObjects and formatted into clean pages.',
    faqs: [
      { question: 'Will transparency in PNGs be preserved?', answer: 'PDF supports PNG alpha channels so your translucent graphics will render correctly inside the resulting PDF.' },
      { question: 'Is sign-up required to convert files?', answer: 'No sign-up or registration is ever required to use IndianTools.' },
      { question: 'Can I rearrange PNG images before converting?', answer: 'Yes, you can drag and drop images to set their order in the final document.' }
    ],
    relatedSlugs: ['jpg-to-pdf', 'pdf-to-png', 'images-to-pdf']
  },
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    description: 'Combine multiple PDF files into one unified document.',
    icon: 'Layers',
    accept: '.pdf,application/pdf',
    multiple: true,
    seoTitle: 'Merge PDF Files Online Free — Combine PDFs Privately | IndianTools',
    seoDescription: 'Merge multiple PDF files into one document in seconds. 100% browser-based merging ensures total privacy for sensitive documents.',
    howItWorks: 'We read the page dictionary of each uploaded PDF using pdf-lib, copy the specified page objects into a new master PDF document, and write out a clean merged file.',
    faqs: [
      { question: 'How many PDF files can I merge at once?', answer: 'You can merge as many PDFs as your browser memory permits.' },
      { question: 'Can I reorder PDFs before merging?', answer: 'Yes, simple drag-and-drop handles allow you to organize files in the exact sequence you want.' },
      { question: 'Is document privacy guaranteed?', answer: 'Yes! Your documents never leave your computer or touch any cloud server.' }
    ],
    relatedSlugs: ['split-pdf', 'reorder-pdf-pages', 'extract-pdf-pages']
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf',
    description: 'Separate a PDF into individual pages or specific page ranges.',
    icon: 'Scissors',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'Split PDF Online Free — Extract Pages Privately | IndianTools',
    seoDescription: 'Split PDF documents by page range or extract individual pages effortlessly. Safe, fast, and 100% browser-based.',
    howItWorks: 'Our engine parses your PDF using pdf-lib, copies selected page indices into target PDF documents, and generates downloadable PDF files or a packaged ZIP archive.',
    faqs: [
      { question: 'How do I specify which pages to split?', answer: 'You can enter page numbers (e.g. 1-3, 5, 8-10) or choose to extract every page into its own file.' },
      { question: 'Is my data secure when splitting confidential documents?', answer: '100% secure. Everything happens locally in browser RAM.' },
      { question: 'What file format will I get when splitting multiple pages?', answer: 'If splitting into multiple documents, you will receive a convenient ZIP package containing all output files.' }
    ],
    relatedSlugs: ['merge-pdf', 'extract-pdf-pages', 'delete-pdf-pages']
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    category: 'pdf',
    description: 'Reduce PDF file size with Safe or Aggressive compression modes.',
    icon: 'Minimize2',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'Compress PDF Online Free — Reduce PDF File Size | IndianTools',
    seoDescription: 'Shrink PDF file size online without uploading files. Choose Safe mode to preserve text or Aggressive mode for maximum reduction.',
    howItWorks: 'Offers two compression modes: Safe mode optimizes PDF structure and object streams via pdf-lib while preserving vector text. Aggressive mode renders pages to canvas compressed JPEG images and rebuilds the PDF.',
    faqs: [
      { question: 'What is the difference between Safe and Aggressive compression?', answer: 'Safe mode keeps text selectable and searchable while cleaning PDF objects. Aggressive mode converts pages to compressed images for maximum size reduction.' },
      { question: 'Will my PDF quality be reduced?', answer: 'Safe mode preserves visual fidelity completely. Aggressive mode allows you to adjust image compression quality.' },
      { question: 'Are files sent to a server for processing?', answer: 'No. All compression algorithms run locally inside your web browser.' }
    ],
    relatedSlugs: ['pdf-to-jpg', 'image-compressor', 'split-pdf']
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'pdf',
    description: 'Rotate PDF pages by 90°, 180°, or 270° degrees easily.',
    icon: 'RotateCw',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'Rotate PDF Pages Online Free — Instant & Private | IndianTools',
    seoDescription: 'Rotate PDF pages clockwise or counterclockwise in seconds. 100% free browser tool with zero uploads.',
    howItWorks: 'Modifies page rotation metadata attributes directly within the PDF document tree using pdf-lib, saving a newly aligned PDF instantly.',
    faqs: [
      { question: 'Can I rotate specific pages or the entire document?', answer: 'You can choose to rotate all pages or select specific page ranges to orient.' },
      { question: 'Is the page rotation permanent?', answer: 'Yes, when you download the output PDF, the rotation changes are saved into the file structure.' },
      { question: 'Does rotating affect document quality?', answer: 'No quality loss occurs because rotation is a metadata operation, not an image re-encoding step.' }
    ],
    relatedSlugs: ['reorder-pdf-pages', 'delete-pdf-pages', 'rotate-flip-image']
  },
  {
    slug: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    category: 'pdf',
    description: 'Remove unwanted pages from your PDF document with a visual preview.',
    icon: 'Trash2',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'Delete PDF Pages Online Free — Remove Pages Privately | IndianTools',
    seoDescription: 'Select and delete unwanted pages from PDF files with an interactive page thumbnail preview. 100% private and client-side.',
    howItWorks: 'Renders page thumbnails using pdf.js so you can visually click and mark pages for removal. pdf-lib then strips the unselected page indices and re-saves the document.',
    faqs: [
      { question: 'How do I pick which pages to delete?', answer: 'An interactive grid displays page thumbnails; simply click any thumbnail to toggle it for deletion.' },
      { question: 'Can I delete all pages in a PDF?', answer: 'At least one page must remain in the output PDF document.' },
      { question: 'Are deleted pages recoverable?', answer: 'Your original source file on your computer remains unchanged. Only the newly generated PDF removes the selected pages.' }
    ],
    relatedSlugs: ['extract-pdf-pages', 'split-pdf', 'reorder-pdf-pages']
  },
  {
    slug: 'reorder-pdf-pages',
    name: 'Reorder PDF Pages',
    category: 'pdf',
    description: 'Rearrange the sequence of PDF pages via interactive drag-and-drop.',
    icon: 'Move',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'Reorder PDF Pages Online Free — Drag & Drop Page Organizer | IndianTools',
    seoDescription: 'Change page order in any PDF file using simple drag-and-drop thumbnails. Completely free, fast, and client-side.',
    howItWorks: 'Page thumbnails rendered by pdf.js allow drag-and-drop visual sorting. pdf-lib copies original PDF page objects in the newly specified order into a target file.',
    faqs: [
      { question: 'How do I rearrange pages?', answer: 'Drag thumbnail cards into your preferred sequence and click "Save & Download".' },
      { question: 'Can I reorder large PDF files with hundreds of pages?', answer: 'Yes, page thumbnails are rendered efficiently in your browser.' },
      { question: 'Does reordering alter text or formatting?', answer: 'No, all vector text, fonts, and embeds are perfectly preserved.' }
    ],
    relatedSlugs: ['rotate-pdf', 'delete-pdf-pages', 'merge-pdf']
  },
  {
    slug: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    category: 'pdf',
    description: 'Select and extract specific pages into a brand new PDF file.',
    icon: 'FolderPlus',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'Extract PDF Pages Online Free — Select & Export Pages | IndianTools',
    seoDescription: 'Extract essential pages from any PDF document into a clean new file. Private, free, and processed 100% in your browser.',
    howItWorks: 'Allows visual thumbnail selection or numeric range selection. Selected pages are isolated and copied into a newly constructed PDF container using pdf-lib.',
    faqs: [
      { question: 'How is this different from Split PDF?', answer: 'Extract PDF allows you to select non-contiguous specific pages (e.g. pages 2, 5, 9) and save them as a single consolidated new PDF.' },
      { question: 'Are files sent over the internet?', answer: 'No. All operations run strictly on your local browser memory.' },
      { question: 'Is document quality altered?', answer: 'Extracted pages maintain 100% original formatting and font quality.' }
    ],
    relatedSlugs: ['split-pdf', 'delete-pdf-pages', 'merge-pdf']
  },
  {
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    category: 'pdf',
    description: 'Extract raw text content from PDF documents instantly.',
    icon: 'FileCode',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'PDF to Text Converter Free Online — Extract Text Privately | IndianTools',
    seoDescription: 'Extract plain text from PDF files online. Copy extracted text to clipboard or download as a TXT file with complete privacy.',
    howItWorks: 'Iterates through PDF pages using pdf.js, extracts text item tokens and glyph position information, formats lines, and outputs a clean plain text stream.',
    faqs: [
      { question: 'Can I extract text from scanned paper PDFs?', answer: 'If a PDF is a scanned image without a text layer, raw text extraction will be empty as optical character recognition (OCR) is not included in v1.' },
      { question: 'How can I save the extracted text?', answer: 'You can copy text directly to your clipboard or download a formatted .txt document.' },
      { question: 'Does this store document text on your server?', answer: 'No text or file data ever leaves your device.' }
    ],
    relatedSlugs: ['pdf-to-jpg', 'pdf-to-png', 'image-to-base64']
  },
  {
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    category: 'pdf',
    description: 'Add custom text or image watermarks across PDF pages.',
    icon: 'Stamp',
    accept: '.pdf,application/pdf',
    multiple: false,
    seoTitle: 'Watermark PDF Online Free — Add Text or Image Overlay | IndianTools',
    seoDescription: 'Protect your PDF documents by adding text or graphic watermarks with custom position, opacity, and rotation. 100% browser-based.',
    howItWorks: 'Uses pdf-lib to draw vector text or embedded images over every page at customizable angles, font sizes, colors, and opacity levels.',
    faqs: [
      { question: 'Can I customize watermark text, color, and transparency?', answer: 'Yes! You can set watermark text, text color, font size, rotation angle, and opacity.' },
      { question: 'Can I use an image logo as a watermark?', answer: 'Yes, you can upload a transparent PNG or JPG logo image to overlay as a watermark.' },
      { question: 'Are watermarks removable by third parties?', answer: 'Watermarks are vector objects drawn directly onto page content streams.' }
    ],
    relatedSlugs: ['pdf-to-jpg', 'rotate-pdf', 'compress-pdf']
  },

  // --- IMAGE TOOLS (11) ---
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    category: 'image',
    description: 'Convert JPG images into PNG format seamlessly.',
    icon: 'RefreshCw',
    accept: '.jpg,.jpeg,image/jpeg',
    multiple: false,
    seoTitle: 'Convert JPG to PNG Online Free — Instant Image Converter | IndianTools',
    seoDescription: 'Convert JPG photos to PNG format free online. Safe, fast, and processed entirely inside your web browser.',
    howItWorks: 'Loads JPG files into an HTML Image element, draws pixels onto an HTML5 canvas element, and exports a clean PNG blob.',
    faqs: [
      { question: 'Does converting JPG to PNG improve image quality?', answer: 'PNG is a lossless format so it prevents further loss, but it cannot restore compression artifacts present in the original JPG.' },
      { question: 'Are my photos uploaded to a cloud server?', answer: 'No. File processing takes place 100% inside your browser.' },
      { question: 'Is there a limit on image resolution?', answer: 'Supports high resolution photos up to standard browser canvas capabilities.' }
    ],
    relatedSlugs: ['png-to-jpg', 'jpg-to-webp', 'image-compressor']
  },
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG',
    category: 'image',
    description: 'Convert PNG graphics into lightweight JPG format with background color selection.',
    icon: 'Image',
    accept: '.png,image/png',
    multiple: false,
    seoTitle: 'Convert PNG to JPG Online Free — Background Fill Support | IndianTools',
    seoDescription: 'Convert PNG images to JPG format online. Handles transparent pixels by compositing over solid backgrounds.',
    howItWorks: 'Composites transparent PNG pixels over a solid background color (default white) on an HTML5 canvas before re-encoding into JPEG format to prevent dark alpha artifacts.',
    faqs: [
      { question: 'What happens to transparent areas in my PNG?', answer: 'You can select a background color (such as white or black) to replace transparent areas cleanly.' },
      { question: 'Can I adjust the JPEG output quality?', answer: 'Yes, a quality slider allows you to balance image fidelity and file size.' },
      { question: 'Is sign up required to convert images?', answer: 'No sign up required. It is completely free.' }
    ],
    relatedSlugs: ['jpg-to-png', 'png-to-webp', 'image-compressor']
  },
  {
    slug: 'webp-to-jpg',
    name: 'WebP to JPG',
    category: 'image',
    description: 'Convert WebP images into standard JPG images for maximum compatibility.',
    icon: 'FileImage',
    accept: '.webp,image/webp',
    multiple: false,
    seoTitle: 'Convert WebP to JPG Online Free — Instant Converter | IndianTools',
    seoDescription: 'Convert modern WebP images into standard JPG format for universal compatibility. 100% client-side execution.',
    howItWorks: 'Decodes WebP image streams using native browser rendering capabilities and draws frame contents onto a canvas to export standard JPEG output.',
    faqs: [
      { question: 'Why convert WebP to JPG?', answer: 'While WebP is great for web speed, JPG remains universally supported across older software, printers, and operating systems.' },
      { question: 'Are files stored on IndianTools?', answer: 'No files are ever uploaded or stored.' },
      { question: 'How fast is the conversion?', answer: 'Conversion takes less than a second as it runs directly on your device CPU/GPU.' }
    ],
    relatedSlugs: ['jpg-to-webp', 'png-to-jpg', 'webp-to-png']
  },
  {
    slug: 'jpg-to-webp',
    name: 'JPG to WebP',
    category: 'image',
    description: 'Convert JPG images into high-efficiency WebP format to speed up websites.',
    icon: 'Zap',
    accept: '.jpg,.jpeg,image/jpeg',
    multiple: false,
    seoTitle: 'Convert JPG to WebP Online Free — Modern Web Format | IndianTools',
    seoDescription: 'Convert JPG images into optimized WebP files to shrink image size by up to 30%. Private and free.',
    howItWorks: 'Decodes JPEG images and re-encodes pixel streams into WebP format using canvas.toBlob("image/webp"), yielding smaller file sizes with high fidelity.',
    faqs: [
      { question: 'How much smaller are WebP files compared to JPG?', answer: 'WebP files are typically 25% to 35% smaller than comparable quality JPG files.' },
      { question: 'Is my image data kept private?', answer: 'Yes, no network requests are made during conversion.' },
      { question: 'Can I convert multiple images?', answer: 'You can convert images quickly one after another.' }
    ],
    relatedSlugs: ['webp-to-jpg', 'png-to-webp', 'image-compressor']
  },
  {
    slug: 'png-to-webp',
    name: 'PNG to WebP',
    category: 'image',
    description: 'Convert PNG images to WebP while maintaining alpha transparency.',
    icon: 'Layers',
    accept: '.png,image/png',
    multiple: false,
    seoTitle: 'Convert PNG to WebP Online Free — Preserve Transparency | IndianTools',
    seoDescription: 'Convert PNG files to WebP while keeping full transparency and reducing file size. 100% browser execution.',
    howItWorks: 'Draws PNG graphics onto a canvas context with alpha channel intact and outputs WebP blobs supporting lossy/lossless alpha compression.',
    faqs: [
      { question: 'Does WebP support transparent backgrounds like PNG?', answer: 'Yes! WebP fully supports alpha channel transparency with significantly smaller file sizes.' },
      { question: 'Are photos uploaded anywhere?', answer: 'Zero uploads. Processing is done locally.' },
      { question: 'Is there quality loss?', answer: 'You can select high quality encoding for virtually indistinguishable results.' }
    ],
    relatedSlugs: ['png-to-jpg', 'jpg-to-webp', 'image-compressor']
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    description: 'Compress JPG, PNG, and WebP images to cut file size significantly.',
    icon: 'Maximize2',
    accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
    multiple: false,
    seoTitle: 'Compress Images Online Free — Shrink JPG, PNG, WebP | IndianTools',
    seoDescription: 'Reduce image file size online without losing quality. Works with JPG, PNG, WebP. 100% private in-browser compression.',
    howItWorks: 'Uses browser-image-compression library to intelligently downscale pixel dimensions and adjust quality quantization matrices within user-defined target thresholds.',
    faqs: [
      { question: 'How much file size reduction can I expect?', answer: 'Reductions typically range from 40% to 80% depending on initial compression levels.' },
      { question: 'Will my image look blurry after compression?', answer: 'You can adjust the compression quality slider to maintain crisp visual fidelity.' },
      { question: 'Is it safe to compress private photos here?', answer: 'Yes! Because files never leave your device, your private photos stay private.' }
    ],
    relatedSlugs: ['compress-pdf', 'image-resizer', 'jpg-to-webp']
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    description: 'Resize image dimensions in pixels or percentages while locking aspect ratio.',
    icon: 'Scaling',
    accept: 'image/*',
    multiple: false,
    seoTitle: 'Resize Images Online Free — Change Pixel Dimensions | IndianTools',
    seoDescription: 'Resize image width and height easily in your browser. Lock aspect ratio or set custom pixel dimensions with full privacy.',
    howItWorks: 'Calculates scaled image coordinates and renders resized bitmaps onto an HTML5 canvas using high quality bilinear interpolation.',
    faqs: [
      { question: 'Can I maintain the original image aspect ratio while resizing?', answer: 'Yes, checking "Lock Aspect Ratio" automatically updates height when you change width (and vice versa).' },
      { question: 'Which image formats are supported for resizing?', answer: 'Supports JPG, PNG, WebP, GIF, and BMP formats.' },
      { question: 'Does resizing shrink file size?', answer: 'Yes, reducing pixel dimensions proportionally reduces overall file size.' }
    ],
    relatedSlugs: ['image-cropper', 'image-compressor', 'rotate-flip-image']
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    category: 'image',
    description: 'Crop images freehand or lock to aspect ratios like 1:1, 4:3, 16:9.',
    icon: 'Crop',
    accept: 'image/*',
    multiple: false,
    seoTitle: 'Crop Images Online Free — Aspect Ratio Presets | IndianTools',
    seoDescription: 'Crop JPG, PNG, or WebP images online with freeform selection or aspect ratio presets. 100% private client-side cropping.',
    howItWorks: 'Integrated react-easy-crop workspace captures pixel bounds and renders cropped image coordinates directly to an output canvas blob.',
    faqs: [
      { question: 'What aspect ratio presets are available?', answer: 'Includes popular presets such as 1:1 (Square), 4:3, 16:9 (Widescreen), and custom freeform cropping.' },
      { question: 'Does cropping upload my photo?', answer: 'No, all cropping calculations and image rendering occur inside your browser.' },
      { question: 'Can I export in different image formats?', answer: 'Yes, you can export cropped results as PNG or JPG.' }
    ],
    relatedSlugs: ['image-resizer', 'rotate-flip-image', 'image-compressor']
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    category: 'image',
    description: 'Convert image files to Base64 data strings and decode Base64 back to image files.',
    icon: 'Code',
    accept: 'image/*',
    multiple: false,
    seoTitle: 'Image to Base64 Converter Online — Encoder & Decoder | IndianTools',
    seoDescription: 'Convert images to Base64 data URIs or decode Base64 strings back to downloadable image files. 100% client-side tool.',
    howItWorks: 'Encodes binary image data using FileReader.readAsDataURL() into Base64 format for web embedding, and offers instant decoding back to image files.',
    faqs: [
      { question: 'What is a Base64 data URI string used for?', answer: 'Base64 strings let developers embed images directly inside HTML, CSS, or JSON files without separate image requests.' },
      { question: 'Can I decode a Base64 string back into an image?', answer: 'Yes! Simply paste a Base64 string into the decoder box to preview and download the image file.' },
      { question: 'Is my Base64 string stored anywhere?', answer: 'No string or file data is recorded on any server.' }
    ],
    relatedSlugs: ['pdf-to-text', 'jpg-to-png', 'png-to-jpg']
  },
  {
    slug: 'rotate-flip-image',
    name: 'Rotate / Flip Image',
    category: 'image',
    description: 'Rotate images by 90/180/270 degrees or flip horizontally and vertically.',
    icon: 'RefreshCw',
    accept: 'image/*',
    multiple: false,
    seoTitle: 'Rotate & Flip Images Online Free — Instant Image Editor | IndianTools',
    seoDescription: 'Rotate photos clockwise or flip horizontally and vertically in seconds. Works 100% in your browser with complete privacy.',
    howItWorks: 'Applies canvas transformation matrices (ctx.rotate, ctx.scale) to reorient pixel buffers and export freshly aligned image files.',
    faqs: [
      { question: 'Can I combine rotation and flipping together?', answer: 'Yes! You can rotate an image 90 degrees and flip it horizontally simultaneously before saving.' },
      { question: 'Is image resolution altered during flip?', answer: 'Original image pixel dimensions are preserved intact.' },
      { question: 'Are files sent over the internet?', answer: 'No network uploads take place.' }
    ],
    relatedSlugs: ['rotate-pdf', 'image-cropper', 'image-resizer']
  },
  {
    slug: 'images-to-pdf',
    name: 'Multiple Images to PDF',
    category: 'image',
    description: 'Combine multiple photos (JPG, PNG, WebP) into a single PDF document.',
    icon: 'FilePlus',
    accept: 'image/*',
    multiple: true,
    seoTitle: 'Convert Multiple Images to PDF Free — Photo to PDF | IndianTools',
    seoDescription: 'Batch convert multiple images into one PDF file. Reorder thumbnails easily. 100% private browser processing.',
    howItWorks: 'Loads multiple uploaded image files, embeds them sequentially into a pdf-lib PDF document with selectable page dimensions, and exports a unified PDF file.',
    faqs: [
      { question: 'Can I mix JPG and PNG files in the same PDF?', answer: 'Yes! You can combine JPG, PNG, and WebP images together into a single multi-page PDF.' },
      { question: 'How do I change page order?', answer: 'Drag and drop image thumbnail cards to arrange the exact page sequence.' },
      { question: 'Can I set page margins or fit to page?', answer: 'Yes, page layout options let you fit images to canvas or add clean margins.' }
    ],
    relatedSlugs: ['jpg-to-pdf', 'png-to-pdf', 'merge-pdf']
  }
];

export const GET_TOOL = (slug) => TOOLS.find(t => t.slug === slug);
export const GET_RELATED_TOOLS = (slug) => {
  const tool = GET_TOOL(slug);
  if (!tool || !tool.relatedSlugs) return [];
  return tool.relatedSlugs.map(s => GET_TOOL(s)).filter(Boolean);
};
