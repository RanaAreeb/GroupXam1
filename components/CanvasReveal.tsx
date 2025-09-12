"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useCanvasReveal } from '@/hooks/use-canvas-reveal';

interface CanvasRevealProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  variant?: 'spiral' | 'wave' | 'circle' | 'zigzag';
}

export default function CanvasReveal({
  children,
  className = '',
  color = '#10b981',
  duration = 2000,
  delay = 0,
  strokeWidth = 3,
  variant = 'spiral'
}: CanvasRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            setTimeout(() => {
              animateReveal();
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    const animateReveal = () => {
      const startTime = Date.now();
      const path = createRevealPath(
        canvas.width / window.devicePixelRatio,
        canvas.height / window.devicePixelRatio,
        variant
      );

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = applyEasing(progress, 'ease-out');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the revealed portion
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = 0.8;

        ctx.beginPath();
        const pointIndex = Math.floor(easedProgress * (path.length - 1));

        for (let i = 0; i <= pointIndex; i++) {
          const point = path[i];
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }

        ctx.stroke();

        // Add sparkle effects
        if (easedProgress > 0.3) {
          drawSparkles(ctx, path, pointIndex, color);
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsRevealed(true);
        }
      };

      animate();
    };

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duration, delay, color, strokeWidth, variant, isVisible]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ opacity: isRevealed ? 0 : 1 }}
      />
      <div className={`transition-all duration-500 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

function createRevealPath(width: number, height: number, variant: string) {
  const path = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.3;

  switch (variant) {
    case 'spiral':
      for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI * 4;
        const currentRadius = (i / 100) * radius;
        const x = centerX + Math.cos(angle) * currentRadius;
        const y = centerY + Math.sin(angle) * currentRadius;
        path.push({ x, y });
      }
      break;

    case 'wave':
      for (let i = 0; i <= 100; i++) {
        const x = (i / 100) * width;
        const y = centerY + Math.sin((i / 100) * Math.PI * 4) * (radius / 2);
        path.push({ x, y });
      }
      break;

    case 'circle':
      for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        path.push({ x, y });
      }
      break;

    case 'zigzag':
      for (let i = 0; i <= 100; i++) {
        const x = (i / 100) * width;
        const y = centerY + (i % 2 === 0 ? -radius/2 : radius/2);
        path.push({ x, y });
      }
      break;

    default:
      // Default spiral
      for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI * 4;
        const currentRadius = (i / 100) * radius;
        const x = centerX + Math.cos(angle) * currentRadius;
        const y = centerY + Math.sin(angle) * currentRadius;
        path.push({ x, y });
      }
  }

  return path;
}

function drawSparkles(ctx: CanvasRenderingContext2D, path: any[], pointIndex: number, color: string) {
  const sparkleCount = 5;
  const sparkleSize = 3;
  
  for (let i = 0; i < sparkleCount; i++) {
    const randomIndex = Math.floor(Math.random() * pointIndex);
    const point = path[randomIndex];
    
    if (point) {
      ctx.save();
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, sparkleSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }
}

function applyEasing(t: number, easing: string): number {
  switch (easing) {
    case 'ease-in':
      return t * t;
    case 'ease-out':
      return 1 - Math.pow(1 - t, 2);
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    case 'linear':
    default:
      return t;
  }
}
