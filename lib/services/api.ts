// Browser requests are same-origin: the browser handles the HttpOnly session cookie.
// Never read, log, or attach the signed session token in frontend JavaScript.
export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(body.message || "Request failed", response.status);
  }

  return body;
}

export const Register = async (formData: {
  username: string;
  password: string;
  email: string;
}) => {
  const response = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
  return response.data;
};

export const Login = async (formData: {
  username: string;
  password: string;
}) => {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });
  return response.data;
};

export const Logout = async (): Promise<void> => {
  await request("/api/auth/logout", { method: "POST" });
};

export const GetCurrentUser = async () => {
  const response = await request("/api/auth/me");
  return response.data.user;
};

export const FetchCharacters = async () => {
  const response = await request("/api/character/view");
  return response.data;
};

export const FetchSpecificCharacter = async (id: string) => {
  const response = await request(`/api/character/${encodeURIComponent(id)}`);
  return response.data;
};

export const DeleteCharacter = async (id: number): Promise<void> => {
  await request(`/api/character/delete/${id}`, { method: "DELETE" });
};

export const CreateCharacter = async (formData: {
  name: string;
  role: string;
  traits: string[];
  flaws: string[];
  imageURL: string;
}) => {
  const response = await request("/api/character/create", {
    method: "POST",
    body: JSON.stringify(formData),
  });
  return response.data;
};

export const UpdateCharacter = async (
  id: number,
  payload: Partial<{
    name: string;
    role: string;
    traits: string[];
    flaws: string[];
    backstory: unknown;
    personalityNotes: unknown;
    arcNotes: unknown;
    relationshipNotes: unknown;
    extraNotes: unknown;
    age: number;
    species?: string;
    coreWant: string;
    coreNeed: string;
  }>,
) => {
  const response = await request(`/api/character/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return response.data.character;
};
