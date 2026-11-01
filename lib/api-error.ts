import { AuthenticationError } from "./auth";

// Present expected authentication failures without leaking internal errors.
export function handleApiError(error: unknown, operation: string): Response {
  if (error instanceof AuthenticationError) {
    return Response.json(
      { success: false, message: "Authentication required" },
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
    );
  }

  console.error(`${operation} failed:`, error);
  return Response.json(
    { success: false, message: "Internal server error" },
    { status: 500 },
  );
}
