"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import {
  Users, BarChart2, Cpu, Briefcase, AlertTriangle,
  Trash2, Calendar, Hash, Inbox, Loader2, RefreshCw,
  Building2, UserX, X, AlertCircle
} from "lucide-react";

// ─── Shared Confirm Dialog ────────────────────────────────────────────────────

function ConfirmDialog({
  open, title, message, confirmLabel = "Delete", onConfirm, onCancel, danger = true
}: {
  open: boolean; title: string; message: string;
  confirmLabel?: string; onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className={`h-1 w-full ${danger ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-indigo-600 to-purple-500"}`} />
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? "bg-red-500/10 border border-red-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
              <AlertCircle size={20} className={danger ? "text-red-400" : "text-amber-400"} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{title}</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${danger ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300" : "bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300"}`}
            >
              {confirmLabel}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const fill = payload[0].payload.fill;
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fill }} />
        <span className="text-xl font-bold text-white">{value}</span>
        <span className="text-xs text-slate-500">complaint{value !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}

// ─── Unassigned Complaints Tab ────────────────────────────────────────────────

function UnassignedTab() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/complaints/unassigned");
      const data = await res.json();
      setComplaints(data);
    } catch {
      toast.error("Failed to load unassigned complaints");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    setDeletingId(id);
    setConfirmId(null);
    try {
      const res = await fetch(`/api/admin/complaints/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Complaint deleted");
      setComplaints(prev => prev.filter(c => c.id !== id));
    } catch {
      toast.error("Failed to delete complaint");
    } finally {
      setDeletingId(null);
    }
  }

  const statusColors: Record<string, string> = {
    OPEN: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
  };

  return (
    <>
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Complaint"
        message="This will permanently remove the complaint and all its history. This action cannot be undone."
        confirmLabel="Yes, Delete"
        onConfirm={() => confirmId !== null && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Unassigned Complaints</h3>
              <p className="text-xs text-slate-500 mt-0.5">Status: OPEN — department has no staff</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {complaints.length > 0 && (
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                {complaints.length} pending
              </span>
            )}
            <button onClick={load} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
          <Building2 size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            These complaints are stuck. <span className="text-indigo-300 font-semibold">Assign a staff member</span> to the department from the Users tab, or <span className="text-amber-300 font-semibold">delete</span> to clear the backlog.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
            <p className="text-sm text-slate-400">Loading...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
              <Inbox size={28} className="text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-300">All departments staffed! 🎉</p>
              <p className="text-sm text-slate-500 mt-0.5">No unassigned complaints.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.06] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h4 className="font-bold text-white text-sm">{c.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[c.status] ?? statusColors.OPEN}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{c.description}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={11} />
                        {new Date(c.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                        <Hash size={11} />
                        {c.id.toString().padStart(4, "0")}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Users size={11} />
                        {c.user?.name} · {c.user?.email}
                      </div>
                      {c.departmentName && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                          <Building2 size={11} />
                          {c.departmentName} <span className="text-slate-600">(no staff)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmId(c.id)}
                    disabled={deletingId === c.id}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {deletingId === c.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboardTabs({ users: initialUsers, performanceData }: any) {
  const [activeTab, setActiveTab] = useState("users");
  const [queueEnabled, setQueueEnabled] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data));
  }, []);

  async function handleDepartmentChange(userId: number, departmentId: string) {
    const res = await fetch("/api/admin/users/department", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, departmentId }),
    });
    if (res.ok) {
      toast.success("Department assigned");
      window.location.reload();
    }
  }

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

  async function handleDeleteUser(id: number) {
    setDeletingUserId(id);
    setDeleteUserId(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success("User deleted");
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  }

  const roleBadge: Record<string, string> = {
    ADMIN: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
    STAFF: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
    USER: "bg-slate-500/15 text-slate-400 border border-slate-500/25",
  };

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "performance", label: "Performance", icon: BarChart2 },
    { id: "unassigned", label: "Unassigned", icon: AlertTriangle },
  ];

  // Summary cards for performance tab
  const totalComplaints = performanceData.reduce((a: number, d: any) => a + d.count, 0);

  return (
    <>
      <ConfirmDialog
        open={deleteUserId !== null}
        title="Delete User"
        message="This will permanently delete the user and all their complaints. This cannot be undone."
        confirmLabel="Yes, Delete User"
        onConfirm={() => deleteUserId !== null && handleDeleteUser(deleteUserId)}
        onCancel={() => setDeleteUserId(null)}
      />

      <div className="relative min-h-screen bg-[#030712] text-slate-200 font-sans overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_115%)] opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[30rem] bg-indigo-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Admin Panel</h1>
              <p className="text-sm text-slate-500 mt-1">Manage users, roles, and system settings</p>
            </div>
            <button
              onClick={toggleQueue}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${queueEnabled ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"}`}
            >
              <Cpu className="w-4 h-4" />
              {queueEnabled ? "Queue Mode On" : "Direct Mode"}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit backdrop-blur-md">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === id
                  ? id === "unassigned"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${id === "unassigned" && activeTab !== "unassigned" ? "text-amber-500" : ""}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden min-h-[400px]">

            {/* ── Users Tab ── */}
            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Department</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-white/[0.03] transition group">
                        <td className="px-6 py-4 font-medium text-white group-hover:text-indigo-300 transition-colors">{user.name}</td>
                        <td className="px-6 py-4 text-slate-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <div className="relative inline-block w-40">
                            <select
                              value={user.departmentId || ""}
                              onChange={(e) => handleDepartmentChange(user.id, e.target.value)}
                              className="w-full bg-white/5 border border-white/10 text-slate-300 text-xs rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer appearance-none hover:bg-white/10 transition"
                            >
                              <option value="" className="bg-[#0d1117] text-slate-500">None</option>
                              {departments.map((d: any) => (
                                <option key={d.id} value={d.id} className="bg-[#0d1117]">{d.name}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <Briefcase className="w-3 h-3 text-slate-600" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${roleBadge[user.role] ?? roleBadge["USER"]}`}>
                              {user.role}
                            </span>
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="bg-white/5 border border-white/10 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer hover:bg-white/10 transition appearance-none min-w-[80px]"
                            >
                              <option value="USER" className="bg-[#0d1117]">USER</option>
                              <option value="STAFF" className="bg-[#0d1117]">STAFF</option>
                              <option value="ADMIN" className="bg-[#0d1117]">ADMIN</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setDeleteUserId(user.id)}
                            disabled={deletingUserId === user.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                          >
                            {deletingUserId === user.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <UserX size={12} />
                            )}
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Performance Tab ── */}
            {activeTab === "performance" && (
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Complaints Statistics</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time breakdown from database · {totalComplaints} total</p>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {performanceData.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.06] transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{item.status}</span>
                      </div>
                      <span className="text-3xl font-bold text-white">{item.count}</span>
                      <p className="text-xs text-slate-500 mt-1">
                        {totalComplaints > 0 ? Math.round((item.count / totalComplaints) * 100) : 0}% of total
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bar Chart */}
                {performanceData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <Inbox className="w-10 h-10 text-slate-600" />
                    <p className="text-slate-400">No complaints in the system yet.</p>
                  </div>
                ) : (
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData} barCategoryGap="35%" barSize={48}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                        <XAxis dataKey="status" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)", radius: 8 }} />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                          {performanceData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* ── Unassigned Tab ── */}
            {activeTab === "unassigned" && <UnassignedTab />}
          </div>
        </div>
      </div>
    </>
  );
}