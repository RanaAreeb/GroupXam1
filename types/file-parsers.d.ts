declare module "pdf-parse" {
  interface PdfParseResult {
    text: string;
  }

  function pdfParse(dataBuffer: Buffer, options?: unknown): Promise<PdfParseResult>;

  export default pdfParse;
}

declare module "mammoth" {
  interface ExtractRawTextResult {
    value: string;
  }

  function extractRawText(options: { buffer: Buffer }): Promise<ExtractRawTextResult>;

  export { extractRawText };
}


