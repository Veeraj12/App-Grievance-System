"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { FileText, CheckCircle, Clock, PlusCircle, X, Send, ShieldCheck } from "lucide-react";

export default function UserDashboard() {
  const { data: session } = useSession();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadComplaints() {
    const res = await fetch("/api/complaints");
    const data = await res.json();
    setComplaints(data);
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  async function submitComplaint(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("User session not available");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, userId: session.user.id }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Complaint submitted!");
      setTitle("");
      setDescription("");
      setShowForm(false);
      loadComplaints();
    } catch (err) {
      toast.error("Submission failed");
      console.error(err);
    }
    setLoading(false);
  }

  const stats = [
    {
      label: "Total",
      value: complaints.length,
      icon: FileText,
      color: "from-indigo-500 to-blue-500",
      glow: "shadow-indigo-500/20",
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "RESOLVED").length,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/20",
    },
    {
      label: "Pending",
      value: complaints.filter((c) => c.status !== "RESOLVED").length,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/20",
    },
  ];

  const statusBadge: Record<string, string> = {
    OPEN: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    ASSIGNED: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    IN_PROGRESS: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  };

  return (
    <div className="relative min-h-screen bg-[#030712] overflow-hidden text-slate-200 font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_115%)] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[30rem] bg-indigo-500/15 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                My Dashboard
              </h1>
              <p className="text-sm text-slate-500">Welcome back, {session?.user?.name || "User"}</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] border border-indigo-500/50"
          >
            <PlusCircle className="w-4 h-4" />
            New Complaint
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`relative rounded-2xl p-5 bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl ${stat.glow}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-400">{stat.label}</span>
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* New Complaint Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl p-8 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-white mb-6">File a Complaint</h2>
              <form onSubmit={submitComplaint} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Brief title of the issue"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? "Submitting..." : "Submit Complaint"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Complaints List */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Your Complaints</h2>
          </div>

          {complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400">No complaints filed yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition border border-indigo-500/50"
              >
                File your first complaint
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {complaints.map((complaint) => (
                <li
                  key={complaint.id}
                  className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.03] transition"
                >
                  <div>
                    <p className="font-semibold text-white mb-1">{complaint.title}</p>
                    <p className="text-xs text-slate-500">
                      Filed on {new Date(complaint.createdAt).toLocaleDateString()} &nbsp;·&nbsp;
                      <span className="text-indigo-400">
                        {complaint.departmentName || "Municipal"} Dept
                      </span>
                    </p>
                  </div>
                  <span
                    className={`self-start sm:self-auto px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      statusBadge[complaint.status] ?? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}