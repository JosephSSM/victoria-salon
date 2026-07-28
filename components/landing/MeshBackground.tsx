"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/theme";

const BLOBS = [
  { color: BRAND.roseDust, top: "-10%", left: "5%", size: "38vw", duration: 18 },
  { color: BRAND.lavender, top: "20%", left: "60%", size: "34vw", duration: 22 },
  { color: BRAND.gold, top: "55%", left: "15%", size: "30vw", duration: 26 },
];

export default function MeshBackground({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color}99 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.15, 0.95, 1],
            opacity: [0.5, 0.8, 0.5],
            x: [0, 30, -20, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
