"use client";

import { DeleteCharacter, FetchCharacters } from "@/lib/services/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CharacterCard from "@/components/ui/CharacterCard";
import CharacterModal from "@/components/layout/CharacterModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export default function CharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<any[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

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

  const handleCharacterCreated = (newCharacter: any) => {
    setCharacters((prev) => [...prev, newCharacter]);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    await DeleteCharacter(token, deleteTargetId);

    // Rerender after deletion
    setCharacters((prev) => prev.filter((c) => c.id !== deleteTargetId));

    setDeleteTargetId(null); // Close modal
  };

  return (
    <div className="py-16">
      <div className="flex flex-col px-8 lg:text-start lg:flex-row lg:justify-between ">
        <h1 className="text-[61.04px] text-[#2B2B2B] text-center">
          All Characters
        </h1>
        <CharacterModal onCharacterCreated={handleCharacterCreated} />
      </div>

      <div className="grid gap-4 justify-center grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {characters.map((character: any) => (
          <div key={character.id}>
            <CharacterCard
              character={character}
              onDeleteRequest={() => setDeleteTargetId(character.id)}
            />
          </div>
        ))}
      </div>
      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
