import { NextRequest, NextResponse } from 'next/server';
import { getCachedData } from '@/app/lib/dataCache';
import { DataPoint } from '@/app/types/DataPoint';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const date = pathname.split('/').pop();

  if (!date) {
    return NextResponse.json({ error: 'Parâmetro de data inválido' }, { status: 400 });
  }

  const allData = getCachedData();
  const irradiancia: DataPoint[] = [];
  const temperatura: DataPoint[] = [];

  if (date === 'all-data') {
    for (const row of allData) {
      const [_, time] = row.TIMESTAMP.split(' ');
      const rad = parseFloat(row['Radiação (W/m²)']);
      const temp = parseFloat(row['Temp Painel (°C)']);

      irradiancia.push({ x: time, y: rad, date: _ });
      temperatura.push({ x: time, y: temp, date: _ });
    }
  } else {
    for (const row of allData) {
      if (!row.TIMESTAMP.startsWith(date)) {
        if (irradiancia.length > 0) break;
        continue;
      }

      const time = row.TIMESTAMP.split(' ')[1];
      const rad = parseFloat(row['Radiação (W/m²)']);
      const temp = parseFloat(row['Temp Painel (°C)']);

      irradiancia.push({ x: time, y: rad, date: date });
      temperatura.push({ x: time, y: temp, date: date });
    }
  }

  const notFound = irradiancia.length === 0;
  return NextResponse.json({ irradiancia, temperatura, notFound });
}
