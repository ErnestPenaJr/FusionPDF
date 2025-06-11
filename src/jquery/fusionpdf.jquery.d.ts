/// <reference types="jquery" />

interface FusionPDFOptions {
  triggerEvent?: string;
  pdfOptions?: object; // Define more specific options later based on core library
  filename?: string;
}

interface JQuery {
  fusionPDF(options?: FusionPDFOptions): JQuery;
}

interface JQueryStatic {
  fusionPDF: {
    generate(content: any, options?: object): Promise<Blob>;
    version: string;
  };
}
