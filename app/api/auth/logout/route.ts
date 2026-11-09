import { rejectCrossOriginMutation } from "@/lib/csrf";
import { clearSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const blocked = rejectCrossOriginMutation(req);
  if (blocked) return blocked;

  return clearSessionCookie(
    Response.json(
      { success: true, message: "Signed out" },
      { headers: { "Cache-Control": "no-store" } },
    ),
  );
}
