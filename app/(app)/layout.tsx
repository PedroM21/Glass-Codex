import Sidebar from "@/components/layout/Sidebar";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 bg-[#F9F6E5]">
      <Sidebar />
      <div className="col-span-4 md:col-span-8 lg:col-span-12 lg:col-start-4">
        {children}
      </div>
    </main>
  );
}
