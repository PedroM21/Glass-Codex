"use client";

import { duration } from "drizzle-orm/gel-core";
import { easeIn, motion } from "motion/react";

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
    <>
      <motion.h1
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="text-[#2B2B2B] text-[61.04px]"
      >
        {header}
      </motion.h1>
      <motion.h2
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="text-[#2B2B2B] text-[48.83px] overflow-hidden whitespace-nowrap"
      >
        {subheader}
      </motion.h2>
      <p className="text-[#2B2B2B] text-[25px]">{tagline}</p>
    </>
  );
}
