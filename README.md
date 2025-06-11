# Author: Ernest Pena Jr
# Date: 2025-06-11

# FusionPDF jQuery Plugin

A jQuery plugin to generate PDF documents from HTML content or JSON data.

## Features

- **Dual Input**: Accepts HTML elements or JSON objects as input.
- **jQuery Integration**: Easy to use with familiar jQuery syntax (`$().fusionPDF()`).
- **Customizable**: Options for PDF generation (delegated to core FusionPDF library).
- **Event-Driven**: Triggers custom events like `fusionpdf:success` and `fusionpdf:error`.
- **Declarative Options**: Use data attributes for simple configuration.

## Installation

1.  Include jQuery (v3.0.0+):
    ```html
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    ```
2.  Include FusionPDF jQuery plugin:
    ```html
    <script src="path/to/fusionpdf.jquery.js"></script>
    ```

## Basic Usage

### From HTML Content

```html
<div id="myReport">
  <h2>Report Title</h2>
  <p>This content will be in the PDF.</p>
</div>
<button id="generateHtmlPdf">Generate PDF from Report Div</button>

<script>
  $(document).ready(function() {
    $('#generateHtmlPdf').fusionPDF({
      contentSource: '#myReport', // jQuery selector for the HTML content
      filename: 'my-html-report.pdf'
    });
  });
</script>
```

### From JSON Data

```html
<button id="generateJsonPdf" data-json='{"title":"Invoice #123","amount":100}'>Generate PDF from JSON</button>

<script>
  $(document).ready(function() {
    $('#generateJsonPdf').fusionPDF({
      filename: 'my-json-report.pdf',
      pdfOptions: { /* Options for JSON templating/rendering */ }
    });
  });
</script>
```

## Options

- `triggerEvent` (String, default: `'click'`): The event on the jQuery element that triggers PDF generation.
- `filename` (String, default: `'document.pdf'`): The default filename for the generated PDF.
- `contentSource` (String, optional): A jQuery selector to specify a different element as the source for HTML content. If not provided, the plugin uses the HTML of the element it's attached to (or its `data-json` attribute).
- `pdfOptions` (Object, default: `{}`): Options passed directly to the core `$.fusionPDF.generate()` method. These will control the actual PDF rendering (e.g., templates for JSON, page size, margins).

## Events

- `fusionpdf:success (event, pdfBlob, filename)`: Triggered after successful PDF generation. `pdfBlob` is the generated PDF Blob object, `filename` is the suggested filename.
- `fusionpdf:error (event, error)`: Triggered if an error occurs during PDF generation.

Example:
```javascript
$('#generateHtmlPdf')
  .fusionPDF({ contentSource: '#myReport' })
  .on('fusionpdf:success', function(event, pdfBlob, filename) {
    console.log(filename + ' generated!', pdfBlob);
    // Example: offer download
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  })
  .on('fusionpdf:error', function(event, error) {
    console.error('PDF Generation Failed:', error);
    alert('Could not generate PDF.');
  });
```

## Core API

The plugin also exposes a static API for direct use:

- `$.fusionPDF.generate(content, pdfOptions)`: Asynchronously generates a PDF.
  - `content`: HTML string, JSON object, or jQuery object (for its HTML).
  - `pdfOptions`: Options for the core PDF engine.
  - Returns: `Promise<Blob>`

- `$.fusionPDF.version`: The current version of the plugin.

Example:
```javascript
async function createPdfProgrammatically() {
  try {
    const myJsonData = { message: "Hello from programmatic PDF!" };
    const blob = await $.fusionPDF.generate(myJsonData, { template: 'simpleMessage' });
    // ... do something with the blob
    console.log('Programmatic PDF Blob:', blob);
  } catch (err) {
    console.error('Programmatic PDF error:', err);
  }
}
```

## Development

(Details on building, testing, and contributing to come)

## License

MIT
