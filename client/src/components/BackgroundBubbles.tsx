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

export function BackgroundBubbles({ count = 14 }: { count?: number }) {
  const bubbles = useMemo(() => {
    const rnd = mulberry32(1337);
    const arr: BubbleSpec[] = [];

    for (let i = 0; i < count; i++) {
      const size = Math.round(140 + rnd() * 260); // 140..400
      const left = rnd() * 100;
      const top = rnd() * 100;

      const dx = Math.round((rnd() * 2 - 1) * 180); // -180..180
      const dy = Math.round((rnd() * 2 - 1) * 140); // -140..140

      const drift = 18 + rnd() * 28; // 18..46
      const drift2 = 22 + rnd() * 34; // 22..56
      const pulse = 7 + rnd() * 9; // 7..16
      const delay = -rnd() * 20;

      const opacity = 0.18 + rnd() * 0.26; // 0.18..0.44 visible
      const blur = rnd() * 1.2; // 0..1.2

      // Pink, purple, blue ranges
      const hueBuckets = [320, 285, 245]; // pink, purple, blue
      const baseHue = hueBuckets[Math.floor(rnd() * hueBuckets.length)];
      const hue = baseHue + (rnd() * 18 - 9); // small variation

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
