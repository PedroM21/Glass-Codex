const BASE_URL = "https://glass-codex.vercel.app";

// Register a user
export const Register = async (formData: {
  username: string;
  password: string;
  email: string;
}) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to register.");
  }

  return data.data;
};

// Login a user
export const Login = async (formData: {
  username: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to login.");
    }

    console.log("Logged in successfully: ", data);
    return data.data; // This should return { token, user }
  } catch (error) {
    throw error;
  }
};

// Fetch characters from user
export const FetchCharacters = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/character/view`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch characters.");
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

// Fetch specific character
export const FetchSpecificCharacter = async (token: string, id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/character/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch character.");
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

// Delete Character
export const DeleteCharacter = async (token: string, id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/api/character/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("Character Deleted Successfully");
    }
  } catch (error) {
    console.log("Failed to delete character");
    throw error;
  }
};

// Create Character
export const CreateCharacter = async (
  formData: {
    name: string;
    role: string;
    traits: string[];
    flaws: string[];
    imageURL: string;
  },
  token: string,
) => {
  try {
    const response = await fetch(`${BASE_URL}/api/character/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create character.");
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

// Update Character
export const UpdateCharacter = async (
  id: number,
  payload: Partial<{
    name: string;
    role: string;
    traits: string[];
    flaws: string[];
    backstory: any;
    personalityNotes: any;
    arcNotes: any;
    relationshipNotes: any;
    extraNotes: any;
    age: number;
    species?: string;
    coreWant: string;
    coreNeed: string;
  }>,
  token: string,
) => {
  const response = await fetch(`${BASE_URL}/api/character/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update character");
  }

  return data.character;
};
