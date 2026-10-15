import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Cpu, ShieldCheck, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BackendStatus } from '../../types';

interface HeroRobotVisualProps {
  backendStatus: BackendStatus;
}

export const HeroRobotVisual: React.FC<HeroRobotVisualProps> = ({ backendStatus }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Smooth mouse tilt parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Background Canvas: Atmospheric orange particles, metallic particles, and 3D orbit lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Drifting metallic and orange cyber particles
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 800,
      radius: 1 + Math.random() * 2.2,
      speedY: -0.2 - Math.random() * 0.45,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: 0.2 + Math.random() * 0.7,
      color: Math.random() > 0.35 ? '#FF5A00' : '#D4D8DF',
    }));

    const render = () => {
      time += 0.015;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Ambient Volumetric Orange Core Glow behind Robot
      const cx = w * 0.52;
      const cy = h * 0.44;
      const pulseRadius = 260 + Math.sin(time * 2) * 25;

      const gradient = ctx.createRadialGradient(cx, cy, 30, cx, cy, pulseRadius);
      gradient.addColorStop(0, 'rgba(255, 90, 0, 0.28)');
      gradient.addColorStop(0.35, 'rgba(255, 90, 0, 0.09)');
      gradient.addColorStop(0.7, 'rgba(21, 23, 27, 0.05)');
      gradient.addColorStop(1, 'rgba(8, 9, 11, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Animated Metallic 3D Orbit Lines
      const orbits = [
        { rx: 220, ry: 75, angle: time * 0.4, tilt: 0.35, stroke: 'rgba(212, 216, 223, 0.2)' },
        { rx: 250, ry: 85, angle: -time * 0.3 + 1.5, tilt: -0.55, stroke: 'rgba(255, 90, 0, 0.4)' },
        { rx: 190, ry: 60, angle: time * 0.6 + 2.8, tilt: 0.75, stroke: 'rgba(212, 216, 223, 0.15)' },
      ];

      orbits.forEach((orbit) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orbit.tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, orbit.rx, orbit.ry, orbit.angle, 0, Math.PI * 2);
        ctx.strokeStyle = orbit.stroke;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Orbiting node
        const beadAngle = orbit.angle + time * 1.6;
        const bx = orbit.rx * Math.cos(beadAngle);
        const by = orbit.ry * Math.sin(beadAngle);

        ctx.fillStyle = '#FF5A00';
        ctx.shadowColor = '#FF5A00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      });

      // 3. Floating Metallic Particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time * 3 + p.x) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[520px] sm:min-h-[640px] lg:min-h-[740px] flex items-center justify-center lg:justify-end select-none pointer-events-auto perspective-[1200px]"
    >
      {/* 1. Atmospheric Canvas Layer with Orbit Lines */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 2. Interactive Metallic Robot Container with 3D Tilt */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[540px] lg:max-w-[640px] xl:max-w-[700px] flex items-center justify-center"
      >
        {/* Ambient Backlight Aura (Electric Orange Glow) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] bg-gradient-to-tr from-[#FF5A00]/30 via-[#FF8A32]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* The Exact Metallic AI Robot Artwork Image (Asset) */}
        <div className="relative w-full flex items-center justify-center">
          <motion.img
            src="/assets/metallic-ai-robot.svg"
            alt="PitchCraft AI Futuristic Metallic Robot"
            className="w-full h-auto max-h-[70vh] sm:max-h-[74vh] lg:max-h-[80vh] object-contain drop-shadow-[0_25px_65px_rgba(0,0,0,0.95)] transition-transform duration-700 ease-out"
            style={{
              translateZ: 30,
            }}
            animate={{
              y: [-6, 6, -6],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Smooth Bottom Vignette & Edge Fade into #08090B */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08090B] via-[#08090B]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#08090B] via-transparent to-transparent pointer-events-none hidden lg:block" />
        </div>

        {/* 3. Floating HUD Indicator — Top Right: Ollama AI Engine Telemetry */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="absolute -top-4 right-2 sm:right-6 bg-[#15171B]/90 backdrop-blur-2xl border border-[#D4D8DF]/20 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 z-20 group hover:border-[#FF5A00]/60 transition-colors"
          style={{ translateZ: 50 }}
        >
          <div className="w-8 h-8 rounded-xl bg-black/60 border border-[#D4D8DF]/20 flex items-center justify-center text-[#FF5A00]">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus.isConnected
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : 'bg-[#FF5A00] shadow-[0_0_8px_#FF5A00]'
                }`}
              />
              <span className="text-[10px] font-mono tracking-wider text-white font-semibold uppercase">
                OLLAMA AI ENGINE
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#D4D8DF] mt-0.5">
              {backendStatus.isConnected ? (
                <span className="text-emerald-400 font-bold">CONNECTED // QWEN3:4B</span>
              ) : (
                <span className="text-[#D4D8DF]/80">LOCAL STUDIO MODE</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* 4. Floating HUD Indicator — Bottom Left: Real-time PitchCraft Proposal Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="absolute bottom-6 -left-2 sm:left-4 max-w-[290px] sm:max-w-[330px] bg-[#15171B]/90 backdrop-blur-2xl border border-[#D4D8DF]/20 rounded-3xl p-4 shadow-2xl z-20 hover:border-white/30 transition-all"
          style={{ translateZ: 60 }}
        >
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#D4D8DF]/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4D8DF]">
                AUTONOMOUS SYNTHESIS
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              1.8s LATENCY
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-display font-bold text-white tracking-tight line-clamp-1">
              FinTech Mobile Platform Proposal
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#D4D8DF]">
              <span>Client: Apex Capital</span>
              <span className="text-[#FF5A00] font-bold">$24,500</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#D4D8DF]/60">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Air-Gapped Data
            </span>
            <span className="flex items-center gap-1 text-[#FF5A00]">
              <Zap className="w-3 h-3" />
              4 Milestones
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
