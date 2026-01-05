import { register } from "@/lib/controllers/auth";

export async function POST(req: Request) {
  return register(req);
}
