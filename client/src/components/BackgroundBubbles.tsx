import { useMemo } from "react";
import type { CSSProperties } from "react";

type BubbleSpec = {
  id: string;
  left: number;
  top: number;
  size: number;
  dx: number;
  dy: number;
  drift: number;
  drift2: number;
  pulse: number;
  delay: number;
  opacity: number;
  blur: number;
  hue: number;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function BackgroundBubbles({ count = 26 }: { count?: number }) {
  const bubbles = useMemo(() => {
    const rnd = mulberry32(1337);
    const arr: BubbleSpec[] = [];

    for (let i = 0; i < count; i++) {
      const size = Math.round(90 + rnd() * 220); // 90..310 smaller so more fit
      const left = rnd() * 100;
      const top = rnd() * 100;

      const dx = Math.round((rnd() * 2 - 1) * 220); // -220..220
      const dy = Math.round((rnd() * 2 - 1) * 170); // -170..170

      const drift = 20 + rnd() * 34; // 20..54
      const drift2 = 24 + rnd() * 40; // 24..64
      const pulse = 7 + rnd() * 10; // 7..17
      const delay = -rnd() * 24;

      // keep opacity but a bit stronger so colors read
      const opacity = 0.22 + rnd() * 0.30; // 0.22..0.52
      const blur = rnd() * 1.0; // 0..1.0

      // pink, purple, blue with variation
      const hueBuckets = [322, 292, 246];
      const baseHue = hueBuckets[Math.floor(rnd() * hueBuckets.length)];
      const hue = baseHue + (rnd() * 22 - 11);

      arr.push({
        id: `b_${i}`,
        left,
        top,
        size,
        dx,
        dy,
        drift,
        drift2,
        pulse,
        delay,
        opacity,
        blur,
        hue,
      });
    }

    return arr;
  }, [count]);

  return (
    <div className="bgBubbles" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bgBubble"
          style={
            {
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              ["--dx" as any]: `${b.dx}px`,
              ["--dy" as any]: `${b.dy}px`,
              ["--bubbleOpacity" as any]: String(b.opacity),
              ["--bubbleBlur" as any]: `${b.blur}px`,
              ["--hue" as any]: String(b.hue),
              animationDuration: `${b.drift}s, ${b.drift2}s, ${b.pulse}s`,
              animationDelay: `${b.delay}s, ${b.delay * 0.8}s, ${b.delay * 0.6}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
