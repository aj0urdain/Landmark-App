import { parse } from 'csv-parse/sync';
import fs from 'fs';

function updateSupabaseFromCsv(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const records = parse(fileContent, { columns: true }) as Record<string, string>[];

  for (const record of records) {
    console.log(record);
  }

  console.log('done');
}

// Get the file path from command-line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a CSV file path as an argument');
  process.exit(1);
}

updateSupabaseFromCsv(filePath);
