import { useEffect, useRef } from "react";

type Pt = { x: number; y: number };

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* Simple smooth value noise */
function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function noise2(x: number, y: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const sx = smoothstep(x - x0);
  const sy = smoothstep(y - y0);

  const n00 = hash2(x0, y0);
  const n10 = hash2(x1, y0);
  const n01 = hash2(x0, y1);
  const n11 = hash2(x1, y1);

  const ix0 = lerp(n00, n10, sx);
  const ix1 = lerp(n01, n11, sx);
  return lerp(ix0, ix1, sy);
}

function fbm(x: number, y: number) {
  let v = 0;
  let a = 0.5;
  let f = 1.0;
  for (let i = 0; i < 5; i++) {
    v += a * (noise2(x * f, y * f) * 2 - 1);
    f *= 2.0;
    a *= 0.5;
  }
  return v;
}

export function BackgroundWaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctx = canvasEl.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasEl.width = Math.floor(w * dpr);
      canvasEl.height = Math.floor(h * dpr);
      canvasEl.style.width = `${w}px`;
      canvasEl.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();

    const fillRibbon = (top: Pt[], bottom: Pt[], fill: CanvasGradient, alpha: number, blurPx: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = "screen";
      ctx.filter = blurPx > 0 ? `blur(${blurPx}px) saturate(1.45)` : "saturate(1.25)";
      ctx.fillStyle = fill;

      ctx.beginPath();
      ctx.moveTo(top[0].x, top[0].y);
      for (let i = 1; i < top.length; i++) ctx.lineTo(top[i].x, top[i].y);
      for (let i = bottom.length - 1; i >= 0; i--) ctx.lineTo(bottom[i].x, bottom[i].y);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const strokeHighlight = (top: Pt[], alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = "screen";
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1.2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.filter = "blur(0.2px)";

      ctx.beginPath();
      ctx.moveTo(top[0].x, top[0].y);
      for (let i = 1; i < top.length; i++) ctx.lineTo(top[i].x, top[i].y);
      ctx.stroke();

      ctx.restore();
    };

    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0.0, "rgba(0, 240, 255, 1)");
      grad.addColorStop(0.20, "rgba(90, 110, 255, 1)");
      grad.addColorStop(0.45, "rgba(255, 60, 205, 1)");
      grad.addColorStop(0.70, "rgba(255, 165, 0, 1)");
      grad.addColorStop(1.0, "rgba(120, 255, 170, 1)");

      const centerY = h * 0.50;
      const amp = h * 0.15; // bigger
      const freq = 1.05;
      const seed = 1.0;

      const steps = 220;
      const top: Pt[] = [];
      const bottom: Pt[] = [];

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = u * w;

        const n = fbm(u * 2.2 + seed * 2.1 + t * 0.16, seed * 1.4 + t * 0.10);
        const y =
          centerY +
          Math.sin(u * Math.PI * 2 * freq + t * 0.85) * amp * 0.62 +
          n * amp * 0.78;

        const thickness =
          amp * 0.62 +
          (Math.sin(u * Math.PI * 2 + t * 0.65) * 0.5 + 0.5) * (amp * 0.22);

        top.push({ x, y: y - thickness * 0.5 });
        bottom.push({ x, y: y + thickness * 0.5 });
      }

      /* Glow passes */
      fillRibbon(top, bottom, grad, 0.10, 18);
      fillRibbon(top, bottom, grad, 0.14, 10);

      /* Core ribbon */
      fillRibbon(top, bottom, grad, 0.26, 0);

      /* Edge highlight */
      strokeHighlight(top, 0.08);

      /* Subtle mesh sparkle */
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      for (let i = 0; i < top.length; i += 3) {
        const u = i / (top.length - 1);
        const fade = clamp(1 - Math.abs(u - 0.5) * 1.8, 0, 1);
        ctx.globalAlpha = 0.012 + fade * 0.05;
        const mx = top[i].x;
        const my = lerp(top[i].y, bottom[i].y, 0.5);
        ctx.beginPath();
        ctx.arc(mx, my, 1.05, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bgWaves" aria-hidden="true" />;
}
