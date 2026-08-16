import React, { useEffect, useState, useRef } from 'react';
import { CursorStyleType } from '../types';

interface WhimsicalCursorProps {
  cursorType: CursorStyleType;
  accentColor?: string;
  enableAmbientParticles?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  shape: 'sparkle' | 'circle' | 'feather' | 'star';
}

export const WhimsicalCursor: React.FC<WhimsicalCursorProps> = ({
  cursorType,
  accentColor = '#D97786',
  enableAmbientParticles = true,
}) => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const nextIdRef = useRef(1);

  // Detect touch devices (disable custom cursor on touch)
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Track mouse movement & create particles
  useEffect(() => {
    if (isTouchDevice || cursorType === 'default') return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest('button, a, input, select, textarea, [role="button"], .interactive-element')
      );
      setIsHovered(isInteractive);

      // Spawn trail particles
      if (cursorType !== 'minimal-pearl' && Math.random() > 0.4) {
        spawnParticle(e.clientX, e.clientY, false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Burst of fairy dust on click!
      for (let i = 0; i < 8; i++) {
        spawnParticle(e.clientX, e.clientY, true);
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorType, isTouchDevice, isVisible]);

  const spawnParticle = (x: number, y: number, isBurst: boolean) => {
    const colors = [
      accentColor,
      '#FFD1DC', // Fairy blush
      '#FFF4E0', // Star pollen
      '#E8F5E9', // Dewdrop jade
      '#F3E5F5', // Lavender haze
      '#FFFFFF',
    ];

    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    const speed = isBurst ? 2.5 + Math.random() * 3 : 0.8 + Math.random() * 1.2;
    const angle = Math.random() * Math.PI * 2;
    const shapeChoices: Particle['shape'][] =
      cursorType === 'fluttering-bird'
        ? ['feather', 'sparkle', 'circle']
        : cursorType === 'whimsical-butterfly'
        ? ['star', 'sparkle', 'circle']
        : ['sparkle', 'star', 'circle'];

    const particle: Particle = {
      id: nextIdRef.current++,
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      size: isBurst ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
      color: chosenColor,
      opacity: 0.9,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.4, // float gently upwards
      life: 0,
      maxLife: isBurst ? 45 + Math.random() * 20 : 30 + Math.random() * 15,
      shape: shapeChoices[Math.floor(Math.random() * shapeChoices.length)],
    };

    particlesRef.current.push(particle);
  };

  // Canvas particle animation loop
  useEffect(() => {
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

    // Ambient floating spore counter
    let ambientTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn ambient floating fairy spores if enabled
      if (enableAmbientParticles) {
        ambientTimer++;
        if (ambientTimer % 35 === 0 && particlesRef.current.length < 60) {
          const ambientParticle: Particle = {
            id: nextIdRef.current++,
            x: Math.random() * width,
            y: height + 10,
            size: 1.5 + Math.random() * 2.5,
            color: accentColor,
            opacity: 0.4 + Math.random() * 0.4,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(0.4 + Math.random() * 0.6), // slowly floating up
            life: 0,
            maxLife: 200 + Math.random() * 100,
            shape: 'circle',
          };
          particlesRef.current.push(ambientParticle);
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.opacity = Math.max(0, 1 - p.life / p.maxLife);

        if (p.opacity <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        if (p.shape === 'sparkle' || p.shape === 'star') {
          // 4-pointed fairy sparkle
          ctx.beginPath();
          const r = p.size;
          ctx.moveTo(p.x, p.y - r * 1.8);
          ctx.quadraticCurveTo(p.x, p.y, p.x + r * 1.8, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + r * 1.8);
          ctx.quadraticCurveTo(p.x, p.y, p.x - r * 1.8, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - r * 1.8);
          ctx.fill();
        } else if (p.shape === 'feather') {
          // Delicate feather stroke
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 2, p.size * 0.8, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft glowing orb
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [enableAmbientParticles, accentColor]);

  if (isTouchDevice || cursorType === 'default') {
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />;
  }

  return (
    <>
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />

      {/* Main Cursor Element */}
      {isVisible && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out select-none"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: `translate(-50%, -50%) scale(${isClicking ? 0.85 : isHovered ? 1.35 : 1})`,
          }}
        >
          {cursorType === 'fairy-sparkle' && (
            <div className="relative flex items-center justify-center">
              {/* Outer soft aura */}
              <div
                className="w-8 h-8 rounded-full blur-xs transition-all duration-200"
                style={{
                  backgroundColor: isHovered ? `${accentColor}40` : `${accentColor}25`,
                  boxShadow: `0 0 16px ${accentColor}80`,
                }}
              />
              {/* Center Fairy Wand Star */}
              <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-pulse"
                >
                  <path
                    d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
                    fill={isHovered ? '#FFFFFF' : accentColor}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                  <circle cx="12" cy="12" r="2.5" fill="#FFF8E7" />
                </svg>
              </div>
            </div>
          )}

          {cursorType === 'fluttering-bird' && (
            <div className="relative flex items-center justify-center">
              <div
                className="w-7 h-7 rounded-full blur-xs transition-all duration-200"
                style={{ backgroundColor: `${accentColor}20` }}
              />
              <div className="absolute inset-0 flex items-center justify-center -translate-x-1 -translate-y-1">
                {/* Delicate Origami Bird / Feather Motif */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ filter: `drop-shadow(0 2px 4px ${accentColor}60)` }}
                >
                  <path
                    d="M12 3C8 8 3 10 3 14C3 18 7 21 11 21C15 21 19 18 19 14C19 10 16 7 12 3Z"
                    fill={accentColor}
                    fillOpacity="0.75"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M12 3V21M12 9L17 14M12 13L7 18"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          )}

          {cursorType === 'whimsical-butterfly' && (
            <div className="relative flex items-center justify-center">
              <div
                className="w-8 h-8 rounded-full blur-xs transition-all duration-200"
                style={{ backgroundColor: `${accentColor}20` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Whimsical Fairy Butterfly */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-spin-slow"
                  style={{ filter: `drop-shadow(0 2px 6px ${accentColor}70)` }}
                >
                  <path
                    d="M12 12C9 5 3 6 4 10C5 14 11 13 12 12Z"
                    fill={accentColor}
                    fillOpacity="0.8"
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M12 12C15 5 21 6 20 10C19 14 13 13 12 12Z"
                    fill={accentColor}
                    fillOpacity="0.8"
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M12 12C9 17 5 19 6 16C7 13 11 13 12 12Z"
                    fill={accentColor}
                    fillOpacity="0.6"
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M12 12C15 17 19 19 18 16C17 13 13 13 12 12Z"
                    fill={accentColor}
                    fillOpacity="0.6"
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                  />
                  <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
          )}

          {cursorType === 'minimal-pearl' && (
            <div className="relative flex items-center justify-center">
              <div
                className="w-5 h-5 rounded-full border border-rose-300/80 bg-white/70 backdrop-blur-xs flex items-center justify-center shadow-xs"
                style={{ borderColor: accentColor }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
