import { AuthenticationError } from "./auth";
import { ConflictError, ValidationError } from "./http-errors";

// Expected client errors receive controlled messages; unexpected errors stay private.
export function handleApiError(error: unknown, operation: string): Response {
  if (error instanceof ValidationError) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }

  if (error instanceof ConflictError) {
    return Response.json(
      { success: false, message: error.message },
      { status: 409 },
    );
  }

  if (error instanceof AuthenticationError) {
    return Response.json(
      { success: false, message: "Authentication required" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  console.error(`${operation} failed:`, error);
  return Response.json(
    { success: false, message: "Internal server error" },
    { status: 500 },
  );
}
