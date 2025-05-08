'use client'

import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.css';

interface SignalParams {
  Vm: number;
  w: number;
  theta: number;
  color: string;
}

interface ScaleParams {
  xScale: number; // ms per screen
  yScale: number; // Volts per division
}

const Oscilloscope: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [buffer, setBuffer] = useState<number[][]>([]);
  const [maxBufferSize, setMaxBufferSize] = useState(1000);
  const [viewIndex, setViewIndex] = useState(0);

  const [signals, setSignals] = useState<SignalParams[]>([
    { Vm: 100, w: 2 * Math.PI, theta: 0, color: 'lime' },
    { Vm: 50, w: 4 * Math.PI, theta: Math.PI / 4, color: 'cyan' },
  ]);

  const [scale, setScale] = useState<ScaleParams>({ xScale: 1000, yScale: 1 });

  const [limits, setLimits] = useState({
    Vm: { min: 0, max: 300 },
    w: { min: 0.1, max: 20 },
    theta: { min: -Math.PI, max: Math.PI },
  });

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      startTime = time;

      if (isRunning) {
        const newSamples = signals.map(sig =>
          sig.Vm * Math.cos(sig.w * time / 1000 + sig.theta)
        );

        setBuffer(prev => {
          const updated = [...prev, newSamples];
          return updated.length > maxBufferSize ? updated.slice(-maxBufferSize) : updated;
        });

        setViewIndex(prev => (prev < maxBufferSize - 1 ? prev + 1 : prev));
      }

      draw();
      animationFrameId = requestAnimationFrame(render);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw grid
      const divisions = 10;
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      for (let i = 0; i <= divisions; i++) {
        const x = (i * width) / divisions;
        const y = (i * height) / divisions;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw signals
      signals.forEach((sig, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = sig.color;
        const visibleData = buffer.slice(-width);

        visibleData.forEach((samples, i) => {
          const x = i;
          const y = height / 2 - (samples[idx] / scale.yScale);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });

        ctx.stroke();
      });

      // X-axis ticks (time markers)
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      for (let i = 0; i <= width; i += width / divisions) {
        const t = ((buffer.length - width + i) * (scale.xScale / width)).toFixed(0);
        ctx.fillText(`${t} ms`, i + 2, height - 5);
      }
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, signals, maxBufferSize, scale, buffer.length]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <h2>Fonte</h2>
        {signals.map((sig, idx) => (
          <div key={idx} className={styles.signalBlock}>
            <h4>Fonte #{idx + 1}</h4>
            {(['Vm', 'w', 'theta'] as const).map(key => (
              <div key={key} className={styles.controlGroup}>
                <label>{key}</label>
                <input
                  type="range"
                  min={limits[key].min}
                  max={limits[key].max}
                  step="0.1"
                  value={sig[key]}
                  onChange={e => {
                    const updated = [...signals];
                    updated[idx] = { ...updated[idx], [key]: parseFloat(e.target.value) };
                    setSignals(updated);
                  }}
                />
                <div>
                  <span>Min:</span>
                  <input
                    type="number"
                    value={limits[key].min}
                    onChange={e => setLimits({
                      ...limits,
                      [key]: { ...limits[key], min: parseFloat(e.target.value) }
                    })}
                  />
                  <span>Max:</span>
                  <input
                    type="number"
                    value={limits[key].max}
                    onChange={e => setLimits({
                      ...limits,
                      [key]: { ...limits[key], max: parseFloat(e.target.value) }
                    })}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

        <h2>Osciloscópio</h2>
        <div className={styles.controlGroup}>
          <label>Escala Y (volts/div)</label>
          <input
            type="range"
            min={0.1}
            max={20}
            step="0.1"
            value={scale.yScale}
            onChange={e => setScale({ ...scale, yScale: parseFloat(e.target.value) })}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Escala X (ms por tela)</label>
          <input
            type="range"
            min={100}
            max={5000}
            step="100"
            value={scale.xScale}
            onChange={e => setScale({ ...scale, xScale: parseFloat(e.target.value) })}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Buffer Máximo</label>
          <input
            type="number"
            value={maxBufferSize}
            onChange={e => setMaxBufferSize(parseInt(e.target.value))}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Buffer View</label>
          <input
            type="range"
            min={0}
            max={Math.max(0, buffer.length - 1)}
            value={viewIndex}
            onChange={e => setViewIndex(parseInt(e.target.value))}
          />
        </div>

        <button onClick={() => setIsRunning(prev => !prev)}>
          {isRunning ? 'Pausar' : 'Continuar'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className={styles.canvas}
      />
    </div>
  );
};

export default Oscilloscope;
