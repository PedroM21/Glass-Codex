import { createCharacter } from "@/lib/controllers/character";

export async function POST(req: Request) {
  return createCharacter(req);
}
