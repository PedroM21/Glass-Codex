"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const year = new Date().getFullYear();

  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/#1", label: "Features" },
    { href: "/#2", label: "How it works" },
    { href: "/#3", label: "Who its for" },
  ];

  return (
    <footer className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#1b3153]">
      <div className="max-w-screen md:flex justify-between md:px-16 md:py-8 lg:mx-32">
        <div className="text-white text-[39.06px] w-1/4">
          <h1>Build your character library</h1>
          <p>
            Ink & Code helps you organize every character you create in one
            clean, simple place.
          </p>
        </div>
        <div className="flex flex-col gap-4 w-1/3">
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
        </div>
      </div>
      <hr className="border border-[#f1cf79]" />
      <p className="text-center text-white  p-4">
        &copy; {year} Developed & Designed by Pedro Moreno
      </p>
    </footer>
  );
}
