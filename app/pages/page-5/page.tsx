"use client";

import { FunctionPlot } from "@organisms"
interface PlotProps {
  fileName: string;
  onPointClick?: (yValue: number) => void;
}

export default function Page5() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Gráfico de f(x)</h1>
      <FunctionPlot />
    </main>
  )
};