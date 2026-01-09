import { deleteCharacter } from "@/lib/controllers/character";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  return deleteCharacter(req, context);
}
