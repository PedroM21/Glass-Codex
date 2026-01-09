import { getSpecificCharacter } from "@/lib/controllers/character";

export async function GET(req: Request, context: { params: { id: string } }) {
  return getSpecificCharacter(req, context);
}
