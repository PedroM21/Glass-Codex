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
    <>
      <h1 className="text-[61.04px] text-[#2B2B2B]">All Characters</h1>
      <div className="flex flex-wrap gap-4">
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
      <CharacterModal />
    </>
  );
}
