"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import DashboardIcon from "../ui/icons/Dashboard";
import CharacterIcon from "../ui/icons/Character";
import LoreIcon from "../ui/icons/Lore";
import Plot from "../ui/icons/Plot";
import Expand from "../ui/icons/Expand";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandSidebar, setExpandSidebar] = useState(false);
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
          fixed top-0 left-0 z-40 min-h-screen bg-[#1b3153] text-center
          transform transition-transform duration-300 ease-in-out
          ${expandSidebar ? "w-48" : "w-24"}
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        <button
          onClick={() => setExpandSidebar((prev) => !prev)}
          aria-label="Toggle sidebar"
          className="cursor-pointer my-8"
        >
          <Expand />
        </button>

        <ul className="flex  flex-col justify-center items-center gap-6">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href} className="w-full flex justify-center">
                {item.disabled ? (
                  <div className="flex items-center gap-3 text-white opacity-50 cursor-not-allowed">
                    {item.icon}
                    {expandSidebar && <span>{item.label}</span>}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 text-white transition
                    ${isActive ? "font-semibold underline underline-offset-4" : "hover:underline"}
                    `}
                  >
                    {item.icon}
                    {expandSidebar && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
