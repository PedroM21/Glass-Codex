import Sidebar from "@/components/layout/Sidebar";
import { AuthenticationError } from "@/lib/auth";
import { authCheck } from "@/lib/controllers/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

// Server-side guard: never render private pages for unauthenticated visitors.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const cookieHeader = (await headers()).get("cookie") ?? "";

  try {
    await authCheck(
      new Request("http://localhost/", { headers: { cookie: cookieHeader } }),
    );
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect("/login");
    }
    // Unexpected database problems must not be disguised as bad credentials.
    throw error;
  }

  return (
    <main className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 bg-[#F9F6E5] ">
      <Sidebar />
      <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3">
        {children}
      </div>
    </main>
  );
}
