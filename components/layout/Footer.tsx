"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Github from "../ui/icons/Github";

export default function Footer() {
  const year = new Date().getFullYear();

  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#workflow", label: "How it works" },
    { href: "/#audience", label: "Who its for" },
  ];

  return (
    <footer className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#1b3153]">
      <div className="max-w-screen md:flex justify-between md:px-16 md:py-8 lg:mx-32">
        <div className="text-white w-full px-8 flex flex-col gap-4 mt-8 md:mt-0 md:px-0 md:w-1/3">
          <h1 className="text-[39.06px] lg:text-[61.04px]">
            Build your character library
          </h1>
          <p className="lg:text-[20px]">
            Glass Codex helps you organize every character you create in one
            clean, simple place.
          </p>
        </div>
        <div className="flex flex-col gap-4 px-8 my-8 md:my-0 md:px-0 md:w-1/3">
          {navItems.map((item) => (
            <p key={item.href}>
              <Link
                key={item.href}
                href={item.href}
                className={`cursor-pointer text-white ${
                  pathname === item.href
                    ? "hover:border-b-2"
                    : "hover:border-b-2"
                }`}
              >
                {item.label}
              </Link>
            </p>
          ))}
          <Github />
        </div>
      </div>
      <hr className="border border-[#f1cf79]" />
      <p className="text-center text-white  p-4">
        &copy; {year} Developed & Designed by Pedro Moreno
      </p>
    </footer>
  );
}
