"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BrandLogo({ name }: { name?: string | null }) {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  if (!hasMounted) return null; // Prevent flicker during hydration

  return (
    <div className="relative flex items-center justify-center">
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <title>Logo {initials}</title>

        <motion.path
          d="M50,5 L90,27.5 L90,72.5 L50,95 L10,72.5 L10,27.5 Z"
          fill="none"
          className="stroke-blue-700"
          strokeWidth="6"
          strokeDasharray="300"
          strokeDashoffset="300"
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        <motion.text
          x="50"
          y="62"
          textAnchor="middle"
          fontSize="34"
          fontWeight="700"
          fontFamily="Avenir Next, sans-serif"
          className="fill-blue-700"
          letterSpacing="-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {initials}
        </motion.text>
      </motion.svg>

      <AnimatePresence>
        {name && (
          <motion.span
            key={name}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 3 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
            className="absolute left-full ml-1 whitespace-nowrap text-lg font-medium tracking-tight text-gray-900 dark:text-white"
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}