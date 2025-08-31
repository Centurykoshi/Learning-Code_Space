import React from "react";
import { motion } from "framer-motion";

// 1. Pulse Wave Dots (Smooth and Professional)
export const PulseWaveIndicator = () => {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-muted-foreground/60 rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 2. Wave Animation (Modern and Smooth)
export const WaveIndicator = () => {
  return (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="w-1 bg-muted-foreground/60 rounded-full"
          animate={{
            height: [4, 12, 4],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 3. Typewriter Dots (Clean and Minimal)
export const TypewriterIndicator = () => {
  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 4. Gradient Flow (Modern and Elegant)
export const GradientFlowIndicator = () => {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: `linear-gradient(45deg, hsl(var(--primary)) ${index * 30}%, hsl(var(--muted-foreground)) ${100 - index * 20}%)`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 5. Breathing Circle (Organic Feel)
export const BreathingIndicator = () => {
  return (
    <motion.div
      className="w-8 h-8 rounded-full border-2 border-muted-foreground/40"
      animate={{
        scale: [1, 1.3, 1],
        borderWidth: [2, 1, 2],
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="w-full h-full bg-muted-foreground/20 rounded-full"
        animate={{
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

// 6. Morphing Shapes (Creative and Unique)
export const MorphingIndicator = () => {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-muted-foreground/60"
          animate={{
            borderRadius: ["0%", "50%", "0%"],
            rotate: [0, 180, 360],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};