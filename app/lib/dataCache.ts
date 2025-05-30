import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface RawData {
  TIMESTAMP: string;
  [key: string]: string;
}

let cachedData: RawData[] | null = null;

export function getCachedData(): RawData[] {
  if (cachedData) return cachedData;

  const filePath = path.join(process.cwd(), 'data', 'dados_ano_2020', 'dados_tratados_2020.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as RawData[];

  cachedData = records;
  return cachedData;
}