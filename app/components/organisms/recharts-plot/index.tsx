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
} from 'recharts'

export type CanvasPlotProps = {
  x: number[]
  y: number[][]
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
}

const defaultColors = [
  '#8884d8', // violet
  '#82ca9d', // green
  '#ff7300', // orange
  '#ff4f81', // pink/red
  '#0088FE', // blue
  '#00C49F', // teal
]

const RechartsPlot: React.FC<CanvasPlotProps> = ({
  x,
  y,
  width = 600,
  height = 400,
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
}) => {
  const data = useMemo(() => {
    return x.map((xVal, i) => {
      const point: any = { x: xVal }
      y.forEach((yArray, j) => {
        point[`y${j}`] = yArray[i]
      })
      return point
    })
  }, [x, y])

  const xDomain: [number, number] = xlim ?? [Math.min(...x), Math.max(...x)]

  const globalY = y.flat()
  const yDomain: [number, number] =
    ylim ?? [Math.min(...globalY), Math.max(...globalY)]

  return (
    <div style={{ backgroundColor, padding: '1rem' }}>
      <ResponsiveContainer width={width} height={height}>
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 14, left: 16 }} // ajustes aqui!
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
              dy: 20, // afasta rótulo X dos ticks
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
                offset: 20, // afasta da escala
                dx: -40,    // empurra para a esquerda
              }}
            />
          ) : null}

          <Tooltip />
          <Legend
            verticalAlign="top" // posição vertical
            align="right"         // ou "left" / "right"
            layout="horizontal"    // ou "vertical"
            wrapperStyle={{ marginTop: 0}} // esse funciona em alguns contextos
          />

          {y.map((_, idx) => (
            <Line
              key={idx}
              type="linear"
              dataKey={`y${idx}`}
              stroke={colors[idx % colors.length]}
              strokeWidth={lineWidths[idx] ?? 2}
              dot={false}
              yAxisId={perCurveYScale ? `y${idx}` : 'main'}
              name={labels[idx] ?? `Curve ${idx + 1}`}
            />
          ))}

          {perCurveYScale &&
            y.map((yArray, idx) => {
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RechartsPlot
