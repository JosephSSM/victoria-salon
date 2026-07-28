"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { BRAND } from "@/lib/theme";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.2 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 origin-left z-[60]"
      style={{
        scaleX,
        background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.lavender})`,
      }}
    />
  );
}
