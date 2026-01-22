import {
  getSpecificCharacter,
  updateCharacter,
} from "@/lib/controllers/character";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getSpecificCharacter(req, id);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return updateCharacter(req, id);
}
