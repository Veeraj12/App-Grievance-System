"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
}
