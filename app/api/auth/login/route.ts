import { login } from "@/lib/controllers/auth";

export async function POST(req: Request) {
  return login(req);
}
