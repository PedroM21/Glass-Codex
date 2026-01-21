"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FetchCharacters } from "@/lib/services/api";
import DashboardCharCard from "@/components/ui/DashboardCharCard";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<any[]>([]);

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

        // get the 5 most recent characters
        const recentCharacters = response.characters
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);

        setCharacters(recentCharacters);
      } catch (error) {
        console.error("Error fetching characters: ", error);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div className="text-center mb-16 lg:text-start">
      <h1 className="text-[39.06px] text-center text-[#2B2B2B] py-16 px-8 lg:text-[61.04px] xl:text-start">
        Recent Characters
      </h1>
      {characters.length === 0 ? (
        <p>No characters yet.</p>
      ) : (
        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center lg:justify-center xl:justify-start">
          {characters.map((character: any) => (
            <div key={character.id}>
              <DashboardCharCard character={character} />
            </div>
          ))}
        </div>
      )}
      <Link href="/characters">
        <Button
          label="View All Characters"
          color="bg-[#f1cf79]"
          textColor="text-[#2B2B2B]"
        />
      </Link>
    </div>
  );
}
