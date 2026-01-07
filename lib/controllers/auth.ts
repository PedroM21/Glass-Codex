import bcrypt from "bcryptjs";
import { db } from "@/db/index";
import { usersTable } from "@/db/schemas/schema";
import { generateToken } from "@/lib/jwt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

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
      { status: 201 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: (error as Error).message || "Internal server error",
      }),
      { status: 500 }
    );
  }
};

// Auth check (token + user exist)
export const authCheck = async (req: Request) => {
  try {
    // Check headers for token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    // Use the decoded token to find the user
    const [user] = await db
      .select({ id: usersTable.id, username: usersTable.username })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.id));

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Authentication failed");
  }
};

// export const authCheck = async (req: Request) => {
//   console.log("---- AUTH CHECK START ----");

//   const authHeader = req.headers.get("authorization");
//   console.log("Authorization header:", authHeader);

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     throw new Error("No token provided");
//   }

//   const token = authHeader.split(" ")[1];
//   console.log("Extracted token:", token);

//   let decoded: { id: number };
//   try {
//     decoded = jwt.verify(token, JWT_SECRET) as { id: number };
//     console.log("Decoded token:", decoded);
//   } catch (err) {
//     console.error("JWT verify failed:", err);
//     throw new Error("Invalid or expired token");
//   }

//   const [user] = await db
//     .select({ id: usersTable.id, username: usersTable.username })
//     .from(usersTable)
//     .where(eq(usersTable.id, decoded.id));

//   console.log("DB user lookup result:", user);

//   if (!user) {
//     throw new Error("User not found");
//   }

//   console.log("---- AUTH CHECK SUCCESS ----");
//   return user;
// };
