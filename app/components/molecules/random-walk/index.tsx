'use client';
import React, { useRef, useEffect, useState } from 'react';
import styles from './style.module.css';

interface Point {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  opacity: number;
}

// Parâmetros ajustáveis
const numPoints = 150;
const maxConnectionDistance = 200;
const maxMouseDistance = 300;
const maxConnectionsPerPoint = 10;
const maxConnectionsToMouse = 10;
const minOpacity = 0.2
const maxOpacity = 0.6
const maxRadius = 5
const minRadius = 1
const speedFactor = 1;

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
const getDistance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const RandomWalkerCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false });
  const animationFrameRef = useRef<number>(null);
  const colorRef = useRef<string>('');

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
  };

  const getCSSColor = (variableName: string): string => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const updateColor = () => {
      colorRef.current = getCSSColor('--color-8');
    };
    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Inicializa pontos
    pointsRef.current = Array.from({ length: numPoints }, () => ({
      x: getRandom(0, canvas.width),
      y: getRandom(0, canvas.height),
      dx: getRandom(-1, 1) * speedFactor,
      dy: getRandom(-1, 1) * speedFactor,
      radius: getRandom(minRadius, maxRadius),
      opacity: getRandom(minOpacity, maxOpacity),
    }));

    const animate = () => {
      if (!ctx || !canvas) return;

      // Limpa o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      const mouse = mouseRef.current;

      // Atualiza posições
      for (let p of points) {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        p.x = Math.max(0, Math.min(p.x, canvas.width));
        p.y = Math.max(0, Math.min(p.y, canvas.height));
      }

      // Desenha círculos
      for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = colorRef.current
        ctx.fill();
      }

      // Linhas entre pontos
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const connections: { b: Point; dist: number }[] = [];

        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dist = getDistance(a, b);
          if (dist <= maxConnectionDistance) {
            connections.push({ b, dist });
          }
        }

        connections
          .sort((a, b) => a.dist - b.dist)
          .slice(0, maxConnectionsPerPoint)
          .forEach(({ b, dist }) => {
            
            const opacity = Math.max(0, maxOpacity - dist / maxConnectionDistance);
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = colorRef.current
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          });
      }

      // Linhas para o mouse
      if (mouse.inside) {
        const distances = points
          .map(p => ({ p, dist: getDistance(p, mouse) }))
          .filter(({ dist }) => dist <= maxMouseDistance)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, maxConnectionsToMouse);

        for (let { p, dist } of distances) {
          const opacity = Math.max(0, maxOpacity - dist / maxMouseDistance);
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = colorRef.current
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {

  const rect = canvasRef.current?.getBoundingClientRect();
  if (rect) {
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }
  };

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
      }
    };
  
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container}
    >
      <canvas
        ref={canvasRef}
        className={styles.svg}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => (mouseRef.current.inside = true)}
        onMouseLeave={() => (mouseRef.current.inside = false)}
      />
    </div>
  );
};

export default RandomWalkerCanvas;
