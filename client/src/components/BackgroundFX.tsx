import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  sp: number;
  hue: number;
};

type Streak = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  life: number;
  max: number;
  hue: number;
};

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rnd = mulberry32(424242);

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // subtle parallax
    let px = 0.5;
    let py = 0.5;

    const onMove = (e: PointerEvent) => {
      px = clamp(e.clientX / Math.max(1, w), 0, 1);
      py = clamp(e.clientY / Math.max(1, h), 0, 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    // Sparkles
    const sparks: Spark[] = Array.from({ length: 90 }, () => ({
      x: rnd() * w,
      y: rnd() * h,
      r: 0.6 + rnd() * 1.8,
      a: 0.08 + rnd() * 0.22,
      tw: 0.9 + rnd() * 2.2,
      sp: 0.06 + rnd() * 0.18,
      hue: [205, 255, 290, 322][Math.floor(rnd() * 4)] + (rnd() * 18 - 9),
    }));

    // Comet streaks
    const streaks: Streak[] = [];

    const spawnStreak = () => {
      const fromLeft = rnd() > 0.5;
      const startX = fromLeft ? -80 : w + 80;
      const startY = rnd() * h * 0.92 + h * 0.04;

      // Faster and more dynamic
      const vx = fromLeft ? 520 + rnd() * 520 : -(520 + rnd() * 520);
      const vy = (rnd() * 2 - 1) * 140;

      streaks.push({
        x: startX,
        y: startY,
        vx,
        vy,
        w: 1.6 + rnd() * 3.0,
        life: 0,
        max: 1.15 + rnd() * 1.0, // slightly longer lifetime
        hue: [210, 255, 300, 330][Math.floor(rnd() * 4)] + (rnd() * 18 - 9),
      });
    };

    // Give it an initial "wow" burst on load
    for (let i = 0; i < 7; i++) spawnStreak();

    const start = performance.now();

    const drawAuroraBloom = (t: number) => {
      const cx = w * (0.5 + (px - 0.5) * 0.06);
      const cy = h * (0.45 + (py - 0.5) * 0.06);

      const driftA = Math.sin(t * 0.18) * w * 0.06;
      const driftB = Math.cos(t * 0.14) * h * 0.05;

      const blobs = [
        { x: cx - w * 0.28 + driftA, y: cy - h * 0.18 + driftB, r: Math.min(w, h) * 0.62, hue: 300 },
        { x: cx + w * 0.22 - driftA * 0.7, y: cy - h * 0.05 - driftB * 0.6, r: Math.min(w, h) * 0.56, hue: 330 },
        { x: cx - w * 0.06 + driftA * 0.4, y: cy + h * 0.22 + driftB * 0.7, r: Math.min(w, h) * 0.68, hue: 215 },
      ];

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.filter = "blur(22px) saturate(1.35)";
      ctx.globalAlpha = 0.22;

      for (const b of blobs) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `hsla(${b.hue}, 100%, 72%, 0.55)`);
        g.addColorStop(0.35, `hsla(${b.hue + 10}, 100%, 62%, 0.22)`);
        g.addColorStop(0.75, `hsla(${b.hue - 20}, 100%, 58%, 0.10)`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawSparks = (t: number, dt: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.65;

      for (const s of sparks) {
        s.y += s.sp * 18 * dt;
        s.x += Math.sin(t * 0.2 + s.y * 0.004) * 0.02;

        if (s.y > h + 8) {
          s.y = -8;
          s.x = rnd() * w;
        }

        const tw = (Math.sin(t * s.tw + s.x * 0.01) * 0.5 + 0.5) * 0.9 + 0.1;
        const a = s.a * tw;

        ctx.fillStyle = `hsla(${s.hue}, 100%, 85%, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (tw > 0.82) {
          ctx.strokeStyle = `rgba(255,255,255,${a * 0.55})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(s.x - 3.5, s.y);
          ctx.lineTo(s.x + 3.5, s.y);
          ctx.moveTo(s.x, s.y - 3.5);
          ctx.lineTo(s.x, s.y + 3.5);
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const drawStreaks = (dt: number) => {
        // smooth default: frequent but not insane
        if (rnd() < 0.028) spawnStreak();
            
        // hard cap to guarantee performance
        const MAX_STREAKS = 12;
        if (streaks.length > MAX_STREAKS) streaks.splice(0, streaks.length - MAX_STREAKS);


      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.lineCap = "round";

      for (let i = streaks.length - 1; i >= 0; i--) {
        const st = streaks[i];
        st.life += dt;
        st.x += st.vx * dt;
        st.y += st.vy * dt;

        const p = clamp(st.life / st.max, 0, 1);
        const fade = 1 - p;

        // Tail direction (opposite of velocity)
        const len = 220 + Math.abs(st.vx) * 0.12; // longer tail
        const norm = Math.max(1, Math.hypot(st.vx, st.vy));
        const tx = (-st.vx / norm) * len;
        const ty = (-st.vy / norm) * len;

        // Gradient tail (shiny)
        const gx0 = st.x;
        const gy0 = st.y;
        const gx1 = st.x + tx;
        const gy1 = st.y + ty;

        const grad = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
        grad.addColorStop(0.0, `rgba(255,255,255,${0.95 * fade})`);
        grad.addColorStop(0.15, `hsla(${st.hue},100%,75%,${0.55 * fade})`);
        grad.addColorStop(0.5, `hsla(${st.hue},100%,65%,${0.18 * fade})`);
        grad.addColorStop(1.0, "rgba(0,0,0,0)");

        // Outer glow pass
        ctx.globalAlpha = 0.55 * fade;
        ctx.filter = "blur(16px) saturate(1.5)";
        ctx.strokeStyle = `hsla(${st.hue}, 100%, 70%, 1)`;
        ctx.lineWidth = st.w * 9.0;

        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x + tx, st.y + ty);
        ctx.stroke();

        // Gradient mid pass
        ctx.globalAlpha = 0.80 * fade;
        ctx.filter = "blur(6px) saturate(1.35)";
        ctx.strokeStyle = grad;
        ctx.lineWidth = st.w * 4.2;

        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x + tx, st.y + ty);
        ctx.stroke();

        // Core bright line
        ctx.globalAlpha = 0.95 * fade;
        ctx.filter = "blur(0px)";
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = st.w * 1.2;

        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x + tx * 0.55, st.y + ty * 0.55);
        ctx.stroke();

        // Head sparkle (makes it look glossy)
        ctx.save();
        ctx.globalAlpha = 0.80 * fade;
        ctx.globalCompositeOperation = "screen";

        ctx.filter = "blur(10px)";
        ctx.fillStyle = `hsla(${st.hue}, 100%, 80%, 0.65)`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.w * 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.filter = "blur(0px)";
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.w * 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255,255,255,${0.55 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(st.x - 6, st.y);
        ctx.lineTo(st.x + 6, st.y);
        ctx.moveTo(st.x, st.y - 6);
        ctx.lineTo(st.x, st.y + 6);
        ctx.stroke();

        ctx.restore();

        const offscreen = st.x < -220 || st.x > w + 220 || st.y < -220 || st.y > h + 220;
        if (p >= 1 || offscreen) streaks.splice(i, 1);
      }

      ctx.restore();
      ctx.filter = "none";
    };

    let last = performance.now();

    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, w, h);

      drawAuroraBloom(t);
      drawStreaks(dt);
      drawSparks(t, dt);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove as any);
    };
  }, []);

  return <canvas ref={canvasRef} className="bgFXCanvas" aria-hidden="true" />;
}
