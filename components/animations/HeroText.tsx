"use client";
import { motion } from "motion/react";

type HeroTextProps = {
  header: string;
  subheader: string;
  tagline: string;
};

export default function HeroText({
  header,
  subheader,
  tagline,
}: HeroTextProps) {
  return (
    <div className="w-full text-center space-y-4 px-8 lg:px-0">
      <motion.h1
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="text-[#2B2B2B] text-[39.06px] md:text-[61.04px]"
      >
        {header}
      </motion.h1>
      <motion.h2
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="inline-block text-[#2B2B2B] text-[31.25px] md:text-[48.83px]"
      >
        {subheader}
      </motion.h2>
      <p className="text-[#2B2B2B] md:text-[25px]">{tagline}</p>
    </div>
  );
}
