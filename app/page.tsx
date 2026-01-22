import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import Sorting from "@/components/ui/icons/Sorting";
import PlayArrow from "@/components/ui/icons/PlayArrow";
import Save from "@/components/ui/icons/Save";
import Start from "@/components/ui/icons/Start";
import Fill from "@/components/ui/icons/Fill";
import Pencil from "@/components/ui/icons/Pencil";
import FeaturesCard from "@/components/ui/FeaturesCard";
import HeroText from "@/components/animations/HeroText";
import Audience from "@/components/animations/Audience";

export default function Home() {
  const audienceData = [
    {
      type: "Indie game developers",
      description:
        "Build NPCs and protagonists with the depth your game deserves. Keep every character consistent from concept to release.",
      image: "/indiegamedev.png",
    },
    {
      type: "Character writers",
      description:
        "Organize your cast across multiple projects. Keep your characters alive and accessible whenever inspiration hits",
      image: "/characterwriters-v4.png",
    },
    {
      type: "Tabletop designers",
      description:
        "Create memorable characters for your campaings and modules. Reference them instantly when you need them at the table.",
      image: "/ttrpg.png",
    },
    {
      type: "Design students",
      description:
        "Learn how to structure character development properly. Build a portfolio of work that shows your craft.",
      image: "/designstudents.jpg",
    },
  ];

  return (
    <main className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
      {/* Hero Section */}
      <section className="col-span-4 md:col-span-8 lg:col-span-12 min-h-screen bg-[#F9F6E5] flex flex-col justify-center items-center gap-4 relative">
        <HeroText
          header="Ink & Code"
          subheader="Your Glass Codex - where every character is written, piece by piece."
          tagline="Create a character, write their details, build out their story, and
            give them a purpose."
        />
        <div className="flex gap-8 pt-8 justify-center">
          <Link href="/#features">
            <Button
              label="View Features"
              color="bg-transparent"
              textColor="text-[#2B2B2B]"
            />
          </Link>
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
        <div className="flex flex-col w-full py-16 lg:flex-row">
          <div className="flex flex-col w-full justify-center items-center gap-16 lg:w-1/2">
            <div className="w-full space-y-4 lg:w-1/2 px-8 lg:px-0">
              <Sorting />
              <h1 className="text-[31.25px] md:text-[48.83px] text-[#2B2B2B]">
                Character details scattered everywhere
              </h1>
              <p>
                Game designers and writers know the struggle. Names in one
                document, traits in another, flaws buried in notes. Your best
                ideas get lost in the creative chaos.
              </p>
            </div>
            <div className="w-full space-y-4 lg:w-1/2 px-8 lg:px-0">
              <PlayArrow />
              <h1 className="text-[31.25px] md:text-[48.83px] text-[#2B2B2B]">
                Everything in one place, always
              </h1>
              <p>
                Glass Codex brings order to the chaos. Create characters with
                structured fields for name, role, traits, and flaws. View all
                your characters at once. Update details whenever inspiration
                strikes. Delete what doesn't work. Simple. Clear. Effective.
              </p>
            </div>
          </div>
          <div className="flex w-full justify-center items-center px-8 mt-8 lg:px-0 lg:mt-0 lg:w-1/2">
            <Image
              src="/Solution.png"
              width={700}
              height={700}
              alt="Solution Image"
              className="border-2 border-black rounded-lg"
            />
          </div>
        </div>
      </section>
      {/* Feature Highlights */}
      <section
        id="features"
        className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#F9F6E5]"
      >
        <div className="flex flex-col py-16 gap-16">
          <div className="flex flex-col text-center items-center gap-4 px-8 lg:px-0">
            <p className="md:text-[20px]">Build</p>
            <h1 className="text-[31.25px] md:text-[48.83px] text-[#2B2B2B]">
              Create characters with structure
            </h1>
            <p className="md:text-[20px]">
              Start fresh with organized fields for every detail
            </p>
          </div>
          <div className="flex flex-col justify-center gap-8 mx-auto md:flex-row md:flex-wrap">
            <FeaturesCard
              header="See all characters at once"
              text="View your entire roster in a single, clear interface"
              image="/Feature1-v2.png"
            />
            <FeaturesCard
              header="Edit and update character details"
              text="Update traits, flaws, and roles whenever you need to"
              image="/Feature2-v2.png"
            />
            <FeaturesCard
              header="Refine"
              text="Delete entries and keep only what matters most"
              image="/Feature3-v3.png"
            />
          </div>
        </div>
      </section>
      {/* How it Works */}
      <section
        id="workflow"
        className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#eff5f6]"
      >
        <div className="flex flex-col w-full justify-center items-center py-16 gap-8 lg:gap-0 lg:flex-row">
          <div className="w-full px-8 lg:px-0 md:w-2/3 lg:w-1/2">
            <Image
              src="/Workflow.png"
              width={600}
              height={600}
              alt="Workflow Image"
              className="mx-auto"
            />
          </div>
          <div className="flex flex-wrap w-full px-8 gap-8 lg:w-1/2 lg:px-0">
            <div className="flex flex-col gap-4 mx-auto">
              <Start />
              <h1 className="text-[25px] text-[#2B2B2B] font-semibold">
                Start Here
              </h1>
              <p className="w-full lg:w-3/4">
                Log into Glass Codex and begin building your first character
              </p>
            </div>
            <div className="flex flex-col gap-4 mx-auto">
              <Fill />
              <h1 className="text-[25px] text-[#2B2B2B] font-semibold">
                Fill it in
              </h1>
              <p className="w-full lg:w-3/4">
                Add name, role, traits, flaws, and everything else that matters
              </p>
            </div>
            <div className="flex flex-col gap-4 mx-auto">
              <Save />
              <h1 className="text-[25px] text-[#2B2B2B] font-semibold">
                Save it
              </h1>
              <p className="w-full lg:w-3/4">
                Your character is stored and ready to view anytime you want
              </p>
            </div>
            <div className="flex flex-col gap-4 mx-auto">
              <Pencil />
              <h1 className="text-[25px] text-[#2B2B2B] font-semibold">
                Manage all
              </h1>
              <p className="w-full lg:w-3/4">
                Edit, update, or delete characters as your designs evolve
              </p>
              <Link href="/login">
                <Button
                  label="Log in"
                  color="bg-[#f1cf79]"
                  textColor="text-[#2B2B2B]"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Who It's For */}
      <section
        id="audience"
        className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#F9F6E5]"
      >
        <div className="flex flex-col w-full justify-center items-center py-16 gap-16">
          <div className="w-full text-center space-y-4 px-8 lg:w-1/2">
            <p>Built for</p>
            <h1 className="text-[31.25px] md:text-[48.83px] text-[#2B2B2B]">
              Made for the people who create worlds
            </h1>
            <p>
              Whether you're writing your first character or your tenth, Glass
              Codex works the way you do. No bloat. No confusion. Just what you
              need to keep your characters straight and your ideas flowing.
            </p>
          </div>
          {/* use motion to add animations and have each one show one at a time */}
          <Audience audiences={audienceData} />
        </div>
      </section>
      {/* Call to Action */}
      <section className="col-span-4 md:col-span-8 lg:col-span-12 bg-[#E1D7C3]">
        <div className=" flex flex-col justify-center items-center gap-4 py-8 text-center px-8 md:text-start md:px-0">
          <h1 className="text-[31.25px] md:text-[48.83px]">
            Write characters that stay together
          </h1>
          <p>
            No more scattered notes or lost ideas, write characters with
            clarity.
          </p>
          <Link href="/register">
            <Button
              label="Sign Up"
              color="bg-[#f1cf79]"
              textColor="text-[#2B2B2B]"
            />
          </Link>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </main>
  );
}
