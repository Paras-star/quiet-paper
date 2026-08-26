/**
 * Minimal RFC 4180-style CSV parse. UTF-8 text, comma separated, double-quote
 * escaping. No streaming, no extra packages.
 */
export function parseCsvRecords(text: string): Record<string, string>[] {
  const rows = parseCsvRows(text);
  if (rows.length === 0) {
    throw new Error("CSV file is empty.");
  }
  const headers = rows[0].map((header) => header.trim());
  if (
    !headers.includes("body") ||
    !headers.includes("minimum_age") ||
    !headers.includes("maximum_age")
  ) {
    throw new Error("CSV must include headers body, minimum_age, and maximum_age.");
  }
  const records: Record<string, string>[] = [];
  for (let index = 1; index < rows.length; index += 1) {
    const cells = rows[index];
    if (cells.every((cell) => cell.trim() === "")) {
      continue;
    }
    const record: Record<string, string> = {};
    for (let column = 0; column < headers.length; column += 1) {
      const header = headers[column];
      if (!header) {
        continue;
      }
      record[header] = cells[column] ?? "";
    }
    records.push(record);
  }
  return records;
}

export function parseCsvRows(text: string): string[][] {
  const source = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (inQuotes) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          field += '"';
          index += 2;
          continue;
        }
        inQuotes = false;
        index += 1;
        continue;
      }
      field += char;
      index += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      index += 1;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      index += 1;
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      index += 1;
      continue;
    }
    field += char;
    index += 1;
  }
  if (inQuotes) {
    throw new Error("CSV has an unclosed quoted field.");
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((candidate) => candidate.some((cell) => cell.trim() !== ""));
}
