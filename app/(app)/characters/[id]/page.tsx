"use client";
import TipTap from "@/components/ui/Tiptap";
import { FetchSpecificCharacter } from "@/lib/services/api";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Artwork = {
  id: string;
  imageURL: string;
};

type RichTextDoc = {
  type: "doc";
  content?: any[];
};

type Character = {
  id: number;
  name: string;
  role: string;
  traits: string[];
  flaws: string[];
  arc: string[];
  narrative: RichTextDoc;
  purpose: RichTextDoc;
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
    <div>
      <h1 className="text-[64px]">{character.name}</h1>
      <div className="flex pt-8 justify-between">
        <div className="flex flex-col w-1/3 gap-2">
          <div className="flex gap-4 justify-between w-full border-b">
            <span className="font-semibold">Name</span>
            <p>{character.name}</p>
          </div>
          <div className="flex gap-4 justify-between w-full border-b">
            <span className="font-semibold">Role</span>
            <p>{character.role}</p>
          </div>
          <div className="flex gap-4 justify-between w-full border-b">
            <span className="font-semibold text-right">Traits</span>
            <p>{character.traits.join(", ")}</p>
          </div>
          <div className="flex gap-4 justify-between w-full border-b">
            <span className="font-semibold">Flaws</span>
            <p>{character.flaws.join(", ")}</p>
          </div>
        </div>
        <div>
          <Image
            src={character.artworks[0].imageURL}
            alt={character.name}
            loading="eager"
            width={250}
            height={250}
          />
        </div>
      </div>
      <div className="flex gap-16">
        <div className="w-1/2">
          <h1 className="px-3">Narrative</h1>
          <TipTap content={character.narrative} />
        </div>
        <div className="w-1/2">
          <h1 className="px-3">Purpose</h1>
          <TipTap content={character.purpose} />
        </div>
      </div>
    </div>
  );
}
