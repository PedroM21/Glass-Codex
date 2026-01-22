"use client";
import Button from "@/components/ui/Button";
import TipTap from "@/components/ui/Tiptap";
import { FetchSpecificCharacter, UpdateCharacter } from "@/lib/services/api";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Artwork = {
  id: number;
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
  const [draft, setDraft] = useState<Character | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [traitsInput, setTraitsInput] = useState("");
  const [flawsInput, setFlawsInput] = useState("");

  useEffect(() => {
    if (draft) {
      setTraitsInput(draft.traits.join(", "));
      setFlawsInput(draft.flaws.join(", "));
    }
  }, [draft]);

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
        setDraft(response.character);
      } catch (error) {
        console.log("Error fetching character: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!character || !draft) return <p>Character not found</p>;

  console.log(character);

  return (
    <div className="mb-16">
      <h1 className="text-[64px] text-center pt-16 md:text-start md:px-32 xl:px-0">
        {character.name}
      </h1>
      <div className="flex flex-col pt-8 justify-center gap-4 md:flex-row lg:justify-between">
        <form className="flex flex-col w-full gap-2 mx-auto px-8 md:w-1/3 xl:mx-0">
          <div className="flex gap-4 justify-between w-full border-b">
            <span className="font-semibold">Name</span>
            <input
              value={draft.name}
              onChange={(e) => {
                setDraft({ ...draft, name: e.target.value });
                setIsDirty(true);
              }}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div className="flex gap-4 justify-between w-full border-b">
            <span className="font-semibold">Role</span>
            <input
              value={draft?.role}
              onChange={(e) => {
                setDraft({ ...draft, role: e.target.value });
                setIsDirty(true);
              }}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div className="flex gap-4 justify-between w-full border-b">
            <span className="font-semibold text-right">Traits</span>
            <input
              value={traitsInput}
              onChange={(e) => setTraitsInput(e.target.value)}
              onBlur={() => {
                if (!draft) return;
                setDraft({
                  ...draft,
                  traits: traitsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                });
                setIsDirty(true);
              }}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div className="flex gap-4 justify-between w-full border-b">
            <span className="font-semibold">Flaws</span>
            <input
              value={flawsInput}
              onChange={(e) => setFlawsInput(e.target.value)}
              onBlur={() => {
                if (!draft) return;
                setDraft({
                  ...draft,
                  flaws: flawsInput
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean),
                });
                setIsDirty(true);
              }}
              className="border px-2 py-1 rounded"
            />
          </div>
          <Button
            label={isSaving ? "Saving..." : "Save Changes"}
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
            disabled={!isDirty || isSaving}
            onClick={async () => {
              if (!draft || !character) return;

              try {
                setIsSaving(true);
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No auth token");

                // update character
                await UpdateCharacter(
                  character.id,
                  {
                    name: draft.name,
                    role: draft.role,
                    traits: draft.traits,
                    flaws: draft.flaws,
                    narrative: draft.narrative,
                    purpose: draft.purpose,
                  },
                  token,
                );

                // refetch full character
                const response = await FetchSpecificCharacter(
                  token,
                  character.id.toString(),
                );
                setCharacter(response.character);
                setDraft(response.character);
                setIsDirty(false);
              } catch (err) {
                console.error(err);
                alert("Failed to save changes");
              } finally {
                setIsSaving(false);
              }
            }}
          />
        </form>
        <div className="mx-auto mb-4">
          {character.artworks.length > 0 ? (
            <Image
              src={character.artworks[0].imageURL}
              alt={character.name}
              width={250}
              height={250}
            />
          ) : (
            <div className="w-62 h-62 flex items-center justify-center border">
              No image
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-16 lg:flex-row">
        <div className="w-full px-8 lg:w-1/3 lg:px-0">
          <h1 className="px-3">Narrative</h1>
          <TipTap
            content={draft.narrative ?? { type: "doc", content: [] }}
            onChange={(doc) => {
              setDraft({ ...draft, narrative: doc });
              setIsDirty(true);
            }}
          />
          <Button
            label="Save Narrative"
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
            onClick={async () => {
              if (!draft) return;
              setIsSaving(true);
              const token = localStorage.getItem("token");
              try {
                await UpdateCharacter(
                  character.id,
                  { narrative: draft.narrative },
                  token!,
                );
                const response = await FetchSpecificCharacter(
                  token!,
                  character.id.toString(),
                );
                setCharacter(response.character);
                setDraft(response.character);
              } catch (err) {
                console.error(err);
                alert("Failed to save narrative");
              } finally {
                setIsSaving(false);
              }
            }}
          />
        </div>
        <div className="w-full px-8 lg:w-1/3 lg:px-0">
          <h1 className="px-3">Purpose</h1>
          <TipTap
            content={draft.purpose ?? { type: "doc", content: [] }}
            onChange={(doc) => {
              setDraft({ ...draft, purpose: doc });
              setIsDirty(true);
            }}
          />
          <Button
            label="Save Purpose"
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
            onClick={async () => {
              if (!draft) return;
              setIsSaving(true);
              const token = localStorage.getItem("token");
              try {
                await UpdateCharacter(
                  character.id,
                  { purpose: draft.purpose },
                  token!,
                );
                const response = await FetchSpecificCharacter(
                  token!,
                  character.id.toString(),
                );
                setCharacter(response.character);
                setDraft(response.character);
              } catch (err) {
                console.error(err);
                alert("Failed to save purpose");
              } finally {
                setIsSaving(false);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
