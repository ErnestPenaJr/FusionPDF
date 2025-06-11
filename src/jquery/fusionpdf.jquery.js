(function($, FusionPDFCore) {
  'use strict';

  if (!$) {
    console.error('FusionPDF jQuery Plugin: jQuery is not loaded. Please ensure it is included before this script.');
    return;
  }
  if (!FusionPDFCore) {
    console.error('FusionPDF jQuery Plugin: FusionPDFCore is not loaded. Please ensure it is included before this script.');
    return;
  }

  // Helper function to trigger a download. Kept private to the plugin's scope.
  function download(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    console.log(`FusionPDF (jQuery): Download triggered for ${filename}.`);
  }

  // Main plugin logic
  $.fn.fusionPDF = function(optionsOrCommand) {
    // Command handling (e.g., $('.btn').fusionPDF('trigger');)
    if (typeof optionsOrCommand === 'string') {
      const command = optionsOrCommand;
      return this.each(function() {
        const $element = $(this);
        if (command === 'trigger') {
          const settings = $element.data('fusionPDF-settings');
          if (settings) {
            $element.trigger(settings.triggerEvent + '.fusionPDF');
          }
        }
      });
    }

    // Initialization
    const settings = $.extend(true, {}, $.fn.fusionPDF.defaults, optionsOrCommand);

    return this.each(function() {
      const $element = $(this);
      $element.data('fusionPDF-settings', settings); // Store for manual trigger

      const eventName = settings.triggerEvent + '.fusionPDF';
      $element.off(eventName); // Prevent multiple bindings

      $element.on(eventName, function(e) {
        e.preventDefault();

        let input;
        if (settings.json) {
          input = settings.json;
        } else if (settings.contentSource) {
          const $contentEl = $(settings.contentSource).first();
          if (!$contentEl.length) {
            console.error(`FusionPDF Error: contentSource selector "${settings.contentSource}" found no elements.`);
            $element.trigger('fusionpdf:error', { message: 'Content source not found.' });
            return;
          }
          input = $contentEl[0]; // Pass the raw HTMLElement for html2canvas
        } else {
          console.error('FusionPDF Error: No input specified. Provide `json` or `contentSource`.');
          $element.trigger('fusionpdf:error', { message: 'No input specified.' });
          return;
        }

        console.log('FusionPDF (jQuery Wrapper): Delegating to core generate...');
        
        // The core 'generate' function expects the full options object now
        FusionPDFCore.generate(input, settings)
          .then(result => {
            if (result && result.blob && result.filename) {
              download(result.blob, result.filename);
              $element.trigger('fusionpdf:success', {
                blob: result.blob,
                filename: result.filename
              });
            } else {
              throw new Error('Core PDF generation failed to return valid data.');
            }
          })
          .catch(error => {
            console.error('FusionPDF (jQuery Wrapper): PDF generation failed.', error);
            $element.trigger('fusionpdf:error', error);
          });
      });
    });
  };

  // Default settings exposed for global modification
  $.fn.fusionPDF.defaults = {
    triggerEvent: 'click',
    filename: 'document.pdf',
    contentSource: null,       // CSS selector for HTML content
    json: null,                // JSON data object
    pdfOptions: {},            // Core options (now mostly legacy, but can be used for overrides)
    html2canvasOptions: {}     // Options passed directly to html2canvas
  };

  $.fn.fusionPDF.version = '0.2.0-jquery';

})(jQuery, window.FusionPDFCore);
