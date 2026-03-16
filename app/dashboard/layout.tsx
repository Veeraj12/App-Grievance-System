import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, ShieldCheck, ClipboardList, User as UserIcon } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role;
  const userName = session.user.name;

  // Determine sidebar title and color based on role
  const roleConfig = {
    ADMIN: { title: "AdminPanel", icon: <ShieldCheck className="text-blue-400" size={32} />, color: "bg-blue-600" },
    STAFF: { title: "Staff Portal", icon: <ClipboardList className="text-green-400" size={32} />, color: "bg-green-600" },
    USER: { title: "My Dashboard", icon: <UserIcon className="text-purple-400" size={32} />, color: "bg-purple-600" }
  };

  const config = roleConfig[userRole as keyof typeof roleConfig];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR (Menubar) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            {config.icon}
            <span className="text-xl font-bold tracking-tight">{config.title}</span>
          </div>

          <nav className="space-y-2">
            <Link href={`/dashboard/${userRole.toLowerCase()}`} className={`flex items-center gap-3 p-3 rounded-lg ${config.color} hover:opacity-90 transition`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-slate-700 pt-6">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
              <UserIcon size={24} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{userName}</span>
              <span className="text-xs text-slate-400">{userRole}</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}