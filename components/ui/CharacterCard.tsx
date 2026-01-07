"use client";
// palette: #DDe6ed, #9Db2bf, #536d82, #26374d
import { motion } from "motion/react";
import Image from "next/image";
import Ryn from "@/public/Ryn.png";

type Artwork = {
  id: number;
  imageURL: string;
};

type Character = {
  id: number;
  name: string;
  role: string;
  artworks: Artwork[];
};

export default function CharacterCard({ character }: { character: Character }) {
  return (
    <motion.div
      initial={{ scale: 1.2, x: 400 }}
      animate={{ scale: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 50,
        ease: "easeInOut",
        duration: 0.8,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        rotate: 2,
        transition: { type: "spring", stiffness: 300 },
      }}
      className="bg-radial from-[#536d82] border-2 border-[#536d82] from-10% to-[#26374d] p-4 relative m-4 h-90 rounded-lg cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#DDe6ed] m-2"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#DDe6ed] m-2"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#DDe6ed] m-2"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#DDe6ed] m-2"></div>
      {/* content */}
      <motion.div className="relative z-10 flex flex-col justify-center h-full gap-2">
        <Image
          src={character.artworks[0].imageURL}
          alt="Character Image"
          width={150}
          height={150}
        />
        <div className="flex justify-between border-b text-white">
          <span>Name</span>
          {character.name}
        </div>
        <div className="flex justify-between border-b text-white">
          <span>Role</span>
          {character.role}
        </div>
      </motion.div>
    </motion.div>
  );
}
