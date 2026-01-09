"use client";

import { FetchCharacters } from "@/lib/services/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CharacterCard from "@/components/ui/CharacterCard";
import CharacterModal from "@/components/layout/CharacterModal";

export default function CharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState([]);

  // fetch characters from the API
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          throw new Error("No auth token found");
        }
        const response = await FetchCharacters(token);
        setCharacters(response.characters);
      } catch (error) {
        console.error("Error fetching characters: ", error);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div>
      <h1 className="text-[61.04px]">All Characters</h1>
      <div className="flex flex-wrap gap-4">
        {characters.map((character: any) => (
          <div key={character.id}>
            <CharacterCard character={character} />
          </div>
        ))}
      </div>
      <CharacterModal />
    </div>
  );
}
