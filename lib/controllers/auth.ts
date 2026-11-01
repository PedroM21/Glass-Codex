import bcrypt from "bcryptjs";
import { db } from "@/db/index";
import { usersTable } from "@/db/schemas/schema";
import { generateToken } from "@/lib/jwt";
import { eq } from "drizzle-orm";
import { AuthenticationError, getUserIdFromRequest } from "@/lib/auth";

// Register a new user
export const register = async (req: Request) => {
  try {
    const { username, password, email } = await req.json();

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (existingUser.length > 0) {
      return new Response("User already exists", { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        username,
        passwordHash: hashedPassword,
        email,
      })
      .returning({ id: usersTable.id, username: usersTable.username });

    // Generate token
    const token = generateToken(newUser);

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully",
        data: { token, user: newUser },
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
};

// Login an existing user
export const login = async (req: Request) => {
  try {
    const { username, password } = await req.json();

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (!user) {
      throw new Error("User not found!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken({ id: user.id, username: user.username });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
        data: { token, user: { id: user.id, username: user.username } },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: (error as Error).message || "Internal server error",
      }),
      { status: 500 },
    );
  }
};

// Authenticate the token, then confirm that its account still exists.
export const authCheck = async (req: Request) => {
  const userId = getUserIdFromRequest(req);

  const [user] = await db
    .select({ id: usersTable.id, username: usersTable.username })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (!user) {
    throw new AuthenticationError();
  }

  return user;
};
