'use client'

import React, { useRef, useEffect } from 'react';

export type CanvasPlotProps = {
  x: number[];
  y: number[][];
  width?: number;
  height?: number;
  backgroundColor?: string;
  colors?: string[];
  grid?: boolean;
  perCurveYScale?: boolean;
  labels?: string[];
  axisLabels?: {
    x?: string;
    y?: string;
  };
  lineWidths?: number[];
  gridLineWidth?: number;
  yPrecision?: number;
  xPrecision?: number;
  ylim?: [number, number];
  xlim?: [number, number];
};

const CanvasPlot: React.FC<CanvasPlotProps> = ({
  x,
  y,
  width = 600,
  height = 400,
  backgroundColor = 'white',
  colors = ['blue', 'red', 'green', 'purple', 'orange'],
  grid = true,
  perCurveYScale = false,
  labels = [],
  axisLabels = { x: '', y: '' },
  lineWidths = [],
  gridLineWidth = 1,
  yPrecision = 2,
  xPrecision = 2,
  ylim,
  xlim,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const padding = 60;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    const safeRange = (min: number, max: number) => (min === max ? [min - 1, max + 1] : [min, max]);

    const [safeMinX, safeMaxX] = xlim ?? safeRange(Math.min(...x), Math.max(...x));

    const scaleX = (val: number) =>
      padding + ((val - safeMinX) / (safeMaxX - safeMinX)) * plotWidth;

    const getScaleY = (yVals: number[]) => {
      const [minY, maxY] = ylim ?? safeRange(Math.min(...yVals), Math.max(...yVals));
      return (val: number) =>
        padding + plotHeight - ((val - minY) / (maxY - minY)) * plotHeight;
    };

    const [globalMinY, globalMaxY] = ylim ?? safeRange(Math.min(...y.flat()), Math.max(...y.flat()));

    if (grid) {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = gridLineWidth;
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const gx = padding + (plotWidth / 10) * i;
        const gy = padding + (plotHeight / 10) * i;
        ctx.moveTo(gx, padding);
        ctx.lineTo(gx, height - padding);
        ctx.moveTo(padding, gy);
        ctx.lineTo(width - padding, gy);
      }
      ctx.stroke();
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '14px sans-serif';
    if (axisLabels.x) ctx.fillText(axisLabels.x, width / 2 - 20, height - 5);
    if (axisLabels.y) {
      ctx.save();
      ctx.translate(10, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(axisLabels.y, 0, 0);
      ctx.restore();
    }

    ctx.font = '12px sans-serif';
    for (let i = 0; i <= 10; i++) {
      const valX = safeMinX + ((safeMaxX - safeMinX) / 10) * i;
      const xPos = scaleX(valX);
      ctx.fillText(valX.toFixed(xPrecision), xPos - 10, height - padding + 15);
    }

    // Y axis ticks
    for (let i = 0; i <= 10; i++) {
      const valY = globalMinY + ((globalMaxY - globalMinY) / 10) * i;
      const yPos = padding + plotHeight - ((valY - globalMinY) / (globalMaxY - globalMinY)) * plotHeight;
      ctx.fillText(valY.toFixed(yPrecision), padding - 45, yPos + 4);
    }

    y.forEach((yArray, i) => {
      const scaleY = perCurveYScale ? getScaleY(yArray) : getScaleY(y.flat());

      ctx.beginPath();
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = lineWidths[i] ?? 2;
      for (let j = 0; j < x.length; j++) {
        const px = scaleX(x[j]);
        const py = scaleY(yArray[j]);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      if (labels[i]) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillText(labels[i], width - padding - 80, padding + 20 * i);
      }
    });
  }, [x, y, width, height, backgroundColor, colors, grid, perCurveYScale, labels, axisLabels, lineWidths, gridLineWidth, yPrecision, xPrecision, ylim, xlim]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default CanvasPlot;
