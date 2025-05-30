import { NextResponse } from 'next/server';
import { getCachedData } from '@/app/lib/dataCache';
import { DataPoint } from '@/app/types/DataPoint';

export async function GET(
  request: Request, // Aqui usamos o tipo padrão
  { params }: { params: { date: string } } // Correção aqui
) {
  const { date } = params; // formato esperado: YYYY-MM-DD
  const allData = getCachedData();

  const irradiancia: DataPoint[] = [];
  const temperatura: DataPoint[] = [];

  for (const row of allData) {
    if (!row.TIMESTAMP.startsWith(date)) {
      if (irradiancia.length > 0) break; // Já passou do dia procurado
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
