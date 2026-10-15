import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Sparkles, Shield, Zap } from 'lucide-react';

export const HeroAiCenterpiece: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Responsive canvas dimensions
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle field around orb
    const particles = Array.from({ length: 42 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 120 + Math.random() * 140,
      speed: 0.004 + Math.random() * 0.008,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.7,
      color: Math.random() > 0.4 ? '#FF4D00' : '#E8E8E8',
      yOffset: (Math.random() - 0.5) * 80,
    }));

    const render = () => {
      time += 0.015;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Background Core Glow
      const ambientGlow = ctx.createRadialGradient(cx, cy, 30, cx, cy, 220);
      ambientGlow.addColorStop(0, 'rgba(255, 77, 0, 0.22)');
      ambientGlow.addColorStop(0.4, 'rgba(255, 77, 0, 0.06)');
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.fill();

      // 2. Render Outer Orbital Rings (3D Ellipses with rotation)
      const rings = [
        { rx: 170, ry: 70, angle: time * 0.5, tilt: 0.4, stroke: 'rgba(255, 255, 255, 0.25)', width: 1.5 },
        { rx: 195, ry: 85, angle: -time * 0.35 + 1.2, tilt: -0.6, stroke: 'rgba(255, 77, 0, 0.5)', width: 2 },
        { rx: 140, ry: 55, angle: time * 0.7 + 2.5, tilt: 0.85, stroke: 'rgba(200, 205, 215, 0.3)', width: 1.2 },
      ];

      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ring.tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, ring.angle, 0, Math.PI * 2);
        ctx.strokeStyle = ring.stroke;
        ctx.lineWidth = ring.width;
        ctx.stroke();

        // Orbiting glowing beads along the ring
        const beadAngle = ring.angle + time * 1.5;
        const bx = ring.rx * Math.cos(beadAngle);
        const by = ring.ry * Math.sin(beadAngle);

        ctx.fillStyle = '#FF4D00';
        ctx.shadowColor = '#FF4D00';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      // 3. Render Floating Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * (p.radius * 0.45) + Math.sin(time + p.angle) * 15 + p.yOffset;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 4. Central 3D Metallic Core Orb with realistic studio gradient
      const orbRadius = 78 + Math.sin(time * 1.2) * 2;
      const orbX = cx;
      const orbY = cy + Math.sin(time * 0.8) * 8; // gentle levitation

      // Drop shadow underneath
      ctx.save();
      const shadowGradient = ctx.createRadialGradient(cx, cy + orbRadius + 30, 10, cx, cy + orbRadius + 30, orbRadius * 1.4);
      shadowGradient.addColorStop(0, 'rgba(0,0,0,0.6)');
      shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.ellipse(cx, cy + orbRadius + 24, orbRadius * 1.1, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Main metallic spherical shading
      const sphereGrad = ctx.createRadialGradient(
        orbX - orbRadius * 0.35,
        orbY - orbRadius * 0.35,
        orbRadius * 0.05,
        orbX,
        orbY,
        orbRadius
      );
      sphereGrad.addColorStop(0, '#FFFFFF'); // Specular highlight
      sphereGrad.addColorStop(0.2, '#A8ABB2'); // Chrome midtone
      sphereGrad.addColorStop(0.55, '#353840'); // Dark metal
      sphereGrad.addColorStop(0.85, '#16181C'); // Deep charcoal
      sphereGrad.addColorStop(1, '#0C0D10'); // Dark edge

      ctx.save();
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Specular rim stroke
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Futuristic equator latitude incision groove
      ctx.beginPath();
      ctx.ellipse(orbX, orbY, orbRadius * 0.95, orbRadius * 0.28, Math.sin(time * 0.3) * 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 77, 0, 0.85)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FF4D00';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner glowing core aperture
      const coreGrad = ctx.createRadialGradient(orbX, orbY, 2, orbX, orbY, 26);
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.3, '#FFA066');
      coreGrad.addColorStop(0.7, '#FF4D00');
      coreGrad.addColorStop(1, 'rgba(255, 77, 0, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none">
      {/* Canvas for 60fps metallic 3D orb rendering */}
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Floating Futuristic Badge 1: Qwen3 Neural Inference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-8 -left-4 sm:-left-8 z-20 glass-panel px-3.5 py-2 rounded-full flex items-center gap-2.5 shadow-2xl border border-white/10"
      >
        <div className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
        <span className="text-xs font-mono font-medium text-white tracking-wide">
          Qwen3 · 4B Active
        </span>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
          Local
        </span>
      </motion.div>

      {/* Floating Futuristic Badge 2: Open Source Confidentiality */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-10 -right-2 sm:-right-6 z-20 glass-panel px-4 py-2 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/10"
      >
        <div className="w-8 h-8 rounded-full bg-[#FF4D00]/15 flex items-center justify-center text-[#FF4D00]">
          <Shield className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="text-xs font-semibold text-white tracking-tight">100% Client Privacy</div>
          <div className="text-[10px] text-white/50 font-mono">Zero Cloud Data Retention</div>
        </div>
      </motion.div>

      {/* Floating Futuristic Badge 3: Fast Generation Speed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="hidden sm:flex absolute bottom-2 left-6 z-20 glass-panel px-3 py-1.5 rounded-full items-center gap-2 border border-white/10 text-xs font-mono text-white/80"
      >
        <Zap className="w-3.5 h-3.5 text-[#FF4D00]" />
        <span>Synthesis: &lt; 2.4s</span>
      </motion.div>
    </div>
  );
};
