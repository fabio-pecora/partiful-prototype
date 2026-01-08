import { useEffect, useRef } from "react";

type Pt = { x: number; y: number };

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

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

    const drawRibbon = (points: Pt[], width: number, grad: CanvasGradient, alpha: number) => {
      if (points.length < 2) return;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = grad;
      ctx.lineWidth = width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const loop = (now: number) => {
      const t = (now - start) / 1000;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.globalAlpha = 0.10;
      ctx.fillStyle = "rgba(8, 3, 26, 1)";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      const centerY = h * 0.46;

      const ribbons = 3;
      for (let r = 0; r < ribbons; r++) {
        const yBase = centerY + (r - 1) * (h * 0.085);
        const amp = h * (0.06 + r * 0.01);
        const freq = 0.85 + r * 0.18;
        const speed = 0.18 + r * 0.05;

        const pts: Pt[] = [];
        const steps = 120;

        for (let i = 0; i <= steps; i++) {
          const u = i / steps;
          const x = u * w;

          const n = fbm(u * 2.2 + r * 3.1 + t * speed, r * 1.7 + t * 0.12);
          const y =
            yBase +
            Math.sin(u * Math.PI * 2 * freq + t * (0.9 + r * 0.25)) * amp * 0.55 +
            n * amp * 0.6;

          pts.push({ x, y });
        }

        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0.0, "rgba(0, 240, 255, 1)");
        grad.addColorStop(0.25, "rgba(120, 80, 255, 1)");
        grad.addColorStop(0.5, "rgba(255, 70, 200, 1)");
        grad.addColorStop(0.72, "rgba(255, 160, 0, 1)");
        grad.addColorStop(1.0, "rgba(140, 255, 120, 1)");

        drawRibbon(pts, 18 - r * 2, grad, 0.06);
        drawRibbon(pts, 10 - r * 1, grad, 0.10);
        drawRibbon(pts, 4, grad, 0.18);

        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        const dotEvery = 4;
        for (let i = 0; i < pts.length; i += dotEvery) {
          const p = pts[i];
          const d = Math.abs(i / pts.length - 0.5);
          const a = clamp(1 - d * 2.2, 0, 1);
          ctx.globalAlpha = 0.03 + a * 0.07;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

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
