"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardIcon from "../ui/icons/Dashboard";
import CharacterIcon from "../ui/icons/Character";
import LoreIcon from "../ui/icons/Lore";
import Plot from "../ui/icons/Plot";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { href: "/characters", label: "Characters", icon: <CharacterIcon /> },
    { href: "/plot", label: "Plot", disabled: true, icon: <Plot /> },
    { href: "/lore", label: "Lore", disabled: true, icon: <LoreIcon /> },
  ];

  return (
    <>
      {/* Mobile togggle */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        className="lg:hidden fixed top-6 right-6 z-50 flex flex-col justify-center w-10 h-10"
      >
        <span
          className={`w-6 h-1 bg-[#2B2B2B] rounded transition-all duration-300 mb-1 ${
            menuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`w-6 h-1 bg-[#2B2B2B] rounded transition-all duration-300 mb-1 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`w-6 h-1 bg-[#2B2B2B] rounded transition-all duration-300 ${
            menuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 min-h-screen w-64 bg-[#1b3153] text-white
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="p-6 space-y-10">
          <h1 className="text-2xl font-semibold">Glass Codex</h1>

          <ul className="space-y-6 text-lg">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              if (item.disabled) {
                return (
                  <li
                    key={item.label}
                    className="opacity-50 cursor-not-allowed"
                  >
                    <div className="flex gap-2">
                      {item.icon}
                      {item.label}
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block transition ${
                      isActive
                        ? "font-semibold underline underline-offset-4"
                        : "hover:underline underline-offset-4"
                    }`}
                  >
                    <div className="flex gap-2">
                      {item.icon}
                      {item.label}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}
