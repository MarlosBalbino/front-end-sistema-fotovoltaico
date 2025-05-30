"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import style from "./style.module.css";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import { RiRestartLine } from "react-icons/ri";
import { DataPoint } from "@/app/types/DataPoint";

interface PlotProps {
  data: DataPoint[];
  xLabel?: string;
  yLabel?: string;
  color?: string;
  onPointClick?: (yValue: number) => void;
}

const PlotData = ({ data, xLabel = 'eixo x', yLabel = 'eixo y', color = '#8884d8', onPointClick }: PlotProps) => {
  const [allData, setAllData] = useState<DataPoint[]>([]);
  const [displayData, setDisplayData] = useState<DataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [chartSize, setChartSize] = useState<number>(90);

  const ZOOM_SENSITIVITY = 1.2;
  const MIN_POINTS = 5;
  const SIZE_INCREMENT = 10;
  const MIN_SIZE = 50;
  const MAX_SIZE = 200;
  const BASE_HEIGHT = 300;

  useEffect(() => {
    if (!data || data.length === 0) return;
    setAllData(data);
    setDisplayData(data);
    setSelectedPoint(null);
    setZoomLevel(1);
  }, [data]);

  const handleChartClick = (event: any) => {
    if (!event?.activePayload?.length) return;
    const point: DataPoint = event.activePayload[0].payload;
    setSelectedPoint(point);
    onPointClick?.(point.y);
  };

  const applyZoom = (direction: 'in' | 'out') => {
    if (allData.length === 0) return;

    const newZoomLevel = direction === 'in'
      ? zoomLevel * ZOOM_SENSITIVITY
      : zoomLevel / ZOOM_SENSITIVITY;

    setZoomLevel(newZoomLevel);

    const totalPoints = allData.length;
    const visiblePoints = Math.max(MIN_POINTS, Math.floor(totalPoints / newZoomLevel));
    const halfVisible = Math.floor(visiblePoints / 2);

    const centerIndex = selectedPoint
      ? allData.findIndex(d => d.x === selectedPoint.x && d.y === selectedPoint.y)
      : Math.floor(allData.length / 2);

    if (centerIndex === -1) return;

    let start = Math.max(0, centerIndex - halfVisible);
    let end = Math.min(allData.length - 1, centerIndex + halfVisible);

    if (end - start + 1 < visiblePoints) {
      if (start === 0) {
        end = Math.min(allData.length - 1, start + visiblePoints - 1);
      } else {
        start = Math.max(0, end - visiblePoints + 1);
      }
    }

    setDisplayData(allData.slice(start, end + 1));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setDisplayData(allData);
    setSelectedPoint(null);
  };

  const adjustChartSize = (direction: 'increase' | 'decrease') => {
    setChartSize(prev =>
      direction === 'increase'
        ? Math.min(prev + SIZE_INCREMENT, MAX_SIZE)
        : Math.max(prev - SIZE_INCREMENT, MIN_SIZE)
    );
  };

  const chartHeight = (BASE_HEIGHT * chartSize) / 100;
  const chartWidth = (chartHeight * 16) / 9;

  return (
    <div className={style.plotContainer}>
      <div className={style.chartWrapper}>
        <div className={style.sizeControls}>
          <button onClick={() => adjustChartSize('increase')} className={style.sizeButton}>
            <CiZoomIn size={18} />
          </button>
          <button onClick={() => adjustChartSize('decrease')} className={style.sizeButton}>
            <CiZoomOut size={18} />
          </button>
        </div>

        <div className={style.chartContainer} style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}>
          <div className={style.zoomControls}>
            <button onClick={() => applyZoom('in')} className={style.zoomButton}>
              <CiZoomIn size={18} />
            </button>
            <button onClick={() => applyZoom('out')} className={style.zoomButton}>
              <CiZoomOut size={18} />
            </button>
            <button onClick={resetZoom} className={style.zoomButton}>
              <RiRestartLine size={18} />
            </button>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              onClick={handleChartClick}
              margin={{ top: 0, right: 0, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="x" label={{ value: xLabel, position: 'bottom', offset: 5 }} />
              <YAxis
                label={{
                  value: yLabel,
                  angle: -90,
                  position: 'insideLeftCenter',
                  offset: 0,
                  dx: -30,
                }}
              />
              <Tooltip />
              <Line type="linear" dataKey="y" stroke={color} strokeWidth={1} dot={false} isAnimationActive={false} />
              {selectedPoint && (
                <ReferenceDot
                  x={selectedPoint.x}
                  y={selectedPoint.y}
                  r={6}
                  fill="#8884d8"
                  stroke="white"
                  strokeWidth={2}
                  isFront
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlotData;
