import Link from "next/link";
import Dashboard from "@mui/icons-material/Dashboard";
import CharacterIcon from "@mui/icons-material/Person";
import PlotIcon from "@mui/icons-material/Create";
import LoreIcon from "@mui/icons-material/MenuBook";

export default function Sidebar() {
  return (
    <div className="col-span-4 md:col-span-8 lg:col-span-2 min-h-screen bg-[#1b3153] text-white p-4 space-y-4">
      <div className="flex gap-2 text-[31.25px] items-center">
        <Dashboard />
        <Link href="/dashboard" className="">
          Dashboard
        </Link>
      </div>
      <div className="flex gap-2 text-[31.25px] items-center">
        <CharacterIcon />
        <Link href="/characters">Characters</Link>
      </div>
      <div className="flex gap-2 opacity-50 text-[31.25px] items-center">
        <PlotIcon />
        <h1>Plot</h1>
      </div>
      <div className="flex gap-2 opacity-50 text-[31.25px] items-center">
        <LoreIcon />
        <h1>Lore</h1>
      </div>
    </div>
  );
}
