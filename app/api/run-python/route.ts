// app/api/run-python/route.ts
import { NextResponse } from 'next/server';
import { spawnSync } from 'child_process';

export async function POST(req: Request) {
  try {
    const body = await req.json(); // <-- Dados enviados do frontend

    const python = spawnSync('py', ['script.py', JSON.stringify(body)], {
      encoding: 'utf-8',
    });

    if (python.error) {
      console.error('[Python error]:', python.error);
      return NextResponse.json({ success: false, error: python.error.message }, { status: 500 });
    }

    const output = python.stdout.trim();
    const result = JSON.parse(output);

    return NextResponse.json(result);
  } catch (e: any) {
    console.error('[Server error]:', e);
    return NextResponse.json({ success: false, error: e.message || 'Erro interno' }, { status: 500 });
  }
}
