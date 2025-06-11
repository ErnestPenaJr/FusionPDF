// Author: Ernest Pena Jr
// Date: 2025-06-11

// src/core/fusionpdf.js

/**
 * @typedef {Object} PdfLibOptions
 * @property {Array<number>} [mediaBox] - The media box [x, y, width, height]. Defaults to A4.
 * @property {Array<number>} [cropBox] - The crop box. Defaults to mediaBox.
 */

/**
 * @typedef {Object} PdfGenerationOptions
 * @property {string} [fontName='Helvetica'] - Default font to use (must be standard PDF font or embedded).
 * @property {number} [fontSize=12] - Default font size.
 * @property {Object|number} [margin=50] - Page margins (points). Can be a number or an object {top, right, bottom, left}.
 * @property {PdfLibOptions} [pdfLibOptions={}] - Options passed directly to PDFDocument.create().
 * // Add more core-specific options here as they are defined
 */

const FusionPDFCore = { /**
   * Generates a PDF document from HTML or JSON input.
   * This is the main entry point for the core PDF generation logic.
   *
   * @param {string|Object|HTMLElement} input - The input data. Can be an HTML string,
   * a JSON object/array, or an HTMLElement (its innerHTML will be used).
   * @param {PdfGenerationOptions} [options={}] - Options for PDF generation.
   * @returns {Promise<Blob>} A promise that resolves with a Blob representing the PDF.
   */
    async generate(input, options = {}) {
        console.log('FusionPDFCore: Generating PDF with input:', input, 'and options:', options);

        const {PDFDocument, rgb, StandardFonts} = PDFLib;
        // Assuming PDFLib is globally available
        // html2canvas should also be globally available if this approach is used for HTML

        const mergedOptions = {
            fontName: 'Helvetica',
            fontSize: 12,
            margin: 50, // Default margin in points
            filename: 'fusion-document.pdf', // Default filename
            html2canvasOptions: {}, // Options for html2canvas
            ...options
        };

        // Normalize margin
        let margins = {};
        if (typeof mergedOptions.margin === 'number') {
            margins = {
                top: mergedOptions.margin,
                right: mergedOptions.margin,
                bottom: mergedOptions.margin,
                left: mergedOptions.margin
            };
        } else {
            margins = {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
                ... mergedOptions.margin
            };
        }

        try {
            const pdfDoc = await PDFDocument.create(mergedOptions.pdfLibOptions);
            const page = pdfDoc.addPage(); // Default A4 size
            const {width: pageWidth, height: pageHeight} = page.getSize();

            // Determine input type and process
            if ((typeof input === 'string' && (input.trim().startsWith('<') && input.trim().endsWith('>'))) || input instanceof HTMLElement) { // HTML input: Use html2canvas
                if (typeof html2canvas === 'undefined') {
                    throw new Error('FusionPDFCore: html2canvas is not loaded. Please include it to render HTML.');
                }

                let elementToRender;
                if (typeof input === 'string') { // Create a temporary div to render the HTML string
                    elementToRender = document.createElement('div');
                    elementToRender.innerHTML = input;
                    elementToRender.style.width = (pageWidth - margins.left - margins.right) + 'px'; // Constrain width
                    elementToRender.style.display = 'inline-block'; // Ensure it takes up space
                    document.body.appendChild(elementToRender); // Must be in DOM for html2canvas
                } else {
                    elementToRender = input;
                }

                const canvas = await html2canvas(elementToRender, mergedOptions.html2canvasOptions);
                const imgDataUrl = canvas.toDataURL('image/png');

                if (typeof input === 'string' && elementToRender.parentElement === document.body) {
                    document.body.removeChild(elementToRender); // Clean up temporary div
                }

                const pngImage = await pdfDoc.embedPng(imgDataUrl);
                const pngDims = pngImage.scale(1);

                // Scale image to fit page width (respecting margins)
                const availableWidth = pageWidth - margins.left - margins.right;
                const availableHeight = pageHeight - margins.top - margins.bottom;

                let imgWidth = pngDims.width;
                let imgHeight = pngDims.height;

                if (imgWidth > availableWidth) {
                    const scale = availableWidth / imgWidth;
                    imgWidth = availableWidth;
                    imgHeight *= scale;
                }
                // TODO: Add similar scaling for height if it exceeds availableHeight and pagination logic

                page.drawImage(pngImage, {
                    x: margins.left,
                    y: pageHeight - margins.top - imgHeight, // Draw from top-left respecting margin
                    width: imgWidth,
                    height: imgHeight
                });

            } else { // JSON or plain text input: Draw as text (existing logic)
                let textContent = 'Unsupported input type for text rendering';
                if (typeof input === 'string') {
                    textContent = input;
                } else if (typeof input === 'object' && input !== null) {
                    try {
                        pdfDoc.removePage(0); // Remove the initial blank page
                        await processJSONInput(input, pdfDoc, mergedOptions);
                        const pdfBytes = await pdfDoc.save();
                        return {
                            blob: new Blob([pdfBytes], {type: 'application/pdf'}),
                            filename: mergedOptions.filename
                        };
                    } catch (e) {
                        textContent = 'Could not process JSON object';
                    }
                } else if (input !== null && input !== undefined) {
                    textContent = String(input);
                }

                const font = await pdfDoc.embedFont(StandardFonts[mergedOptions.fontName] || StandardFonts.Helvetica);
                page.drawText(textContent, {
                    x: margins.left,
                    y: pageHeight - margins.top - mergedOptions.fontSize,
                    font: font,
                    size: mergedOptions.fontSize,
                    color: rgb(0, 0, 0),
                    maxWidth: pageWidth - margins.left - margins.right,
                    lineHeight: mergedOptions.fontSize * 1.2
                });
            }

            // Serialize the PDFDocument to bytes (a Uint8Array)
            const pdfBytes = await pdfDoc.save();

            // Create a Blob from the bytes
            const pdfBlob = new Blob([pdfBytes], {type: 'application/pdf'});

            console.log('FusionPDFCore: PDF generated successfully, returning blob.');

            // Return the blob and the final filename
            return {blob: pdfBlob, filename: mergedOptions.filename};

        } catch (e) {
            console.error('FusionPDFCore: Error during PDF generation', e);
            throw e;
        }
    },

    version: '0.1.1-core' // Incremented version
};

/**
 * Processes JSON input into a PDF document
 * @param {Object} jsonData - The JSON data to convert
 * @param {PDFDocument} pdfDoc - The PDF document to add content to
 * @param {Object} options - Options for PDF generation
 */
async function processJSONInput(jsonData, pdfDoc, options) {
    const {StandardFonts, rgb} = PDFLib;
    const page = pdfDoc.addPage();
    const {width, height} = page.getSize();
    const margin = 50;
    let yPosition = height - margin;

    // Embed fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Helper function to draw text and update y position
    const drawText = (text, fontSize, font, indent = 0) => {
        page.drawText(text, {
            x: margin + indent,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0)
        });
        yPosition -= fontSize * 1.5; // Move down for next line
    };

    // Helper function to draw a simple table
    const drawTable = (headers, rows, startY) => {
        const colWidth = (width - margin * 2) / headers.length;
        let y = startY;

        // Draw headers
        headers.forEach((header, i) => {
            page.drawText(String(header), {
                x: margin + i * colWidth,
                y: y,
                size: 10,
                font: helveticaBold,
                color: rgb(0, 0, 0)
            });
        });

        y -= 20;
        // Move down for table rows

        // Draw rows
        rows.forEach(row => { // Check if we need a new page
            if (y < margin) {
                const newPage = pdfDoc.addPage();
                y = height - margin;
            }

            // Draw cells
            row.forEach((cell, i) => {
                page.drawText(String(cell), {
                    x: margin + i * colWidth,
                    y: y,
                    size: 10,
                    font: helvetica,
                    color: rgb(0, 0, 0)
                });
            });

            y -= 20; // Move down for next row
        });

        return y; // Return the new Y position
    };

    // Check for common report structures
    if (jsonData.reportTitle || jsonData.title) { // Draw title
        drawText(jsonData.reportTitle || jsonData.title, 18, helveticaBold);
        yPosition -= 10; // Extra space after title
    }

    // Draw metadata if available
    if (jsonData.period) 
        drawText(`Period: ${
            jsonData.period
        }`, 12, helvetica);
    

    if (jsonData.author) 
        drawText(`Author: ${
            jsonData.author
        }`, 12, helvetica);
    

    yPosition -= 10;
    // Extra space after metadata

    // Handle data array if present
    if (Array.isArray(jsonData.data)) { // Extract table headers from first item
        const firstItem = jsonData.data[0];
        if (firstItem && typeof firstItem === 'object') {
            const headers = Object.keys(firstItem);
            const rows = jsonData.data.map(item => headers.map(key => item[key]));

            yPosition = drawTable(headers, rows, yPosition);
        }
    } else if (typeof jsonData === 'object') { // For generic objects, display key-value pairs
        Object.entries(jsonData).forEach(([key, value]) => {
            if (key !== 'reportTitle' && key !== 'title' && key !== 'period' && key !== 'author' && key !== 'data') {
                if (typeof value === 'object' && value !== null) { // Handle nested objects
                    drawText(`${key}:`, 12, helveticaBold);
                    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                        drawText(`${nestedKey}: ${nestedValue}`, 10, helvetica, 20);
                    });
                } else {
                    drawText(`${key}: ${value}`, 12, helvetica);
                }
            }
        });
    }

    // Draw summary if available
    if (jsonData.summary) {
        yPosition -= 10; // Extra space before summary
        drawText('Summary:', 12, helveticaBold);
        drawText(jsonData.summary, 10, helvetica);
    }
}

// Export for potential use in Node.js or other modules if this becomes a UMD bundle itself
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FusionPDFCore;
} else if (typeof window !== 'undefined') { // Expose to global scope for the jQuery plugin to find if not using modules
    window.FusionPDFCore = FusionPDFCore;
    // Also ensure PDFLib is available on window if not using modules
    if (window.PDFLib) {
        console.log('FusionPDFCore: PDFLib found on window object.');
    } else {
        console.warn('FusionPDFCore: PDFLib was not found on the window object. Please ensure it is loaded before FusionPDFCore.');
    }
}
