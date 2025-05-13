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

interface DataPoint {
  x: number;
  y: number;
}

interface PlotProps {
  fileName: string;
  onPointClick?: (yValue: number) => void;
}

const Plot = ({ fileName, onPointClick }: PlotProps) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

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
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result: any) => {
            const parsedData: DataPoint[] = result.data.map((row: any) => ({
              x: row[0],
              y: row[1],
            }));
            setData(parsedData);
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

  return (
    <div className={style.container}>
      <div className={style.chartContainer}>
        <ResponsiveContainer width="100%" aspect={16 / 9}>
          <LineChart data={data} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#8884d8"
              dot={false} //
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
  );
};

export default Plot;
