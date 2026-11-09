import { authCheck } from "@/lib/controllers/auth";
import { handleApiError } from "@/lib/api-error";

export const runtime = "nodejs";

export async function GET(req: Request): Promise<Response> {
  try {
    const user = await authCheck(req);
    return Response.json(
      { success: true, data: { user } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleApiError(error, "getCurrentUser");
  }
}
