import { NextRequest, NextResponse } from 'next/server';
import { getCachedData } from '@/app/lib/dataCache';
import { DataPoint } from '@/app/types/DataPoint';

export async function GET(req: NextRequest) {
  // Extrair o parâmetro "date" da URL
  const url = new URL(req.url);
  const pathname = url.pathname; // /api/data/2020-02-01
  const date = pathname.split('/').pop(); // "2020-02-01"

  if (!date) {
    return NextResponse.json({ error: 'Parâmetro de data inválido' }, { status: 400 });
  }

  const allData = getCachedData();

  const irradiancia: DataPoint[] = [];
  const temperatura: DataPoint[] = [];

  for (const row of allData) {
    if (!row.TIMESTAMP.startsWith(date)) {
      if (irradiancia.length > 0) break;
      continue;
    }

    const time = row.TIMESTAMP.split(' ')[1];
    const rad = parseFloat(row['Radiação (W/m²)']);
    const temp = parseFloat(row['Temp Painel (°C)']);

    irradiancia.push({ x: time, y: rad });
    temperatura.push({ x: time, y: temp });
  }

  const notFound = irradiancia.length === 0;
  return NextResponse.json({ irradiancia, temperatura, notFound });
}
