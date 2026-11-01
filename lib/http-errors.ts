// Errors for expected client-side mistakes. Unexpected errors remain server errors.
export class ValidationError extends Error {
  constructor(message = "Invalid request data") {
    super(message);
    this.name = "ValidationError";
  }
}

export class ConflictError extends Error {
  constructor(message = "Account already exists") {
    super(message);
    this.name = "ConflictError";
  }
}
