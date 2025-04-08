"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Papa from "papaparse";
import style from "./style.module.css";

interface DataPoint {
  x: number;
  y: number;
}

interface PlotProps {
  fileName: string;
}

const Plot = ({ fileName }: PlotProps) => {
  const [data, setData] = useState<DataPoint[]>([]);

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
          delimiter: " ", // Suporta arquivos CSV e DAT com separação por espaço
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

  return (
    <div className={style.container}>
      <div className={style.chartContainer}>
        <ResponsiveContainer width="100%" aspect={16/9}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Plot;
