"use client";
// palette: #DDe6ed, #9Db2bf, #536d82, #26374d
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import Parchment from "@/public/parchment.png";
import Button from "./Button";

type Artwork = {
  id: number;
  imageURL?: string;
};

type Character = {
  id: number;
  name: string;
  role: string;
  artworks: Artwork[];
};

type CharacterCardProps = {
  character: Character;
};

export default function DashboardCharCard({ character }: CharacterCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <Link href={`/characters/${character.id}`}>
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
          style={{
            backgroundImage: `url(${Parchment.src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="p-4 relative m-4 h-90 rounded-lg cursor-pointer"
        >
          {/* <div className="absolute top-2 left-0 w-4 h-4 border-t-2 border-l-2 border-[#DDe6ed] m-2"></div>
      <div className="absolute top-2 right-0 w-4 h-4 border-t-2 border-r-2 border-[#DDe6ed] m-2"></div>
      <div className="absolute bottom-2 left-0 w-4 h-4 border-b-2 border-l-2 border-[#DDe6ed] m-2"></div>
      <div className="absolute bottom-2 right-0 w-4 h-4 border-b-2 border-r-2 border-[#DDe6ed] m-2"></div> */}
          {/* content */}
          <motion.div className="relative z-10 flex flex-col justify-center h-full gap-2">
            <div className="w-full h-48 relative border-2 border-[#212022] shadow-inner rounded-md overflow-hidden">
              {character.artworks[0] ? (
                <Image
                  src={character.artworks[0].imageURL}
                  alt={character.name}
                  width={150}
                  height={150}
                />
              ) : (
                <div className="flex justify-center items-center h-full w-full">
                  No Image
                </div>
              )}
            </div>

            {/* <span>Name</span> */}
            <h1 className="text-[20px] text-[#2B2B2B] text-center font-semibold">
              {character.name}
            </h1>
            {/* <span>Role</span> */}
            <p className="text-[16px] text-[#2B2B2B] text-center">
              {character.role}
            </p>
          </motion.div>
        </motion.div>
      </Link>
    </>
  );
}
