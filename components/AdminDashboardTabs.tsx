"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import { Users, BarChart2, Cpu } from "lucide-react";

export default function AdminDashboardTabs({ users, performanceData }: any) {
  const [activeTab, setActiveTab] = useState("users");
  const [queueEnabled, setQueueEnabled] = useState(false);

  async function toggleQueue() {
    const res = await fetch("/api/admin/queue", { method: "POST" });
    const data = await res.json();
    setQueueEnabled(data.useQueue);
    toast.success(data.useQueue ? "Redis Queue Enabled" : "Direct Processing Enabled");
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (!res.ok) toast("Failed to update role");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const roleBadge: Record<string, string> = {
    ADMIN: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
    STAFF: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
    USER: "bg-slate-500/15 text-slate-400 border border-slate-500/25",
  };

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "performance", label: "Performance", icon: BarChart2 },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-200 font-sans overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_115%)] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[30rem] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Admin Panel
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage users, roles, and system settings</p>
          </div>

          {/* Processing Mode Toggle */}
          <button
            onClick={toggleQueue}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${queueEnabled
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
              }`}
          >
            <Cpu className="w-4 h-4" />
            {queueEnabled ? "Queue Mode On" : "Direct Mode"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === id
                  ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden">

          {activeTab === "users" ? (
            /* USERS TAB */
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Department</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-white/[0.03] transition">
                      <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                      <td className="px-6 py-4 text-slate-400">{user.email}</td>
                      <td className="px-6 py-4 text-slate-400">
                        {user.department?.name || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${roleBadge[user.role] ?? roleBadge["USER"]}`}>
                            {user.role}
                          </span>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-white/5 border border-white/10 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer"
                          >
                            <option value="USER" className="bg-[#0d1117]">USER</option>
                            <option value="STAFF" className="bg-[#0d1117]">STAFF</option>
                            <option value="ADMIN" className="bg-[#0d1117]">ADMIN</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* PERFORMANCE TAB */
            <div className="p-8">
              <h3 className="text-lg font-semibold text-white mb-8">Complaints Overview</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} barCategoryGap="40%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                    <XAxis dataKey="status" tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0d1117",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#e2e8f0",
                      }}
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {performanceData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}