"use client";

import {
    LayoutDashboard,
    ShieldCheck,
    ClipboardList,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";
type Role = "ADMIN" | "STAFF" | "USER";

export default function Sidebar({ session }: any) {
    const userRole = session.user.role as Role;
    const userName = session.user.name || "User";

    const roleConfig: Record<
        Role,
        { title: string; icon: React.ReactNode }
    > = {
        ADMIN: {
            title: "Admin Panel",
            icon: <ShieldCheck className="text-indigo-400" size={26} />,
        },
        STAFF: {
            title: "Staff Portal",
            icon: <ClipboardList className="text-emerald-400" size={26} />,
        },
        USER: {
            title: "My Dashboard",
            icon: (
                <div className="text-white font-bold text-lg">
                    {userName.charAt(0).toUpperCase()}
                </div>
            ),
        },
    };

    const config = roleConfig[userRole];
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    
    return (
        <aside className="w-72 max-w-[80vw] h-full bg-black/5 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between p-6 shadow-2xl transition-all duration-200">

            {/* TOP */}
            <div>
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {config.icon}
                    </div>

                    <span className="text-xl font-bold text-white">
                        {config.title}
                    </span>
                </div>

                <nav className="space-y-3">

                    {/* Dashboard */}
                    <Link
                        href={`/dashboard/${userRole.toLowerCase()}`}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl transition ${isActive(`/dashboard/${userRole.toLowerCase()}`)
                                ? "bg-indigo-600 text-white"
                                : "text-slate-300 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>

                    {/* Quick Access */}
                    <div className="pt-4 px-3">
                        <span className="text-xs color-black uppercase">
                            Quick Access
                        </span>
                    </div>

                    {/* History */}
                    {userRole !== "ADMIN" && (
                        <Link
                            href={`/dashboard/${userRole.toLowerCase()}/history`}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl transition ${isActive(`/dashboard/${userRole.toLowerCase()}/history`)
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-300 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            <ClipboardList size={20} />
                            History
                        </Link>
                    )}

                </nav>


            </div>

            {/* BOTTOM */}
            <div className="space-y-6 pt-6 border-t border-white/10">

                <div className="flex items-center gap-4 px-3 py-4 rounded-3xl bg-white/5 border border-white/10">

                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {userName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-white">
                            {userName}
                        </div>
                        <div className="text-xs text-indigo-400">
                            {userRole}
                        </div>
                    </div>
                </div>

                <LogoutButton />
            </div>
        </aside>
    );
}