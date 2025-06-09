'use client'

import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'

export type CanvasPlotProps = {
  x: number[][]
  y: number[][]
  scatterPoints?: {x: number, y: number, label?: string}[] // Novo tipo para múltiplos pontos
  width?: number
  height?: number
  backgroundColor?: string
  colors?: string[]
  grid?: boolean
  perCurveYScale?: boolean
  labels?: string[]
  axisLabels?: {
    x?: string
    y?: string
  }
  lineWidths?: number[]
  gridLineWidth?: number
  yPrecision?: number
  xPrecision?: number
  ylim?: [number, number]
  xlim?: [number, number]
  ylimPercentage?: number
}

const defaultColors = [
  '#8884d8', // violet
  '#82ca9d', // green
  '#ff7300', // orange
  '#ff4f81', // pink/red
  '#0088FE', // blue
  '#00C49F', // teal
]

function mergeDatasets(datasets: { x: number[], y: number[], key: string }[]) {
  const map = new Map<number, Record<string, number | undefined>>();

  for (const { x, y, key } of datasets) {
    for (let i = 0; i < x.length; i++) {
      const xi = x[i];
      if (!map.has(xi)) {
        map.set(xi, { x: xi });
      }
      map.get(xi)![key] = y[i];
    }
  }

  // Retorna array ordenado por x
  return Array.from(map.values()).sort((a, b) => (a.x as number) - (b.x as number));
}

// function mergeDatasets(datasets: { x: number[], y: number[], key: string }[]) {
//   // Coletar todos os pontos x únicos
//   const allX = new Set<number>();
//   datasets.forEach(dataset => dataset.x.forEach(x => allX.add(x)));
  
//   // Ordenar os pontos x
//   const sortedX = Array.from(allX).sort((a, b) => a - b);
  
//   // Para cada dataset, criar um mapa de x para y
//   const datasetMaps = datasets.map(dataset => {
//     const map = new Map<number, number>();
//     dataset.x.forEach((x, i) => map.set(x, dataset.y[i]));
//     return map;
//   });

//   // Construir o array de dados final
//   return sortedX.map(x => {
//     const point: any = { x };
//     datasets.forEach((dataset, i) => {
//       point[dataset.key] = datasetMaps[i].get(x) ?? null;
//     });
//     return point;
//   });
// }

const RechartsPlot: React.FC<CanvasPlotProps> = ({
  x,
  y,
  scatterPoints = [], // Agora recebe um array de pontos
  width = 500,
  height = 280,
  backgroundColor = 'white',
  colors = defaultColors,
  grid = true,
  perCurveYScale = false,
  labels = [],
  axisLabels = { x: '', y: '' },
  lineWidths = [],
  yPrecision = 2,
  xPrecision = 2,
  ylim,
  xlim,
  ylimPercentage
}) => {

  // 1. Construção do dataset em formato apropriado para o Recharts
  const dataSets = useMemo(() => {
    return x.map((xArr, idx) => ({
      x: xArr,
      y: y[idx],
      key: `y${idx}`,
      hasData: y[idx] && y[idx].length > 0
    }))
  }, [x, y]);
  
  const data = useMemo(() => mergeDatasets(dataSets), [dataSets]);

  // 2. Domínio de x: pega todos os valores de x e scatterPoints e encontra min/max
  const xFlat = [...x.flat(), ...scatterPoints.map(p => p.x)];
  const minX = Math.min(...xFlat);
  const maxX = Math.max(...xFlat);
  const xDomain: [number, number] = xlim ?? [minX, maxX];

  // 3. Domínio de y: pega todos os valores de y válidos e scatterPoints e encontra min/max
  const yFlat = [...y.filter(yArr => yArr.length > 0).flat(), ...scatterPoints.map(p => p.y)];
  const minY = yFlat.length > 0 ? Math.min(...yFlat) : 0;
  const maxY = yFlat.length > 0 ? Math.max(...yFlat) : 1;

  const yDomain: [number, number] = useMemo(() => {
    if (ylim) return ylim;

    if (minY === maxY) {
      return [minY - 1, maxY + 1];
    }

    if (ylimPercentage != null) {
      const range = (maxY - minY) * ylimPercentage;
      return [minY - range, maxY + range];
    }

    return [minY, maxY];
  }, [ylim, ylimPercentage, minY, maxY]);

  return (
    <div style={{ backgroundColor, padding: '1rem' }}>
      <ResponsiveContainer width={width} height={height}>
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 14, left: 16 }}
        >
          {grid && (
            <CartesianGrid
              stroke="#ccc"
              strokeDasharray="5 5"
            />
          )}
          <XAxis
            dataKey="x"
            domain={xDomain}
            type="number"
            tickFormatter={(val) => val.toFixed(xPrecision)}
            label={{
              value: axisLabels.x ?? '',
              position: 'insideCenter',
              dy: 20,
            }}
          />
          {!perCurveYScale ? (
            <YAxis
              yAxisId="main"
              domain={yDomain}
              tickFormatter={(val) => val.toFixed(yPrecision)}
              label={{
                value: axisLabels.y ?? '',
                angle: -90,
                position: 'insideLeftCenter',
                offset: 20,
                dx: -40,
              }}
            />
          ) : null}

          <Tooltip />
          <Legend
            verticalAlign="top"
            align="right"
            layout="horizontal"
            wrapperStyle={{ marginTop: 0 }}
          />

          {dataSets.map((dataset, idx) => (
            dataset.hasData && (
              <Line
                key={idx}
                type="monotone"
                dataKey={`y${idx}`}
                stroke={colors[idx % colors.length]}
                strokeWidth={lineWidths[idx] ?? 2}
                dot={false}
                yAxisId={perCurveYScale ? `y${idx}` : 'main'}
                name={labels[idx] ?? `Curve ${idx + 1}`}
                connectNulls={true}
              />
            )
          ))}

          {perCurveYScale &&
            y.map((yArray, idx) => {
              if (yArray.length === 0) return null;
              
              const minY = Math.min(...yArray)
              const maxY = Math.max(...yArray)
              const domain: [number, number] =
                ylim ?? (minY === maxY ? [minY - 1, maxY + 1] : [minY, maxY])
              return (
                <YAxis
                  key={`yaxis-${idx}`}
                  yAxisId={`y${idx}`}
                  orientation={idx % 2 === 0 ? 'left' : 'right'}
                  domain={domain}
                  tickFormatter={(val) => val.toFixed(yPrecision)}
                  width={50}
                  hide={false}
                />
              )
            })}
            
            {/* Renderiza múltiplos pontos de scatter com cores correspondentes */}
            {scatterPoints.map((point, idx) => (
              <ReferenceDot
                key={`scatter-${idx}`}
                x={point.x}
                y={point.y}
                yAxisId="main"
                r={6}
                fill={colors[idx % colors.length]} // Usa a mesma cor da curva correspondente
                stroke="white"
                strokeWidth={2}
                label={{
                  value: point.label || '',
                  position: 'bottom',
                  fontSize: 12,
                  fill: '#2c3e50',
                }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RechartsPlot