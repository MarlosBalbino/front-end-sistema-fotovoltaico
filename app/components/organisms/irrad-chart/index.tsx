"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


type DataPoint = {
  mes: string;
  [key: string]: number | string;
};

interface DualLineChartProps {
  irradiancias: DataPoint[];
  labels: string[];
  colors?: string[];
}

const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ff7300', '#ff0000', '#00ff00', '#0000ff'];

const IrradChart: React.FC<DualLineChartProps> = ({ 
  irradiancias, 
  labels,
  colors = DEFAULT_COLORS 
}) => {
  const curveKeys = irradiancias.length > 0 
    ? Object.keys(irradiancias[0]).filter(key => key !== 'mes') 
    : [];

  return (
    <div style={{ width: '100%', height: 400 }}>
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
          <XAxis 
            dataKey="mes" 
            // label={{ value: 'Mês', position: 'insideBottomCenter', offset: -5 }} 
          />
          <YAxis 
            label={{ 
              value: 'Irradiância (W/m²)', 
              angle: -90, 
              position: 'insideLeft' 
            }} 
          />
          <Tooltip 
            formatter={(value) => [`${value} W/m²`, '']}
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