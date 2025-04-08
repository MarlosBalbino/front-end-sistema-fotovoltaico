"use client";

import { useEffect, useRef, useState } from "react";

const WIDTH = 600;
const HEIGHT = 400;

function generateRandomFunction(): (x: number) => number {
  const amplitude = 20 + Math.random() * 80;
  const frequency = 0.01 + Math.random() * 0.05;
  const phase = Math.random() * Math.PI * 2;
  const offset = HEIGHT / 2 + (Math.random() - 0.5) * 100;
  return (x: number) => offset + amplitude * Math.sin(frequency * x + phase);
}

type Point = {
  id: number;
  x: number;
  y: number;
  func: (x: number) => number;
  color: string;
};

export default function SineMode() {
  const [numPoints, setNumPoints] = useState(5);
  const [radius, setRadius] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [baseColor, setBaseColor] = useState("#ff0000");
  const [points, setPoints] = useState<Point[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const newPoints: Point[] = [];
    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * WIDTH;
      newPoints.push({
        id: i,
        x,
        y: 0,
        func: generateRandomFunction(),
        color: baseColor,
      });
    }
    setPoints(newPoints);
  }, [numPoints, baseColor]);

  useEffect(() => {
    const animate = () => {
      setPoints((prev) =>
        prev.map((p) => {
          const newX = (p.x + 1) % WIDTH;
          const newY = p.func(newX);
          return { ...p, x: newX, y: newY };
        })
      );
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      <svg width={WIDTH} height={HEIGHT} className="border border-gray-300 bg-gray-100">
        {points.map((p) => (
          <circle key={p.id} cx={p.x} cy={p.y} r={radius} fill={p.color} opacity={opacity} />
        ))}
      </svg>
      <div className="mt-6 flex gap-6 flex-wrap items-center">
        <label>
          Nº Pontos:
          <input
            type="range"
            min={1}
            max={100}
            value={numPoints}
            onChange={(e) => setNumPoints(Number(e.target.value))}
          />
          <span className="ml-2">{numPoints}</span>
        </label>
        <label>
          Tamanho:
          <input
            type="range"
            min={2}
            max={20}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </label>
        <label>
          Opacidade:
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
          />
        </label>
        <label>
          Cor Base:
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
