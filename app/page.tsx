"use client";

import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Link from "next/link";

// import CloudinaryUploadWidget from "./cloudinary";

// palette: #DDe6ed, #9Db2bf, #536d82, #26374d
// palette 2: #d8d7ce, #00a6c0, #283b48, #222831
// palette 3: #19192e, #003e91, #002063, #041642

export default function Home() {
  return (
    <main className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
      {/* Hero Section */}
      <section className="col-span-4 md:col-span-8 lg:col-span-12 min-h-screen bg-[#F9F6E5] flex flex-col justify-center items-center">
        <h1 className="text-[#2B2B2B] text-[61.04px]">Ink & Code</h1>
        <h2 className="text-[#2B2B2B] text-[39.06px]">
          Your Glass Codex - where every character is written, piece by piece.
        </h2>
        <p className="text-[#2B2B2B] text-[25px]">
          Create a character, write their details, build out their story, and
          give them a purpose.
        </p>
        <div className="flex gap-8 pt-8">
          <Button
            label="View Features"
            color="bg-transparent"
            textColor="text-[#2B2B2B]"
          />
          <Link href="/register">
            <Button
              label="Sign Up"
              color="bg-[#f1cf79]"
              textColor="text-[#2B2B2B]"
            />
          </Link>
        </div>
      </section>
      {/* Problem -> Solution */}
      <section className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#eff5f6]">
        <h1>Hello World</h1>
      </section>
      {/* Feature Highlights */}
      <section className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#F9F6E5]">
        <h1>Hello World</h1>
      </section>
      {/* How it Works */}
      <section className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#eff5f6]">
        <h1>Hello World</h1>
      </section>
      {/* Who It's For */}
      <section className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#F9F6E5]">
        <h1>Hello World</h1>
      </section>
      {/* Call to Action */}
      <section className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#eff5f6]">
        <h1>Hello World</h1>
      </section>
      {/* Footer */}
      <Footer />
    </main>
  );
}
