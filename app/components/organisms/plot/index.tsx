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
import Papa from "papaparse";
import style from "./style.module.css";

import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import { RiRestartLine } from "react-icons/ri";

interface DataPoint {
  x: string;
  y: number;
}

interface PlotProps {
  fileName: string;
  onPointClick?: (yValue: number) => void;
}

const Plot = ({ fileName, onPointClick }: PlotProps) => {
  const [allData, setAllData] = useState<DataPoint[]>([]);
  const [displayData, setDisplayData] = useState<DataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [chartSize, setChartSize] = useState<number>(100); // Percentual do tamanho base
  
  // Parâmetros ajustáveis
  const ZOOM_SENSITIVITY = 1.2;
  const MIN_POINTS = 5;
  const SIZE_INCREMENT = 10; // 10% por clique
  const MIN_SIZE = 50; // 50% do tamanho original
  const MAX_SIZE = 200; // 200% do tamanho original
  const BASE_HEIGHT = 300; // Altura base em pixels (16:9)

  useEffect(() => {
    if (!fileName) return;

    const handleFileLoad = async () => {
      try {
        const response = await fetch(`/${fileName}`);
        if (!response.ok) {
          console.error("Erro ao carregar o arquivo");
          return;
        }
        const text = await response.text();

        Papa.parse(text, {
          delimiter: " ",
          skipEmptyLines: true,
          complete: (result: any) => {
            const parsedData: DataPoint[] = result.data.map((row: any) => ({
              x: row[0],
              y: parseFloat(row[1]),
            }));
            setAllData(parsedData);
            setDisplayData(parsedData);
          },
        });
      } catch (error) {
        console.error("Erro ao processar o arquivo", error);
      }
    };

    handleFileLoad();
  }, [fileName]);

  const handleChartClick = (event: any) => {
    if (!event || !event.activePayload || event.activePayload.length === 0) return;

    const point: DataPoint = event.activePayload[0].payload;
    setSelectedPoint(point);
    if (onPointClick) {
      onPointClick(point.y);
    }
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

    // Usa ponto selecionado ou centro do gráfico
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
  };

  const adjustChartSize = (direction: 'increase' | 'decrease') => {
    setChartSize(prev => {
      return direction === 'increase' 
        ? Math.min(prev + SIZE_INCREMENT, MAX_SIZE)
        : Math.max(prev - SIZE_INCREMENT, MIN_SIZE);
    });
  };

  // Calcula dimensões mantendo proporção 16:9
  const chartHeight = (BASE_HEIGHT * chartSize) / 100;
  const chartWidth = (chartHeight * 16) / 9;

  return (
    <div className={style.plotContainer}>
      <div className={style.chartWrapper}>
        {/* Controles de tamanho (esquerda) */}
        <div className={style.sizeControls}>
          <button 
            onClick={() => adjustChartSize('increase')} 
            className={style.sizeButton}
            aria-label="Aumentar tamanho"
          >
            <CiZoomIn size={18} />
          </button>
          <button 
            onClick={() => adjustChartSize('decrease')} 
            className={style.sizeButton}
            aria-label="Diminuir tamanho"
          >
            <CiZoomOut size={18} />
          </button>
        </div>
        
        {/* Container do gráfico */}
        <div 
          className={style.chartContainer} 
          style={{
            width: `${chartWidth}px`,
            height: `${chartHeight}px`
          }}
        >
          {/* Controles de zoom (direita) */}
          <div className={style.zoomControls}>
            <button 
              onClick={() => applyZoom('in')} 
              className={style.zoomButton}
              aria-label="Zoom In"
            >
              <CiZoomIn size={18} />
            </button>
            <button 
              onClick={() => applyZoom('out')} 
              className={style.zoomButton}
              aria-label="Zoom Out"
            >
              <CiZoomOut size={18} />
            </button>
            <button 
              onClick={resetZoom} 
              className={style.zoomButton}
              aria-label="Reset Zoom"
            >
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
              <XAxis 
                dataKey="x" 
                label={{ value: 'Hora do dia', position: 'bottom', offset: 5 }}
              />
              <YAxis 
                label={{ 
                  value: 'Irradiância (W/m²)', 
                  angle: -90, 
                  position: 'insideLeftCenter', 
                  offset: 0,
                  dx: -30 
                }}
              />
              <Tooltip />
              <Line
                type="linear"
                dataKey="y"
                stroke="#8884d8"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
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

export default Plot;