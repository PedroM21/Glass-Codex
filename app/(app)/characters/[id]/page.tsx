"use client";
import Button from "@/components/ui/Button";
import TipTap from "@/components/ui/Tiptap";
import { FetchSpecificCharacter, UpdateCharacter } from "@/lib/services/api";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JSONContent } from "@tiptap/react";

type Artwork = {
  id: number;
  imageURL: string;
};

type Character = {
  id: number;
  name: string;
  role: string;
  traits: string[];
  flaws: string[];
  age?: number;
  species?: string;
  coreWant?: string;
  coreNeed?: string;
  backstory: JSONContent;
  personalityNotes: JSONContent;
  arcNotes: JSONContent;
  relationshipNotes: JSONContent;
  extraNotes: JSONContent;
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

  const saveRichTextField = async (field: keyof Character) => {
    if (!draft) return;
    setIsSaving(true);
    const token = localStorage.getItem("token");
    try {
      await UpdateCharacter(character!.id, { [field]: draft[field] }, token!);
      const response = await FetchSpecificCharacter(
        token!,
        character!.id.toString(),
      );
      setCharacter(response.character);
      setDraft(response.character);
    } catch (err) {
      console.error(err);
      alert(`Failed to save ${field}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!character || !draft) return <p>Character not found</p>;

  return (
    <div className="min-h-screen">
      <h1 className="text-[64px] text-center pt-16 px-8 md:text-start">
        {character.name}
      </h1>
      <div className="flex flex-col pt-8 justify-center gap-4 md:flex-row lg:justify-between">
        <form className="flex flex-col w-full gap-2 mx-auto px-4 xl:mx-0">
          {/* basic profile */}
          <div className="flex w-full">
            <div className="flex flex-col w-full justify-end gap-2">
              <div className="flex flex-col gap-2 bg-[#1B3153] border-2 border-[#2B2B2B] text-white p-2 rounded-xl w-2/3">
                <span className="font-semibold px-2">Name</span>
                <input
                  value={draft.name}
                  onChange={(e) => {
                    setDraft({ ...draft, name: e.target.value });
                    setIsDirty(true);
                  }}
                  className="border px-2 py-1 rounded-xl bg-white text-[#2B2B2B]"
                />
              </div>
              <div className="flex flex-col gap-2 bg-[#1B3153] border-2 border-[#2B2B2B] text-white p-2 rounded-xl w-2/3">
                <span className="font-semibold px-2">Role</span>
                <input
                  value={draft?.role}
                  onChange={(e) => {
                    setDraft({ ...draft, role: e.target.value });
                    setIsDirty(true);
                  }}
                  className="border px-2 py-1 rounded-xl bg-white text-[#2B2B2B]"
                />
              </div>
              <div className="flex flex-col gap-2 bg-[#1B3153] border-2 border-[#2B2B2B] text-white p-2 rounded-xl w-2/3">
                <span className="font-semibold px-2">Age</span>
                <input
                  value={draft?.age}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    setDraft({
                      ...draft,
                      age: val === "" ? null : Number(val),
                    });
                    setIsDirty(true);
                  }}
                  className="border px-2 py-1 rounded-xl bg-white text-[#2B2B2B]"
                />
              </div>
              <div className="flex flex-col gap-2 bg-[#1B3153] border-2 border-[#2B2B2B] text-white p-2 rounded-xl w-2/3">
                <span className="font-semibold px-2">Species</span>
                <input
                  value={draft?.species ?? ""}
                  onChange={(e) => {
                    setDraft({ ...draft, species: e.target.value });
                    setIsDirty(true);
                  }}
                  className="border px-2 py-1 rounded-xl bg-white text-[#2B2B2B]"
                />
              </div>
            </div>
            {/* Image of character */}
            <div className="hidden md:flex w-64 justify-center items-center">
              {character.artworks.length > 0 ? (
                <div className="relative w-64 aspect-auto overflow-hidden">
                  <Image
                    src={character.artworks[0].imageURL}
                    alt={character.name}
                    width={250}
                    height={250}
                    className="object-contain rounded-md "
                  />
                </div>
              ) : (
                <div className="w-64 aspect-square flex items-center justify-center rounded-md text-gray-500">
                  No image
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-[#1B3153] border-2 border-[#2B2B2B] text-white p-2 rounded-xl">
            <span className="font-semibold px-2">Traits</span>
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
              className="border px-2 py-1 rounded-xl bg-white text-[#2B2B2B]"
            />
          </div>
          <div className="flex flex-col gap-2 bg-[#1B3153] border-2 border-[#2B2B2B] text-white p-2 rounded-xl">
            <span className="font-semibold px-2">Flaws</span>
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
              className="border px-2 py-1 rounded-xl bg-white text-[#2B2B2B]"
            />
          </div>
          <div className="flex flex-col gap-2 bg-[#1B3153] border-2 border-[#2B2B2B] text-white p-2 rounded-xl">
            <span className="font-semibold px-2">Core Want</span>
            <input
              value={draft?.coreWant ?? ""}
              onChange={(e) => {
                setDraft({ ...draft, coreWant: e.target.value });
                setIsDirty(true);
              }}
              className="border px-2 py-1 rounded-xl bg-white text-[#2B2B2B]"
            />
          </div>
          <div className="flex flex-col gap-2 bg-[#1B3153] border-2 border-[#2B2B2B] text-white p-2 rounded-xl">
            <span className="font-semibold px-2">Core Need</span>
            <input
              value={draft?.coreNeed ?? ""}
              onChange={(e) => {
                setDraft({ ...draft, coreNeed: e.target.value });
                setIsDirty(true);
              }}
              className="border px-2 py-1 rounded-xl bg-white text-[#2B2B2B]"
            />
          </div>
          <div>
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
                      age: draft.age,
                      species: draft.species,
                      coreWant: draft.coreWant,
                      coreNeed: draft.coreNeed,
                      traits: draft.traits,
                      flaws: draft.flaws,
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
          </div>
        </form>
      </div>
      <div className="flex flex-col gap-16 py-8">
        <div className="w-full px-4">
          <h1 className="text-[31.25px] px-4">Backstory</h1>
          <TipTap
            content={draft.backstory ?? { type: "doc", content: [] }}
            onChange={(doc) => {
              setDraft({ ...draft, backstory: doc });
              setIsDirty(true);
            }}
          />
          <Button
            label="Save Backstory"
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
            onClick={() => saveRichTextField("backstory")}
          />
        </div>
        <div className="w-full px-4">
          <h1 className="text-[31.25px] px-4">Personality Notes</h1>
          <TipTap
            content={draft.personalityNotes ?? { type: "doc", content: [] }}
            onChange={(doc) => {
              setDraft({ ...draft, personalityNotes: doc });
              setIsDirty(true);
            }}
          />
          <Button
            label="Save Personality Notes"
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
            onClick={() => saveRichTextField("personalityNotes")}
          />
        </div>
        <div className="w-full px-4">
          <h1 className="text-[31.25px] px-4">Character Arc</h1>
          <TipTap
            content={draft.arcNotes ?? { type: "doc", content: [] }}
            onChange={(doc) => {
              setDraft({ ...draft, arcNotes: doc });
              setIsDirty(true);
            }}
          />
          <Button
            label="Save Character Arc"
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
            onClick={() => saveRichTextField("arcNotes")}
          />
        </div>
        <div className="w-full px-4">
          <h1 className="text-[31.25px] px-4">Relationships</h1>
          <TipTap
            content={draft.relationshipNotes ?? { type: "doc", content: [] }}
            onChange={(doc) => {
              setDraft({ ...draft, relationshipNotes: doc });
              setIsDirty(true);
            }}
          />
          <Button
            label="Save Relationships"
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
            onClick={() => saveRichTextField("relationshipNotes")}
          />
        </div>
        <div className="w-full px-4">
          <h1 className="text-[31.25px] px-4">Extra Notes</h1>
          <TipTap
            content={draft.extraNotes ?? { type: "doc", content: [] }}
            onChange={(doc) => {
              setDraft({ ...draft, extraNotes: doc });
              setIsDirty(true);
            }}
          />
          <Button
            label="Save Extra Notes"
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
            onClick={() => saveRichTextField("extraNotes")}
          />
        </div>
      </div>
    </div>
  );
}
