'use client'
import React, { useRef, useEffect, useState } from "react";
import styles from "./style.module.css";

interface Point {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  opacity: number;
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
const getDistance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

const RandomWalkMode: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [mouse, setMouse] = useState<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false });
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const numPoints = 50;
  const maxConnectionDistance = 200;
  const maxMouseDistance = 300;
  const maxConnectionsPerPoint = 10;
  const maxConnectionsToMouse = 10;
  const speedFactor = 2;

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const newPoints: Point[] = Array.from({ length: numPoints }, () => ({
        x: getRandom(0, dimensions.width),
        y: getRandom(0, dimensions.height),
        dx: getRandom(-1, 1) * speedFactor,
        dy: getRandom(-1, 1) * speedFactor,
        radius: getRandom(2, 5),
        opacity: getRandom(0.3, 1),
      }));
      setPoints(newPoints);
    }
  }, [dimensions]);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setPoints((prevPoints) =>
        prevPoints.map((p) => {
          let newX = p.x + p.dx;
          let newY = p.y + p.dy;

          if (newX < 0 || newX > dimensions.width) p.dx *= -1;
          if (newY < 0 || newY > dimensions.height) p.dy *= -1;

          return {
            ...p,
            x: Math.max(0, Math.min(newX, dimensions.width)),
            y: Math.max(0, Math.min(newY, dimensions.height)),
          };
        })
      );
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [dimensions]);

  return (
    <div
      className={styles.container}
      onMouseMove={(e) => {
        if (svgRef.current) {
          const rect = svgRef.current.getBoundingClientRect();
          setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true });
        }
      }}
      onMouseLeave={() => setMouse((m) => ({ ...m, inside: false }))}
      onMouseEnter={() => setMouse((m) => ({ ...m, inside: true }))}
    >
      <svg ref={svgRef} className={styles.svg}>
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.radius} fill="black" fillOpacity={p.opacity} />
        ))}

        {mouse.inside && points
          .map((p, i) => ({ p, i, dist: getDistance(p, mouse) }))
          .filter(({ dist }) => dist <= maxMouseDistance)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, maxConnectionsToMouse)
          .map(({ p, i, dist }) => {
            const normalizedOpacity = Math.max(0, 1 - dist / maxMouseDistance);
            return (
              <line
                key={`line-to-mouse-${i}`}
                className={styles.line}
                x1={p.x}
                y1={p.y}
                x2={mouse.x}
                y2={mouse.y}
                style={{ strokeOpacity: normalizedOpacity, transition: 'stroke-opacity 0.3s ease' }}
              />
            );
          })}

        {points.map((a, i) => {
          const connections = points
            .slice(i + 1)
            .map((b, j) => ({ b, j, dist: getDistance(a, b) }))
            .filter(({ dist }) => dist <= maxConnectionDistance)
            .sort((a, b) => a.dist - b.dist)
            .slice(0, maxConnectionsPerPoint);

          return connections.map(({ b, j, dist }) => {
            const normalizedOpacity = Math.max(0, 1 - dist / maxConnectionDistance);
            return (
              <line
                key={`line-${i}-${j}`}
                className={styles.line}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                style={{ strokeOpacity: normalizedOpacity, transition: 'stroke-opacity 0.3s ease' }}
              />
            );
          });
        })}
      </svg>
    </div>
  );
};

export default RandomWalkMode;