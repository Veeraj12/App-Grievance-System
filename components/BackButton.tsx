// components/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors rounded-md hover:bg-slate-100 mb-4"
    >
      <ChevronLeft size={18} />
      <span>Back</span>
    </button>
  );
}