"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import Link from "next/link";

export default function Github() {
  return (
    <div className="text-white">
      <Link href="https://github.com/PedroM21" target="_blank">
        <GitHubIcon />
      </Link>
    </div>
  );
}
