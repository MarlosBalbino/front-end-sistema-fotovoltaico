'use client'

import React, { useMemo, useState, useCallback } from 'react'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from 'recharts'

// Função matemática
const f = (x: number): number => Math.sin(x) * x

interface FunctionPlotProps {
  xMin?: number
  xMax?: number
  step?: number
}

const FunctionPlot: React.FC<FunctionPlotProps> = ({
  xMin = -10,
  xMax = 10,
  step = 0.1
}) => {
  const fullData = useMemo(() => {
    const points = []
    for (let x = xMin; x <= xMax; x += step) {
      points.push({ x: parseFloat(x.toFixed(2)), y: f(x) })
    }
    return points
  }, [xMin, xMax, step])

  const [viewWindow, setViewWindow] = useState({ xStart: xMin, xEnd: xMax })

  const handleZoom = useCallback((delta: number) => {
    const range = viewWindow.xEnd - viewWindow.xStart
    const zoomFactor = 0.2 * range
    const newStart = viewWindow.xStart + delta * zoomFactor
    const newEnd = viewWindow.xEnd - delta * zoomFactor
    if (newEnd - newStart >= step * 2) {
      setViewWindow({ xStart: newStart, xEnd: newEnd })
    }
  }, [viewWindow, step])

  const handleWheel = (event: React.WheelEvent) => {
    const delta = event.deltaY > 0 ? 1 : -1
    handleZoom(delta)
  }

  const zoomIn = () => handleZoom(1)
  const zoomOut = () => handleZoom(-1)
  const resetZoom = () => setViewWindow({ xStart: xMin, xEnd: xMax })

  const visibleData = fullData.filter(
    (point) => point.x >= viewWindow.xStart && point.x <= viewWindow.xEnd
  )

  return (
    <div onWheel={handleWheel}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={zoomIn}>🔍 Zoom In</button>
        <button onClick={zoomOut} style={{ marginLeft: '1rem' }}>🔎 Zoom Out</button>
        <button onClick={resetZoom} style={{ marginLeft: '1rem' }}>Reset</button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={visibleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[viewWindow.xStart, viewWindow.xEnd]}
          />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FunctionPlot
