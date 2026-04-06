import * as XLSX from 'xlsx';

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    pages.push(text);
  }

  return pages.join('\n');
}

export async function extractTextFromFile(
  base64Data: string,
  mediaType: string,
  filename?: string,
): Promise<string> {
  const raw = base64Data.includes(',')
    ? base64Data.split(',')[1]
    : base64Data;

  const buffer = Buffer.from(raw, 'base64');

  if (mediaType === 'application/pdf') {
    return await extractPdfText(buffer);
  }

  if (
    mediaType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mediaType === 'application/vnd.ms-excel'
  ) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheets = workbook.SheetNames.map((name) => {
      const sheet = workbook.Sheets[name];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      return `--- Planilha: ${name} ---\n${csv}`;
    });
    return sheets.join('\n\n');
  }

  if (mediaType === 'text/csv') {
    return buffer.toString('utf-8');
  }

  return `[Arquivo ${filename ?? 'desconhecido'} nao suportado para extracao de texto]`;
}