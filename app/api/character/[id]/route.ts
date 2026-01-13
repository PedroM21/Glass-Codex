import {
  getSpecificCharacter,
  updateCharacter,
} from "@/lib/controllers/character";

export async function GET(req: Request, context: { params: { id: string } }) {
  return getSpecificCharacter(req, context);
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  return updateCharacter(req, context);
}
