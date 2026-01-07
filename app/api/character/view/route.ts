import { getCharacters } from "@/lib/controllers/character";

export async function GET(req: Request) {
  return getCharacters(req);
}
