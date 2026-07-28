"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

export default function MagneticButton({
  children,
  href,
  target,
  rel,
  className,
  background,
  onClick,
}: {
  children: ReactNode;
  href: string;
  target?: string;
  rel?: string;
  className?: string;
  background?: CSSProperties["background"];
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 14, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 150, damping: 14, mass: 0.25 });

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, background }}
      className={`group relative isolate inline-flex items-center justify-center overflow-hidden ${className ?? ""}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-x-[150%] skew-x-[-20deg] bg-white/35 transition-transform duration-700 ease-out group-hover:translate-x-[150%]" />
    </motion.a>
  );
}
