"use client";
import { FetchSpecificCharacter } from "@/lib/services/api";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Artwork = {
  id: string;
  imageURL: string;
};

type Character = {
  id: number;
  name: string;
  role: string;
  traits: string[];
  flaws: string[];
  arc: string[];
  narrative: string;
  purpose: string;
  artworks: Artwork[];
};

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.log("No id yet");
      return;
    }

    const fetchCharacter = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No auth token found");
        }

        const response = await FetchSpecificCharacter(token, id);
        setCharacter(response.character);
      } catch (error) {
        console.log("Error fetching character: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!character) return <p>Character not found</p>;

  console.log(character);

  return (
    <div className="p-4">
      <h1 className="text-[64px]">{character.name}</h1>
      <div className="space-y-4 w-1/4">
        <div className="flex gap-4 justify-between w-full">
          <span className="font-semibold">Name</span>
          <p>{character.name}</p>
        </div>
        <div className="flex gap-4 justify-between w-full">
          <span className="font-semibold">Role</span>
          <p>{character.role}</p>
        </div>
        <div className="flex gap-4 justify-between w-full">
          <span className="font-semibold text-right">Traits</span>
          <p>{character.traits.join(", ")}</p>
        </div>
        <div className="flex gap-4 justify-between w-full">
          <span className="font-semibold">Flaws</span>
          <p>{character.flaws.join(", ")}</p>
        </div>
      </div>
      <Image
        src={character.artworks[0].imageURL}
        alt={character.name}
        loading="eager"
        width={150}
        height={150}
      />
    </div>
  );
}
