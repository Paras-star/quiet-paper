import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { importEditorialText } from "../lib/data/advice-editorial-import";

/**
 * Operator-machine CLI. Not authentication. Not a public HTTP endpoint.
 *
 *   npm run import-editorial -- fixtures/editorial-import.example.json
 */
function loadEnvFile(filePath: string): void {
  if (!existsSync(filePath)) {
    return;
  }
  const text = readFileSync(filePath, "utf8");
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) {
      continue;
    }
    const separator = line.indexOf("=");
    if (separator < 1) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    if (process.env[key] !== undefined) {
      continue;
    }
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function formatFromPath(filePath: string): "json" | "csv" {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".json") {
    return "json";
  }
  if (extension === ".csv") {
    return "csv";
  }
  throw new Error("Use a .json or .csv file.");
}

async function main(): Promise<void> {
  loadEnvFile(".env.local");
  loadEnvFile(".env");
  const filePath = process.argv.slice(2).find((argument) => !argument.startsWith("-"));
  if (!filePath) {
    console.error("Usage: npm run import-editorial -- <file.json|file.csv>");
    process.exitCode = 2;
    return;
  }
  let format: "json" | "csv";
  try {
    format = formatFromPath(filePath);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unsupported file type.");
    process.exitCode = 2;
    return;
  }
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exitCode = 2;
    return;
  }
  const text = readFileSync(filePath, "utf8");
  try {
    const summary = await importEditorialText(text, format);
    console.log(
      `Imported ${summary.imported}, skipped ${summary.skipped} duplicate(s), ${summary.invalid} invalid row(s).`,
    );
    for (const message of summary.errors) {
      console.error(message);
    }
    if (summary.errors.length > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Import failed.");
    process.exitCode = 1;
  }
}

void main();
