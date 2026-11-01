// PostgreSQL uses SQLSTATE 23505 for unique-constraint violations.
// A unique constraint is still required: a pre-insert lookup cannot prevent races.
export function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if ("code" in error && error.code === "23505") {
    return true;
  }

  if ("cause" in error) {
    const cause = error.cause;
    return (
      typeof cause === "object" &&
      cause !== null &&
      "code" in cause &&
      cause.code === "23505"
    );
  }

  return false;
}
