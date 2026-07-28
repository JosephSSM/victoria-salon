"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function FloatingTool({
  icon: Icon,
  top,
  left,
  size,
  duration,
  color,
  containerRef,
}: {
  icon: LucideIcon;
  top: string;
  left: string;
  size: number;
  duration: number;
  color: string;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 12 });
  const springY = useSpring(y, { stiffness: 120, damping: 12 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleMove(e: MouseEvent) {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const radius = 180;
      if (dist < radius) {
        const pull = 1 - dist / radius;
        x.set((-dx / dist) * pull * 28);
        y.set((-dy / dist) * pull * 28);
      } else {
        x.set(0);
        y.set(0);
      }
    }

    container.addEventListener("mousemove", handleMove);
    return () => container.removeEventListener("mousemove", handleMove);
  }, [containerRef, x, y]);

  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{ top, left }}
      animate={{ y: [0, -14, 0], rotate: [-6, 6, -6] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div style={{ x: springX, y: springY }}>
        <Icon size={size} color={color} strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
}
