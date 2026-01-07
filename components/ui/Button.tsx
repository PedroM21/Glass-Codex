"use client";
import { motion, type HTMLMotionProps } from "motion/react";

type ButtonProps = {
  label: string;
  stiffness?: number;
  damping?: number;
} & HTMLMotionProps<"button">;

export default function Button({
  label,
  stiffness = 300,
  damping = 15,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      {...props}
      whileHover={{ y: -2, boxShadow: "0 6px 12px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness, damping }}
      className="bg-[#536d82] text-white px-6 py-3 rounded-md font-semibold mt-4 cursor-pointer"
    >
      {label}
    </motion.button>
  );
}
