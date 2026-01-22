import {
  getSpecificCharacter,
  updateCharacter,
} from "@/lib/controllers/character";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  return getSpecificCharacter(req, params.id);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  return updateCharacter(req, params.id);
}
