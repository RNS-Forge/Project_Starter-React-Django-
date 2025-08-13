import React, { useEffect, useRef } from 'react';

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  maxOpacity?: number;
  className?: string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(255, 255, 255)',
  maxOpacity = 0.2,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const gridSizeWithGap = squareSize + gridGap;
    const cols = Math.ceil(canvas.width / gridSizeWithGap);
    const rows = Math.ceil(canvas.height / gridSizeWithGap);

    const grid: { opacity: number; targetOpacity: number }[][] = [];
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < cols; j++) {
        grid[i][j] = { opacity: 0, targetOpacity: 0 };
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = grid[i][j];

          // Randomly flicker
          if (Math.random() < flickerChance) {
            cell.targetOpacity = Math.random() * maxOpacity;
          } else if (Math.random() < 0.05) {
            cell.targetOpacity = 0;
          }

          // Smooth transition
          cell.opacity += (cell.targetOpacity - cell.opacity) * 0.1;

          if (cell.opacity > 0.01) {
            ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', `, ${cell.opacity})`);
            ctx.fillRect(j * gridSizeWithGap, i * gridSizeWithGap, squareSize, squareSize);
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [squareSize, gridGap, flickerChance, color, maxOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
