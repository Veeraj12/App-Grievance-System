"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children, session }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans">

      {/* 🌌 Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      {/* 🧱 Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar session={session} />
      </div>

      {/* 📱 Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 flex transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
      >
        <Sidebar session={session} />

        {/* Overlay */}
        <div
          className="flex-1 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* 🧠 MAIN CONTENT */}
      <div className="flex flex-col flex-1 relative z-10 overflow-hidden">

        {/* 📱 Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#030712/80] backdrop-blur-xl">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <Menu size={22} />
          </button>

          <h1 className="font-semibold text-lg">Dashboard</h1>
          <div className="w-6" />
        </div>

        {/* ✨ Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-64 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

        {/* 📦 CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}