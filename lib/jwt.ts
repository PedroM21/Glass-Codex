import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export const generateToken = (user: { id: number; username: string }) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: 60 * 60 * 4 },
  );
};
