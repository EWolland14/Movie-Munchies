import React, { useEffect, useRef } from 'react';

interface GoldCoinShowerProps {
  active: boolean;
  onComplete?: () => void;
}

interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rot: number;
  vRot: number;
  scaleX: number;
  vScaleX: number;
  color: string;
  shineAngle: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vOpacity: number;
  vy: number;
}

export const GoldCoinShower: React.FC<GoldCoinShowerProps> = ({ active, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize Coins
    const coins: Coin[] = [];
    const coinCount = 75;
    for (let i = 0; i < coinCount; i++) {
      coins.push({
        x: Math.random() * width,
        y: -50 - Math.random() * height * 0.8,
        vx: (Math.random() - 0.5) * 3,
        vy: 4 + Math.random() * 6,
        radius: 14 + Math.random() * 12,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        scaleX: Math.cos(Math.random() * Math.PI),
        vScaleX: 0.05 + Math.random() * 0.08,
        color: '#f59e0b',
        shineAngle: Math.random() * Math.PI * 2,
      });
    }

    // Initialize Sparkles
    const sparkles: Sparkle[] = [];
    const sparkleCount = 60;
    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2 + Math.random() * 3,
        opacity: Math.random(),
        vOpacity: 0.02 + Math.random() * 0.03,
        vy: 1 + Math.random() * 2,
      });
    }

    let animationId: number;
    const startTime = performance.now();
    const duration = 4800; // 4.8 seconds

    const render = (time: number) => {
      const elapsed = time - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        if (onComplete) onComplete();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Global alpha fades out towards end
      const globalAlpha = progress > 0.75 ? 1 - (progress - 0.75) / 0.25 : 1;
      ctx.globalAlpha = Math.max(0, globalAlpha);

      // 1. Draw Sparkles
      sparkles.forEach((s) => {
        s.y += s.vy;
        s.opacity += s.vOpacity;
        if (s.opacity > 1 || s.opacity < 0) s.vOpacity = -s.vOpacity;
        if (s.y > height) s.y = -10;

        ctx.save();
        ctx.fillStyle = `rgba(253, 224, 71, ${Math.max(0, Math.min(1, s.opacity))})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw 3D Tumble Coins
      coins.forEach((c) => {
        c.y += c.vy;
        c.x += c.vx;
        c.rot += c.vRot;
        c.scaleX = Math.cos(c.shineAngle);
        c.shineAngle += c.vScaleX;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.scale(c.scaleX, 1);

        // Golden Coin Body Gradient
        const grad = ctx.createLinearGradient(-c.radius, -c.radius, c.radius, c.radius);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.3, '#f59e0b');
        grad.addColorStop(0.7, '#d97706');
        grad.addColorStop(1, '#78350f');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
        ctx.fill();

        // Rim
        ctx.lineWidth = Math.max(1, c.radius * 0.14);
        ctx.strokeStyle = '#b45309';
        ctx.stroke();

        // Center Star / Emblem (only when face is visible)
        if (Math.abs(c.scaleX) > 0.3) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(0, 0, c.radius * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Star shape
          ctx.font = `${Math.floor(c.radius * 0.8)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', 0, 1);
        }

        // Specular glint
        const glint = ctx.createRadialGradient(-c.radius * 0.3, -c.radius * 0.3, 1, 0, 0, c.radius);
        glint.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        glint.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glint;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
};
