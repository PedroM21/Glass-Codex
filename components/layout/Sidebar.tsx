import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="col-span-4 md:col-span-8 lg:col-span-2 min-h-screen bg-[#26374d] text-white p-4">
      <div className="flex gap-2 text-[31.25px]">
        <span>[ ]</span>
        <Link href="/dashboard" className="">
          Dashboard
        </Link>
      </div>
      <div className="flex gap-2 text-[31.25px]">
        <span>[ ]</span>
        <Link href="/characters">Characters</Link>
      </div>
      <div className="flex gap-2 opacity-50 text-[31.25px]">
        <span>[ ]</span>
        <h1>Plot</h1>
      </div>
      <div className="flex gap-2 opacity-50 text-[31.25px]">
        <span>[ ]</span>
        <h1>Lore</h1>
      </div>
    </div>
  );
}
