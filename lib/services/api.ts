const BASE_URL = "http://localhost:3000";

export const Register = async (formData: {
  username: string;
  password: string;
  email: string;
}) => {
  try {
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

    console.log("Account created successfully: ", data);
    return data.data; // This should return { token, user }
  } catch (error) {
    throw error;
  }
};

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

export const CreateCharacter = async (
  formData: {
    name: string;
    role: string;
    traits: string[];
    flaws: string[];
    imageURL: string;
  },
  token: string
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
