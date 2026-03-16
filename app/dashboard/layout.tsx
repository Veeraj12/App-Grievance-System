import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { LayoutDashboard, ShieldCheck, ClipboardList, User as UserIcon } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role;
  const userName = session.user.name;

  // Determine sidebar title and icon based on role
  const roleConfig = {
    ADMIN: { title: "AdminPanel", icon: <ShieldCheck className="text-indigo-400" size={28} /> },
    STAFF: { title: "Staff Portal", icon: <ClipboardList className="text-emerald-400" size={28} /> },
    USER: { title: "My Dashboard", icon: <UserIcon className="text-purple-400" size={28} /> }
  };

  const config = roleConfig[userRole as keyof typeof roleConfig];

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans">
      {/* Background Grid Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      {/* SIDEBAR */}
      <aside className="relative z-10 w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between p-6 shadow-2xl">
        <div>
          {/* Logo/Brand Area */}
          <div className="flex items-center gap-3 mb-12 px-2 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-300">
              {config.icon}
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {config.title}
            </span>
          </div>

          <nav className="space-y-3">
            <Link 
              href={`/dashboard/${userRole.toLowerCase()}`} 
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <LayoutDashboard size={20} />
              <span className="font-semibold">Dashboard</span>
            </Link>
            
            {/* Added a placeholder for secondary nav item to balance the UI */}
            <div className="pt-4 px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quick Access</span>
            </div>
            <button className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <ClipboardList size={20} />
              <span className="text-sm font-medium">History</span>
            </button>
          </nav>
        </div>

        {/* User Profile & Logout Bottom Section */}
        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-4 px-3 py-4 rounded-3xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center p-0.5 shadow-lg">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <UserIcon size={24} className="text-slate-400" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate leading-tight">{userName}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400/80 mt-1">{userRole}</span>
            </div>
          </div>
          
          <div className="px-1 scale-105">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 overflow-auto bg-transparent custom-scrollbar">
        {/* Subtle top glow to transition from sidebar */}
        <div className="absolute top-0 left-0 w-full h-64 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
        
        <div className="relative py-4">
          {children}
        </div>
      </main>
    </div>
  );
}