import { login } from "@/lib/controllers/auth";
import { rejectCrossOriginMutation } from "@/lib/csrf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const blocked = rejectCrossOriginMutation(req);
  if (blocked) return blocked;

  return login(req);
}
