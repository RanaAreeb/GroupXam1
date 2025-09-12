"use client";

import { useEffect, useRef, useState } from 'react';

interface CanvasRevealOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  color?: string;
  strokeWidth?: number;
}

export function useCanvasReveal(options: CanvasRevealOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();

  const {
    duration = 2000,
    delay = 0,
    easing = 'ease-out',
    color = '#10b981',
    strokeWidth = 3
  } = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Set canvas size to match container
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

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

    observer.observe(canvas);

    const animateReveal = () => {
      const startTime = Date.now();
      const path = createRevealPath(canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing
        const easedProgress = applyEasing(progress, easing);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the revealed portion
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duration, delay, easing, color, strokeWidth, isVisible]);

  return { canvasRef, isRevealed, isVisible };
}

function createRevealPath(width: number, height: number) {
  const path = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;
  
  // Create a spiral path
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 4; // 2 full rotations
    const currentRadius = (i / 100) * radius;
    const x = centerX + Math.cos(angle) * currentRadius;
    const y = centerY + Math.sin(angle) * currentRadius;
    path.push({ x, y });
  }
  
  return path;
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
