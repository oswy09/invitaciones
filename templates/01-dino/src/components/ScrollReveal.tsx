import React, { ReactNode } from "react";
import { motion } from "motion/react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  duration = 0.7, 
  yOffset = 35 
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1], // Smooth easeOutQuart-like cubic-bezier
      }}
      className="w-full flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
}
