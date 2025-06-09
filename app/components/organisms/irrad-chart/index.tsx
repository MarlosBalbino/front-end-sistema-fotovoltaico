"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type DataPoint = {
  mes: string;
  [key: string]: number | string;
};

interface MultiLineChartProps {
  irradiancias: DataPoint[];
  labels: string[];
  colors?: string[];
  yLabel?: string;
  yUnit?: string;
  ylim?: [number, number]; // <- novo
}

const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ff7300', '#ff0000', '#00ff00', '#0000ff'];

const IrradChart: React.FC<MultiLineChartProps> = ({ 
  irradiancias, 
  labels,
  yLabel = "Eixo Y",
  yUnit = "",
  colors = DEFAULT_COLORS,
  ylim
}) => {
  const curveKeys = irradiancias.length > 0 
    ? Object.keys(irradiancias[0]).filter(key => key !== 'mes') 
    : [];

  const height = 250;
  const width = height * 23 / 9;

  return (
    <div style={{ width: width, height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={irradiancias}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis 
            label={{ 
              value: `${yLabel} ${yUnit ? `(${yUnit})`: ""}`, 
              position: 'insideCenter',
              angle: -90, 
              offset: 20,
              dx: -40               
            }} 
            domain={ylim ?? ['auto', 'auto']} // <- aqui está o suporte a ylim
          />
          <Tooltip 
            formatter={(value) => [`${value} ${yUnit}`, '']}
            labelFormatter={(label) => `Mês: ${label}`}
          />
          <Legend />
          {curveKeys.map((key, index) => (
            <Line
              key={key}
              type="linear"
              dataKey={key}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 6 }}            
              name={labels[index]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IrradChart;
