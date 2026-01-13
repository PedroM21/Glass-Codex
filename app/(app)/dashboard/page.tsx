"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FetchCharacters } from "@/lib/services/api";
import CharacterCard from "@/components/ui/CharacterCard";
import DashboardCharCard from "@/components/ui/DashboardCharCard";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<any[]>([]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // now we know we're on the client
  }, []);

  // fetch characters from the API
  useEffect(() => {
    if (!isClient) return;
    const fetchCharacters = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          throw new Error("No auth token found");
        }
        const response = await FetchCharacters(token);

        // get the 5 most recent characters
        const recentCharacters = response.characters.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setCharacters(recentCharacters);
      } catch (error) {
        console.error("Error fetching characters: ", error);
      }
    };

    fetchCharacters();
  }, [isClient, router]);

  if (!isClient) return null;

  return (
    <div>
      <h1 className="text-[61.04px] text-[#2B2B2B]">Recent Characters</h1>
      {characters.length === 0 ? (
        <p>No characters yet.</p>
      ) : (
        <div className="flex">
          {characters.map((character: any) => (
            <div key={character.id}>
              <DashboardCharCard character={character} />
            </div>
          ))}
        </div>
      )}
      <Button
        label="View All Characters"
        color="bg-[#f1cf79]"
        textColor="text-[#2B2B2B]"
      />
    </div>
  );
}
